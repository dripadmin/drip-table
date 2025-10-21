<template>
  <div class="drip-table-row-toolbar">
    <el-button-group v-if="group">
      <el-button
        v-for="action in props.actions"
        :key="action.event"
        :type="action.type"
        :size="props.size || 'small'"
        :link="action.link || false"
        @click="handleAction(action.event)"
      >
        {{ action.label }}
      </el-button>
    </el-button-group>
    <template v-else>
      <el-button
        v-for="action in props.actions"
        :key="action.event"
        :type="action.type"
        :size="props.size || 'small'"
        :link="action.link || false"
        @click="handleAction(action.event)"
      >
        {{ action.label }}
      </el-button>
    </template>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from "vue";
import type { DripTableRowToolBar } from "../../../types/drip-table";
defineOptions({ name: "RowToolbar" });
const props = defineProps<DripTableRowToolBar>();

const emit = defineEmits<{
  (e: "action", eventName: string, row: any): void;
}>();

const handleAction = (eventName: string) => {
  emit("action", eventName, props.row);
};
</script>

<style scoped>
.drip-table-row-toolbar {
  display: flex;
  justify-content: center;
}
</style>
