<template>
  <q-page padding>
    <div class="q-mb-md">
      <q-input
        type="text"
        v-model="searchTerm"
        :debounce="500"
        clearable
        clear-icon="ion-ios-close-circle"
        stack-label
        :label="'Search ' + songs.length + ' songs'" />
    </div>

    <div class="q-my-md">
      <div v-if="resultsTitles.length > 0">
        <h2 class="text-h5">
          Title Matches
          <q-chip small color="primary" class="shadow-1">{{ resultsTitles.length }}</q-chip>
        </h2>
        <q-list>
          <q-item
            v-for="(t, ti) in resultsTitles"
            :key="ti"
            link
            exact
            :to="getRouteForResult(t)"
          >
            <q-item-section>{{ t.title }}</q-item-section>
            <q-item-section side>
              <q-icon v-if="isFavorite(t)" name="ion-ios-star" />
            </q-item-section>
            <q-item-section side>
              <q-icon name="ion-ios-arrow-forward" />
            </q-item-section>
          </q-item>
        </q-list>
      </div>
      <p v-else-if="searchTermIsValid">No title matches.</p>
    </div>

    <div class="q-my-md">
      <div v-if="resultsLyrics.length > 0">
        <h2 class="text-h5">
          Lyrics Matches
          <q-chip small color="primary" class="shadow-1">{{ resultsLyrics.length }}</q-chip>
        </h2>
        <q-list>
          <q-item
            v-for="(l, li) in resultsLyrics"
            :key="li"
            link
            exact
            :to="getRouteForResult(l)"
          >
            <q-item-section>{{ l.title }}</q-item-section>
            <q-item-section side>
              <q-icon v-if="isFavorite(l)" name="ion-ios-star" />
            </q-item-section>
            <q-item-section side>
              <q-icon name="ion-ios-arrow-forward" />
            </q-item-section>
          </q-item>
        </q-list>
      </div>
      <p v-else-if="searchTermIsValid">No lyrics matches.</p>
    </div>
  </q-page>
</template>

<style>
</style>

<script>
import FlexSearch from 'flexsearch';
import { deburr, toLower } from 'lodash';
import songs from '../../json/songs.json';

const titles = new FlexSearch();
const lyrics = new FlexSearch();

const standardizeText = function standardizeText(t) {
  return toLower(deburr(t));
};

songs.forEach((s, i) => {
  titles.add(i, standardizeText(s.title));
  lyrics.add(i, standardizeText(s.text));
});

export default {
  name: 'PageIndex',
  data() {
    const userSettingsStr = this.$q.localStorage.getItem('user');

    return {
      userSettings: userSettingsStr ? JSON.parse(userSettingsStr) : {},
      searchTerm: '',
      songs,
      titles,
      lyrics,
      resultsTitles: [],
      resultsLyrics: [],
    };
  },
  computed: {
    searchTermIsValid() {
      return typeof this.searchTerm === 'string' && this.searchTerm.length >= 3;
    },
    hasFav() {
      return Object.keys(this.userSettings).indexOf('favorites') >= 0;
    },
  },
  watch: {
    searchTerm(val) {
      this.resultsTitles = [];
      this.resultsLyrics = [];

      if (this.searchTermIsValid) {
        this.$router.replace({
          query: Object.assign({}, this.$route.query, {
            q: this.searchTerm,
          }),
        });

        const search = standardizeText(val);
        const resultsIndex = [];
        const resultsTitles = this.titles.search(search);

        resultsTitles.forEach((r) => {
          resultsIndex.push(this.songs[r].title_std);
          this.resultsTitles.push(this.songs[r]);
        });

        const resultsLyrics = this.lyrics.search(search);

        resultsLyrics.forEach((r) => {
          if (resultsIndex.indexOf(this.songs[r].title_std) < 0) {
            resultsIndex.push(this.songs[r].title_std);
            this.resultsLyrics.push(this.songs[r]);
          }
        });
      } else {
        this.$router.replace({
          query: Object.assign({}, this.$route.query, {
            q: '',
          }),
        });
      }
    },
  },
  methods: {
    getRouteForResult(r) {
      return {
        name: 'Title',
        params: {
          title: r.title_std,
        },
        query: {
          highlight: this.searchTerm,
        },
      };
    },
    saveUserSettings() {
      this.$q.localStorage.set('user', JSON.stringify(this.userSettings));
    },
    isFavorite(song) {
      if (!this.hasFav) {
        this.$set(this.userSettings, 'favorites', []);
      }

      this.saveUserSettings();

      return this.userSettings.favorites.indexOf(song.title_std) >= 0;
    },
  },
  mounted() {
    if (this.$route.query.q) {
      this.searchTerm = this.$route.query.q;
    }
  },
};
</script>
