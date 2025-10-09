<template>
  <div class="notice-marquee" @click="showNoticeDetail" data-aos="fade-right" data-aos-duration="600">
    <div class="notice-icon">📢</div>
    <div class="marquee-container">
      <div class="marquee-content">
        <span
          v-for="(notice, index) in notices"
          :key="notice.id"
          class="notice-item"
        >
          {{ notice.content }}
          <span v-if="index < notices.length - 1" class="separator"> | </span>
        </span>
      </div>
      <!-- 左側漸變遮罩，防止文字與喇叭重疊 -->
      <div class="fade-mask"></div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { mockNotices } from "../mockData.js";

const notices = ref(mockNotices);

function showNoticeDetail() {
  const noticeText = notices.value.map((n) => n.content).join("\n\n");
  alert(`公告詳情：\n\n${noticeText}`);
}
</script>

<style scoped>
.notice-marquee {
  background: linear-gradient(90deg, #fff2cc 0%, #ffe066 100%);
  padding: 10px 15px;
  overflow: hidden;
  white-space: nowrap;
  box-sizing: border-box;
  cursor: pointer;
  transition: background 0.3s ease;
  display: flex;
  align-items: center;
  gap: 10px;
  border-bottom: 1px solid rgba(196, 127, 0, 0.2);
}

.notice-marquee:hover {
  background: linear-gradient(90deg, #ffe066 0%, #ffd700 100%);
}

.notice-icon {
  font-size: 16px;
  flex-shrink: 0;
  animation: bounce 2s infinite;
  z-index: 2;
  position: relative;
}

@keyframes bounce {
  0%,
  20%,
  50%,
  80%,
  100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-3px);
  }
  60% {
    transform: translateY(-2px);
  }
}

.marquee-container {
  flex: 1;
  overflow: hidden;
  position: relative;
}

.marquee-content {
  display: inline-block;
  padding-left: 100%;
  animation: marquee 15s linear infinite;
  font-weight: bold;
  color: #c47f00;
  font-size: 14px;
  white-space: nowrap;
}

.fade-mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 40px;
  height: 100%;
  background: linear-gradient(
    to right,
    #fff2cc 0%,
    #ffe066 30%,
    rgba(255, 224, 102, 0.8) 70%,
    transparent 100%
  );
  pointer-events: none;
  z-index: 1;
}

.notice-item {
  margin-right: 20px;
}

.separator {
  color: rgba(196, 127, 0, 0.6);
  margin: 0 10px;
}

@keyframes marquee {
  0% {
    transform: translateX(0%);
  }
  100% {
    transform: translateX(-100%);
  }
}

/* 響應式設計 */
@media (max-width: 480px) {
  .notice-marquee {
    padding: 8px 12px;
  }

  .notice-icon {
    font-size: 14px;
  }

  .marquee-content {
    font-size: 13px;
    animation-duration: 12s;
  }

  .fade-mask {
    width: 30px;
    background: linear-gradient(
      to right,
      #fff2cc 0%,
      #ffe066 40%,
      rgba(255, 224, 102, 0.7) 80%,
      transparent 100%
    );
  }
}
</style>
