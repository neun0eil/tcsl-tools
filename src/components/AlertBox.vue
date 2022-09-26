<template>
  <div class="alert d-flex align-items-center gap-3" :class="`alert-${color}`" role="alert">
    <i class="fa-solid align-self-start" :class="`fa-${icon}`"></i>
    <div>
      <slot>{{ message }}</slot>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps } from 'vue';

const props = defineProps({
  color: String,
  icon: String,
  message: String,
});

const color = ref(props.color || 'primary');
const icon = ref(props.icon || 'circle-info');
const message = ref(props.message);
</script>

<style lang="scss">
.alert > i {
  font-size: 2rem;
}
</style>
