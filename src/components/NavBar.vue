<template>
  <nav class="fixed-top navbar navbar-dark bg-dark">
    <div class="container">
      <span class="navbar-brand">{{ props.title }}</span>
      <button class="navbar-toggler" type="button" @click="onClick">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" ref="navbar">
        <ul class="navbar-nav">
          <li class="nav-item">
            <router-link class="nav-link" :to="{ name: 'home' }"> Accueil </router-link>
          </li>
          <li>
            <router-link class="nav-link" :to="{ name: 'sight' }"> Réglage visée </router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { onMounted, ref, defineProps, watch } from 'vue';
import { useRoute } from 'vue-router';
import { Collapse } from 'bootstrap';

const route = useRoute();
const toggler = ref();
const navbar = ref();

const props = defineProps({
  title: String,
});

function onClick() {
  toggler.value.toggle();
}

watch(
  () => route.name,
  () => {
    toggler.value.hide();
  }
);

onMounted(() => {
  toggler.value = new Collapse(navbar.value, {
    toggle: false,
  });
});
</script>

<style lang="scss">
.nav-link.router-link-exact-active {
  color: var(--bs-navbar-active-color);
}
</style>
