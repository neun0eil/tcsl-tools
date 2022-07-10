<template>
  <div class="container my-3">
    <div class="row">
      <div class="col-12 mx-auto d-flex flex-column gap-3">
        <a href="/" class="logo mx-auto">
          <img src="@/assets/logo.svg" alt="Logo" />
        </a>
        <router-link class="btn btn-dark btn-lg" to="/sight">
          Réglage visée
        </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.col-12 {
  max-width: 20rem;
}
.logo {
  max-width: 10rem;
  > img {
    width: 100%;
  }
}
</style>
