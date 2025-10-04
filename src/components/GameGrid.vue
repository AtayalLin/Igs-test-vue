<template>
  <div class="game-grid-container">
    <transition name="fade" mode="out-in">
      <!-- loading skeleton -->
      <div v-if="loading" key="loading" class="game-grid loading">
        <div
          v-for="n in 8"
          :key="`skeleton-${n}`"
          :class="['game-card', 'skeleton', n % 3 === 1 ? 'large' : 'small']"
        >
          <div class="skeleton-content"></div>
        </div>
      </div>

      <!-- games grid -->
      <div v-else key="games" class="game-grid">
        <!-- favorites empty -->
        <div
          v-if="games.length === 0 && gameStore.selectedCategory === 'favorite'"
          class="no-favorites"
        >
          <div class="no-favorites-container">
            <div class="no-favorites-icon">💖</div>
            <div class="no-favorites-text">尚未加入最愛遊戲</div>
            <div class="no-favorites-subtitle">
              點擊遊戲右上角的愛心來收藏您喜歡的遊戲
            </div>
          </div>
        </div>

        <!-- other empty -->
        <div v-else-if="games.length === 0" class="no-games">
          <div class="no-games-icon">🎮</div>
          <div class="no-games-text">暫無遊戲</div>
        </div>

        <!-- cards -->
        <transition-group
          v-else
          name="game-card"
          tag="div"
          class="game-grid-inner"
          appear
        >
          <div
            v-for="(game, index) in games"
            :key="game.id"
            :class="['game-card', game.layout === 'large' ? 'large' : 'small']"
            :style="{ '--delay': index * 0.06 + 's' }"
            @click="playGame(game)"
          >
            <!-- image -->
            <div class="game-image-container">
              <img
                :src="game.imageUrl || placeholderImg"
                :alt="game.name"
                @error="handleImageError"
                class="game-thumb"
              />
            </div>

            <!-- left top badges (image badges) -->
            <div class="badges-left" v-if="game.tags && game.tags.length > 0">
              <div
                class="badge-wrap"
                v-for="(tag, bIndex) in game.tags.slice(0, 3)"
                :key="`${game.id}-tag-${bIndex}`"
                :ref="(el) => setBadgeRef(el, `${game.id}-${bIndex}`)"
                :style="{ '--badge-order': bIndex }"
              >
                <img
                  class="badge-img"
                  :src="getTagBadgeImage(tag).src"
                  :alt="getTagBadgeImage(tag).alt"
                  @error="(e) => (e.target.src = getTagBadgeImage().src)"
                />
                <span class="badge-glow" aria-hidden="true"></span>
              </div>
            </div>

            <!-- right top favorite -->
            <div class="favorite-heart" @click.stop="toggleFavorite(game)">
              <div
                class="heart-circle"
                :class="{ active: game.isFavorite }"
                role="button"
                aria-label="Toggle favorite"
              >
                <span class="heart-icon">{{
                  game.isFavorite ? "❤️" : "🤍"
                }}</span>
              </div>
            </div>

            <!-- overlay bottom info (optional) -->
            <div class="game-overlay">
              <div class="game-info">
                <div class="game-name">{{ game.name }}</div>
                <div class="game-description" v-if="game.description">
                  {{ game.description }}
                </div>
              </div>
            </div>

            <!-- center play button -->
            <button
              class="play-button"
              @click.stop="playGame(game)"
              aria-label="Play"
            >
              <div class="play-icon">▶</div>
            </button>
          </div>
        </transition-group>
      </div>
    </transition>

    <!-- 遊戲啟動器 -->
    <GameLauncher
      :game="selectedGame"
      :isVisible="isLauncherVisible"
      @close="closeLauncher"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onUpdated, nextTick, watch } from "vue";
import { storeToRefs } from "pinia";
import { useGameStore } from "../stores/useGameStore";
import GameLauncher from "./GameLauncher.vue";
import gsap from "gsap";

/**
 * Game grid component (full version)
 * - Uses GSAP to animate image badges on each card
 * - Left top: image badges (up to 3) stacked vertically
 * - Right top: favorite heart inside white circle
 * - Hover: image zoom + darken, play button appears
 */

const gameStore = useGameStore();
const { games, loading } = storeToRefs(gameStore);

const placeholderImg = "https://placehold.co/600x400/333/fff?text=Game";

// 遊戲啟動器狀態
const isLauncherVisible = ref(false);
const selectedGame = ref(null);

// --- Play / Favorite ---
function playGame(game) {
  // prevent null
  if (!game) return;

  // 啟動遊戲
  selectedGame.value = game;
  isLauncherVisible.value = true;

  console.log("🎮 啟動遊戲:", game.name);
}

// 關閉遊戲啟動器
function closeLauncher() {
  isLauncherVisible.value = false;
  selectedGame.value = null;
}

