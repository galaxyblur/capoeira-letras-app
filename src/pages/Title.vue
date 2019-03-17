<template>
  <q-page padding>
    <div v-if="displaySong">
      <h5>
        {{ displaySong.title }}
      </h5>
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
    return {
      songs,
      displaySong: undefined,
    };
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
  },
};
</script>
