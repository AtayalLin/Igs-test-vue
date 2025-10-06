<template>
  <div class="category-tabs-container">
    <div class="nav-wrapper">
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
      </div>

      <div class="search-wrapper">
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
  position: sticky;
  top: 0;
  z-index: 10;
  background: #ffffff;
  padding: 4px;
  border-radius: 22px;
  margin: 8px 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.nav-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 44px;
}

.category-tabs {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  -ms-overflow-style: none;
  padding-right: 8px;
  margin-right: 44px;
}

.search-wrapper {
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 11;
}

.category-tabs::-webkit-scrollbar {
  display: none;
}

.tab-item {
  position: relative;
  padding: 6px 12px;
  border-radius: 16px;
  color: #666666;
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 4px;
  height: 36px;
}

.tab-item:hover {
  background: rgba(0, 0, 0, 0.05);
}

.tab-item.active {
  background: #4287ff;
  color: #ffffff;
  font-weight: 500;
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
  border-top: 2px solid currentColor;
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
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  cursor: pointer;
  background: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

.search-icon:hover {
  background: #f5f5f5;
  transform: scale(1.05);
}

.search-icon-img {
  width: 20px;
  height: 20px;
  opacity: 0.6;
}

.close-icon {
  font-size: 16px;
  color: #666;
}

.search-container {
  position: absolute;
  top: calc(100% + 4px);
  left: 16px;
  right: 16px;
  padding: 8px;
  display: flex;
  gap: 8px;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  animation: slideDown 0.2s ease-out;
  z-index: 12;
}

.search-input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 20px;
  font-size: 14px;
  outline: none;
}

.search-button {
  padding: 8px 16px;
  background: #4287ff;
  color: #ffffff;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.search-button:hover {
  background: #3476e8;
}

@keyframes slideDown {
  from {
    transform: translateY(-10px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.search-icon {
  position: absolute;
  right: 4px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
}
.search-icon:hover {
  background: rgba(0, 0, 0, 0.1);
}

.search-icon-img {
  width: 16px;
  height: 16px;
  opacity: 0.6;
}

.close-icon {
  font-size: 14px;
  color: #666666;
}

.search-container {
  margin-top: 8px;
  padding: 8px;
  display: flex;
  gap: 8px;
  align-items: center;
  animation: slideDown 0.2s ease;
  background: #f5f5f5;
  border-radius: 16px;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.search-input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 16px;
  background: #ffffff;
  color: #333333;
  font-size: 14px;
  outline: none;
  transition: all 0.2s ease;
}

.search-input::placeholder {
  color: #999999;
}

.search-input:focus {
  border-color: #4287ff;
  box-shadow: 0 0 0 2px rgba(66, 135, 255, 0.1);
}

.search-button {
  padding: 8px 16px;
  border: none;
  border-radius: 16px;
  background: #4287ff;
  color: white;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.search-button:hover {
  background: #3b7ae6;
}

.search-button:active {
  transform: translateY(1px);
}

/* 響應式設計 */
@media (max-width: 480px) {
  .category-tabs-container {
    margin: 6px 12px;
    padding: 6px 12px;
  }

  .category-tabs {
    gap: 6px;
  }

  .tab-item {
    padding: 6px 12px;
    font-size: 13px;
  }

  .search-container {
    margin-top: 6px;
    padding: 6px;
  }

  .search-input {
    padding: 6px 10px;
    font-size: 13px;
  }

  .search-button {
    padding: 6px 12px;
    font-size: 13px;
  }
}
</style>
