<template>
  <transition name="loading-fade">
    <div v-if="isLoading" class="loading-screen">
      <!-- 背景動畫層 -->
      <div class="loading-background">
        <div class="particle" v-for="i in 20" :key="i" :style="getParticleStyle(i)"></div>
      </div>
      
      <!-- Logo 和動畫 -->
      <div class="loading-content">
        <!-- Logo -->
        <div class="logo-container">
          <div class="logo-circle">
            <div class="logo-inner">
              <span class="logo-text">🎮</span>
            </div>
          </div>
          <div class="logo-ring"></div>
          <div class="logo-ring-2"></div>
        </div>
        
        <!-- 載入文字 -->
        <div class="loading-text">
          <h2 class="loading-title">遊戲大廳</h2>
          <p class="loading-subtitle">{{ loadingText }}</p>
        </div>
        
        <!-- 進度條 -->
        <div class="progress-container">
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: progress + '%' }"></div>
            <div class="progress-glow" :style="{ left: progress + '%' }"></div>
          </div>
          <div class="progress-text">{{ progress }}%</div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'

const props = defineProps({
  isLoading: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['loaded'])

const progress = ref(0)
const loadingText = ref('正在載入遊戲資源...')

const loadingTexts = [
  '正在載入遊戲資源...',
  '正在連接伺服器...',
  '正在獲取遊戲列表...',
  '準備就緒...'
]

// 生成粒子樣式
function getParticleStyle(index) {
  const size = Math.random() * 4 + 2
  const left = Math.random() * 100
  const animationDuration = Math.random() * 3 + 2
  const animationDelay = Math.random() * 2
  
  return {
    width: `${size}px`,
    height: `${size}px`,
    left: `${left}%`,
    animationDuration: `${animationDuration}s`,
    animationDelay: `${animationDelay}s`
  }
}

// 模擬載入進度
function simulateLoading() {
  let currentProgress = 0
  let textIndex = 0
  
  const interval = setInterval(() => {
    // 更新進度
    if (currentProgress < 100) {
      const increment = Math.random() * 15 + 5
      currentProgress = Math.min(currentProgress + increment, 100)
      progress.value = Math.floor(currentProgress)
      
      // 更新載入文字
      if (currentProgress > 25 && textIndex === 0) {
        loadingText.value = loadingTexts[1]
        textIndex = 1
      } else if (currentProgress > 50 && textIndex === 1) {
        loadingText.value = loadingTexts[2]
        textIndex = 2
      } else if (currentProgress > 80 && textIndex === 2) {
        loadingText.value = loadingTexts[3]
        textIndex = 3
      }
    } else {
      clearInterval(interval)
      // 延遲一下再觸發載入完成
      setTimeout(() => {
        emit('loaded')
      }, 500)
    }
  }, 100)
}

onMounted(() => {
  if (props.isLoading) {
    simulateLoading()
  }
})

watch(() => props.isLoading, (newVal) => {
  if (newVal) {
    progress.value = 0
    loadingText.value = loadingTexts[0]
    simulateLoading()
  }
})
</script>

<style scoped>
.loading-screen {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%);
  overflow: hidden;
}

/* 背景動畫層 */
.loading-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
}

.particle {
  position: absolute;
  background: radial-gradient(circle, rgba(255, 215, 0, 0.8) 0%, transparent 70%);
  border-radius: 50%;
  animation: float-up linear infinite;
  opacity: 0;
}

@keyframes float-up {
  0% {
    transform: translateY(100vh) scale(0);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(-100px) scale(1);
    opacity: 0;
  }
}

/* 載入內容 */
.loading-content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
}

/* Logo 容器 */
.logo-container {
  position: relative;
  width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-circle {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ffd700 0%, #ffb347 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 30px rgba(255, 215, 0, 0.5),
              0 0 60px rgba(255, 215, 0, 0.3);
  animation: pulse 2s ease-in-out infinite;
  position: relative;
  z-index: 2;
}

.logo-inner {
  width: 85px;
  height: 85px;
  border-radius: 50%;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-text {
  font-size: 48px;
  animation: bounce 1s ease-in-out infinite;
}

.logo-ring {
  position: absolute;
  width: 120px;
  height: 120px;
  border: 3px solid rgba(255, 215, 0, 0.3);
  border-radius: 50%;
  border-top-color: #ffd700;
  animation: spin 2s linear infinite;
}

.logo-ring-2 {
  position: absolute;
  width: 140px;
  height: 140px;
  border: 2px solid rgba(255, 215, 0, 0.2);
  border-radius: 50%;
  border-bottom-color: #ffd700;
  animation: spin 3s linear infinite reverse;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* 載入文字 */
.loading-text {
  text-align: center;
}

.loading-title {
  font-size: 32px;
  font-weight: bold;
  background: linear-gradient(135deg, #ffd700 0%, #ffb347 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 10px;
  animation: glow 2s ease-in-out infinite;
}

.loading-subtitle {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.7);
  animation: fade-in-out 2s ease-in-out infinite;
}

@keyframes glow {
  0%, 100% {
    filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.5));
  }
  50% {
    filter: drop-shadow(0 0 20px rgba(255, 215, 0, 0.8));
  }
}

@keyframes fade-in-out {
  0%, 100% {
    opacity: 0.7;
  }
  50% {
    opacity: 1;
  }
}

/* 進度條 */
.progress-container {
  width: 300px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.progress-bar {
  position: relative;
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  overflow: hidden;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.3);
}

.progress-fill {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: linear-gradient(90deg, #ffd700 0%, #ffb347 100%);
  border-radius: 10px;
  transition: width 0.3s ease;
  box-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
}

.progress-glow {
  position: absolute;
  top: -2px;
  width: 20px;
  height: 12px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.8) 0%, transparent 70%);
  border-radius: 50%;
  transform: translateX(-50%);
  transition: left 0.3s ease;
  filter: blur(3px);
}

.progress-text {
  text-align: center;
  font-size: 14px;
  color: #ffd700;
  font-weight: bold;
}

/* 淡入淡出動畫 */
.loading-fade-enter-active {
  animation: fade-in 0.5s ease;
}

.loading-fade-leave-active {
  animation: fade-out 0.5s ease;
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes fade-out {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

/* 響應式設計 */
@media (max-width: 480px) {
  .logo-container {
    width: 100px;
    height: 100px;
  }
  
  .logo-circle {
    width: 80px;
    height: 80px;
  }
  
  .logo-inner {
    width: 68px;
    height: 68px;
  }
  
  .logo-text {
    font-size: 36px;
  }
  
  .loading-title {
    font-size: 24px;
  }
  
  .loading-subtitle {
    font-size: 14px;
  }
  
  .progress-container {
    width: 250px;
  }
}
</style>

