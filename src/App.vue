<template>
  <nav-bar />
  <main class="flex-fill">
    <router-view />
  </main>
</template>

<script>
import NavBar from "./components/NavBar.vue";

export default {
  components: {
    NavBar,
  },
};
</script>

<style scoped lang="scss">
#app > main {
  margin-top: 56px !important;
}
</style>
