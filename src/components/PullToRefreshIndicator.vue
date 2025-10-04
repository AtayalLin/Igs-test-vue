<template>
  <div
    class="pull-to-refresh-indicator"
    :style="{
      transform: `translateY(${pullDistance}px)`,
      opacity: pullDistance > 0 ? 1 : 0,
    }"
  >
    <div class="indicator-content">
      <!-- 刷新圖標 -->
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

      <!-- 提示文字 -->
      <div class="refresh-text">
        <span v-if="!isRefreshing && pullDistance < threshold"
          >下拉重新整理</span
        >
        <span v-else-if="!isRefreshing && pullDistance >= threshold"
          >放開將重新整理遊戲頁面</span
        >
        <span v-else>正在重新整理...</span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  isPulling: {
    type: Boolean,
    default: false,
  },
  pullDistance: {
    type: Number,
    default: 0,
  },
  isRefreshing: {
    type: Boolean,
    default: false,
  },
  threshold: {
    type: Number,
    default: 80,
  },
});
</script>

<style scoped>
.pull-to-refresh-indicator {
  position: absolute;
  top: -80px;
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
  color: rgba(255, 255, 255, 0.6);
  transition: all 0.3s ease;
}

.refresh-icon.is-pulling {
  color: rgba(255, 215, 0, 0.6);
}

.refresh-icon.is-ready {
  color: #ffd700;
  transform: scale(1.2);
}

.refresh-icon.is-refreshing {
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

.refresh-icon.is-ready + .refresh-text {
  color: #ffd700;
  font-weight: 600;
}

.refresh-icon.is-refreshing + .refresh-text {
  color: #ffd700;
  font-weight: 600;
}
</style>
