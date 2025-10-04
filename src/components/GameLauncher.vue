<template>
  <transition name="launcher-fade">
    <div v-if="isVisible" class="game-launcher">
      <!-- 遊戲載入中 -->
      <div v-if="isLoading" class="launcher-loading">
        <div class="loading-content">
          <div class="spinner"></div>
          <h3>{{ loadingText }}</h3>
          <p>{{ game?.name || '遊戲' }}</p>
          <button class="cancel-btn" @click="handleCancel">取消</button>
        </div>
      </div>

      <!-- 遊戲 Iframe -->
      <div v-else-if="gameUrl" class="game-container">
        <!-- 頂部工具欄 -->
        <div class="game-toolbar">
          <button class="toolbar-btn back-btn" @click="handleClose">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            <span>返回</span>
          </button>
          
          <div class="game-title">{{ game?.name || '遊戲' }}</div>
          
          <button class="toolbar-btn refresh-btn" @click="handleRefresh">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/>
            </svg>
          </button>
        </div>

        <!-- 遊戲 Iframe -->
        <iframe
          ref="gameIframe"
          :src="gameUrl"
          class="game-iframe"
          frameborder="0"
          allowfullscreen
          @load="handleIframeLoad"
        ></iframe>

        <!-- Iframe 載入中遮罩 -->
        <div v-if="isIframeLoading" class="iframe-loading">
          <div class="spinner"></div>
          <p>遊戲載入中...</p>
        </div>
      </div>

      <!-- 錯誤提示 -->
      <div v-else-if="error" class="launcher-error">
        <div class="error-content">
          <div class="error-icon">⚠️</div>
          <h3>遊戲啟動失敗</h3>
          <p>{{ error }}</p>
          <div class="error-actions">
            <button class="retry-btn" @click="handleRetry">重試</button>
            <button class="close-btn" @click="handleClose">關閉</button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, watch } from 'vue'
import { launchGame } from '../services/api.js'

const props = defineProps({
  game: {
    type: Object,
    default: null
  },
  isVisible: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close'])

const isLoading = ref(false)
const isIframeLoading = ref(false)
const gameUrl = ref('')
const error = ref('')
const loadingText = ref('正在啟動遊戲...')
const gameIframe = ref(null)

// 啟動遊戲
async function startGame() {
  if (!props.game) return

  isLoading.value = true
  error.value = ''
  gameUrl.value = ''
  loadingText.value = '正在連接遊戲伺服器...'

  try {
    // 模擬請求延遲
    await new Promise(resolve => setTimeout(resolve, 800))
    
    loadingText.value = '正在獲取遊戲資源...'
    
    // 調用 API 啟動遊戲
    const response = await launchGame(props.game.id)
    
    if (response.success && response.gameUrl) {
      loadingText.value = '正在載入遊戲...'
      gameUrl.value = response.gameUrl
      isIframeLoading.value = true
      
      console.log('✅ 遊戲啟動成功:', {
        gameId: props.game.id,
        gameName: props.game.name,
        gameUrl: response.gameUrl,
        token: response.token
      })
    } else {
      throw new Error('無法獲取遊戲 URL')
    }
  } catch (err) {
    console.error('❌ 遊戲啟動失敗:', err)
    error.value = err.message || '遊戲啟動失敗，請稍後再試'
  } finally {
    isLoading.value = false
  }
}

// Iframe 載入完成
function handleIframeLoad() {
  isIframeLoading.value = false
  console.log('✅ 遊戲 Iframe 載入完成')
}

// 刷新遊戲
function handleRefresh() {
  if (gameIframe.value) {
    isIframeLoading.value = true
    gameIframe.value.src = gameIframe.value.src
  }
}

// 重試
function handleRetry() {
  error.value = ''
  startGame()
}

// 取消
function handleCancel() {
  isLoading.value = false
  handleClose()
}

// 關閉
function handleClose() {
  gameUrl.value = ''
  error.value = ''
  isLoading.value = false
  isIframeLoading.value = false
  emit('close')
}

// 監聽遊戲變化
watch(() => props.isVisible, (newVal) => {
  if (newVal && props.game) {
    startGame()
  }
})
</script>

<style scoped>
.game-launcher {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10000;
  background: #000;
}

/* 載入中 */
.launcher-loading {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%);
}

.loading-content {
  text-align: center;
}

.loading-content h3 {
  margin: 20px 0 10px;
  font-size: 20px;
  color: #ffd700;
}

.loading-content p {
  margin: 0 0 30px;
  font-size: 16px;
  color: rgba(255, 255, 255, 0.7);
}

.cancel-btn {
  padding: 10px 30px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cancel-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.5);
}

/* 遊戲容器 */
.game-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
}

/* 工具欄 */
.game-toolbar {
  height: 50px;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 15px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  flex-shrink: 0;
  z-index: 10;
}

.toolbar-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 8px 15px;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 6px;
  color: white;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.toolbar-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.toolbar-btn svg {
  flex-shrink: 0;
}

.game-title {
  flex: 1;
  text-align: center;
  font-size: 16px;
  font-weight: bold;
  color: #ffd700;
}

/* Iframe */
.game-iframe {
  flex: 1;
  width: 100%;
  border: none;
  background: #000;
}

/* Iframe 載入中 */
.iframe-loading {
  position: absolute;
  top: 50px;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #000;
  z-index: 5;
}

.iframe-loading p {
  margin-top: 20px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 16px;
}

/* 錯誤提示 */
.launcher-error {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%);
}

.error-content {
  text-align: center;
  max-width: 400px;
  padding: 40px;
}

.error-icon {
  font-size: 64px;
  margin-bottom: 20px;
}

.error-content h3 {
  font-size: 24px;
  color: #ff6b6b;
  margin-bottom: 15px;
}

.error-content p {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 30px;
}

.error-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
}

.retry-btn,
.close-btn {
  padding: 12px 30px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.retry-btn {
  background: linear-gradient(135deg, #ffd700 0%, #ffb347 100%);
  color: #000;
}

.retry-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(255, 215, 0, 0.4);
}

.close-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* Spinner */
.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(255, 215, 0, 0.3);
  border-top-color: #ffd700;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* 淡入淡出動畫 */
.launcher-fade-enter-active,
.launcher-fade-leave-active {
  transition: opacity 0.3s ease;
}

.launcher-fade-enter-from,
.launcher-fade-leave-to {
  opacity: 0;
}
</style>

