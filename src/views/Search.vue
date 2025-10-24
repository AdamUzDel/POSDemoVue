<template>
  <div class="search-page">
    <el-card>
      <h2>Global Search</h2>
      <el-input
        v-model="searchQuery"
        placeholder="Search across all modules..."
        size="large"
        clearable
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
      <el-empty v-if="!searchQuery" description="Enter a search term to begin" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Search } from '@element-plus/icons-vue'

const searchQuery = ref('')
</script>

<style scoped>
.search-page {
  padding: 1rem;
}

h2 {
  margin-bottom: 1.5rem;
  color: #111827;
}
</style>
