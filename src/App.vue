<script setup>
import { onMounted, ref } from "vue";
import { useGameStore } from "./stores/useGameStore.js";
import { getImageUrl, IMAGE_PATHS } from "./utils/assets.js";
import { usePullToRefresh } from "./composables/usePullToRefresh.js";
import { useDataRefresh } from "./composables/useDataRefresh.js";
import Header from "./components/Header.vue";
import NoticeMarquee from "./components/NoticeMarquee.vue";
import CategoryTabs from "./components/CategoryTabs.vue";
import BannerCarousel from "./components/BannerCarousel.vue";
import GameGrid from "./components/GameGrid.vue";
import FloatingChatButton from "./components/FloatingChatButton.vue";
/* 移除舊 FooterNav，改用新 BottomBar */
import PullToRefreshIndicator from "./components/PullToRefreshIndicator.vue";
import LoadingScreen from "./components/LoadingScreen.vue";
import BottomBar from "./components/BottomBar.vue";
import GameLauncher from "./components/GameLauncher.vue";
import WalletPage from "./components/WalletPage.vue";
import ShopPage from "./components/ShopPage.vue";
import VipPage from "./components/VipPage.vue";
import MorePage from "./components/MorePage.vue";
import SettingsPage from "./components/SettingsPage.vue";
import ProfilePage from "./components/ProfilePage.vue";
import RankingPage from "./components/RankingPage.vue";
import GiftsPage from "./components/GiftsPage.vue";
import GuildPage from "./components/GuildPage.vue";
import AOS from "aos";

const gameStore = useGameStore();
const mainContentRef = ref(null);
const showGlobalLoading = ref(true);
// 啟動數據與餘額輪詢
const { startPolling, startBalancePolling } = useDataRefresh();

// 簡易分頁（底部導航）狀態：other、ranking、shop、gifts、guild；兼容 wallet/vip/more
const currentTab = ref("gifts");

// 進入大廳後以 AOS 演示滑入：依序顯示 Header、主內容、Footer
const showHeaderBar = ref(false);
const showMainBlocks = ref(false);
const showFooterBar = ref(false);
const isAnyLauncherVisible = ref(false);
const launcherGame = ref(null);

function onLaunchGame(game) {
  launcherGame.value = game;
  isAnyLauncherVisible.value = true;
}

function onLauncherClose() {
  isAnyLauncherVisible.value = false;
  launcherGame.value = null;
}

