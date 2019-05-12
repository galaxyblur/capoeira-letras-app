<template>
  <q-page padding>
    <div class="q-my-md">
      <div v-if="userSettings.favorites.length > 0">
        <h2 class="text-h5">
          Favorites
          <q-chip small color="primary" class="shadow-1">
            {{ userSettings.favorites.length }}
          </q-chip>
        </h2>
        <q-list>
          <q-item
            v-for="(f, fi) in userSettings.favorites"
            :key="fi"
            link
            exact
            :to="getRouteForResult(getSongFromKey(f))"
          >
            <q-item-section>{{ getSongFromKey(f).title }}</q-item-section>
          </q-item>
        </q-list>
      </div>
      <p v-else>No favorites found.</p>
    </div>
  </q-page>
</template>

<style>
</style>

<script>
import songs from '../../json/songs.json';

export default {
  name: 'Favorites',
  data() {
    const userSettingsStr = this.$q.localStorage.getItem('user');

    return {
      userSettings: userSettingsStr ? JSON.parse(userSettingsStr) : {},
      songs,
    };
  },
  computed: {
    hasFav() {
      return Object.keys(this.userSettings).indexOf('favorites') >= 0;
    },
  },
  methods: {
    getSongFromKey(titleStd) {
      const [song] = this.songs.filter(s => s.title_std === titleStd);

      return song;
    },
    getRouteForResult(r) {
      return {
        name: 'Title',
        params: {
          title: r.title_std,
        },
      };
    },
    saveUserSettings() {
      this.$q.localStorage.set('user', JSON.stringify(this.userSettings));
    },
  },
  mounted() {
    if (!this.hasFav) {
      this.$set(this.userSettings, 'favorites', []);
    }

    this.saveUserSettings();
  },
};
</script>
