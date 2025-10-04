// 下拉刷新 Composable
import { ref, onMounted, onUnmounted } from 'vue'

export function usePullToRefresh(containerRef, onRefresh) {
  const isPulling = ref(false)
  const pullDistance = ref(0)
  const isRefreshing = ref(false)
  
  let startY = 0
  let currentY = 0
  const threshold = 80 // 觸發刷新的閾值
  const maxPullDistance = 150 // 最大下拉距離

  // 觸摸開始
  function handleTouchStart(e) {
    if (!containerRef.value) return
    
    // 只有在滾動到頂部時才允許下拉
    if (containerRef.value.scrollTop === 0) {
      startY = e.touches[0].clientY
      isPulling.value = true
    }
  }

  // 觸摸移動
  function handleTouchMove(e) {
    if (!isPulling.value || isRefreshing.value) return
    
    currentY = e.touches[0].clientY
    const distance = currentY - startY
    
    // 只允許向下拉
    if (distance > 0) {
      // 防止頁面滾動
      e.preventDefault()
      
      // 計算下拉距離（使用阻尼效果）
      pullDistance.value = Math.min(distance * 0.5, maxPullDistance)
    }
  }

  // 觸摸結束
  async function handleTouchEnd() {
    if (!isPulling.value) return
    
    isPulling.value = false
    
    // 如果下拉距離超過閾值，觸發刷新
    if (pullDistance.value >= threshold && !isRefreshing.value) {
      isRefreshing.value = true
      pullDistance.value = threshold // 保持在閾值位置
      
      try {
        // 執行刷新回調
        await onRefresh()
      } catch (error) {
        console.error('刷新失敗:', error)
      } finally {
        // 延遲一下再重置，讓用戶看到完成動畫
        setTimeout(() => {
          isRefreshing.value = false
          pullDistance.value = 0
        }, 500)
      }
    } else {
      // 未達到閾值，回彈
      pullDistance.value = 0
    }
  }

  // 設置事件監聽
  function setupListeners() {
    if (!containerRef.value) return
    
    const container = containerRef.value
    
    container.addEventListener('touchstart', handleTouchStart, { passive: true })
    container.addEventListener('touchmove', handleTouchMove, { passive: false })
    container.addEventListener('touchend', handleTouchEnd, { passive: true })
  }

  // 移除事件監聽
  function removeListeners() {
    if (!containerRef.value) return
    
    const container = containerRef.value
    
    container.removeEventListener('touchstart', handleTouchStart)
    container.removeEventListener('touchmove', handleTouchMove)
    container.removeEventListener('touchend', handleTouchEnd)
  }

  // 生命週期管理
  onMounted(() => {
    setupListeners()
  })

  onUnmounted(() => {
    removeListeners()
  })

  return {
    isPulling,
    pullDistance,
    isRefreshing,
    threshold
  }
}

