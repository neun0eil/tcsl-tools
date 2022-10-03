<template>
  <div class="container my-3">
    <div class="row justify-content-md-center">
      <div class="col-12 col-lg-6 d-flex flex-column gap-3">
        <AlertBox>
          <ul class="mb-0">
            <li>Selectionnez l'image téléchargée depuis votre espace EDEN</li>
            <li>Choisissez un format</li>
            <li>Cliquez sur 'Générer le PDF'</li>
          </ul>
        </AlertBox>
        <input
          :disabled="processing"
          class="form-control"
          type="file"
          @change="onChange"
          :accept="TYPES.join(',')"
        />
        <img class="img-fluid border rounded" v-if="image" :src="image" ref="img" />
        <div class="border rounded d-flex p-3 gap-3">
          <span>Format&nbsp;:</span>
          <div class="form-check" v-for="[k] of Object.entries(FORMATS)" :key="k">
            <input
              :disabled="processing"
              class="form-check-input"
              type="radio"
              :id="`format-${k}`"
              :value="k"
              v-model.number="selected"
            />
            <label class="form-check-label" :for="`format-${k}`">ID-{{ k }}</label>
          </div>
        </div>
        <button
          type="button"
          class="btn btn-dark w-100"
          @click="onClick"
          :disabled="!image || processing"
        >
          <div v-if="processing" class="spinner-border" role="status">
            <span class="visually-hidden">Génération...</span>
          </div>
          <span v-else>Générer le PDF</span>
        </button>
        <a ref="link" :href="href" class="d-none" target="_blank"></a>
      </div>
    </div>
  </div>
</template>

<script setup>
import AlertBox from '@/components/AlertBox.vue';
import { ref, watch, nextTick } from 'vue';

const FORMATS = {
  1: { w: 3.37, h: 2.125 },
  2: { w: 4.134, h: 2.913 },
  3: { w: 4.921, h: 3.465 },
};

const TYPES = ['image/jpeg', 'image/png', 'image/gif'];

const image = ref();
const img = ref();
const processing = ref(false);
const selected = ref(1);
const href = ref();
const link = ref();

const worker = new Worker(new URL('@/assets/js/jspdf', import.meta.url));

worker.onmessage = async ({ data }) => {
  processing.value = false;
  if (data) {
    href.value = URL.createObjectURL(data);
    await nextTick(() => link.value.click());
  }
};

function revoke(ref) {
  if (!ref.value) return;
  URL.revokeObjectURL(ref.value);
  ref.value = null;
}

function onChange({ target }) {
  revoke(href);
  revoke(image);
  const [file] = target.files;
  if (!file || !TYPES.includes(file.type)) {
    target.value = null;
    return;
  }
  image.value = URL.createObjectURL(file);
}

function onClick() {
  processing.value = true;
  worker.postMessage({
    format: FORMATS[selected.value],
    image: image.value,
    ratio: img.value.naturalWidth / img.value.naturalHeight,
  });
}

watch(selected, () => {
  revoke(href);
});
</script>

<style scoped>
.img-fluid {
  aspect-ratio: 16/10;
  object-fit: contain;
}
</style>
