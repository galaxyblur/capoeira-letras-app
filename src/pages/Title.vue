<template>
  <q-page padding>
    <div v-if="displaySong">
      <div class="row items-center">
        <div class="col">
          <h5>
            {{ displaySong.title }}
          </h5>
        </div>
        <div class="col-2 text-right">
          <q-btn v-if="isFavorite" flat icon="ion-ios-star" color="yellow-14"
            @click="removeFavorite" />
          <q-btn v-else flat icon="ion-ios-star-outline" @click="addFavorite" />
        </div>
      </div>
      <p class="q-my-md">
        <template v-for="(line, key) in displaySong.text.split('\n')">
          {{ line }}<br :key="key">
        </template>
      </p>
    </div>
  </q-page>
</template>

<script>
import songs from '../../json/songs.json';

export default {
  name: 'Title',
  data() {
    const userSettingsStr = this.$q.localStorage.getItem('user');

    return {
      userSettings: userSettingsStr ? JSON.parse(userSettingsStr) : {},
      songs,
      displaySong: undefined,
    };
  },
  computed: {
    hasFav() {
      return Object.keys(this.userSettings).indexOf('favorites') >= 0;
    },
    isFavorite() {
      const i = this.hasFav ? this.userSettings.favorites.indexOf(this.displaySong.title_std) : -1;
      return i >= 0;
    },
  },
  watch: {
    $route: 'setSong',
  },
  created() {
    this.setSong();
  },
  methods: {
    setSong() {
      const { title } = this.$route.params;

      if (title) {
        const [displaySong] = this.songs.filter(s => s.title_std === title);

        if (displaySong) {
          this.displaySong = displaySong;
        }
      }
    },
    saveUserSettings() {
      this.$q.localStorage.set('user', JSON.stringify(this.userSettings));
    },
    addFavorite() {
      if (!this.hasFav) {
        this.$set(this.userSettings, 'favorites', []);
      }

      if (this.userSettings.favorites.indexOf(this.displaySong.title_std) < 0) {
        this.userSettings.favorites.push(this.displaySong.title_std);
      }

      this.saveUserSettings();

      this.$q.notify({
        message: `Added "${this.displaySong.title}" to favorites`,
      });
    },
    removeFavorite() {
      this.$delete(
        this.userSettings.favorites,
        this.userSettings.favorites.indexOf(this.displaySong.title_std),
      );

      this.saveUserSettings();

      this.$q.notify({
        message: `Removed "${this.displaySong.title}" from favorites`,
      });
    },
  },
};
</script>
