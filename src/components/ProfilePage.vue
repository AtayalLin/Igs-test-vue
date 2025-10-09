<template>
  <section class="profile-page" data-aos="fade-up">
    <div class="header">
      <img :src="user.avatarUrl" class="avatar" alt="avatar" />
      <div class="info">
        <div class="name">{{ user.nickname }}</div>
        <div class="vip">VIP {{ user.vipLevel }}</div>
        <div class="balance">餘額 ${{ balance.toFixed(2) }}</div>
      </div>
    </div>

    <div class="actions">
      <button class="btn btn-warning btn-sm" @click="$emit('goto-wallet')">前往錢包</button>
      <button class="btn btn-outline-light btn-sm" @click="$emit('goto-vip')">查看 VIP</button>
    </div>

    <div class="back-row" data-aos="fade-up">
      <button class="btn btn-outline-light w-100" @click="$emit('back-to-lobby')">回到遊戲大廳</button>
    </div>
  </section>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useUserStore } from '../stores/useUserStore.js'

const userStore = useUserStore()
const { user, balance } = storeToRefs(userStore)
</script>

<style scoped>
.profile-page { padding: 16px; color: #fff; }
.header { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
.avatar { width: 64px; height: 64px; border-radius: 50%; border: 3px solid #ffd700; }
.info .name { font-size: 18px; font-weight: 800; }
.info .vip { color: #ffd700; font-weight: 700; }
.info .balance { color: #43e97b; font-weight: 800; }
.actions { display: flex; gap: 8px; margin-bottom: 12px; }
.back-row { margin-top: 16px; }
</style>
