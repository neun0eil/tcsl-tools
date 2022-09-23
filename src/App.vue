<template>
  <NavBar :title="title" />
  <main>
    <router-view />
  </main>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import NavBar from '@/components/NavBar.vue';

const DEFAULT_TITLE = 'Outils TCSL';
const route = useRoute();
const title = ref(DEFAULT_TITLE);

watch(
  () => route.name,
  () => {
    title.value = document.title = route.meta.title || DEFAULT_TITLE;
  }
);
</script>

<style scoped lang="scss">
main {
  overflow: hidden;
  margin-top: 56px !important;
}
</style>
