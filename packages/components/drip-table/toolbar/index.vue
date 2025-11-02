<template>
  <div
    class="drip-table__toolbar"
    :style="containerStyle"
    :class="props?.class"
  >
    <div class="drip-table__toolbar-actions">
      <div
        v-for="action in props?.actions"
        :key="action.event"
        class="toolbar-item"
      >
        <ElDropdown
          @command="handleAction(action.event, $event)"
          v-if="action.event === 'size'"
        >
          <!-- 注意：为避免 Tooltip 与 Dropdown 的 role 冲突，这里改用原生 title 提示 -->
          <ElButton
            :size="props.size"
            :circle="isCircle"
            :round="isRound"
            :link="isLink"
            :text="isText"
            :plain="isPlain"
            :icon="props.showIcon ? getIcon(action.icon as string) : ''"
            :title="action.label"
            :type="action.type"
            aria-label="size"
            ><span v-show="props.showText">{{ action.label }}</span></ElButton
          >
          <template #dropdown>
            <ElDropdownMenu>
              <ElDropdownItem
                v-for="opt in sizeMenu"
                :key="opt"
                :command="opt"
                >{{ sizeLabel(opt) }}</ElDropdownItem
              >
            </ElDropdownMenu>
          </template>
        </ElDropdown>

        <column-setting
          :action="action"
          :columns="props.columns"
          :btnStyle="props.btnStyle"
          :size="props.size"
          :showIcon="props.showIcon"
          :showText="props.showText"
          :showTooltip="props.showTooltip"
          v-else-if="action.event === 'columns'"
          @columns-visibility-change="
            handleAction('columns-visibility-change', $event)
          "
          @columns-order-change="handleAction('columns-order-change', $event)"
        />

        <ElTooltip
          :disabled="!props.showTooltip"
          :content="action.label"
          placement="bottom"
          v-else
        >
          <ElButton
            :size="props?.size"
            :circle="isCircle"
            :round="isRound"
            :link="isLink"
            :text="isText"
            :plain="isPlain"
            :type="action.type"
            :icon="props.showIcon ? getIcon(action.icon as string) : ''"
            @click="handleAction(action.event, action.data, action.config)"
          >
            <span v-show="props.showText">{{ action.label }}</span>
          </ElButton>
        </ElTooltip>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DripTableToolbarConfig } from "../../../types/drip-table";
import { computed, ref } from "vue";
import ColumnSetting from "./ColumnSetting.vue";
import { getIcon } from "../tools";

defineOptions({ name: "Toolbar" });
const props = defineProps<DripTableToolbarConfig>();
const isCircle = computed(() => props.btnStyle === "circle");
const isRound = computed(() => props.btnStyle === "round");
const isLink = computed(() => props.btnStyle === "link");
const isText = computed(() => props.btnStyle === "text");
const isPlain = computed(() => props.btnStyle === "plain");

const containerStyle = computed(() => ({
  "--toolbar-gap": `${props.gap ?? 8}px`,
  ...(props.style ?? {}),
}));

const emit = defineEmits<{
  (e: "action", eventName: string, data?: any, config?: any): void;
}>();
const handleAction = (eventName: string, data?: any, config?: any) => {
  emit("action", eventName, data, config);
};

// 尺寸菜单项(紧凑（small）、默认（default）、宽松（large）)
const sizeMenu = ["large", "default", "small"];
function sizeLabel(s: string) {
  return s === "small" ? "紧凑" : s === "large" ? "宽松" : "默认";
}
// 页面区域内“最大化”而非浏览器全屏
const isMaximized = ref(false);
const maximizeLabel = computed(() =>
  isMaximized.value ? "退出最大化" : "最大化"
);
const maximizeIcon = computed(() =>
  isMaximized.value ? getIcon("CloseBold") : getIcon("FullScreen")
);

// function onToggleMaximize() {
//   isMaximized.value = !isMaximized.value;
//   emit('maximize-toggle', isMaximized.value);
// }
</script>

<style scoped>
.drip-table__toolbar {
  display: flex;
}
.drip-table__toolbar-actions {
  display: flex;
  align-items: center;
  gap: var(--toolbar-gap, 8px);
}
.toolbar-item {
  display: inline-flex;
}
/* 统一 Element Plus 组件在工具条中的外边距，避免个别组件（如 Popover/Dropdown）默认 margin 导致间距偏大 */
.drip-table__toolbar-actions :deep(.el-popover__reference),
.drip-table__toolbar-actions :deep(.el-dropdown),
.drip-table__toolbar-actions :deep(.el-tooltip__trigger) {
  margin: 0 !important;
}
</style>
