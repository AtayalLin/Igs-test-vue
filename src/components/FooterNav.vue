<template>
  <nav class="footer-nav" role="navigation" aria-label="主頁導航">
    <!-- Debug message to check if navItems is empty or not -->
    <div v-if="navItems.length === 0">Loading...</div>

    <button
      v-for="item in navItems"
      :key="item.id"
      type="button"
      :class="['nav-item', { active: item.active }, { special: item.special }]"
      @click="handleNavClick(item)"
      @keydown.enter="handleNavClick(item)"
      @keydown.space.prevent="handleNavClick(item)"
      :aria-label="item.label"
      :aria-current="item.active ? 'page' : undefined"
    >
      <div class="nav-icon" :class="{ pulse: item.special }">
        {{ item.icon }}
      </div>
      <div class="nav-label">{{ item.label }}</div>
      <div v-if="item.special" class="special-indicator"></div>
    </button>
  </nav>
</template>

<script setup>
import { ref } from "vue";

const emit = defineEmits(["navigate"]);

const navItems = ref([
  { id: "other", label: "其他", icon: "⚙️", route: "/other", active: false },
  {
    id: "ranking",
    label: "排行榜",
    icon: "🏆",
    route: "/ranking",
    active: false,
  },
  {
    id: "shop",
    label: "商城",
    icon: "👛",
    special: true,
    route: "/shop",
    active: false,
  },
  { id: "gifts", label: "贈禮", icon: "🎁", route: "/gifts", active: true },
  { id: "guild", label: "公會", icon: "🏰", route: "/guild", active: false },
]);

function handleNavClick(item) {
  // Set all items to inactive
  navItems.value.forEach((n) => (n.active = false));
  // Set the clicked item as active
  item.active = true;

  // Emit the route change
  emit("navigate", item.route || item.id);
}
</script>

<style scoped>
.footer-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: calc(70px + env(safe-area-inset-bottom, 0px));
  padding-bottom: calc(8px + env(safe-area-inset-bottom, 0px));
  background: radial-gradient(
      120% 80% at 50% 120%,
      rgba(255, 215, 0, 0.12) 0%,
      rgba(0, 0, 0, 0) 60%
    ),
    linear-gradient(
      180deg,
      rgba(20, 20, 28, 0.75) 0%,
      rgba(10, 10, 16, 0.92) 100%
    ),
    url("/assets/images/backgrounds/footer-bg.webp");
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  padding-left: 12px;
  padding-right: 12px;
  box-shadow: 0 -4px 18px rgba(0, 0, 0, 0.5),
    0 -1px 24px rgba(255, 215, 0, 0.12);
  z-index: 100000;
  backdrop-filter: blur(10px) saturate(120%);
  -webkit-backdrop-filter: blur(10px) saturate(120%);
  border-top: 1px solid rgba(255, 215, 0, 0.18);
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  padding: 8px 4px;
  background: transparent;
  border: none;
  outline: none;
  -webkit-tap-highlight-color: transparent;
  flex: 1;
  height: 60px;
  min-width: 56px;
  max-width: 80px;
}

.nav-item {
  overflow: hidden;
  position: relative;
}

.nav-item::before {
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
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 2px;
  transition: all 0.3s ease;
  transform-origin: center;
}

.nav-label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.85);
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

/* Special button styles */
.nav-item.special {
  margin-top: -22px;
  height: 82px;
  background: radial-gradient(
      120% 100% at 50% -10%,
      rgba(255, 255, 255, 0.25) 0%,
      rgba(255, 255, 255, 0) 60%
    ),
    linear-gradient(135deg, #ffd700, #ffb347);
  border-radius: 50% 50% 14px 14px;
  box-shadow: 0 -6px 16px rgba(255, 215, 0, 0.35),
    0 4px 14px rgba(0, 0, 0, 0.35);
  padding-top: 12px;
  overflow: visible;
  border: 1px solid rgba(0, 0, 0, 0.2);
}

.nav-item.special .nav-icon {
  font-size: 32px;
  color: #ffffff;
  text-shadow: 0 2px 6px rgba(0, 0, 0, 0.35);
}

.nav-item.special .nav-label {
  color: #ffffff;
  font-weight: 600;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

.nav-item.special:hover {
  transform: translateY(-2px);
  box-shadow: 0 -8px 18px rgba(255, 215, 0, 0.45);
}

.nav-item.special .special-indicator {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #ff3366;
  box-shadow: 0 0 8px rgba(255, 51, 102, 0.6);
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

.nav-icon.pulse {
  animation: pulse 2s infinite;
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
