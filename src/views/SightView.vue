<template>
  <div class="container my-3">
    <h1 class="display-3 text-center mb-3">Réglage visée</h1>
    <div class="row align-items-center">
      <div class="target col-12 col-md-6">
        <target-c50 />
        <div @click="move">
          <cross-hair :style="hitStyle"></cross-hair>
        </div>
      </div>
      <div class="col-12 col-md-6">
        <div class="row gx-3">
          <div class="col-12">
            <table class="table table-bordered border-dark">
              <thead class="table-dark">
                <tr>
                  <th :colspan="showX && 2">Dérive {{ dirX }}</th>
                  <th :colspan="showY && 2">Élévation {{ dirY }}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{{ roundX }} mm</td>
                  <td v-if="showX">
                    {{ clickX }} clic{{ clickX > 1 ? "s" : "" }}
                  </td>
                  <td>{{ roundY }} mm</td>
                  <td v-if="showY">
                    {{ clickY }} clic{{ clickY > 1 ? "s" : "" }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="col-6">
            <div class="mb-3 form-floating with-button">
              <input
                @focus="select"
                v-model.number="range"
                type="number"
                class="form-control border-dark"
                id="range"
              />
              <label for="range">Distance</label>
              <button
                class="input-group-text rounded-end border-dark"
                @click="metric = !metric"
              >
                {{ metric ? "m" : "yd" }}
              </button>
            </div>
          </div>
          <div class="col-6">
            <div class="mb-3 form-floating">
              <select
                v-model.number="type"
                class="form-select border-dark"
                id="type"
              >
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

<script>
import TargetC50 from "../components/TargetC50.vue";
import CrossHair from "../components/CrossHair.vue";

const key = "sight",
  absRound = v => Math.abs(Math.round(v)),
  posToPct = v => v * 100 + "%",
  posToMm = v => (v - 0.5) * 1100;

export default {
  data() {
    return {
      posX: 0.5,
      posY: 0.5,
      range: 100,
      metric: true,
      type: 1,
    };
  },
  mounted() {
    const json = localStorage.getItem(key);
    if (json) {
      try {
        const data = JSON.parse(json);
        Object.assign(this, data);
      } catch (e) {
        localStorage.removeItem(key);
        console.error(e);
      }
    }
  },
  watch: {
    $data: {
      handler(v) {
        try {
          const json = JSON.stringify({ ...v });
          localStorage.setItem(key, json);
        } catch (e) {
          console.error(e);
        }
      },
      deep: true,
    },
  },
  components: {
    TargetC50,
    CrossHair,
  },
  methods: {
    move(e) {
      this.posX = e.offsetX / e.target.offsetWidth;
      this.posY = e.offsetY / e.target.offsetHeight;
    },
    select(e) {
      e.target.select();
    },
    mmToClk(v) {
      const range = this.metric ? this.range : this.range * 0.9144;
      return Math.abs(Math.round(v / (this.ratio * range * 1000)));
    },
  },
  computed: {
    hitStyle() {
      return {
        top: posToPct(this.posY),
        left: posToPct(this.posX),
      };
    },
    ratio() {
      let ratio;
      switch (this.type) {
        case 1:
          ratio = Math.tan(((0.25 / 60) * Math.PI) / 180);
          break;
        case 2:
          ratio = Math.tan(((0.125 / 60) * Math.PI) / 180);
          break;
        case 3:
          ratio = Math.tan(0.0001);
          break;
        case 4:
          ratio = Math.tan(0.00005);
      }
      return ratio;
    },
    offsetX() {
      return posToMm(this.posX);
    },
    offsetY() {
      return posToMm(this.posY);
    },
    roundX() {
      return absRound(this.offsetX);
    },
    roundY() {
      return absRound(this.offsetY);
    },
    dirX() {
      if (this.offsetX === 0) return "";
      return this.offsetX < 0 ? "gauche" : "droite";
    },
    dirY() {
      if (this.offsetY === 0) return "";
      return this.offsetY < 0 ? "haute" : "basse";
    },
    clickX() {
      return this.mmToClk(this.offsetX);
    },
    clickY() {
      return this.mmToClk(this.offsetY);
    },
    showX() {
      return Number.isInteger(this.clickX) || null;
    },
    showY() {
      return Number.isInteger(this.clickY) || null;
    },
  },
};
</script>

<style scoped lang="scss">
.target {
  display: grid;
  > * {
    grid-area: 1/-1;
  }
  > div {
    position: relative;
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
</style>
