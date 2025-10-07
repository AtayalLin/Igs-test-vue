import { ref, watch, onUnmounted } from "vue";

export function usePullToRefresh(containerRef, onRefresh) {
  const isPulling = ref(false);
  const pullDistance = ref(0);
  const isRefreshing = ref(false);

  let startY = 0;
  let currentY = 0;
  const threshold = 80; // 觸發刷新的閾值
  const maxPullDistance = 150; // 最大下拉距離

  let container = null;

  function handleTouchStart(e) {
    if (!container) return;

    if (container.scrollTop === 0 && !isRefreshing.value) {
      startY = e.touches[0].clientY;
      isPulling.value = true;
    }
  }

  function handleTouchMove(e) {
    if (!isPulling.value || isRefreshing.value) return;

    currentY = e.touches[0].clientY;
    const distance = currentY - startY;

    if (distance > 0) {
      e.preventDefault();

      pullDistance.value = Math.min(distance * 0.5, maxPullDistance);
    }
  }

  async function handleTouchEnd() {
    if (!isPulling.value) return;

    isPulling.value = false;

    if (pullDistance.value >= threshold && !isRefreshing.value) {
      isRefreshing.value = true;
      pullDistance.value = threshold;

      try {
        await onRefresh();
      } catch (error) {
        console.error("刷新失敗:", error);
      } finally {
        setTimeout(() => {
          isRefreshing.value = false;
          pullDistance.value = 0;
        }, 1000);
      }
    } else {
      pullDistance.value = 0;
    }
  }

  function setupListeners() {
    if (!containerRef.value) return;
    container = containerRef.value;

    container.addEventListener("touchstart", handleTouchStart, {
      passive: true,
    });
    container.addEventListener("touchmove", handleTouchMove, {
      passive: false,
    });
    container.addEventListener("touchend", handleTouchEnd, { passive: true });
    container.addEventListener("touchcancel", handleTouchEnd, {
      passive: true,
    });
  }

  function removeListeners() {
    if (!container) return;

    container.removeEventListener("touchstart", handleTouchStart);
    container.removeEventListener("touchmove", handleTouchMove);
    container.removeEventListener("touchend", handleTouchEnd);
    container.removeEventListener("touchcancel", handleTouchEnd);
  }

  watch(
    containerRef,
    (newVal, oldVal) => {
      if (oldVal) removeListeners();
      if (newVal) setupListeners();
    },
    { immediate: true }
  );

  onUnmounted(() => {
    removeListeners();
  });

  return {
    isPulling,
    pullDistance,
    isRefreshing,
    threshold,
  };
}
