<template>
  <section class="guild-page" data-aos="fade-up">
    <h2 class="title">公會</h2>
    <div class="intro">加入公會，與朋友一起遊玩、參與活動、共享獎勵。</div>

    <div class="actions">
      <button class="btn btn-primary btn-sm" @click="join">加入公會</button>
      <button class="btn btn-outline-light btn-sm" @click="createGuild">建立公會</button>
    </div>

    <div class="guild-list">
      <div class="guild-card" v-for="g in guilds" :key="g.id" data-aos="fade-up">
        <div class="name">{{ g.name }}</div>
        <div class="meta">成員 {{ g.members }} ・ 活躍度 {{ g.activity }}</div>
        <button class="btn btn-warning btn-sm" data-bs-toggle="modal" data-bs-target="#guildApplyModal" @click="selectGuild(g)">申請加入</button>
      </div>
    </div>

    <div class="back-row" data-aos="fade-up">
      <button class="btn btn-outline-light w-100" @click="$emit('back-to-lobby')">回到遊戲大廳</button>
    </div>

    <!-- 申請彈窗 -->
    <div class="modal fade" id="guildApplyModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content" style="background:#111;color:#fff;border:1px solid rgba(255,255,255,0.1)">
          <div class="modal-header">
            <h5 class="modal-title">申請加入公會</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <p>是否申請加入「{{ selectedGuild?.name }}」？</p>
            <p class="text-muted">成員 {{ selectedGuild?.members }} ・ 活躍度 {{ selectedGuild?.activity }}</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
            <button type="button" class="btn btn-warning" data-bs-dismiss="modal" @click="applySelected">送出申請</button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const guilds = ref([])
const selectedGuild = ref(null)

function join() { alert('加入示例公會（示意）') }
function createGuild() { alert('建立公會（示意）') }
function selectGuild(g) { selectedGuild.value = g }
function applySelected() { if (selectedGuild.value) alert(`已送出申請至：${selectedGuild.value.name}`) }

onMounted(() => {
  guilds.value = Array.from({ length: 6 }).map((_, i) => ({
    id: `guild_${i}`,
    name: `公會 ${i + 1}`,
    members: Math.floor(Math.random() * 50) + 10,
    activity: Math.floor(Math.random() * 100),
  }))
})
</script>

<style scoped>
.guild-page { padding: 16px; }
.title { font-size: 20px; font-weight: 800; color: #ffd700; margin-bottom: 8px; text-shadow: 0 2px 10px rgba(0,0,0,0.35); }
.intro { color: rgba(255,255,255,0.85); margin-bottom: 12px; }
.actions { display: flex; gap: 8px; margin-bottom: 12px; }
.guild-list { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
.guild-card { background: linear-gradient(135deg, rgba(30,30,50,0.95), rgba(12,12,24,0.95)); border: 1px solid rgba(255,255,255,0.06); border-radius: 14px; padding: 12px; color: #fff; box-shadow: 0 8px 30px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.02); display: flex; flex-direction: column; gap: 6px; }
.name { font-weight: 800; }
.meta { font-size: 12px; color: rgba(255,255,255,0.85); }
</style>
