<script setup lang="ts">
import { computed, ref } from 'vue'

type CartItem = {
  id: string
  name: string
  image: string
  unitPrice: number
  qty: number
}

const props = defineProps<{
  cartItems: CartItem[]
  cartSubtotal: number
}>()

const emits = defineEmits<{
  'place-order': []
  'go-shopping': []
}>()

const shippingFee = 80

type CheckoutCoupon = {
  code: string
  type: 'percent' | 'flat'
  value: number
  label: string
}

const couponInput = ref('')
const couponError = ref('')
const appliedCoupon = ref<CheckoutCoupon | null>(null)
const supportedCoupons: CheckoutCoupon[] = [
  { code: 'SAVE10', type: 'percent', value: 10, label: '10% off order subtotal' },
  { code: 'FLAT100', type: 'flat', value: 100, label: 'BDT 100 off order subtotal' },
  { code: 'WELCOME50', type: 'flat', value: 50, label: 'BDT 50 off order subtotal' },
]

const invoiceId = ref(`INV-WEB-${Date.now().toString().slice(-6)}`)

const discountAmount = computed(() => {
  if (!appliedCoupon.value) return 0
  if (appliedCoupon.value.type === 'percent') {
    return (props.cartSubtotal * appliedCoupon.value.value) / 100
  }
  return Math.min(appliedCoupon.value.value, props.cartSubtotal)
})

const payableTotal = computed(() => {
  if (!props.cartItems.length) return 0
  return Math.max(0, props.cartSubtotal + shippingFee - discountAmount.value)
})

const applyCoupon = () => {
  const normalizedCode = couponInput.value.trim().toUpperCase()
  if (!normalizedCode) {
    couponError.value = 'Enter a coupon code first.'
    appliedCoupon.value = null
    return
  }

  const matched = supportedCoupons.find((coupon) => coupon.code === normalizedCode)
  if (!matched) {
    couponError.value = 'Invalid coupon code.'
    appliedCoupon.value = null
    return
  }

  appliedCoupon.value = matched
  couponInput.value = matched.code
  couponError.value = ''
}

const removeCoupon = () => {
  appliedCoupon.value = null
  couponInput.value = ''
  couponError.value = ''
}

const formatPrice = (amount: number): string => {
  return `BDT ${Math.round(amount).toLocaleString('en-BD')}`
}

const getInvoiceTimestamp = () => {
  return new Date().toLocaleString('en-BD', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

const escapeHtml = (value: string) => {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

const buildCheckoutInvoiceText = () => {
  const lines = [
    `Invoice: ${invoiceId.value}`,
    `Created: ${getInvoiceTimestamp()}`,
    'Channel: Web Checkout',
    '',
    'Items:',
    ...props.cartItems.map((item, index) => {
      return `${index + 1}. ${item.name} | ${item.qty} x ${formatPrice(item.unitPrice)} = ${formatPrice(item.qty * item.unitPrice)}`
    }),
    '',
    `Subtotal: ${formatPrice(props.cartSubtotal)}`,
    `Shipping: ${formatPrice(props.cartItems.length ? shippingFee : 0)}`,
    `Coupon: ${appliedCoupon.value?.code ?? 'None'}`,
    `Discount: ${formatPrice(discountAmount.value)}`,
    `Total Payable: ${formatPrice(payableTotal.value)}`,
  ]

  return lines.join('\n')
}

const viewCheckoutInvoice = () => {
  if (typeof window === 'undefined') return

  const invoiceText = buildCheckoutInvoiceText()
  const popup = window.open('', '_blank', 'noopener,noreferrer,width=820,height=720')
  if (!popup) return

  popup.document.write(`
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>${escapeHtml(invoiceId.value)}</title>
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; margin: 24px; color: #0f172a; }
          h1 { margin: 0 0 12px; font-size: 20px; }
          pre { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px; white-space: pre-wrap; }
        </style>
      </head>
      <body>
        <h1>Checkout Invoice</h1>
        <pre>${escapeHtml(invoiceText)}</pre>
      </body>
    </html>
  `)
  popup.document.close()
}

const downloadCheckoutInvoice = () => {
  if (typeof window === 'undefined') return

  const invoiceText = buildCheckoutInvoiceText()
  const blob = new Blob([invoiceText], { type: 'text/plain;charset=utf-8' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `${invoiceId.value}.txt`
  link.click()
  URL.revokeObjectURL(link.href)
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
        <div v-if="!props.cartItems.length" class="mt-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5 text-center text-sm text-slate-600">
          Your cart is empty.
        </div>
        <div v-else class="mt-3 space-y-3">
          <div v-for="item in props.cartItems" :key="item.id" class="flex items-center gap-3 rounded-xl border border-slate-200 p-3">
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
            <span>{{ formatPrice(props.cartSubtotal) }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span>Shipping</span>
            <span>{{ formatPrice(props.cartItems.length ? shippingFee : 0) }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span>Coupon Discount</span>
            <span>-{{ formatPrice(discountAmount) }}</span>
          </div>
          <div class="border-t border-slate-200 pt-2">
            <div class="flex items-center justify-between text-base font-bold text-slate-900">
              <span>Total</span>
              <span>{{ formatPrice(payableTotal) }}</span>
            </div>
          </div>
        </div>

        <div class="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
          <p class="text-xs font-semibold uppercase tracking-wide text-slate-600">Coupon Code</p>
          <div class="mt-2 flex flex-wrap gap-2">
            <input
              v-model="couponInput"
              type="text"
              placeholder="SAVE10 / FLAT100 / WELCOME50"
              class="min-w-[170px] flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs uppercase tracking-wide text-slate-700 outline-none ring-emerald-300/60 focus:ring-2"
            />
            <button type="button" class="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-700" @click="applyCoupon">Apply</button>
            <button type="button" class="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 hover:border-slate-400" @click="removeCoupon">Remove</button>
          </div>
          <p v-if="appliedCoupon" class="mt-2 text-xs font-medium text-emerald-700">Applied: {{ appliedCoupon.code }} ({{ appliedCoupon.label }})</p>
          <p v-else-if="couponError" class="mt-2 text-xs font-medium text-rose-600">{{ couponError }}</p>
        </div>

        <div class="mt-4 rounded-xl border border-slate-200 bg-white p-3">
          <p class="text-xs font-semibold uppercase tracking-wide text-slate-600">Invoice Preview</p>
          <div class="mt-2 space-y-1 text-xs text-slate-700">
            <div class="flex items-center justify-between"><span>Invoice No</span><span class="font-semibold text-slate-900">{{ invoiceId }}</span></div>
            <div class="flex items-center justify-between"><span>Items</span><span>{{ props.cartItems.length }}</span></div>
            <div class="flex items-center justify-between"><span>Coupon</span><span>{{ appliedCoupon?.code ?? 'None' }}</span></div>
            <div class="flex items-center justify-between"><span>Final Amount</span><span class="font-semibold text-slate-900">{{ formatPrice(payableTotal) }}</span></div>
          </div>
          <div class="mt-3 flex flex-wrap gap-2">
            <button type="button" class="rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:border-emerald-400" @click="viewCheckoutInvoice">View Invoice</button>
            <button type="button" class="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-slate-400" @click="downloadCheckoutInvoice">Download Invoice</button>
          </div>
        </div>

        <button
          type="button"
          class="mt-4 w-full rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
          :disabled="!props.cartItems.length"
          @click="emits('place-order')"
        >
          Place Order
        </button>
      </article>
    </div>
  </section>
</template>
