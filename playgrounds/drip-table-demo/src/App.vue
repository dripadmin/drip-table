<template>
  <div>
    <h3>Drip Table 演示</h3>
    <el-tabs v-model="activeTab" type="border-card">
      <el-tab-pane label="基础表格" name="TablePage" active>
        <TableDemo />
      </el-tab-pane>
      <el-tab-pane label="树表格" name="TreePage">
        <TreeDemo />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref, shallowRef, defineAsyncComponent } from 'vue'
import TableDemo from './components/TableDemo.vue'
import TreeDemo from './components/TreeDemo.vue'
const activeTab = ref('TablePage')
</script>