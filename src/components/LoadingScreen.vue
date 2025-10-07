<template>
  <transition name="loading-fade">
    <div v-if="isLoading" class="loading-screen-overlay">
      <!-- 背景動畫層 -->
      <div class="loading-background">
        <!-- 浮動遊戲圖標背景 -->
        <div class="floating-icons-container">
          <div
            class="floating-icon"
            v-for="i in 15"
            :key="`icon-${i}`"
            :style="getFloatingIconStyle(i)"
          >
            {{ getRandomGameIcon() }}
          </div>
        </div>

        <!-- 粒子效果 -->
        <div class="particles-container">
          <div
            class="particle"
            v-for="i in 25"
            :key="`particle-${i}`"
            :style="getParticleStyle(i)"
          ></div>
        </div>
      </div>

      <!-- 主要內容區 -->
      <div class="loading-content" data-aos="zoom-in">
        <!-- Logo 容器 -->
        <div class="logo-wrapper">
          <!-- 外圈旋轉環 -->
          <div class="orbit-ring orbit-ring-1"></div>
          <div class="orbit-ring orbit-ring-2"></div>
          <div class="orbit-ring orbit-ring-3"></div>

          <!-- 中心 Logo -->
          <div class="logo-center">
            <div class="logo-circle">
              <div class="logo-inner">
                <span class="main-emoji">🎮</span>
              </div>
            </div>

            <!-- 軌道運行的小圖標 -->
            <div class="orbit-icon orbit-icon-1">🎯</div>
            <div class="orbit-icon orbit-icon-2">🎲</div>
            <div class="orbit-icon orbit-icon-3">🃏</div>
          </div>
        </div>

        <!-- 標題文字 -->
        <div class="title-section">
          <h1 class="game-title">
            <span class="title-icon">🎮</span>
            遊戲大廳
            <span class="title-icon">🎮</span>
          </h1>
          <p class="loading-status">{{ loadingText }}</p>
        </div>

        <!-- 進度條區域 -->
        <div class="progress-section">
          <!-- Bootstrap 風格進度條 -->
          <div class="progress-wrapper">
            <div class="progress">
              <div
                class="progress-bar progress-bar-striped progress-bar-animated"
                role="progressbar"
                :style="{ width: progress + '%' }"
                :aria-valuenow="progress"
                aria-valuemin="0"
                aria-valuemax="100"
              >
                <span class="progress-shine"></span>
              </div>
            </div>
          </div>

          <!-- 進度百分比 -->
          <div class="progress-info">
            <span class="progress-percentage">{{ progress.toFixed(2) }}%</span>
            <span class="progress-label">Loading...</span>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from "vue";
import { gsap } from "gsap";
import AOS from "aos";

const props = defineProps({
  isLoading: {
    type: Boolean,
    default: true,
  },
  durationSeconds: {
    type: Number,
    default: 2,
  },
});

const emit = defineEmits(["loaded"]);

const progress = ref(0);
const loadingText = ref("🎮 正在載入遊戲資源...");

const loadingTexts = [
  "🎮 正在載入遊戲資源...",
  "🌐 正在連接伺服器...",
  "📋 正在獲取遊戲列表...",
  "🎯 正在載入遊戲數據...",
  "✨ 準備就緒...",
];

const gameIcons = [
  "🎮",
  "🎯",
  "🎲",
  "🃏",
  "🎰",
  "🎪",
  "🎨",
  "🎭",
  "🎸",
  "🎺",
  "🎻",
  "🎹",
  "🎤",
  "🎧",
  "🎬",
  "🎮",
  "🕹️",
  "🎳",
  "🏆",
  "🥇",
  "🎊",
  "🎉",
];

// 生成粒子樣式
function getParticleStyle(index) {
  const size = Math.random() * 3 + 1;
  const left = Math.random() * 100;
  const animationDuration = Math.random() * 4 + 3;
  const animationDelay = (index * 0.1) % 2;

  return {
    width: `${size}px`,
    height: `${size}px`,
    left: `${left}%`,
    animationDuration: `${animationDuration}s`,
    animationDelay: `${animationDelay}s`,
  };
}

// 生成浮動圖標樣式
function getFloatingIconStyle(index) {
  const size = Math.random() * 25 + 35;
  const left = Math.random() * 95;
  const top = Math.random() * 95;
  const animationDuration = Math.random() * 5 + 4;
  const animationDelay = (index * 0.2) % 3;
  const opacity = Math.random() * 0.15 + 0.05;

  return {
    fontSize: `${size}px`,
    left: `${left}%`,
    top: `${top}%`,
    opacity: opacity,
    animationDuration: `${animationDuration}s`,
    animationDelay: `${animationDelay}s`,
  };
}

// 隨機獲取遊戲圖標
function getRandomGameIcon() {
  return gameIcons[Math.floor(Math.random() * gameIcons.length)];
}

