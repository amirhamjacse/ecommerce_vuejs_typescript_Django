<script setup lang="ts">
type CartItem = {
  id: string
  name: string
  image: string
  unitPrice: number
  qty: number
}

defineProps<{
  cartItems: CartItem[]
  cartSubtotal: number
}>()

const emits = defineEmits<{
  'place-order': []
  'go-shopping': []
}>()

const formatPrice = (amount: number): string => {
  return `BDT ${Math.round(amount).toLocaleString('en-BD')}`
}
</script>

<template>
  <section class="rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-lime-50 to-emerald-50 p-6 shadow-[0_20px_60px_rgba(16,185,129,0.14)] md:p-8">
    <div class="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div>
        <p class="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">Secure Checkout</p>
        <h1 class="mt-1 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">Review and Place Order</h1>
      </div>
      <button type="button" class="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:border-emerald-400 hover:text-emerald-700" @click="emits('go-shopping')">
        Continue Shopping
      </button>
    </div>

    <div class="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
      <article class="rounded-2xl border border-white/70 bg-white/90 p-4 shadow-sm">
        <h2 class="text-sm font-semibold uppercase tracking-wide text-slate-600">Order Items</h2>
        <div v-if="!cartItems.length" class="mt-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5 text-center text-sm text-slate-600">
          Your cart is empty.
        </div>
        <div v-else class="mt-3 space-y-3">
          <div v-for="item in cartItems" :key="item.id" class="flex items-center gap-3 rounded-xl border border-slate-200 p-3">
            <img :src="item.image" :alt="item.name" class="h-14 w-14 rounded-lg object-cover" loading="lazy" />
            <div class="min-w-0 flex-1">
              <p class="line-clamp-1 text-sm font-semibold text-slate-800">{{ item.name }}</p>
              <p class="mt-1 text-xs text-slate-600">{{ formatPrice(item.unitPrice) }} x {{ item.qty }}</p>
            </div>
            <p class="text-sm font-bold text-emerald-700">{{ formatPrice(item.unitPrice * item.qty) }}</p>
          </div>
        </div>
      </article>

      <article class="rounded-2xl border border-white/70 bg-white/90 p-4 shadow-sm">
        <h2 class="text-sm font-semibold uppercase tracking-wide text-slate-600">Payment Summary</h2>
        <div class="mt-3 space-y-2 text-sm text-slate-700">
          <div class="flex items-center justify-between">
            <span>Subtotal</span>
            <span>{{ formatPrice(cartSubtotal) }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span>Shipping</span>
            <span>BDT 80</span>
          </div>
          <div class="border-t border-slate-200 pt-2">
            <div class="flex items-center justify-between text-base font-bold text-slate-900">
              <span>Total</span>
              <span>{{ formatPrice(cartSubtotal + (cartItems.length ? 80 : 0)) }}</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          class="mt-4 w-full rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
          :disabled="!cartItems.length"
          @click="emits('place-order')"
        >
          Place Order
        </button>
      </article>
    </div>
  </section>
</template>
