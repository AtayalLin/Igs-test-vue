<template>
  <section class="more-page" data-aos="fade-up">
    <h2 class="title">更多</h2>
    <div class="grid">
      <button class="more-card" @click="openSetting"><span>設定</span></button>
      <button class="more-card" @click="openHelp"><span>幫助中心</span></button>
      <button class="more-card" @click="openFeedback"><span>意見回饋</span></button>
    </div>

    <div class="back-row" data-aos="fade-up">
      <button class="btn btn-outline-light w-100" @click="$emit('back-to-lobby')">回到遊戲大廳</button>
    </div>
  </section>
</template>

<script setup>
function openSetting() { alert('開啟設定（示意）') }
function openHelp() { alert('開啟幫助中心（示意）') }
function openFeedback() { alert('開啟意見回饋（示意）') }
</script>

<style scoped>
.more-page { padding: 16px; }
.title { font-size: 20px; font-weight: 800; color: #ffd700; margin-bottom: 12px; text-shadow: 0 2px 10px rgba(0,0,0,0.35); }
.grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
.more-card {
  border: none; outline: none; cursor: pointer; border-radius: 14px; padding: 16px; color: #fff;
  background: linear-gradient(135deg, rgba(30,30,50,0.95), rgba(12,12,24,0.95));
  border: 1px solid rgba(255, 255, 255, 0.06);
  box-shadow: 0 8px 30px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.02);
}
.more-card span { font-weight: 700; }
</style>
