<template>
  <nav class="bottom-bar" role="navigation" aria-label="主頁導航">
    <button
      v-for="item in items"
      :key="item.id"
      type="button"
      :class="[
        'bb-item',
        { active: current === item.id },
        { special: item.special },
      ]"
      @click="onClick(item)"
      :aria-label="item.label"
      :aria-current="current === item.id ? 'page' : undefined"
    >
      <div class="bb-icon">{{ item.icon }}</div>
      <div class="bb-label">{{ item.label }}</div>
    </button>
  </nav>
</template>

<script setup>
import { ref } from "vue";

const emit = defineEmits(["navigate"]);
const current = ref("gifts");
const items = ref([
  { id: "other", label: "其他", icon: "⚙️" },
  { id: "ranking", label: "排行榜", icon: "🏆" },
  { id: "shop", label: "商城", icon: "👛", special: true },
  { id: "gifts-page", label: "贈禮", icon: "🎁" },
  { id: "guild", label: "公會", icon: "🏰" },
]);

function onClick(item) {
  current.value = item.id;
  emit("navigate", `/${item.id}`);
}
</script>

<style scoped>
.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: calc(72px + env(safe-area-inset-bottom, 0px));
  padding: 0 12px calc(10px + env(safe-area-inset-bottom, 0px));
  background: radial-gradient(
      120% 80% at 50% 120%,
      rgba(255, 215, 0, 0.14) 0%,
      rgba(0, 0, 0, 0) 60%
    ),
    linear-gradient(
      180deg,
      rgba(20, 20, 28, 0.85) 0%,
      rgba(10, 10, 16, 0.96) 100%
    ),
    url("/assets/images/backgrounds/footer-bg.webp");
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  box-shadow: 0 -6px 18px rgba(0, 0, 0, 0.55),
    0 -1px 24px rgba(255, 215, 0, 0.14);
  backdrop-filter: blur(10px) saturate(120%);
  -webkit-backdrop-filter: blur(10px) saturate(120%);
  border-top: 1px solid rgba(255, 215, 0, 0.2);
  z-index: 100000;
}

.bb-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  cursor: pointer;
  background: transparent;
  border: none;
  outline: none;
  -webkit-tap-highlight-color: transparent;
  height: 60px;
  flex: 1;
}
.bb-icon {
  font-size: 22px;
  color: rgba(255, 255, 255, 0.9);
}
.bb-label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.85);
  font-weight: 600;
}
.bb-item.active .bb-icon,
.bb-item.active .bb-label {
  color: #ffd700;
  text-shadow: 0 0 12px rgba(255, 215, 0, 0.5);
}

.bb-item.special {
  margin-top: -22px;
  height: 82px;
  background: radial-gradient(
      120% 100% at 50% -10%,
      rgba(255, 255, 255, 0.25) 0%,
      rgba(255, 255, 255, 0) 60%
    ),
    linear-gradient(135deg, #ffd700, #ffb347);
  border-radius: 50% 50% 14px 14px;
  box-shadow: 0 -8px 18px rgba(255, 215, 0, 0.45),
    0 4px 14px rgba(0, 0, 0, 0.35);
  border: 1px solid rgba(0, 0, 0, 0.2);
}
.bb-item.special .bb-icon {
  color: #fff;
  font-size: 28px;
}
.bb-item.special .bb-label {
  color: #fff;
}

@media (max-width: 360px) {
  .bb-icon {
    font-size: 20px;
  }
  .bb-label {
    font-size: 10px;
  }
}
</style>