function toggleFavorite(game) {
  if (!game) return;
  game.isFavorite = !game.isFavorite;
  if (typeof gameStore.updateGameFavoriteStatus === "function") {
    gameStore.updateGameFavoriteStatus(game.id, game.isFavorite);
  }
  // If we're in favorites category, refresh list
  if (
    gameStore.selectedCategory === "favorite" &&
    typeof gameStore.fetchGamesByCategory === "function"
  ) {
    gameStore.fetchGamesByCategory("favorite");
  }
}

// --- image fallback ---
function handleImageError(event) {
  event.target.src = placeholderImg;
}

// --- tag badge image map ---
function getTagBadgeImage(tag = "") {
  // return object with src & alt
  const badgeMap = {
    HOT: { src: "/assets/images/ui/badges/hot-badge.webp", alt: "HOT" },
    NEW: { src: "/assets/images/ui/badges/new-badge.webp", alt: "NEW" },
    活動: { src: "/assets/images/ui/badges/event-badge.webp", alt: "活動" },
    加強送: { src: "/assets/images/ui/badges/bonus-badge.webp", alt: "加強送" },
    加碼送: { src: "/assets/images/ui/badges/bonus-badge.webp", alt: "加碼送" },
    x1000: {
      src: "/assets/images/ui/badges/multiplier-badge.webp",
      alt: "x1000",
    },
  };

  return (
    badgeMap[tag] || {
      src: "/assets/images/ui/badges/hot-badge.webp",
      alt: tag || "badge",
    }
  );
}

// --- GSAP badge refs & animation ---
const badgeRefs = ref({});

function setBadgeRef(el, key) {
  // key: unique per badge, like `${game.id}-${index}`
  if (!key) return;
  if (el) {
    badgeRefs.value[key] = el;
  } else {
    // if element removed, clean up
    delete badgeRefs.value[key];
  }
}

function animateBadges() {
  const entries = Object.entries(badgeRefs.value);
  if (!entries.length) return;

  entries.forEach(([key, badgeEl], idx) => {
    if (!badgeEl) return;

    // reset before animation
    gsap.killTweensOf(badgeEl);
    gsap.set(badgeEl, {
      scale: 0,
      rotation: -160,
      opacity: 0,
      transformOrigin: "50% 50%",
    });

    // entrance
    gsap.to(badgeEl, {
      scale: 1,
      rotation: 0,
      opacity: 1,
      duration: 0.55,
      delay: (idx % 6) * 0.06, // small stagger across all badges
      ease: "back.out(1.6)",
      onComplete: () => {
        // subtle float
        gsap.to(badgeEl, {
          y: "-=4",
          duration: 2.5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });

        // glow pulse
        const glow = badgeEl.querySelector(".badge-glow");
        if (glow) {
          gsap.set(glow, { opacity: 0, scale: 0.9 });
          gsap.to(glow, {
            opacity: 0.8,
            scale: 1.15,
            duration: 1.4,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          });
        }
      },
    });
  });
}

// lifecycle: initial + updates
onMounted(() => {
  nextTick(() => {
    animateBadges();
  });
});

onUpdated(() => {
  nextTick(() => {
    animateBadges();
  });
});

watch(
  games,
  () => {
    nextTick(() => {
      animateBadges();
    });
  },
  { deep: true }
);
</script>

<style scoped>
/* container */
.game-grid-container {
  padding: 14px;
  width: 100%;
  box-sizing: border-box;
}

/* grid */
.game-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: 140px;
  gap: 12px;
  align-items: stretch;
}
.game-grid-inner {
  display: contents;
}

/* card baseline */
.game-card {
  position: relative;
  border-radius: 14px;
  overflow: hidden;
  cursor: pointer;
  min-height: 100px;
  background: linear-gradient(
    135deg,
    rgba(30, 30, 50, 0.95),
    rgba(12, 12, 24, 0.95)
  );
  border: 1px solid rgba(255, 255, 255, 0.04);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.45),
    inset 0 1px 0 rgba(255, 255, 255, 0.02);
  transition: transform 0.28s ease, box-shadow 0.28s ease;
  display: block;
}

/* large tile spans */
.game-card.large {
  grid-column: span 2;
  grid-row: span 2;
}

/* hover */
.game-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.55);
}

/* image */
.game-image-container {
  position: absolute;
  inset: 0;
  z-index: 1;
  overflow: hidden;
}
.game-thumb {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transform-origin: center;
  transition: transform 0.5s ease, filter 0.4s ease;
}

/* hover image zoom & darken */
.game-card:hover .game-thumb {
  transform: scale(1.08);
  filter: brightness(0.75);
}

/* overlay bottom info */
.game-overlay {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 3;
  padding: 10px 12px;
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0.6) 60%,
    rgba(0, 0, 0, 0.8) 100%
  );
  pointer-events: none;
}
.game-info {
  pointer-events: none;
}
.game-name {
  color: #fff;
  font-weight: 700;
  font-size: 0.95rem;
  text-shadow: 0 2px 6px rgba(0, 0, 0, 0.7);
}
.game-description {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.85);
  margin-top: 4px;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.6);
}

