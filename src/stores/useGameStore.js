// src/stores/useGameStore.js
import { defineStore } from "pinia";
import { mockCategories, mockBanners, mockGames } from "../mockData.js";
import { getImageUrl } from "../utils/assets.js";

// 處理遊戲圖片路徑
function processGameImages(games) {
  return games.map((game) => ({
    ...game,
    imageUrl: getImageUrl(game.imageUrl),
  }));
}

// 本地收藏鍵名
const FAVORITES_STORAGE_KEY = "game_hall_favorites";

// 從 localStorage 載入收藏集合（id -> true）
function loadFavoritesMap() {
  try {
    const raw = localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

// 儲存收藏集合
function saveFavoritesMap(favMap) {
  try {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favMap));
  } catch {}
}

// 依據收藏集合同步 mockGames 內的 isFavorite 並重建 favorite 分類
function syncMockGamesFavorites() {
  const favMap = loadFavoritesMap();
  Object.keys(mockGames).forEach((category) => {
    const list = mockGames[category];
    if (Array.isArray(list)) {
      list.forEach((g) => {
        if (typeof favMap[g.id] === "boolean") {
          g.isFavorite = favMap[g.id];
        }
      });
    }
  });
  // 重建最愛分類
  mockGames.favorite = (mockGames.all || []).filter((g) => g.isFavorite);
}

export const useGameStore = defineStore("game", {
  state: () => {
    console.log(`🎮 GameStore: Initialized with ${mockBanners.length} banners`);
    return {
      categories: mockCategories,
      selectedCategory: "slot", // 預設選中「電動」
      games: [], // 遊戲列表
      loading: false, // 載入狀態
      banners: mockBanners,
    };
  },

  actions: {
    // 初始化數據
    async initializeData() {
      this.loading = true;
      // 模擬初始化延遲
      await new Promise((resolve) => setTimeout(resolve, 300));
      // 先同步收藏狀態
      syncMockGamesFavorites();
      // 預設載入電動分類的遊戲，並處理圖片路徑
      const rawGames = mockGames[this.selectedCategory] || [];
      this.games = processGameImages(rawGames);
      this.loading = false;
    },

    // 根據分類獲取遊戲
    async fetchGamesByCategory(categoryId) {
      // 如果是最愛分類或者不同分類，才需要重新載入
      const shouldReload =
        categoryId === "favorite" || categoryId !== this.selectedCategory;

      if (!shouldReload) return; // 避免不必要的重複請求

      this.loading = true;
      this.selectedCategory = categoryId;

      // 模擬 API 延遲 500ms
      await new Promise((resolve) => setTimeout(resolve, 500));

      // 類別切換時同步收藏狀態（以防其他處更新）
      syncMockGamesFavorites();

      // 從 mockData 獲取對應分類的遊戲，並處理圖片路徑
      const rawGames = mockGames[categoryId] || [];
      this.games = processGameImages(rawGames);

      this.loading = false;
    },

    // 搜尋遊戲功能
    async searchGames(keyword) {
      if (!keyword.trim()) {
        // 如果搜尋關鍵字為空，回到當前分類
        await this.fetchGamesByCategory(this.selectedCategory);
        return;
      }

      this.loading = true;

      // 模擬搜尋延遲
      await new Promise((resolve) => setTimeout(resolve, 300));

      // 在所有遊戲中搜尋
      const allGames = mockGames.all || [];
      this.games = allGames.filter(
        (game) =>
          game.name.toLowerCase().includes(keyword.toLowerCase()) ||
          (game.description &&
            game.description.toLowerCase().includes(keyword.toLowerCase())) ||
          game.tags.some((tag) =>
            tag.toLowerCase().includes(keyword.toLowerCase())
          )
      );

      this.loading = false;
    },

    // 更新遊戲收藏狀態
    updateGameFavoriteStatus(gameId, isFavorite) {
      // 更新所有分類中的遊戲狀態
      Object.keys(mockGames).forEach((category) => {
        const games = mockGames[category];
        if (Array.isArray(games)) {
          const game = games.find((g) => g.id === gameId);
          if (game) {
            game.isFavorite = isFavorite;
          }
        }
      });

      // 持久化收藏狀態
      const favMap = loadFavoritesMap();
      favMap[gameId] = !!isFavorite;
      saveFavoritesMap(favMap);

      // 重新生成最愛分類
      mockGames.favorite = (mockGames.all || []).filter((game) => game.isFavorite);
    },
  },

  getters: {
    // 獲取當前分類名稱
    currentCategoryName: (state) => {
      const category = state.categories.find(
        (cat) => cat.id === state.selectedCategory
      );
      return category ? category.name : "全部";
    },

    // 獲取遊戲總數
    gamesCount: (state) => state.games.length,

    // 獲取熱門遊戲
    hotGames: (state) =>
      state.games.filter((game) => game.tags.includes("HOT")),

    // 獲取新遊戲
    newGames: (state) =>
      state.games.filter((game) => game.tags.includes("NEW")),
  },
});
