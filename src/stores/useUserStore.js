// src/stores/useUserStore.js
import { defineStore } from "pinia";
import { getUserBalance } from "../services/api.js";
import { mockUser } from "../mockData.js";

export const useUserStore = defineStore("user", {
  state: () => {
    return {
      user: mockUser,
      balance: mockUser.balance,
      loading: false,
    };
  },

  actions: {
    // 刷新用戶餘額
    async refreshBalance() {
      this.loading = true;

      try {
        // 調用 API 獲取最新餘額
        const response = await getUserBalance();

        if (response && response.balance !== undefined) {
          const oldBalance = this.balance;
          this.balance = response.balance;
          this.user.balance = response.balance;

          // 如果餘額有變化，顯示提示
          if (oldBalance !== this.balance) {
            console.log(
              `💰 餘額更新: ${oldBalance.toFixed(2)} → ${this.balance.toFixed(2)}`
            );
          }
        }
      } catch (error) {
        console.error("❌ 刷新餘額失敗:", error);
      } finally {
        this.loading = false;
      }
    },

    // 更新用戶資訊
    updateUser(userData) {
      this.user = { ...this.user, ...userData };
    },

    // 模擬餘額變化（用於測試）
    simulateBalanceChange() {
      // 隨機增加或減少餘額
      const change = (Math.random() - 0.5) * 100;
      this.balance = Math.max(0, this.balance + change);
      this.user.balance = this.balance;
      console.log(`💰 模擬餘額變化: ${change > 0 ? "+" : ""}${change.toFixed(2)}`);
    },
  },

  getters: {
    // 格式化餘額顯示
    formattedBalance: (state) => {
      return state.balance.toFixed(2);
    },

    // 獲取用戶名稱
    userName: (state) => {
      return state.user.nickname || "訪客";
    },

    // 獲取 VIP 等級
    vipLevel: (state) => {
      return state.user.vipLevel || 0;
    },
  },
});

