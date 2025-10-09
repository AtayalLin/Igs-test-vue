<template>
  <section class="vip-page" data-aos="fade-up">
    <div class="header">
      <h2 class="title">會員</h2>
      <p class="desc">查看會員權益、升級進度</p>
    </div>

    <div class="vip-card" data-aos="zoom-in">
      <div class="level">VIP {{ info?.level || 1 }}</div>
      <div class="progress-wrap">
        <div class="progress">
          <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" :style="{ width: info?.progress + '%' }"></div>
        </div>
        <div class="progress-text">升級進度 {{ info?.progress || 0 }}%</div>
      </div>
    </div>

    <div class="benefits">
      <h3 class="subtitle">會員權益</h3>
      <ul class="list">
        <li v-for="(b, i) in info?.benefits || []" :key="i" data-aos="fade-up">{{ b }}</li>
      </ul>
    </div>

    <div class="back-row" data-aos="fade-up">
      <button class="btn btn-outline-light w-100" @click="$emit('back-to-lobby')">回到遊戲大廳</button>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getVipInfo } from '../services/api.js'

const info = ref(null)

onMounted(async () => {
  info.value = await getVipInfo()
})
</script>

<style scoped>
.vip-page { padding: 16px; }
.header { margin-bottom: 12px; }
.title { font-size: 20px; font-weight: 800; color: #ffd700; margin-bottom: 6px; text-shadow: 0 2px 10px rgba(0,0,0,0.35); }
.desc { color: rgba(255,255,255,0.85); }

.vip-card { background: linear-gradient(135deg, rgba(30,30,50,0.95), rgba(12,12,24,0.95)); border: 1px solid rgba(255,255,255,0.06); border-radius: 14px; padding: 16px; color: #fff; box-shadow: 0 8px 30px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.02); }
.level { font-size: 24px; font-weight: 800; margin-bottom: 8px; }
.progress-wrap { margin-top: 4px; }
.progress { height: 10px; background: rgba(255,255,255,0.12); border-radius: 6px; overflow: hidden; }
.progress-text { margin-top: 6px; color: rgba(255,255,255,0.85); font-size: 13px; }

.subtitle { font-size: 16px; font-weight: 700; color: #fff; margin: 12px 0; }
.list { display: grid; grid-template-columns: 1fr; gap: 8px; margin: 0; padding: 0; list-style: none; }
.list li { padding: 10px 12px; border-radius: 12px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.06); }
</style>