function handleNavigate(route) {
  // /other /ranking /shop /gifts /guild 以及舊鍵 /wallet /vip /more
  const key = (route || "").replace(/^\//, "") || "gifts";
  currentTab.value = key;
}

// 使用 usePullToRefresh composable，綁定主內容容器與刷新函式
const { isPulling, pullDistance, isRefreshing, threshold } = usePullToRefresh(
  mainContentRef,
  async () => {
    try {
      showGlobalLoading.value = true;
      await gameStore.initializeData();
    } catch (error) {
      console.error("重新整理失敗:", error);
    } finally {
      // 保持 loading 一小段時間以利過渡（2秒）
      setTimeout(() => {
        showGlobalLoading.value = false;
        if (typeof AOS !== "undefined") AOS.refresh();
      }, 2000);
    }
  }
);

// 監聽 PullToRefreshIndicator 發出的刷新完成事件
const onRefreshComplete = () => {
  console.log("重新整理完成");
  // 你可以在這裡執行額外的操作，例如提示訊息、動畫等
};

// 初始化應用數據
onMounted(async () => {
  showGlobalLoading.value = true;

  // 設定背景圖片 CSS 變數
  const bgImageUrl = getImageUrl(IMAGE_PATHS.backgrounds.main);
  document.documentElement.style.setProperty(
    "--bg-image",
    `url("${bgImageUrl}")`
  );

  // 初始化資料並確保至少等待 2000ms
  const start = Date.now();
  await gameStore.initializeData();
  const elapsed = Date.now() - start;
  const remaining = Math.max(0, 2000 - elapsed);
  setTimeout(() => {
    showGlobalLoading.value = false;
    if (typeof AOS !== "undefined") AOS.refresh();
    // 初始化後啟動輪詢（避免與初始載入重疊）
    startPolling(30000);
    startBalancePolling(10000);

    // 模擬遊戲載入完成後的分段進場：Header -> Main -> Footer
    // 使用少量延遲以觸發 AOS 的依序滑入
    setTimeout(() => {
      showHeaderBar.value = true;
      if (typeof AOS !== "undefined") AOS.refresh();
    }, 120);
    setTimeout(() => {
      showMainBlocks.value = true;
      if (typeof AOS !== "undefined") AOS.refresh();
    }, 300);
    setTimeout(() => {
      showFooterBar.value = true;
      if (typeof AOS !== "undefined") AOS.refresh();
    }, 520);
  }, remaining);
});
</script>

<template>
  <div id="app">
    <!-- 全局 LoadingScreen -->
    <LoadingScreen
      :isLoading="showGlobalLoading"
      title="遊戲大廳載入中..."
      subtitle="正在準備遊戲內容"
    />

    <template v-if="!showGlobalLoading">
      <!-- 固定頂部 Header -->
      <Header
        v-if="showHeaderBar && !isAnyLauncherVisible"
        class="app-header"
        data-aos="fade-down"
        data-aos-duration="600"
        @open-profile="currentTab = 'profile'"
      />

      <!-- 固定跑馬燈 -->
      <NoticeMarquee class="app-notice" :class="{ hiddenByLauncher: isAnyLauncherVisible }" />

      <!-- 主內容區 - 可滾動 -->
      <main
        class="main-content"
        ref="mainContentRef"
        :class="{ hiddenByLauncher: isAnyLauncherVisible }"
      >
        <PullToRefreshIndicator
          :is-pulling="isPulling"
          :pull-distance="pullDistance"
          :is-refreshing="isRefreshing"
          :threshold="threshold"
          @refresh-complete="onRefreshComplete"
        />

        <transition name="fade" mode="out-in">
          <section
            :key="currentTab"
            v-if="showMainBlocks"
            data-aos="fade-up"
            data-aos-duration="700"
          >
            <template v-if="currentTab === 'gifts'">
              <CategoryTabs
                :class="{ hiddenByLauncher: isAnyLauncherVisible }"
              />
              <BannerCarousel :class="{ hiddenByLauncher: isAnyLauncherVisible }" />
              <GameGrid
                @launcher-visibility="isAnyLauncherVisible = $event"
                @launch-game="onLaunchGame"
              />
            </template>
            <template v-else-if="currentTab === 'gifts-page'">
              <GiftsPage @back-to-lobby="currentTab = 'gifts'" />
            </template>
            <template v-else-if="currentTab === 'profile'">
              <ProfilePage
                @back-to-lobby="currentTab = 'gifts'"
                @goto-wallet="currentTab = 'wallet'"
                @goto-vip="currentTab = 'vip'"
              />
            </template>

            <template v-else-if="currentTab === 'settings'">
              <SettingsPage @back-to-lobby="currentTab = 'gifts'" />
            </template>

            <template
              v-else-if="currentTab === 'wallet' || currentTab === 'other'"
            >
              <WalletPage @back-to-lobby="currentTab = 'gifts'" />
            </template>

            <template v-else-if="currentTab === 'shop'">
              <ShopPage @back-to-lobby="currentTab = 'gifts'" />
            </template>

            <template v-else-if="currentTab === 'vip'">
              <VipPage @back-to-lobby="currentTab = 'gifts'" />
            </template>

            <template v-else-if="currentTab === 'ranking'">
              <RankingPage @back-to-lobby="currentTab = 'gifts'" />
            </template>

            <template v-else-if="currentTab === 'guild'">
              <GuildPage @back-to-lobby="currentTab = 'gifts'" />
            </template>

            <template v-else>
              <MorePage @back-to-lobby="currentTab = 'gifts'" />
            </template>
          </section>
        </transition>
      </main>

      <!-- 浮動聊天按鈕 -->
      <FloatingChatButton v-if="!isAnyLauncherVisible" />

      <!-- 全螢幕遊戲啟動器（由 App 控制） -->
      <GameLauncher
        :game="launcherGame"
        :isVisible="isAnyLauncherVisible"
        @close="onLauncherClose"
      />

      <!-- 固定底部導航 -->
      <BottomBar
        v-if="showFooterBar && !isAnyLauncherVisible"
        class="app-footer"
        @navigate="handleNavigate"
      />
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
  /* 預留底部導覽高度 + 安全區，避免內容把 footer 壓出可視範圍 */
  margin-bottom: calc(96px + env(safe-area-inset-bottom, 0px));
  padding: 0 0 20px 0;
  position: relative;
  z-index: 1;
}
.hiddenByLauncher {
  visibility: hidden;
}

/* 固定底部導航 */
.app-footer {
  z-index: 1000; /* 將定位與尺寸交由 FooterNav.vue 控制，避免衝突 */
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

/* 分頁段落樣式（占位內容） */
.section-placeholder {
  padding: 16px;
}
.section-title {
  font-size: 20px;
  font-weight: 800;
  color: #ffd700;
  margin-bottom: 8px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.35);
}
.section-desc {
  color: rgba(255, 255, 255, 0.85);
  margin-bottom: 16px;
}
.placeholder-card-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}
.placeholder-card {
  background: linear-gradient(
    135deg,
    rgba(30, 30, 50, 0.95),
    rgba(12, 12, 24, 0.95)
  );
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: 14px;
  padding: 16px;
  min-height: 88px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.9);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.45),
    inset 0 1px 0 rgba(255, 255, 255, 0.02);
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
