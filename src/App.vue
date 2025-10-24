<template>
  <div id="app">
    <!-- Removed gradient background, now handled by dashboard layout -->
    <router-view />
  </div>
</template>

<script setup lang="ts">
// Root component - all pages will be rendered through router-view
</script>

<style>
/* Global styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  min-height: 100vh;
  /* Removed gradient background for clean dashboard look */
  background-color: #f5f7fa;
}

/* Added global font styling */
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  color: #111827;
}
</style>
