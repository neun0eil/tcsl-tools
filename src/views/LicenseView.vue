<template>
  <div class="container my-3">
    <div class="row justify-content-md-center">
      <div class="col-12 col-md-6">
        <input class="form-control mb-3" type="file" @change="onChange" :accept="TYPES.join(',')" />
        <img class="img-fluid border rounded mb-3" v-if="image" :src="image" />
        <button type="button" class="btn btn-dark w-100" @click="onClick" :disabled="!image">
          Générer le PDF
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import slugify from 'slugify';
import { ref, computed } from 'vue';
import { jsPDF } from 'jspdf';

const name = ref();
const image = ref();
const file = computed(() =>
  slugify(name.value.replaceAll('_', '-').replace(/\.[^.$]+$/, ''), { lower: true })
);

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

function onClick() {
  const doc = new jsPDF({ format: 'a4', unit: 'in' });
  doc.setFontSize(12);
  doc.setLineWidth(0.01);
  doc.setLineDash([0.04], 0);
  doc.text(name.value, 1, 1);
  doc.addImage(image.value, 'png', 1, 1.5, 3.37, 2.125, 'license', 'none', 0);
  doc.addImage(image.value, 'png', 1 + 3.37, 1.5, 3.37, 2.125, 'license', 'none', 180);
  doc.roundedRect(1, 1.5, 3.37, 2.125, 0.125, 0.125);
  doc.roundedRect(1, 1.5 + 2.125, 3.37, 2.125, 0.125, 0.125);
  doc.save(`${file.value}.pdf`);
}
</script>
