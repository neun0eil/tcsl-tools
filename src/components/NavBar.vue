<template>
  <nav class="fixed-top navbar navbar-dark bg-dark">
    <div class="container">
      <span class="navbar-brand">{{ title }}</span>
      <button class="navbar-toggler" type="button" @click="toggle">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" ref="navbar">
        <ul class="navbar-nav">
          <li class="nav-item" @click="hide">
            <router-link class="nav-link" to="/"> Accueil </router-link>
            <router-link class="nav-link" to="/sight">
              Réglage visée
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import { Collapse } from "bootstrap";

export default {
  props: {
    title: String,
  },
  data() {
    return {
      toggler: null,
    };
  },
  mounted() {
    this.toggler = new Collapse(this.$refs.navbar, {
      toggle: false,
    });
  },
  methods: {
    hide(e) {
      const a = e.target.closest("a");
      if (!a) return;
      this.toggler.hide();
    },
    toggle() {
      this.toggler.toggle();
    },
  },
};
</script>
