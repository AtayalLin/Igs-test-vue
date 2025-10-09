<template>
  <section class="gifts-page" data-aos="fade-up">
    <h2 class="title">贈禮</h2>
    <div class="grid">
      <div class="gift-card" v-for="g in gifts" :key="g.id" data-aos="zoom-in">
        <div class="gift-upper">
          <div class="gift-icon">🎁</div>
          <div class="gift-info">
            <div class="name">{{ g.name }}</div>
            <div class="desc">{{ g.desc }}</div>
          </div>
        </div>
        <div class="gift-lower">
          <div class="qty">
            <button class="btn btn-sm btn-outline-light" @click="dec(g)">-</button>
            <span class="qv">{{ g.qty }}</span>
            <button class="btn btn-sm btn-outline-light" @click="inc(g)">+</button>
          </div>
          <div class="price">${{ g.price * g.qty }}</div>
        </div>
        <button class="btn btn-warning w-100 mt-2" data-bs-toggle="modal" data-bs-target="#giftConfirmModal" @click="select(g)">贈送</button>
      </div>
    </div>

    <div class="summary" v-if="totalQty > 0">
      共 {{ totalQty }} 件 ・ 小計 ${{ totalPrice }}
    </div>

    <div class="back-row" data-aos="fade-up">
      <button class="btn btn-outline-light w-100" @click="$emit('back-to-lobby')">回到遊戲大廳</button>
    </div>

    <!-- 確認送出 Modal -->
    <div class="modal fade" id="giftConfirmModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content" style="background:#111;color:#fff;border:1px solid rgba(255,255,255,0.1)">
          <div class="modal-header">
            <h5 class="modal-title">確認贈送</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            是否贈送「{{ selected?.name }}」x {{ selected?.qty }}？
            <div class="text-muted mt-2">總額：${{ (selected?.price || 0) * (selected?.qty || 0) }}</div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
            <button type="button" class="btn btn-warning" data-bs-dismiss="modal" @click="confirmSend">送出</button>
          </div>
        </div>
      </div>
    </div>
  </section>
  
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const gifts = ref([])
const selected = ref(null)

function inc(g) { g.qty = Math.min(99, (g.qty || 0) + 1) }
function dec(g) { g.qty = Math.max(1, (g.qty || 1) - 1) }
function select(g) { selected.value = g }
function confirmSend() {
  if (!selected.value) return
  alert(`已贈送：${selected.value.name} x ${selected.value.qty}`)
}

const totalQty = computed(() => gifts.value.reduce((s,g)=> s + (g.qty||0), 0))
const totalPrice = computed(() => gifts.value.reduce((s,g)=> s + (g.price||0)*(g.qty||0), 0))

onMounted(() => {
  gifts.value = [
    { id: 'g1', name: '小禮包', desc: '送朋友的小確幸', price: 99, qty: 1 },
    { id: 'g2', name: '豪華禮包', desc: '特別的驚喜', price: 199, qty: 1 },
    { id: 'g3', name: '節日禮物', desc: '佳節限定', price: 149, qty: 1 },
  ]
})
</script>

<style scoped>
.gifts-page { padding: 16px; }
.title { font-size: 20px; font-weight: 800; color: #ffd700; margin-bottom: 12px; text-shadow: 0 2px 10px rgba(0,0,0,0.35); }
.grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
.gift-card { background: linear-gradient(135deg, rgba(30,30,50,0.95), rgba(12,12,24,0.95)); border: 1px solid rgba(255,255,255,0.06); border-radius: 14px; padding: 12px; color: #fff; box-shadow: 0 8px 30px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.02); display: flex; flex-direction: column; gap: 8px; }
.gift-upper { display: flex; gap: 10px; align-items: center; }
.gift-icon { font-size: 28px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.4)); }
.gift-info .name { font-weight: 800; }
.gift-info .desc { font-size: 12px; color: rgba(255,255,255,0.85); min-height: 20px; }
.gift-lower { display: flex; align-items: center; justify-content: space-between; }
.qty { display: flex; align-items: center; gap: 8px; }
.qv { min-width: 24px; text-align: center; font-weight: 700; }
.price { font-weight: 800; color: #ffd700; }
.summary { margin-top: 12px; color: rgba(255,255,255,0.9); font-weight: 700; }
.back-row { margin-top: 16px; }
</style>
