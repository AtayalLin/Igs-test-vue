<template>
  <nav class="footer-nav">
    <div
      v-for="item in navItems"
      :key="item.id"
      :class="['nav-item', { active: item.active }]"
      :special="item.special"
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
    id: "gifts",
    label: "贈禮",
    icon: "🎁",
    active: true,
  },
  {
    id: "wallet",
    label: "錢包",
    icon: "💰",
    active: false,
  },
  {
    id: "shop",
    label: "商城",
    icon: "👛",
    active: false,
    special: true,
  },
  {
    id: "vip",
    label: "會員",
    icon: "👑",
    active: false,
  },
  {
    id: "more",
    label: "更多",
    icon: "⋯",
    active: false,
  },
]);

function handleNavClick(item) {
  navItems.value.forEach((nav) => (nav.active = false));
  item.active = true;
}
</script>

<style scoped>
.footer-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 64px;
  background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)),
    url("/assets/images/backgrounds/footer-bg.webp");
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  padding: 0 12px 4px;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.3), 0 -1px 20px rgba(255, 215, 0, 0.1);
  z-index: 999;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  border-top: 1px solid rgba(255, 215, 0, 0.1);
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  padding: 8px 4px;
  flex: 1;
  height: 56px;
}

.nav-item:not([special]) {
  overflow: hidden;
  position: relative;
}

.nav-item:not([special])::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(
    circle at center,
    rgba(255, 215, 0, 0.2),
    transparent 70%
  );
  opacity: 0;
  transform: scale(0.5);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: none;
}

.nav-item:not([special]):hover::before {
  opacity: 1;
  transform: scale(1.2);
}

.nav-item:not([special]):active::before {
  background: radial-gradient(
    circle at center,
    rgba(255, 215, 0, 0.4),
    transparent 70%
  );
  transform: scale(0.9);
}

.nav-item.active {
  color: #ffd700;
}

.nav-icon {
  font-size: 24px;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 2px;
  transition: all 0.3s ease;
  transform-origin: center;
}

.nav-label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
  transition: all 0.3s ease;
}

.nav-item:not([special]):hover .nav-icon {
  transform: scale(1.1);
  color: rgba(255, 255, 255, 1);
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
}

.nav-item.active .nav-icon,
.nav-item.active .nav-label {
  color: #ffd700;
  font-weight: 600;
  text-shadow: 0 0 15px rgba(255, 215, 0, 0.5);
}

/* 特殊按鈕樣式 */
.nav-item[special] {
  margin-top: -20px;
  height: 76px;
  background: linear-gradient(135deg, #ffd700, #ffa500);
  border-radius: 50% 50% 12px 12px;
  box-shadow: 0 -4px 12px rgba(255, 215, 0, 0.3);
  padding-top: 12px;
}

.nav-item[special] .nav-icon {
  font-size: 32px;
  color: #ffffff;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.nav-item[special] .nav-label {
  color: #ffffff;
  font-weight: 600;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.nav-item[special]:hover {
  transform: translateY(-2px);
  box-shadow: 0 -6px 16px rgba(255, 215, 0, 0.4);
}

@media (max-width: 360px) {
  .nav-icon {
    font-size: 20px;
  }

  .nav-label {
    font-size: 10px;
  }
}
</style>
