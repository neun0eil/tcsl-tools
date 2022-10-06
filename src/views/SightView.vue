<template>
  <div class="container my-3">
    <div class="row align-items-center">
      <div class="col-12 col-md-6 mb-3 mb-md-0">
        <div class="target">
          <TargetC50 />
          <div @click="onClick">
            <CrossHair :style="data.style"></CrossHair>
          </div>
        </div>
      </div>
      <div class="col-12 col-md-6">
        <div class="row gx-3">
          <div class="col-12">
            <table class="table table-bordered border-dark">
              <thead class="table-dark">
                <tr>
                  <th :colspan="data.show.x && 2">
                    <div class="d-flex justify-content-between align-items-center">
                      Dérive {{ direction(data.offset.x, 'gauche', 'droite') }}
                      <i
                        class="fa-solid fa-arrows-left-right border border-light rounded"
                        v-pan-x
                      ></i>
                    </div>
                  </th>
                  <th :colspan="data.show.y && 2">
                    <div class="d-flex justify-content-between align-items-center">
                      Élévation {{ direction(data.offset.y, 'haute', 'basse') }}
                      <i class="fa-solid fa-arrows-up-down border border-light rounded" v-pan-y></i>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{{ absolute(data.offset.x) }} mm</td>
                  <td v-if="data.show.x">{{ data.click.x }} clic{{ plural(data.click.x) }}</td>
                  <td>{{ absolute(data.offset.y) }} mm</td>
                  <td v-if="data.show.y">{{ data.click.y }} clic{{ plural(data.click.y) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="col-6">
            <div class="form-floating with-button">
              <input
                v-model.number="range"
                type="number"
                class="form-control border-dark"
                id="range"
                @focus="$event.target.select()"
              />
              <label for="range">Distance</label>
              <button class="input-group-text rounded-end border-dark" @click="metric = !metric">
                {{ metric ? 'm' : 'yd' }}
              </button>
            </div>
          </div>
          <div class="col-6">
            <div class="form-floating">
              <select v-model.number="type" class="form-select border-dark" id="type">
                <option value="1">1/4 MOA</option>
                <option value="2">1/8 MOA</option>
                <option value="3">0.1 mil</option>
                <option value="4">0.05 mil</option>
              </select>
              <label for="type">Type de réglage</label>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue';
import TargetC50 from '@/components/TargetC50.vue';
import CrossHair from '@/components/CrossHair.vue';
import Hammer from 'hammerjs';

const TYPES = {
  1: Math.tan(((0.25 / 60) * Math.PI) / 180),
  2: Math.tan(((0.125 / 60) * Math.PI) / 180),
  3: Math.tan(0.0001),
  4: Math.tan(0.00005),
};

const key = 'sight';
const step = 5000;

const range = ref(100);
const type = ref(1);
const posX = ref(0.5);
const posY = ref(0.5);
const metric = ref(true);

const state = reactive({ range, type, posX, posY, metric });

const plural = (v) => (v > 1 ? 's' : '');
const absolute = (v) => Math.abs(Math.round(v));
const percent = (v) => `${v * 100}%`;
const posToMm = (v) => (v - 0.5) * 500;
const mmToClk = (v) =>
  Math.abs(
    Math.round(v / (TYPES[type.value] * (metric.value ? range.value : range.value * 0.9144) * 1000))
  );
const direction = (v, over, under) => (v === 0 ? '' : v < 0 ? over : under);

const data = computed(() => {
  const offset = {
    x: posToMm(posX.value),
    y: posToMm(posY.value),
  };
  const click = {
    x: mmToClk(offset.x),
    y: mmToClk(offset.y),
  };
  const style = {
    left: percent(posX.value),
    top: percent(posY.value),
  };
  const show = {
    x: Number.isInteger(click.x) || null,
    y: Number.isInteger(click.y) || null,
  };
  return {
    offset,
    click,
    style,
    show,
  };
});

let prevX = null;
let prevY = null;

onMounted(() => {
  const json = localStorage.getItem(key);
  if (!json) return;
  try {
    Object.assign(state, JSON.parse(json));
  } catch (e) {
    console.error(e);
    localStorage.removeItem(key);
  }
});

function onClick(e) {
  posX.value = e.offsetX / e.target.offsetWidth;
  posY.value = e.offsetY / e.target.offsetHeight;
}

const vPanX = {
  created(e) {
    const mc = new Hammer(e);
    mc.get('pan');
    mc.on('pan', (e) => {
      e.preventDefault();
      if (prevX === null) prevX = posX.value;
      posX.value = prevX + e.deltaX / step;
      if (e.isFinal) prevX = null;
    });
  },
};

const vPanY = {
  created(e) {
    const mc = new Hammer(e);
    mc.get('pan').set({ direction: Hammer.DIRECTION_VERTICAL });
    mc.on('pan', (e) => {
      e.preventDefault();
      if (prevY === null) prevY = posY.value;
      posY.value = prevY + e.deltaY / step;
      if (e.isFinal) prevY = null;
    });
  },
};

watch(
  () => state,
  () => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch (e) {
      console.error(e);
    }
  },
  { deep: true }
);
</script>

<style scoped lang="scss">
.target {
  cursor: crosshair;
  display: grid;
  position: relative;
  > * {
    grid-area: 1/-1;
  }
  > div {
    overflow: hidden;
    > svg {
      position: absolute;
      width: 10%;
      height: 10%;
      fill: red;
      transform: translate(-50%, -50%);
      pointer-events: none;
    }
  }
}
.with-button {
  display: flex;
  > input {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
  > button {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    border-left: 0;
  }
}
table i {
  aspect-ratio: 1/1;
  height: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: grab;
}
</style>
