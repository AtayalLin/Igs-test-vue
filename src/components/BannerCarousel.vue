<template>
  <div class="banner-carousel-wrapper">
    <!-- 輪播主容器 -->
    <div
      class="banner-slider"
      @mouseenter="pauseAutoPlay"
      @mouseleave="resumeAutoPlay"
    >
      <!-- Banner 顯示區域 -->
      <div class="banner-viewport">
        <div
          class="banner-slides"
          :style="{ transform: `translateX(-${currentSlide * 100}%)` }"
        >
          <!-- Banner 幻燈片 -->
          <div
            v-for="(banner, index) in bannerList"
            :key="banner.id"
            class="banner-slide"
            :class="{ 'is-active': index === currentSlide }"
          >
            <div
              class="banner-content"
              :style="{ backgroundImage: `url(${banner.image})` }"
              @click="onBannerClick(banner)"
            >
              <!-- 圖片加載失敗時的備用背景 -->
              <div
                class="banner-fallback"
                :style="{ background: banner.gradient }"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- 導航控制 -->
      <div class="banner-controls" v-if="bannerList.length > 1">
        <!-- 左箭頭 -->
        <button
          class="nav-arrow nav-prev"
          @click="goToPrevSlide"
          :disabled="isTransitioning"
        >
          <span class="arrow-icon">‹</span>
        </button>

        <!-- 右箭頭 -->
        <button
          class="nav-arrow nav-next"
          @click="goToNextSlide"
          :disabled="isTransitioning"
        >
          <span class="arrow-icon">›</span>
        </button>
      </div>

      <!-- 指示器 -->
      <div class="banner-indicators" v-if="bannerList.length > 1">
        <button
          v-for="(banner, index) in bannerList"
          :key="`indicator-${banner.id}`"
          class="indicator-dot"
          :class="{ 'is-current': index === currentSlide }"
          @click="goToSlide(index)"
          :disabled="isTransitioning"
        >
          <span class="sr-only">跳轉到第 {{ index + 1 }} 個 Banner</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted, nextTick } from "vue";

// 導入圖片工具
import { getImageUrl, IMAGE_PATHS } from "../utils/assets.js";

// Banner 數據配置
const bannerList = reactive([
  {
    id: 1,
    image: getImageUrl(IMAGE_PATHS.banners.banner1),
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    link: "#banner-1",
    title: "麻將開胡2 特別活動",
  },
  {
    id: 2,
    image: getImageUrl(IMAGE_PATHS.banners.banner2),
    gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    link: "#banner-2",
    title: "街機新手專區",
  },
  {
    id: 3,
    image: getImageUrl(IMAGE_PATHS.banners.banner3),
    gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    link: "#banner-3",
    title: "VIP 專屬優惠",
  },
  {
    id: 4,
    image: getImageUrl(IMAGE_PATHS.banners.banner4),
    gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    link: "#banner-4",
    title: "電動嘉年華",
  },
]);

// 響應式狀態
const currentSlide = ref(0);
const isTransitioning = ref(false);
const autoPlayTimer = ref(null);
const isAutoPlayPaused = ref(false);

// 輪播控制函數
const goToSlide = async (index) => {
  if (isTransitioning.value || index === currentSlide.value) return;

  isTransitioning.value = true;
  currentSlide.value = index;

  await nextTick();
  setTimeout(() => {
    isTransitioning.value = false;
  }, 500); // 與 CSS transition 時間一致
};

const goToNextSlide = () => {
  const nextIndex = (currentSlide.value + 1) % bannerList.length;
  goToSlide(nextIndex);
};

const goToPrevSlide = () => {
  const prevIndex =
    currentSlide.value === 0 ? bannerList.length - 1 : currentSlide.value - 1;
  goToSlide(prevIndex);
};

// 自動播放控制
const startAutoPlay = () => {
  if (bannerList.length <= 1) return;

  autoPlayTimer.value = setInterval(() => {
    if (!isAutoPlayPaused.value && !isTransitioning.value) {
      goToNextSlide();
    }
  }, 4000);
};

const stopAutoPlay = () => {
  if (autoPlayTimer.value) {
    clearInterval(autoPlayTimer.value);
    autoPlayTimer.value = null;
  }
};

const pauseAutoPlay = () => {
  isAutoPlayPaused.value = true;
};

const resumeAutoPlay = () => {
  isAutoPlayPaused.value = false;
};

