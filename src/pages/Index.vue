<template>
  <q-page padding>
    <div class="q-mb-md">
      <q-search
        type="text"
        v-model="searchTerm"
        :debounce="500"
        clearable
        :float-label="'Search ' + songs.length + ' songs'" />
    </div>

    <div class="q-my-md">
      <q-list v-if="resultsTitles.length > 0">
        <q-list-header>
          Title Matches
          <q-chip small color="primary" class="shadow-1">{{ resultsTitles.length }}</q-chip>
        </q-list-header>
        <q-item
          v-for="(t, ti) in resultsTitles"
          :key="ti"
          link
          exact
          :to="{ name: 'Title', params: { title: t.title_std } }"
        >{{ t.title }}</q-item>
      </q-list>
      <p v-else-if="searchTerm">No title matches.</p>
    </div>

    <div class="q-my-md">
      <q-list v-if="resultsLyrics.length > 0">
        <q-list-header>
          Lyrics Matches
          <q-chip small color="primary" class="shadow-1">{{ resultsLyrics.length }}</q-chip>
        </q-list-header>
        <q-item
          v-for="(l, li) in resultsLyrics"
          :key="li"
          link
          exact
          :to="{ name: 'Title', params: { title: l.title_std } }"
        >{{ l.title }}</q-item>
      </q-list>
      <p v-else-if="searchTerm">No lyrics matches.</p>
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
    return {
      searchTerm: '',
      songs,
      titles,
      lyrics,
      resultsTitles: [],
      resultsLyrics: [],
    };
  },
  watch: {
    searchTerm(val) {
      if (typeof val === 'string' && val.length >= 3) {
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
        this.resultsTitles = [];
        this.resultsLyrics = [];
      }
    },
  },
};
</script>
