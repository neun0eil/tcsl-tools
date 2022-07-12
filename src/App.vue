<template>
  <nav-bar :title="title" />
  <main class="overflow-hidden">
    <router-view />
  </main>
</template>

<script>
import NavBar from "@/components/NavBar.vue";

const DEFAULT_TITLE = "Outils TCSL";

export default {
  data() {
    return {
      title: DEFAULT_TITLE,
    };
  },
  components: {
    NavBar,
  },
  watch: {
    $route(t) {
      this.title = document.title = t.meta.title || DEFAULT_TITLE;
    },
  },
};
</script>

<style scoped lang="scss">
#app > main {
  margin-top: 56px !important;
}
</style>
