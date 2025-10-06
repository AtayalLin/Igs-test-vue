<template>
  <nav class="footer-nav">
    <div
      v-for="item in navItems"
      :key="item.id"
      :class="['nav-item', { active: item.active }]"
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
    id: "home",
    label: "首頁",
    icon: "🏠",
    active: true,
  },
  {
    id: "slots",
    label: "電動",
    icon: "🎰",
    active: false,
  },
  {
    id: "live",
    label: "真人",
    icon: "🎲",
    active: false,
  },
  {
    id: "sports",
    label: "體育",
    icon: "⚽",
    active: false,
  },
  {
    id: "fishing",
    label: "捕魚",
    icon: "🎣",
    active: false,
  },
  {
    id: "lottery",
    label: "彩票",
    icon: "🎟️",
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
  height: 56px;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 0 12px;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  z-index: 999;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  padding: 4px;
  flex: 1;
}

.nav-item:hover {
  opacity: 0.8;
}

.nav-item.active {
  color: #007aff;
}

.nav-icon {
  font-size: 24px;
  color: #666;
  margin-bottom: 2px;
}

.nav-label {
  font-size: 12px;
  color: #666;
  font-weight: 500;
}

.nav-item.active .nav-icon,
.nav-item.active .nav-label {
  color: #007aff;
  font-weight: 600;
}

.nav-item.active::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 24px;
  height: 2px;
  background-color: #007aff;
  border-radius: 1px;
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
