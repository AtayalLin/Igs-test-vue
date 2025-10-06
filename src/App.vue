<script setup>
import { onMounted, ref } from "vue";
import { useGameStore } from "./stores/useGameStore.js";
import { getImageUrl, IMAGE_PATHS } from "./utils/assets.js";
import { usePullToRefresh } from "./composables/usePullToRefresh.js";
import Header from "./components/Header.vue";
import NoticeMarquee from "./components/NoticeMarquee.vue";
import CategoryTabs from "./components/CategoryTabs.vue";
import BannerCarousel from "./components/BannerCarousel.vue";
import GameGrid from "./components/GameGrid.vue";
import FloatingChatButton from "./components/FloatingChatButton.vue";
import FooterNav from "./components/FooterNav.vue";
import PullToRefreshIndicator from "./components/PullToRefreshIndicator.vue";

const gameStore = useGameStore();
const mainContentRef = ref(null);

// 處理下拉重新整理
const { isPulling, pullDistance, isRefreshing } = usePullToRefresh(
  mainContentRef,
  async () => {
    try {
      await gameStore.initializeData();
    } catch (error) {
      console.error("重新整理失敗:", error);
    }
  }
);

// 處理重新整理完成
const onRefreshComplete = () => {
  console.log("重新整理完成");
};

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
    <!-- 固定頂部 Header -->
    <Header class="app-header" />

    <!-- 固定跑馬燈 -->
    <NoticeMarquee class="app-notice" />

    <!-- 主內容區 - 可滾動 -->
    <main class="main-content" ref="mainContentRef">
      <PullToRefreshIndicator
        :is-pulling="isPulling"
        :pull-distance="pullDistance"
        :is-refreshing="isRefreshing"
        @refresh-complete="onRefreshComplete"
      />
      <CategoryTabs />
      <BannerCarousel />
      <GameGrid />
    </main>

    <!-- 浮動聊天按鈕 -->
    <FloatingChatButton />

    <!-- 固定底部導航 -->
    <FooterNav class="app-footer" />
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
    var(--bg-image);
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
  -webkit-overflow-scrolling: touch;
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
