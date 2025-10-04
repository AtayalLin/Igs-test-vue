<template>
  <header class="header">
    <div class="user-info" @click="goToProfile">
      <img :src="user.avatarUrl" alt="avatar" class="avatar" />
      <div class="user-details">
        <div class="username">{{ user.nickname }}</div>
        <div class="vip-container">
          <img
            src="/assets/images/ui/icons/vip-crown.webp"
            alt="VIP"
            class="vip-crown"
            @error="handleVipIconError"
          />
          <div class="vip-badge">VIP{{ user.vipLevel }}</div>
        </div>
      </div>
    </div>
    <div class="balance-section">
      <img
        src="/assets/images/ui/icons/gold-coin.webp"
        alt="金幣"
        class="coin-icon"
        @error="handleCoinIconError"
      />
      <span class="balance">{{ formattedBalance }}</span>
      <button
        class="refresh-btn"
        @click.stop="refreshBalance"
        :disabled="loading"
      >
        🔄
      </button>
    </div>
  </header>
</template>

<script setup>
import { computed } from "vue";
import { storeToRefs } from "pinia";
import { useUserStore } from "../stores/useUserStore.js";

const userStore = useUserStore();
const { user, balance, loading } = storeToRefs(userStore);

// 格式化餘額顯示
const formattedBalance = computed(() => {
  return balance.value.toFixed(2);
});

function goToProfile() {
  alert("前往個人資料頁 (尚未實作)");
}

async function refreshBalance() {
  await userStore.refreshBalance();
}

function handleVipIconError(event) {
  // 如果 VIP 圖標載入失敗，隱藏圖標
  event.target.style.display = "none";
}

function handleCoinIconError(event) {
  // 如果金幣圖標載入失敗，隱藏圖標
  event.target.style.display = "none";
}
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background: linear-gradient(
      135deg,
      rgba(0, 0, 0, 0.9) 0%,
      rgba(20, 20, 40, 0.95) 100%
    ),
    url("/assets/images/backgrounds/header-bg.webp");
  background-size: auto, auto;
  backdrop-filter: blur(10px);
  border-bottom: 2px solid rgba(255, 215, 0, 0.3);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  color: #fff;
}
.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
}
.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid gold;
  margin-right: 10px;
}
.user-details {
  display: flex;
  flex-direction: column;
}
.username {
  font-weight: bold;
  font-size: 1rem;
}
.vip-container {
  position: relative;
  display: inline-block;
  margin-top: 2px;
}

.vip-crown {
  position: absolute;
  top: -8px;
  left: -6px;
  width: 20px;
  height: 20px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.4));
  z-index: 2;
}

.vip-badge {
  background: linear-gradient(45deg, gold, orange);
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  color: black;
  font-weight: bold;
  position: relative;
  z-index: 1;
}
.balance-section {
  display: flex;
  align-items: center;
  gap: 6px;
}

.coin-icon {
  width: 20px;
  height: 20px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}
.balance {
  margin-right: 8px;
  font-weight: bold;
  font-size: 1rem;
}
.refresh-btn {
  background: none;
  border: none;
  color: #fff;
  font-size: 1.2rem;
  cursor: pointer;
}
.refresh-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
