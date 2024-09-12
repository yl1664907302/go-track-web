<template>
  <h3>{{ route.query.niname }}</h3>
  <h3>{{ route.query.receiver }}</h3>
  <h3>{{ route.query.state }}</h3>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
</script>
