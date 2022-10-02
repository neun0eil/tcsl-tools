<template>
  <div class="container my-3">
    <div class="row justify-content-md-center">
      <div class="col-12 col-md-6 d-flex flex-column gap-3">
        <AlertBox>
          <ul class="mb-0">
            <li>Selectionnez l'image téléchargée depuis votre espace EDEN</li>
            <li>Choisissez un format</li>
            <li>cliquez sur 'Générer le PDF'</li>
          </ul>
        </AlertBox>
        <input class="form-control" type="file" @change="onChange" :accept="TYPES.join(',')" />
        <img class="img-fluid border rounded" v-if="image" :src="image" />
        <div class="border rounded d-flex p-3 gap-3">
          <span>Format&nbsp;:</span>
          <div class="form-check" v-for="[k] of Object.entries(FORMATS)" :key="k">
            <input
              class="form-check-input"
              type="radio"
              name="flexRadioDefault"
              :id="`format-${k}`"
              :value="k"
              v-model.number="selected"
            />
            <label class="form-check-label" :for="`format-${k}`">ID-{{ k }}</label>
          </div>
        </div>
        <a v-if="href" :href="href" class="btn btn-dark w-100" :download="file"
          >Enregistrer le PDF</a
        >
        <button
          v-else
          type="button"
          class="btn btn-dark w-100"
          @click="makePDF"
          :disabled="!image || processing"
        >
          <div v-if="processing" class="spinner-border" role="status">
            <span class="visually-hidden">Génération...</span>
          </div>
          <span v-else>Générer le PDF</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import AlertBox from '@/components/AlertBox.vue';
import slugify from 'slugify';
import { ref, computed, watch } from 'vue';

const FORMATS = {
  1: { w: 3.37, h: 2.125 },
  2: { w: 4.134, h: 2.913 },
  3: { w: 4.921, h: 3.465 },
};

const TYPES = ['image/jpeg', 'image/png', 'image/gif'];

const name = ref();
const image = ref();
const processing = ref(false);
const selected = ref(1);
const href = ref();

const worker = new Worker(new URL('@/assets/js/jspdf', import.meta.url));

worker.onmessage = (e) => {
  processing.value = false;
  if (e.data) href.value = URL.createObjectURL(e.data);
};

const file = computed(
  () =>
    `${slugify(name.value.replaceAll('_', '-').replace(/\.[^.$]+$/, ''), { lower: true })}-id${
      selected.value
    }`
);

function onChange(e) {
  href.value = null;
  const [file] = e.target.files;
  if (!file || !TYPES.includes(file.type)) {
    e.target.value = null;
    return;
  }
  name.value = file.name;
  image.value = URL.createObjectURL(file);
}

function makePDF() {
  processing.value = true;
  worker.postMessage({
    selected: selected.value,
    format: FORMATS[selected.value],
    name: name.value,
    image: image.value,
  });
}

watch(selected, () => {
  href.value = null;
});
</script>
