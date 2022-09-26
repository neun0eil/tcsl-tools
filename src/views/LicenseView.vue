<template>
  <div class="container my-3">
    <div class="row justify-content-md-center">
      <div class="col-12 col-md-6">
        <AlertBox
          message="Selectionnez l'image téléchargée depuis votr espace EDEN puis cliquez sur 'Générer le PDF'"
        />
        <input class="form-control mb-3" type="file" @change="onChange" :accept="TYPES.join(',')" />
        <img class="img-fluid border rounded mb-3" v-if="image" :src="image" />
        <div class="border rounded mb-3 d-flex p-3 gap-3">
          <span>Format&nbsp;:</span>
          <div class="form-check" v-for="[k] of Object.entries(formats)" :key="k">
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
      </div>
    </div>
  </div>
</template>

<script setup>
import AlertBox from '@/components/AlertBox.vue';
import slugify from 'slugify';
import { ref, computed } from 'vue';
import { jsPDF } from 'jspdf';

const name = ref();
const image = ref();
const file = computed(() =>
  slugify(name.value.replaceAll('_', '-').replace(/\.[^.$]+$/, ''), { lower: true })
);
const processing = ref(false);
const selected = ref(1);

const formats = {
  1: { w: 3.37, h: 2.125 },
  2: { w: 4.134, h: 2.913 },
  3: { w: 4.921, h: 3.465 },
};

const TYPES = ['image/jpeg', 'image/png', 'image/gif'];

function onChange(e) {
  const [file] = e.target.files;
  if (!file || !TYPES.includes(file.type)) {
    e.target.value = null;
    return;
  }
  name.value = file.name;
  image.value = URL.createObjectURL(file);
}

function makePDF() {
  return new Promise((resolve, reject) => {
    try {
      const { w, h } = formats[selected.value];
      const doc = new jsPDF({ format: 'a4', unit: 'in' });
      doc.setFontSize(12);
      doc.setLineWidth(0.01);
      doc.setLineDash([0.04], 0);
      doc.text(name.value, 1, 1);
      doc.addImage(image.value, 'png', 1, 1.5, w, h, 'license', 'none', 0);
      doc.addImage(image.value, 'png', 1 + w, 1.5, w, h, 'license', 'none', 180);
      doc.roundedRect(1, 1.5, w, h, 0.125, 0.125);
      doc.roundedRect(1, 1.5 + h, w, h, 0.125, 0.125);
      doc.save(`${file.value}.pdf`);
      resolve(doc);
    } catch (e) {
      reject(null);
    }
  });
}

async function onClick() {
  processing.value = true;
  await makePDF();
  processing.value = false;
}
</script>
