<template>
  <div class="floating-chat-button" @click="openChat">
    <div class="chat-icon">💬</div>
    <div v-if="unreadCount > 0" class="unread-badge">
      {{ unreadCount > 99 ? "99+" : unreadCount }}
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { mockUnreadMessages } from "../mockData.js";

const unreadCount = ref(mockUnreadMessages);

function openChat() {
  // 模擬打開聊天室
  alert(`打開聊天室 (${unreadCount.value} 條未讀消息)`);
  // 實際應用中這裡會打開聊天介面
  // 清除未讀消息數
  unreadCount.value = 0;
}
</script>

<style scoped>
.floating-chat-button {
  position: fixed;
  bottom: 80px; /* 避免與底部導航重疊 */
  right: 20px;
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  z-index: 1000;
}

.floating-chat-button:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.4);
}

.floating-chat-button:active {
  transform: scale(0.95);
}

.chat-icon {
  font-size: 24px;
  color: white;
}

.unread-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #ff4757;
  color: white;
  border-radius: 12px;
  min-width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
  border: 2px solid white;
  animation: pulse 2s infinite;
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
</style>