/* left badges (stacked vertical) */
.badges-left {
  position: absolute;
  top: 8px;
  left: 8px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  z-index: 6;
  pointer-events: none; /* let clicks fall through to card */
}

/* wrapper for badge (animated element) */
.badge-wrap {
  position: relative;
  width: auto;
  height: 34px;
  display: inline-flex;
  align-items: center;
  pointer-events: none; /* keep non-interactive so card click works */
  transform-origin: center;
}

/* badge image */
.badge-img {
  height: 48px;
  width: auto;
  display: block;
  object-fit: contain;
  filter: drop-shadow(0 6px 14px rgba(0, 0, 0, 0.45));
  border-radius: 6px;
  user-select: none;
  -webkit-user-drag: none;
}

/* glow overlay on badge */
.badge-glow {
  position: absolute;
  inset: 0;
  border-radius: 6px;
  pointer-events: none;
  background: radial-gradient(
    circle at 20% 30%,
    rgba(255, 255, 255, 0.14),
    rgba(255, 255, 255, 0.04) 20%,
    transparent 40%
  );
  mix-blend-mode: screen;
  opacity: 0;
}

/* right top favorite */
.favorite-heart {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 7;
  pointer-events: auto; /* must capture clicks */
}
.heart-circle {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.45);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}
.heart-circle:hover {
  transform: scale(1.06);
}
.heart-circle.active {
  box-shadow: 0 8px 26px rgba(255, 0, 102, 0.16), 0 6px 16px rgba(0, 0, 0, 0.45);
}
.heart-icon {
  font-size: 18px;
  line-height: 1;
  transform-origin: center;
  display: inline-block;
}
.heart-circle.active .heart-icon {
  animation: heartbeat 1.2s ease-in-out infinite;
}
@keyframes heartbeat {
  0%,
  100% {
    transform: scale(1);
  }
  40% {
    transform: scale(1.18);
  }
  80% {
    transform: scale(0.98);
  }
}

/* center play button */
.play-button {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%) scale(0.96);
  width: 52px;
  height: 52px;
  border-radius: 50%;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 5;
  transition: all 0.28s ease;
  background: rgba(255, 255, 255, 0.92);
  opacity: 0;
  cursor: pointer;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
}
.game-card:hover .play-button {
  opacity: 1;
  transform: translate(-50%, -50%) scale(1.06);
}
.play-icon {
  font-size: 18px;
  color: #222;
  margin-left: 4px;
}

/* skeleton */
.skeleton {
  background: linear-gradient(90deg, #2b2b33 20%, #3b3b46 50%, #2b2b33 80%);
  background-size: 200% 100%;
  animation: loading 1.4s linear infinite;
}
.skeleton .skeleton-content {
  width: 100%;
  height: 100%;
}
@keyframes loading {
  from {
    background-position: 200% 0;
  }
  to {
    background-position: -200% 0;
  }
}

/* empty state visuals */
.no-favorites,
.no-games {
  grid-column: 1 / -1;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 240px;
}
.no-favorites-container {
  background: linear-gradient(
    135deg,
    rgba(30, 30, 50, 0.95),
    rgba(18, 18, 30, 0.95)
  );
  border-radius: 14px;
  padding: 28px 40px;
  border: 1px solid rgba(255, 255, 255, 0.04);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
  text-align: center;
}
.no-favorites-icon {
  font-size: 40px;
  margin-bottom: 12px;
  animation: heartbeat 2s ease-in-out infinite;
}
.no-favorites-text {
  font-weight: 800;
  color: #fff;
  margin-bottom: 8px;
  font-size: 1.1rem;
}
.no-favorites-subtitle {
  color: rgba(255, 255, 255, 0.85);
  font-size: 0.9rem;
}

/* transitions for cards */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.45s cubic-bezier(0.4, 0, 0.2, 1);
}
.fade-enter-from {
  opacity: 0;
  transform: translateY(8px);
}
.fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

.game-card-enter-active {
  transition: all 0.6s cubic-bezier(0.2, 0.9, 0.3, 1);
  transition-delay: var(--delay);
}
.game-card-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.96);
}
.game-card-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.98);
}

/* small responsive adjustments */
@media (max-width: 1024px) {
  .game-grid {
    grid-template-columns: repeat(3, 1fr);
    grid-auto-rows: 130px;
  }
  .game-card.large {
    grid-column: span 2;
    grid-row: span 2;
  }
}
@media (max-width: 640px) {
  .game-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
    grid-auto-rows: 120px;
  }
  .game-card.large {
    grid-column: span 2;
    grid-row: span 1;
  }
  .badge-img {
    height: 30px;
  }
  .heart-circle {
    width: 32px;
    height: 32px;
  }
}
</style>
