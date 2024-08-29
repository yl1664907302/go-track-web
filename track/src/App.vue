<script setup lang="ts">
import layout from './views/layout/index.vue'
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div id="app">
    <layout>
      <RouterView />
    </layout>
  </div>
</template>

