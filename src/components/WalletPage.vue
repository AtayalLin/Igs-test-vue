<template>
  <section class="wallet-page" data-aos="fade-up">
    <div class="wallet-header">
      <h2 class="title">錢包</h2>
      <div class="balance-card">
        <div class="label">目前餘額</div>
        <div class="amount">${{ wallet?.balance?.toFixed(2) || '0.00' }}</div>
        <div class="meta">{{ wallet?.currency || 'TWD' }} ・ 更新於 {{ formatTime(wallet?.lastUpdate) }}</div>
        <button class="btn btn-sm btn-outline-light mt-2" @click="refresh">更新餘額</button>
      </div>
    </div>

    <div class="tx-section">
      <h3 class="subtitle">近期交易</h3>
      <div class="tx-list">
        <div v-for="item in transactions" :key="item.id" class="tx-item" :class="item.type">
          <div class="tx-left">
            <div class="tx-type">
              <span v-if="item.type==='deposit'">儲值</span>
              <span v-else-if="item.type==='withdraw'">提領</span>
              <span v-else>獎勵</span>
            </div>
            <div class="tx-note">{{ item.note }}</div>
          </div>
          <div class="tx-right">
            <div class="tx-amount" :class="{ plus: item.amount > 0, minus: item.amount < 0 }">
              {{ item.amount > 0 ? '+' : '' }}{{ item.amount.toFixed(2) }}
            </div>
            <div class="tx-time">{{ formatTime(item.time) }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="back-row" data-aos="fade-up">
      <button class="btn btn-outline-light w-100" @click="$emit('back-to-lobby')">回到遊戲大廳</button>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getWalletInfo, getWalletTransactions } from '../services/api.js'

const wallet = ref(null)
const transactions = ref([])

function formatTime(iso) {
  if (!iso) return '-'
  const d = new Date(iso)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hh = String(d.getHours()).padStart(2, '0')
  const mm = String(d.getMinutes()).padStart(2, '0')
  return `${y}/${m}/${day} ${hh}:${mm}`
}

async function refresh() {
  wallet.value = await getWalletInfo()
}

onMounted(async () => {
  wallet.value = await getWalletInfo()
  const res = await getWalletTransactions()
  transactions.value = res.items || []
})
</script>

<style scoped>
.wallet-page { padding: 16px; }
.title { font-size: 20px; font-weight: 800; color: #ffd700; margin-bottom: 12px; text-shadow: 0 2px 10px rgba(0,0,0,0.35); }
.subtitle { font-size: 16px; font-weight: 700; color: #fff; margin: 12px 0; }
.balance-card {
  background: linear-gradient(135deg, rgba(30,30,50,0.95), rgba(12,12,24,0.95));
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 14px; padding: 16px; color: #fff;
  box-shadow: 0 8px 30px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.02);
}
.balance-card .label { color: rgba(255,255,255,0.7); font-size: 12px; }
.balance-card .amount { font-size: 28px; font-weight: 800; margin-top: 4px; }
.balance-card .meta { color: rgba(255,255,255,0.7); font-size: 12px; margin-top: 4px; }

.tx-list { display: flex; flex-direction: column; gap: 8px; }
.tx-item { display: flex; justify-content: space-between; align-items: center; border-radius: 12px; padding: 12px 14px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.06); }
.tx-left { display: flex; flex-direction: column; }
.tx-type { font-weight: 700; color: #fff; }
.tx-note { color: rgba(255,255,255,0.85); font-size: 13px; }
.tx-right { text-align: right; }
.tx-amount { font-weight: 800; }
.tx-amount.plus { color: #43e97b; }
.tx-amount.minus { color: #ff6b6b; }
.tx-time { color: rgba(255,255,255,0.7); font-size: 12px; }
.back-row { margin-top: 16px; }
</style>