// Banner 點擊處理
const onBannerClick = (banner) => {
  console.log("Banner clicked:", banner.title);
  // 這裡可以添加跳轉邏輯
  if (banner.link && banner.link !== "#") {
    window.open(banner.link, "_blank");
  }
};

// 生命週期
onMounted(() => {
  startAutoPlay();
});

onUnmounted(() => {
  stopAutoPlay();
});
</script>

<style scoped>
/* 主容器 */
.banner-carousel-wrapper {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  padding: 16px;
}

/* 輪播容器 */
.banner-slider {
  position: relative;
  width: 100%;
  height: 200px;
  border-radius: 16px;
  overflow: hidden;
  background: #f5f5f5;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

/* Banner 視窗 */
.banner-viewport {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

/* Banner 幻燈片容器 */
.banner-slides {
  display: flex;
  width: 100%;
  height: 100%;
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 單個 Banner 幻燈片 */
.banner-slide {
  flex: 0 0 100%;
  width: 100%;
  height: 100%;
  position: relative;
}

/* Banner 內容 - 完全填滿 */
.banner-content {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  cursor: pointer;
  position: relative;
  transition: transform 0.3s ease;
}

.banner-content:hover {
  transform: scale(1.02);
}

/* 備用背景 */
/* .banner-fallback {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
} */

/* 導航控制 */
.banner-controls {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 10;
}

/* 導航箭頭 */
.nav-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 44px;
  height: 44px;
  border: none;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  cursor: pointer;
  pointer-events: auto;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(4px);
}

.nav-arrow:hover:not(:disabled) {
  background: rgba(0, 0, 0, 0.8);
  transform: translateY(-50%) scale(1.1);
}

.nav-arrow:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.nav-prev {
  left: 16px;
}

.nav-next {
  right: 16px;
}

.arrow-icon {
  font-size: 20px;
  font-weight: bold;
  line-height: 1;
}

/* 指示器 */
.banner-indicators {
  position: absolute;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  z-index: 10;
}

.indicator-dot {
  width: 12px;
  height: 12px;
  border: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.indicator-dot::before {
  content: "";
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  border: 2px solid transparent;
  border-radius: 50%;
  transition: border-color 0.3s ease;
}

.indicator-dot:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.8);
  transform: scale(1.2);
}

.indicator-dot.is-current {
  background: #ffd700;
  transform: scale(1.3);
}

.indicator-dot.is-current::before {
  border-color: rgba(255, 215, 0, 0.5);
}

.indicator-dot:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 無障礙 */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* 響應式設計 */
@media (max-width: 768px) {
  .banner-carousel-wrapper {
    padding: 12px;
  }

  .banner-slider {
    height: 160px;
    border-radius: 12px;
  }

  .nav-arrow {
    width: 40px;
    height: 40px;
  }

  .nav-prev {
    left: 12px;
  }

  .nav-next {
    right: 12px;
  }

  .arrow-icon {
    font-size: 18px;
  }

  .banner-indicators {
    bottom: 10px;
    gap: 6px;
  }

  .indicator-dot {
    width: 10px;
    height: 10px;
  }
}

@media (max-width: 480px) {
  .banner-carousel-wrapper {
    padding: 8px;
  }

  .banner-slider {
    height: 140px;
    border-radius: 10px;
  }

  .nav-arrow {
    width: 36px;
    height: 36px;
  }

  .nav-prev {
    left: 8px;
  }

  .nav-next {
    right: 8px;
  }

  .arrow-icon {
    font-size: 16px;
  }

  .banner-indicators {
    bottom: 8px;
    gap: 4px;
  }

  .indicator-dot {
    width: 8px;
    height: 8px;
  }
}

/* 高對比度模式支持 */
@media (prefers-contrast: high) {
  .nav-arrow {
    background: rgba(0, 0, 0, 0.9);
    border: 2px solid white;
  }

  .indicator-dot {
    border: 2px solid white;
  }

  .indicator-dot.is-current {
    background: #ffff00;
    border-color: #000000;
  }
}

/* 減少動畫偏好 */
@media (prefers-reduced-motion: reduce) {
  .banner-slides {
    transition: none;
  }

  .banner-content {
    transition: none;
  }

  .nav-arrow {
    transition: none;
  }

  .indicator-dot {
    transition: none;
  }
}
</style>
