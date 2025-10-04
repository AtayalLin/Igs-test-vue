// src/stores/useGameStore.js
import { defineStore } from "pinia";
import { mockCategories, mockBanners, mockGames } from "../mockData.js";

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
      // 預設載入電動分類的遊戲
      this.games = mockGames[this.selectedCategory] || [];
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

      // 從 mockData 獲取對應分類的遊戲
      this.games = mockGames[categoryId] || [];

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

      // 重新生成最愛分類
      mockGames.favorite = mockGames.all.filter((game) => game.isFavorite);
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
