<template>
  <section class="ranking-page" data-aos="fade-up">
    <h2 class="title">排行榜</h2>
    <ol class="list">
      <li v-for="(r, i) in ranks" :key="r.id" class="item" data-aos="fade-up">
        <span class="no">#{{ i + 1 }}</span>
        <img :src="r.avatar" class="avatar" alt="avatar" />
        <span class="name">{{ r.name }}</span>
        <span class="score">{{ r.score.toLocaleString() }}</span>
      </li>
    </ol>

    <div class="back-row" data-aos="fade-up">
      <button
        class="btn btn-outline-light w-100"
        @click="$emit('back-to-lobby')"
      >
        回到遊戲大廳
      </button>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from "vue";

const ranks = ref([]);

onMounted(() => {
  ranks.value = Array.from({ length: 10 })
    .map((_, i) => ({
      id: `u_${i}`,
      name: `玩家 ${i + 1}`,
      score: Math.floor(Math.random() * 100000) + 1000,
      avatar: `https://i.pravatar.cc/48?img=${(i % 70) + 1}`,
    }))
    .sort((a, b) => b.score - a.score);
});
</script>

<style scoped>
.ranking-page {
  padding: 16px;
}
.title {
  font-size: 20px;
  font-weight: 800;
  color: #ffd700;
  margin-bottom: 12px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.35);
}
.list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.item {
  display: grid;
  grid-template-columns: 40px 40px 1fr auto;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  padding: 8px 12px;
}
.no {
  font-weight: 800;
  color: #fff;
}
.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 2px solid #ffd700;
}
.name {
  color: #fff;
  font-weight: 700;
}
.score {
  color: #43e97b;
  font-weight: 800;
}
</style>
