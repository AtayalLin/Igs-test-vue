// 數據刷新 Composable
import { ref, onMounted, onUnmounted } from "vue";
import { useGameStore } from "../stores/useGameStore.js";
import { useUserStore } from "../stores/useUserStore.js";

export function useDataRefresh() {
  const gameStore = useGameStore();
  const userStore = useUserStore();
  const isRefreshing = ref(false);
  const lastRefreshTime = ref(Date.now());
  let refreshInterval = null;
  let balanceInterval = null;

  // 手動刷新數據（包括公告、遊戲列表等）
  async function refreshData() {
    if (isRefreshing.value) return;

    isRefreshing.value = true;

    try {
      console.log("🔄 刷新數據：公告、遊戲列表...");

      // 模擬 API 請求延遲
      await new Promise((resolve) => setTimeout(resolve, 800));

      // 刷新遊戲數據
      await gameStore.fetchGamesByCategory(gameStore.selectedCategory);

      // 刷新用戶餘額
      await userStore.refreshBalance();

      // 更新最後刷新時間
      lastRefreshTime.value = Date.now();

      console.log("✅ 數據刷新成功");
    } catch (error) {
      console.error("❌ 數據刷新失敗:", error);
    } finally {
      isRefreshing.value = false;
    }
  }

  // 僅刷新用戶餘額（輕量級）
  async function refreshBalance() {
    try {
      await userStore.refreshBalance();
      console.log("💰 餘額已更新");
    } catch (error) {
      console.error("❌ 餘額更新失敗:", error);
    }
  }

  // 啟動定時輪詢（刷新遊戲數據）
  function startPolling(interval = 30000) {
    // 清除現有的定時器
    stopPolling();

    // 設置新的定時器
    refreshInterval = setInterval(async () => {
      console.log("🔄 定時輪詢刷新數據...");
      await refreshData();
    }, interval);

    console.log(`✅ 定時輪詢已啟動 (間隔: ${interval}ms)`);
  }

  // 啟動餘額輪詢（更頻繁，每10秒）
  function startBalancePolling(interval = 10000) {
    // 清除現有的定時器
    stopBalancePolling();

    // 設置新的定時器
    balanceInterval = setInterval(async () => {
      console.log("💰 定時更新餘額...");
      await refreshBalance();
    }, interval);

    console.log(`✅ 餘額輪詢已啟動 (間隔: ${interval}ms)`);
  }

  // 停止定時輪詢
  function stopPolling() {
    if (refreshInterval) {
      clearInterval(refreshInterval);
      refreshInterval = null;
      console.log("⏹️ 定時輪詢已停止");
    }
  }

  // 停止餘額輪詢
  function stopBalancePolling() {
    if (balanceInterval) {
      clearInterval(balanceInterval);
      balanceInterval = null;
      console.log("⏹️ 餘額輪詢已停止");
    }
  }

  // 生命週期管理
  onMounted(() => {
    // 啟動定時輪詢 (30秒)
    startPolling(30000);
    // 啟動餘額輪詢 (10秒)
    startBalancePolling(10000);
  });

  onUnmounted(() => {
    // 清理定時器
    stopPolling();
    stopBalancePolling();
  });

  return {
    isRefreshing,
    lastRefreshTime,
    refreshData,
    refreshBalance,
    startPolling,
    stopPolling,
    startBalancePolling,
    stopBalancePolling,
  };
}
