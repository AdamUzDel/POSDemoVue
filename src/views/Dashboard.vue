<template>
  <el-container class="layout-container" style="height: auto">
    <el-aside width="200px">
      <el-scrollbar>
        <el-menu >
			<el-menu-item>
				<el-icon><search /></el-icon>Search
			</el-menu-item>
          <el-menu-item index="2">
            <template #title>
              <el-icon><house /></el-icon>Home
            </template>
          </el-menu-item>
          <el-sub-menu index="3">
            <template #title>
              <el-icon><setting /></el-icon>Inventory
            </template>
            <el-menu-item-group>
              <el-menu-item index="3-1">
				  <el-link href="/products">Products</el-link>
			  </el-menu-item>
              <el-menu-item index="3-2">Orders</el-menu-item>
            </el-menu-item-group>
          </el-sub-menu>
        </el-menu>
      </el-scrollbar>
    </el-aside>

    <el-container>
      <el-header style="text-align: left; font-size: 12px">
        <div class="toolbar">
          <span>Products</span>
        </div>
      </el-header>

      <el-main>
        <el-scrollbar>
          <el-table :data="tableData">
            <el-table-column prop="date" label="Date" width="140" />
            <el-table-column prop="name" label="Name" width="120" />
            <el-table-column prop="address" label="Address" />
          </el-table>
        </el-scrollbar>
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { House, Search, Setting } from '@element-plus/icons-vue'

const item = {
  date: '2016-05-02',
  name: 'Tom',
  address: 'No. 189, Grove St, Los Angeles',
}
const tableData = ref(Array.from({ length: 20 }).fill(item))
</script>

<style scoped>
.layout-container .el-header {
  position: relative;
  background-color: var(--el-color-primary-light-7);
  color: var(--el-text-color-primary);
}
.layout-container .el-aside {
  color: var(--el-text-color-primary);
  background: var(--el-color-primary-light-8);
}
.layout-container .el-menu {
  border-right: none;
}
.layout-container .el-main {
  padding: 0;
}
.layout-container .toolbar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  right: 20px;
}
</style>