<template>
  <div class="pull-to-refresh-wrapper">
    <div
      class="pull-to-refresh-indicator"
      :style="{
        transform: `translateY(${indicatorTranslateY}px)`,
        opacity: pullDistance > 0 ? 1 : 0,
      }"
    >
      <div class="indicator-content">
        <div
          class="refresh-icon"
          :class="{
            'is-pulling': isPulling && pullDistance < threshold,
            'is-ready': isPulling && pullDistance >= threshold,
            'is-refreshing': isRefreshing,
          }"
          :style="{
            transform: `rotate(${
              isPulling && !isRefreshing ? pullDistance * 2 : 0
            }deg)`,
          }"
        >
          <svg
            v-if="!isRefreshing"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"
            />
          </svg>
          <div v-else class="spinner"></div>
        </div>

        <div class="refresh-text">
          <span v-if="!isRefreshing && pullDistance < threshold"
            >下拉重新整理</span
          >
          <div
            v-else-if="!isRefreshing && pullDistance >= threshold"
            class="release-to-refresh-box"
          >
            放開將重新整理遊戲頁面
          </div>
          <span v-else>正在重新整理...</span>
        </div>
      </div>
    </div>

    <slot />
  </div>
</template>

<script setup>
import { computed, watch } from "vue";

const props = defineProps({
  isPulling: Boolean,
  pullDistance: Number,
  isRefreshing: Boolean,
  threshold: {
    type: Number,
    default: 80,
  },
});

const emit = defineEmits(["refresh-complete"]);

const indicatorHeight = 80;

const indicatorTranslateY = computed(() => {
  const clamped = Math.min(props.pullDistance, props.threshold);
  return -indicatorHeight + (clamped / props.threshold) * indicatorHeight;
});

// 監聽刷新狀態，當刷新結束時發射事件
watch(
  () => props.isRefreshing,
  (newVal, oldVal) => {
    if (oldVal === true && newVal === false) {
      emit("refresh-complete");
    }
  }
);
</script>

<style scoped>
/* 保持你原有樣式 */
.pull-to-refresh-wrapper {
  position: relative;
  overflow: hidden;
}

.pull-to-refresh-indicator {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.3s ease;
  z-index: 10;
}

.indicator-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.refresh-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  transition: transform 0.3s ease, color 0.3s ease;
}

.refresh-icon.is-pulling {
  color: rgba(255, 215, 0, 0.6);
}

.refresh-icon.is-ready {
  color: #ffd700;
  transform: scale(1.2);
}

.refresh-icon.is-refreshing {
  color: #ffd700;
  animation: none;
}

.refresh-icon svg {
  width: 100%;
  height: 100%;
}

.spinner {
  width: 24px;
  height: 24px;
  border: 3px solid rgba(255, 215, 0, 0.3);
  border-top-color: #ffd700;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.refresh-text {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 500;
  text-align: center;
  max-width: 250px;
  line-height: 1.4;
}

.release-to-refresh-box {
  display: inline-block;
  padding: 6px 12px;
  background-color: rgba(255, 215, 0, 0.2);
  border: 2px solid #ffd700;
  border-radius: 8px;
  color: #ffd700;
  font-weight: 600;
  user-select: none;
  box-shadow: 0 0 10px rgba(255, 215, 0, 0.6);
}
</style>
