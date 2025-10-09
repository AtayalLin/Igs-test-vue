<template>
  <section class="settings-page" data-aos="fade-up">
    <h2 class="title">設定</h2>

    <div class="card">
      <div class="row">
        <label class="form-label">音效</label>
        <div class="form-check form-switch">
          <input class="form-check-input" type="checkbox" v-model="soundOn" />
          <span class="form-text">{{ soundOn ? '開啟' : '關閉' }}</span>
        </div>
      </div>
      <div class="row">
        <label class="form-label">推播通知</label>
        <div class="form-check form-switch">
          <input class="form-check-input" type="checkbox" v-model="notifyOn" />
          <span class="form-text">{{ notifyOn ? '開啟' : '關閉' }}</span>
        </div>
      </div>
    </div>

    <div class="back-row" data-aos="fade-up">
      <button class="btn btn-outline-light w-100" @click="$emit('back-to-lobby')">回到遊戲大廳</button>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'

const soundOn = ref(true)
const notifyOn = ref(true)
</script>

<style scoped>
.settings-page { padding: 16px; color: #fff; }
.title { font-size: 20px; font-weight: 800; color: #ffd700; margin-bottom: 12px; text-shadow: 0 2px 10px rgba(0,0,0,0.35); }
.card { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.06); border-radius: 14px; padding: 16px; display: flex; flex-direction: column; gap: 12px; }
.row { display: flex; align-items: center; justify-content: space-between; }
.form-label { font-weight: 700; }
.form-text { margin-left: 8px; }
.back-row { margin-top: 16px; }
</style>
