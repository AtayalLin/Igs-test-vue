<script setup>
import { onMounted } from "vue";
import { useGameStore } from "./stores/useGameStore.js";
import { getImageUrl, IMAGE_PATHS } from "./utils/assets.js";
import Header from "./components/Header.vue";
import NoticeMarquee from "./components/NoticeMarquee.vue";
import CategoryTabs from "./components/CategoryTabs.vue";
import BannerCarousel from "./components/BannerCarousel.vue";
import GameGrid from "./components/GameGrid.vue";
import FloatingChatButton from "./components/FloatingChatButton.vue";
import FooterNav from "./components/FooterNav.vue";

const gameStore = useGameStore();

// 初始化應用數據
onMounted(() => {
  gameStore.initializeData();

  // 設置背景圖片（使用 CSS 變數）
  const bgImageUrl = getImageUrl(IMAGE_PATHS.backgrounds.main);
  document.documentElement.style.setProperty(
    "--bg-image",
    `url("${bgImageUrl}")`
  );
});
</script>

<template>
  <div id="app">
    <Header />
    <main class="main-content">
      <NoticeMarquee />
      <CategoryTabs />
      <BannerCarousel />
      <GameGrid />
    </main>
    <FloatingChatButton />
    <FooterNav />
  </div>
</template>

<style>
#app {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;

  /* 遊戲大廳風格背景 - 深色調營造遊戲氛圍 */
  background: linear-gradient(
      180deg,
      rgba(0, 0, 0, 0.7) 0%,
      rgba(0, 0, 0, 0.5) 100%
    ),
    var(--bg-image);
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  background-repeat: no-repeat;
  color: white;
}

/* 添加整體光暈效果 */
#app::before {
  content: "";
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(
      circle at 20% 20%,
      rgba(255, 215, 0, 0.1) 0%,
      transparent 50%
    ),
    radial-gradient(
      circle at 80% 80%,
      rgba(102, 126, 234, 0.1) 0%,
      transparent 50%
    );
  pointer-events: none;
  z-index: -1;
}

.main-content {
  padding-bottom: 80px; /* 為底部導航留出空間 */
  position: relative;
  z-index: 1;
}

/* 全局樣式重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  background: #000;
  overflow-x: hidden;
}

/* 全局滾動條美化 */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.3);
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #ffd700 0%, #ffb347 100%);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, #ffb347 0%, #ffd700 100%);
}
</style>
