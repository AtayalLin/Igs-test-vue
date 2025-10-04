<script setup>
import { ref, onMounted } from "vue";
import { useGameStore } from "./stores/useGameStore.js";
import { useDataRefresh } from "./composables/useDataRefresh.js";
import { usePullToRefresh } from "./composables/usePullToRefresh.js";
import LoadingScreen from "./components/LoadingScreen.vue";
import PullToRefreshIndicator from "./components/PullToRefreshIndicator.vue";
import Header from "./components/Header.vue";
import NoticeMarquee from "./components/NoticeMarquee.vue";
import CategoryTabs from "./components/CategoryTabs.vue";
import BannerCarousel from "./components/BannerCarousel.vue";
import GameGrid from "./components/GameGrid.vue";
import FloatingChatButton from "./components/FloatingChatButton.vue";
import FooterNav from "./components/FooterNav.vue";

const gameStore = useGameStore();
const isLoading = ref(true);
const mainContentRef = ref(null);

// 啟用數據刷新功能（定時輪詢）
useDataRefresh();

// 下拉刷新功能 - 重新整理整個頁面
const handleRefresh = async () => {
  console.log("🔄 重新整理遊戲大廳頁面...");
  // 重新載入頁面
  window.location.reload();
};

// 下拉刷新功能
const {
  isPulling,
  pullDistance,
  isRefreshing: isPullRefreshing,
  threshold,
} = usePullToRefresh(mainContentRef, handleRefresh);

// 處理載入完成
function handleLoaded() {
  isLoading.value = false;
}

// 初始化應用數據
onMounted(async () => {
  await gameStore.initializeData();
});
</script>

<template>
  <div id="app">
    <LoadingScreen :isLoading="isLoading" @loaded="handleLoaded" />
    <template v-if="!isLoading">
      <!-- 固定頂部 Header -->
      <Header class="app-header" />

      <!-- 固定跑馬燈 -->
      <NoticeMarquee class="app-notice" />

      <!-- 主內容區 - 可滾動 -->
      <main ref="mainContentRef" class="main-content">
        <!-- 下拉刷新指示器 -->
        <PullToRefreshIndicator
          :isPulling="isPulling"
          :pullDistance="pullDistance"
          :isRefreshing="isPullRefreshing"
          :threshold="threshold"
        />

        <CategoryTabs />
        <BannerCarousel />
        <GameGrid />
      </main>

      <!-- 浮動聊天按鈕 -->
      <FloatingChatButton />

      <!-- 固定底部導航 -->
      <FooterNav class="app-footer" />
    </template>
  </div>
</template>

<style>
/* 全局樣式重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  background: #000;
  overflow: hidden; /* 防止 body 滾動 */
}

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
    url("/assets/images/backgrounds/main-bg.webp");
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  background-repeat: no-repeat;
  color: white;
}

/* 添加整體光暈效果 - 增強遊戲氛圍 */
#app::before {
  content: "";
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(
      circle at 20% 20%,
      rgba(255, 215, 0, 0.08) 0%,
      transparent 50%
    ),
    radial-gradient(
      circle at 80% 80%,
      rgba(102, 126, 234, 0.08) 0%,
      transparent 50%
    );
  pointer-events: none;
  z-index: 0;
}

/* 固定頂部 Header */
.app-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  height: 60px;
}

/* 固定跑馬燈 */
.app-notice {
  position: fixed;
  top: 60px;
  left: 0;
  right: 0;
  z-index: 999;
  height: 45px;
}

/* 主內容區 - 可滾動 */
.main-content {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  margin-top: 105px; /* Header (60px) + NoticeMarquee (45px) */
  margin-bottom: 70px; /* Footer height */
  padding: 0 0 20px 0;
  position: relative;
  z-index: 1;
}

/* 固定底部導航 */
.app-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  height: 70px;
}

/* 響應式調整 */
@media (max-width: 768px) {
  .main-content {
    margin-top: 100px;
  }

  .app-header {
    height: 55px;
  }

  .app-notice {
    top: 55px;
    height: 40px;
  }
}

@media (max-width: 480px) {
  .main-content {
    margin-top: 95px;
  }

  .app-header {
    height: 50px;
  }

  .app-notice {
    top: 50px;
    height: 38px;
  }

  .app-footer {
    height: 65px;
  }
}

/* 全局滾動條美化 - 深色主題 */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.5);
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #ffd700 0%, #ffb347 100%);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, #ffb347 0%, #ffd700 100%);
}
</style>
