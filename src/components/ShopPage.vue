<template>
  <section class="shop-page" data-aos="fade-up">
    <div class="header">
      <h2 class="title">商城</h2>
      <p class="desc">購買禮包、VIP、加值服務</p>
    </div>

    <div class="product-grid">
      <div v-for="p in products" :key="p.id" class="product-card" data-aos="zoom-in">
        <div class="badge" :class="p.tag?.toLowerCase()">{{ p.tag }}</div>
        <div class="name">{{ p.name }}</div>
        <div class="desc">{{ p.desc }}</div>
        <div class="price">${{ p.price }}</div>
        <button class="btn btn-warning w-100" @click="addToCart(p)">加入購物車</button>
      </div>
    </div>

    <div class="back-row" data-aos="fade-up">
      <button class="btn btn-outline-light w-100" @click="$emit('back-to-lobby')">回到遊戲大廳</button>
    </div>

    <!-- 購物車 / 結帳 -->
    <div class="cart-bar" v-if="cart.length > 0" data-aos="fade-up">
      <div class="cart-info">{{ cart.length }} 件・總計 ${{ totalPrice }}</div>
      <button class="btn btn-success btn-sm" data-bs-toggle="modal" data-bs-target="#checkoutModal">結帳</button>
    </div>

    <div class="modal fade" id="checkoutModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content" style="background:#111;color:#fff;border:1px solid rgba(255,255,255,0.1)">
          <div class="modal-header">
            <h5 class="modal-title">結帳</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <ul class="cart-list">
              <li v-for="(c, idx) in cart" :key="c.id" class="cart-item">
                <span>{{ c.name }}</span>
                <span>${{ c.price }}</span>
                <button class="btn btn-outline-light btn-sm" @click="removeFromCart(idx)">移除</button>
              </li>
            </ul>
            <div class="text-end fw-bold">總計：${{ totalPrice }}</div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
            <button type="button" class="btn btn-warning" data-bs-dismiss="modal" @click="pay">付款</button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getShopProducts } from '../services/api.js'

const products = ref([])
const cart = ref([])

function addToCart(p) { cart.value.push(p) }
function removeFromCart(idx) { cart.value.splice(idx, 1) }
const totalPrice = computed(() => cart.value.reduce((s, p) => s + (p.price || 0), 0))

function pay() {
  const total = totalPrice.value
  cart.value = []
  alert(`付款成功，金額 $${total}`)
}

onMounted(async () => {
  const res = await getShopProducts()
  products.value = res.products || []
})
</script>

<style scoped>
.shop-page { padding: 16px; }
.header { margin-bottom: 12px; }
.title { font-size: 20px; font-weight: 800; color: #ffd700; margin-bottom: 6px; text-shadow: 0 2px 10px rgba(0,0,0,0.35); }
.desc { color: rgba(255,255,255,0.85); }

.product-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
.product-card {
  background: linear-gradient(135deg, rgba(30,30,50,0.95), rgba(12,12,24,0.95));
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 14px; padding: 16px; color: #fff; position: relative;
  box-shadow: 0 8px 30px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.02);
}
.name { font-weight: 800; margin-bottom: 4px; }
.desc { font-size: 13px; color: rgba(255,255,255,0.85); margin-bottom: 8px; min-height: 36px; }
.price { font-weight: 800; margin-bottom: 8px; }
.badge { position: absolute; top: 10px; right: 10px; padding: 2px 8px; border-radius: 10px; font-size: 12px; font-weight: 700; color: #000; background: #ffd700; }
.badge.hot { background: #ff6b6b; color: #fff; }
.badge.new { background: #51cf66; color: #fff; }
.badge.vip { background: #845ef7; color: #fff; }
.badge.event { background: #fcc419; color: #000; }
.back-row { margin-top: 16px; }
.cart-bar { position: sticky; bottom: 10px; display: flex; justify-content: space-between; align-items: center; gap: 8px; background: rgba(0,0,0,0.6); padding: 10px 12px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); margin-top: 12px; }
.cart-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 8px; }
.cart-item { display: flex; justify-content: space-between; align-items: center; gap: 8px; padding: 8px 10px; border-radius: 10px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.06); }
</style>
