<template>
  <nav class="footer-nav">
    <div
      v-for="item in navItems"
      :key="item.id"
      :class="['nav-item', { special: item.special, active: item.active }]"
      @click="handleNavClick(item)"
    >
      <div class="nav-icon">{{ item.icon }}</div>
      <div class="nav-label">{{ item.label }}</div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from "vue";

const navItems = ref([
  {
    id: "other",
    label: "其他",
    icon: "⚙️",
    special: false,
    active: false,
  },
  {
    id: "ranking",
    label: "排行榜",
    icon: "🏆",
    special: false,
    active: false,
  },
  {
    id: "shop",
    label: "商城",
    icon: "🛍️",
    special: true, // 特殊樣式
    active: false,
  },
  {
    id: "gift",
    label: "贈禮",
    icon: "🎁",
    special: false,
    active: false,
  },
  {
    id: "guild",
    label: "公會",
    icon: "👥",
    special: false,
    active: false,
  },
]);

function handleNavClick(item) {
  // 重置所有項目的 active 狀態
  navItems.value.forEach((nav) => (nav.active = false));
  // 設置當前點擊項目為 active
  item.active = true;

  // 模擬導航功能
  switch (item.id) {
    case "other":
      alert("進入其他功能頁面");
      break;
    case "ranking":
      alert("進入排行榜頁面");
      break;
    case "shop":
      alert("進入商城頁面");
      break;
    case "gift":
      alert("進入贈禮頁面");
      break;
    case "guild":
      alert("進入公會頁面");
      break;
  }
}
</script>

<style scoped>
.footer-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 70px;
  background: linear-gradient(
      0deg,
      rgba(0, 0, 0, 0.95) 0%,
      rgba(20, 20, 40, 0.9) 100%
    ),
    url("/assets/images/backgrounds/footer-bg.png");
  background-size: auto, auto;
  backdrop-filter: blur(15px);
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 0 10px;
  border-top: 2px solid rgba(255, 215, 0, 0.3);
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.5);
  z-index: 999;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 8px;
  border-radius: 8px;
  min-width: 60px;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

.nav-item.active {
  background: rgba(255, 215, 0, 0.2);
}

.nav-item.special {
  position: relative;
  transform: translateY(-10px);
  background: linear-gradient(135deg, #ffd700 0%, #ffb347 100%);
  border-radius: 50%;
  width: 60px;
  height: 60px;
  box-shadow: 0 4px 15px rgba(255, 215, 0, 0.4);
}

.nav-item.special:hover {
  transform: translateY(-12px) scale(1.05);
  box-shadow: 0 6px 20px rgba(255, 215, 0, 0.6);
}

.nav-item.special .nav-icon {
  font-size: 24px;
}

.nav-item.special .nav-label {
  color: #333;
  font-weight: bold;
  text-shadow: none;
}

.nav-icon {
  font-size: 20px;
  margin-bottom: 4px;
}

.nav-label {
  font-size: 12px;
  color: #ccc;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  font-weight: 500;
}

.nav-item.active .nav-label {
  color: #ffd700;
}

/* 為商城按鈕添加脈衝動畫 */
.nav-item.special::before {
  content: "";
  position: absolute;
  top: -5px;
  left: -5px;
  right: -5px;
  bottom: -5px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ffd700 0%, #ffb347 100%);
  opacity: 0.3;
  animation: pulse-ring 2s infinite;
  z-index: -1;
}

@keyframes pulse-ring {
  0% {
    transform: scale(1);
    opacity: 0.3;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.1;
  }
  100% {
    transform: scale(1.2);
    opacity: 0;
  }
}
</style>