// 模擬載入進度 - 使用 GSAP 動畫
function simulateLoading() {
  let currentProgress = 0;
  let textIndex = 0;

  // 使用 GSAP 動畫載入進度條
  gsap.to(progress, {
    value: 100,
    duration: props.durationSeconds,
    ease: "power2.out",
    onUpdate: () => {
      currentProgress = progress.value;

      // 更新載入文字
      if (currentProgress > 20 && textIndex === 0) {
        loadingText.value = loadingTexts[1];
        textIndex = 1;
        // 添加文字變化動畫
        gsap.fromTo(
          ".loading-subtitle",
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.5 }
        );
      } else if (currentProgress > 40 && textIndex === 1) {
        loadingText.value = loadingTexts[2];
        textIndex = 2;
        gsap.fromTo(
          ".loading-subtitle",
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.5 }
        );
      } else if (currentProgress > 70 && textIndex === 2) {
        loadingText.value = loadingTexts[3];
        textIndex = 3;
        gsap.fromTo(
          ".loading-subtitle",
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.5 }
        );
      } else if (currentProgress > 90 && textIndex === 3) {
        loadingText.value = loadingTexts[4];
        textIndex = 4;
        gsap.fromTo(
          ".loading-subtitle",
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.5 }
        );
      }
    },
    onComplete: () => {
      // 延遲一下再觸發載入完成
      setTimeout(() => {
        emit("loaded");
      }, 300);
    },
  });

  // 添加 Logo 動畫
  nextTick(() => {
    gsap.fromTo(
      ".logo-wrapper",
      { scale: 0, rotation: -120 },
      { scale: 1, rotation: 0, duration: 0.9, ease: "back.out(1.7)" }
    );

    gsap.fromTo(
      ".game-title, .loading-status",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, delay: 0.3 }
    );

    gsap.fromTo(
      ".progress-wrapper",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, delay: 0.6 }
    );
  });
}

onMounted(() => {
  if (props.isLoading) {
    simulateLoading();
  }
});

watch(
  () => props.isLoading,
  (newVal) => {
    if (newVal) {
      progress.value = 0;
      loadingText.value = loadingTexts[0];
      // refresh AOS to trigger animation
      if (typeof AOS !== "undefined") {
        AOS.refresh();
      }
      simulateLoading();
    }
  }
);
</script>

<style scoped>
/* ==================== 全域重置 ==================== */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* ==================== 主容器 ==================== */
.loading-screen-overlay {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
  width: 100vw !important;
  height: 100vh !important;
  z-index: 999999 !important; /* 最高層級，確保覆蓋所有元素 */
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #0f0c29 0%, #1a1a2e 50%, #24243e 100%);
  overflow: hidden;
  margin: 0;
  padding: 0;
}

/* ==================== 背景層 ==================== */
.loading-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 1;
}

/* 浮動圖標容器 */
.floating-icons-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.floating-icon {
  position: absolute;
  font-size: 40px;
  user-select: none;
  pointer-events: none;
  animation: float-drift 8s ease-in-out infinite;
  filter: blur(1px);
}

/* 粒子容器 */
.particles-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.particle {
  position: absolute;
  background: radial-gradient(
    circle,
    rgba(255, 215, 0, 0.6) 0%,
    rgba(255, 179, 71, 0.3) 50%,
    transparent 100%
  );
  border-radius: 50%;
  animation: particle-rise linear infinite;
  bottom: -10px;
}

/* ==================== 主要內容區 ==================== */
.loading-content {
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 40px;
  padding: 20px;
}

