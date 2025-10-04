<template>
  <div class="category-tabs-container">
    <div class="category-tabs" ref="tabsContainer">
      <div
        v-for="cat in categories"
        :key="cat.id"
        :class="[
          'tab-item',
          {
            active: cat.id === selectedCategory,
            loading: loading && cat.id === selectedCategory,
          },
        ]"
        @click="changeCategory(cat.id)"
      >
        <span class="tab-text">{{ cat.name }}</span>
        <div
          v-if="loading && cat.id === selectedCategory"
          class="loading-spinner"
        ></div>
      </div>
      <div class="search-icon" @click="toggleSearch">
        <img
          v-if="!showSearch"
          src="/assets/images/ui/icons/search-icon.png"
          alt="搜尋"
          class="search-icon-img"
          @error="handleSearchIconError"
        />
        <span v-else class="close-icon">✕</span>
      </div>
    </div>

    <!-- 搜尋輸入框 -->
    <div v-if="showSearch" class="search-container">
      <input
        ref="searchInput"
        v-model="searchKeyword"
        type="text"
        placeholder="搜尋遊戲..."
        class="search-input"
        @input="onSearchInput"
        @keyup.enter="performSearch"
      />
      <button @click="performSearch" class="search-button">搜尋</button>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from "vue";
import { storeToRefs } from "pinia";
import { useGameStore } from "../stores/useGameStore";

const store = useGameStore();
const { categories, selectedCategory, loading } = storeToRefs(store);

const showSearch = ref(false);
const searchKeyword = ref("");
const searchInput = ref(null);
const tabsContainer = ref(null);

function changeCategory(id) {
  if (id !== store.selectedCategory && !loading.value) {
    // 關閉搜尋模式
    showSearch.value = false;
    searchKeyword.value = "";
    // 切換分類
    store.fetchGamesByCategory(id);
  }
}

async function toggleSearch() {
  showSearch.value = !showSearch.value;
  if (showSearch.value) {
    // 等待 DOM 更新後聚焦輸入框
    await nextTick();
    searchInput.value?.focus();
  } else {
    // 關閉搜尋時清空關鍵字並回到當前分類
    searchKeyword.value = "";
    if (searchKeyword.value.trim()) {
      store.fetchGamesByCategory(store.selectedCategory);
    }
  }
}

let searchTimeout = null;

function onSearchInput() {
  // 防抖搜尋，避免頻繁請求
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }

  searchTimeout = setTimeout(() => {
    if (searchKeyword.value.trim()) {
      performSearch();
    } else {
      // 如果搜尋框為空，回到當前分類
      store.fetchGamesByCategory(store.selectedCategory);
    }
  }, 300);
}

function performSearch() {
  if (searchKeyword.value.trim()) {
    store.searchGames(searchKeyword.value);
  }
}

function handleSearchIconError(event) {
  // 如果搜尋圖標載入失敗，顯示 emoji 作為備用
  event.target.outerHTML = "<span>🔍</span>";
}
</script>

<style scoped>
.category-tabs-container {
  background: linear-gradient(180deg, #222 0%, #111 100%);
  border-bottom: 1px solid #333;
}

.category-tabs {
  display: flex;
  overflow-x: auto;
  padding: 12px 15px;
  gap: 8px;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
}

.category-tabs::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}

.tab-item {
  position: relative;
  color: #aaa;
  padding: 10px 16px;
  border-radius: 20px;
  cursor: pointer;
  white-space: nowrap;
  user-select: none;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid transparent;
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: fit-content;
}

.tab-item:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}

.tab-item.active {
  background: linear-gradient(135deg, #ffd700 0%, #ffb347 100%);
  color: #333;
  font-weight: bold;
  border-color: #ffd700;
  box-shadow: 0 2px 8px rgba(255, 215, 0, 0.3);
}

.tab-item.loading {
  pointer-events: none;
  opacity: 0.7;
}

.tab-text {
  font-size: 14px;
}

.loading-spinner {
  width: 12px;
  height: 12px;
  border: 2px solid transparent;
  border-top: 2px solid #333;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.search-icon {
  margin-left: auto;
  color: #fff;
  font-size: 1.2rem;
  cursor: pointer;
  user-select: none;
  padding: 8px;
  border-radius: 50%;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
  height: 40px;
}

.search-icon:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.1);
}

.search-icon-img {
  width: 20px;
  height: 20px;
  filter: brightness(0) invert(1);
  transition: all 0.3s ease;
}

.close-icon {
  font-size: 1.2rem;
  font-weight: bold;
}

.search-container {
  padding: 12px 15px;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  gap: 10px;
  align-items: center;
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.search-input {
  flex: 1;
  padding: 10px 15px;
  border: none;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 14px;
  outline: none;
  transition: all 0.3s ease;
}

.search-input::placeholder {
  color: #aaa;
}

.search-input:focus {
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0 0 0 2px rgba(255, 215, 0, 0.3);
}

.search-button {
  padding: 10px 20px;
  border: none;
  border-radius: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.search-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.search-button:active {
  transform: translateY(0);
}

/* 響應式設計 */
@media (max-width: 480px) {
  .category-tabs {
    padding: 10px 12px;
    gap: 6px;
  }

  .tab-item {
    padding: 8px 12px;
    font-size: 13px;
  }

  .search-container {
    padding: 10px 12px;
  }

  .search-input {
    padding: 8px 12px;
    font-size: 13px;
  }

  .search-button {
    padding: 8px 16px;
    font-size: 13px;
  }
}
</style>
