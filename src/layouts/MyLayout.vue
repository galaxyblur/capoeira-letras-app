<template>
  <q-layout view="hHh lpR fFf">

    <q-header bordered class="bg-primary text-white">
      <q-toolbar>
        <q-btn
          v-if="canGoBack"
          @click="goBack"
          flat dense icon="ion-ios-arrow-back" />
        <q-toolbar-title>
          Capoeira Letras
          <div slot="subtitle">lyrics database</div>
        </q-toolbar-title>
      </q-toolbar>

      <q-tabs align="left">
        <q-route-tab to="/" label="Search" />
        <q-route-tab to="/favorites" label="Favorites" />
        <q-route-tab to="/about" label="About" />
      </q-tabs>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script>
export default {
  computed: {
    canGoBack() {
      return this.$route.path !== '/' && window.history.length > 1;
    },
  },
  methods: {
    goBack() {
      if (this.canGoBack) {
        this.$router.go(-1);
      } else {
        this.$router.push('/');
      }
    },
  },
};
</script>