/* ==================== Logo 區域 ==================== */
.logo-wrapper {
  position: relative;
  width: 200px;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 軌道環 */
.orbit-ring {
  position: absolute;
  border-radius: 50%;
  border: 2px solid transparent;
}

.orbit-ring-1 {
  width: 180px;
  height: 180px;
  border-color: rgba(255, 215, 0, 0.3);
  border-top-color: #ffd700;
  animation: spin-ring 3s linear infinite;
}

.orbit-ring-2 {
  width: 150px;
  height: 150px;
  border-color: rgba(255, 179, 71, 0.2);
  border-right-color: #ffb347;
  animation: spin-ring 4s linear infinite reverse;
}

.orbit-ring-3 {
  width: 120px;
  height: 120px;
  border-color: rgba(255, 215, 0, 0.15);
  border-bottom-color: #ffd700;
  animation: spin-ring 5s linear infinite;
}

/* Logo 中心 */
.logo-center {
  position: relative;
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-circle {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: linear-gradient(135deg, #ffd700 0%, #ffb347 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 30px rgba(255, 215, 0, 0.6), 0 0 60px rgba(255, 215, 0, 0.4),
    inset 0 0 20px rgba(255, 255, 255, 0.2);
  animation: logo-pulse 2s ease-in-out infinite;
}

.logo-inner {
  width: 85%;
  height: 85%;
  border-radius: 50%;
  background: linear-gradient(135deg, #1a1a2e 0%, #24243e 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.main-emoji {
  font-size: 50px;
  animation: emoji-bounce 1.5s ease-in-out infinite;
  filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.5));
}

/* 軌道圖標 */
.orbit-icon {
  position: absolute;
  font-size: 28px;
  filter: drop-shadow(0 0 8px rgba(255, 215, 0, 0.6));
}

.orbit-icon-1 {
  animation: orbit-rotate 4s linear infinite;
}

.orbit-icon-2 {
  animation: orbit-rotate 4s linear infinite;
  animation-delay: 1.33s;
}

.orbit-icon-3 {
  animation: orbit-rotate 4s linear infinite;
  animation-delay: 2.66s;
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

@keyframes float-rotate {
  0% {
    transform: translateY(0) rotate(0deg);
    opacity: 0.1;
  }
  50% {
    opacity: 0.3;
  }
  100% {
    transform: translateY(-20px) rotate(360deg);
    opacity: 0.1;
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
  width: 140px;
  height: 140px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-circle {
  width: 110px;
  height: 110px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ffd700 0%, #ffb347 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 30px rgba(255, 215, 0, 0.5), 0 0 60px rgba(255, 215, 0, 0.3);
  animation: pulse 2s ease-in-out infinite;
  position: relative;
  z-index: 2;
}

.logo-inner {
  width: 95px;
  height: 95px;
  border-radius: 50%;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.game-emoji-container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.main-emoji {
  font-size: 48px;
  animation: bounce 1s ease-in-out infinite;
  z-index: 3;
}

.side-emoji {
  position: absolute;
  font-size: 24px;
  animation: orbit 3s linear infinite;
}

.side-emoji-1 {
  animation-delay: 0s;
}

.side-emoji-2 {
  animation-delay: 1s;
}

.side-emoji-3 {
  animation-delay: 2s;
}

.logo-ring {
  position: absolute;
  width: 130px;
  height: 130px;
  border: 3px solid rgba(255, 215, 0, 0.3);
  border-radius: 50%;
  border-top-color: #ffd700;
  animation: spin 2s linear infinite;
}

.logo-ring-2 {
  position: absolute;
  width: 150px;
  height: 150px;
  border: 2px solid rgba(255, 215, 0, 0.2);
  border-radius: 50%;
  border-bottom-color: #ffd700;
  animation: spin 3s linear infinite reverse;
}

.logo-ring-3 {
  position: absolute;
  width: 170px;
  height: 170px;
  border: 1px solid rgba(255, 215, 0, 0.1);
  border-radius: 50%;
  border-left-color: #ffd700;
  animation: spin 4s linear infinite;
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

@keyframes bounce {
  0%,
  100% {
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

@keyframes orbit {
  0% {
    transform: rotate(0deg) translateX(35px) rotate(0deg);
  }
  100% {
    transform: rotate(360deg) translateX(35px) rotate(-360deg);
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
  0%,
  100% {
    filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.5));
  }
  50% {
    filter: drop-shadow(0 0 20px rgba(255, 215, 0, 0.8));
  }
}

@keyframes fade-in-out {
  0%,
  100% {
    opacity: 0.7;
  }
  50% {
    opacity: 1;
  }
}

/* Bootstrap 風格進度條 */
.progress-container {
  width: 350px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.progress {
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 0.375rem;
  overflow: hidden;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.3);
}

.progress-bar {
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
  color: #fff;
  text-align: center;
  white-space: nowrap;
  background: linear-gradient(90deg, #ffd700 0%, #ffb347 100%);
  transition: width 0.6s ease;
  position: relative;
  box-shadow: 0 0 15px rgba(255, 215, 0, 0.6);
}

.progress-bar-striped {
  background-image: linear-gradient(
    45deg,
    rgba(255, 255, 255, 0.15) 25%,
    transparent 25%,
    transparent 50%,
    rgba(255, 255, 255, 0.15) 50%,
    rgba(255, 255, 255, 0.15) 75%,
    transparent 75%,
    transparent
  );
  background-size: 1rem 1rem;
}

.progress-bar-animated {
  animation: progress-bar-stripes 1s linear infinite;
}

@keyframes progress-bar-stripes {
  0% {
    background-position-x: 1rem;
  }
}

.progress-glow {
  position: absolute;
  top: -2px;
  right: -10px;
  width: 20px;
  height: 16px;
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 0.9) 0%,
    transparent 70%
  );
  border-radius: 50%;
  filter: blur(3px);
  animation: glow-pulse 1.5s ease-in-out infinite;
}

@keyframes glow-pulse {
  0%,
  100% {
    opacity: 0.8;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.2);
  }
}

.progress-text {
  text-align: center;
  font-size: 16px;
  color: #ffd700;
  font-weight: bold;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
  font-family: "Courier New", monospace;
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
