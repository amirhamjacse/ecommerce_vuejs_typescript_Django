<script setup lang="ts">
import { computed, ref } from 'vue'
import { downloadInvoicePdf } from '@/utils/invoicePdf'

type UserRole = 'customer' | 'admin'

type UserSession = {
  name: string
  email: string
  role: UserRole
}

type DashboardSection = 'overview' | 'orders' | 'products' | 'customers' | 'inventory' | 'pos'
type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'

type OrderItem = {
  id: string
  customer: string
  total: number
  status: OrderStatus
  placedAt: string
}

type ProductItem = {
  id: string
  name: string
  category: string
  price: number
  stock: number
  featured: boolean
}

type CustomerItem = {
  id: string
  name: string
  email: string
  orders: number
  spend: number
}

type PosCartItem = {
  id: string
  name: string
  unitPrice: number
  qty: number
}

type PosReceiptLineItem = {
  id: string
  name: string
  unitPrice: number
  qty: number
}

type PosReceipt = {
  id: string
  invoiceId: string
  items: number
  total: number
  discount: number
  couponCode: string | null
  paymentMethod: 'cash' | 'card' | 'mobile-banking'
  lines: PosReceiptLineItem[]
  createdAt: string
}

type PosCouponRule = {
  code: string
  label: string
  type: 'percent' | 'flat'
  value: number
}

defineProps<{
  currentUser: UserSession | null
  isAdminUser: boolean
}>()

const emits = defineEmits<{
  'go-login': []
  'go-main-site': []
  'go-profile': []
  logout: []
}>()

const activeSection = ref<DashboardSection>('overview')
const isSidebarCollapsed = ref(false)
const isNotificationsOpen = ref(false)
const orderSearch = ref('')
const orderFilter = ref<OrderStatus | 'all'>('all')
const productSearch = ref('')
const customerSearch = ref('')
const posSearch = ref('')
const newProductName = ref('')
const newProductCategory = ref('Groceries')
const newProductPrice = ref('')
const newProductStock = ref('')
const posDiscount = ref(0)
const posCouponCode = ref('')
const posCouponError = ref('')
const posAppliedCoupon = ref<PosCouponRule | null>(null)
const posTaxRate = ref(0.05)
const posPaymentMethod = ref<'cash' | 'card' | 'mobile-banking'>('cash')
const posCart = ref<PosCartItem[]>([])
const posReceipts = ref<PosReceipt[]>([
  {
    id: 'POS-1007',
    invoiceId: 'INV-1007',
    items: 4,
    total: 1420,
    discount: 80,
    couponCode: 'SAVE10',
    paymentMethod: 'card',
    lines: [
      { id: 'PRD-101', name: 'Deshi Mustard Oil 1L', unitPrice: 265, qty: 2 },
      { id: 'PRD-102', name: 'Chinigura Rice 5kg', unitPrice: 620, qty: 1 },
      { id: 'PRD-103', name: 'Sundarban Honey 500g', unitPrice: 860, qty: 1 },
    ],
    createdAt: 'Today, 2:25 PM',
  },
  {
    id: 'POS-1006',
    invoiceId: 'INV-1006',
    items: 3,
    total: 960,
    discount: 0,
    couponCode: null,
    paymentMethod: 'cash',
    lines: [
      { id: 'PRD-101', name: 'Deshi Mustard Oil 1L', unitPrice: 265, qty: 1 },
      { id: 'PRD-102', name: 'Chinigura Rice 5kg', unitPrice: 620, qty: 1 },
    ],
    createdAt: 'Today, 1:58 PM',
  },
])
const activePosInvoice = ref<PosReceipt | null>(null)

const posCouponRules: PosCouponRule[] = [
  { code: 'SAVE10', label: '10% off', type: 'percent', value: 10 },
  { code: 'FLAT100', label: 'BDT 100 off', type: 'flat', value: 100 },
  { code: 'WELCOME50', label: 'BDT 50 off', type: 'flat', value: 50 },
]

const sections: Array<{ key: DashboardSection; label: string; icon: string }> = [
  { key: 'overview', label: 'Overview', icon: 'M3 13h8V3H3v10zM13 21h8v-6h-8v6zM13 11h8V3h-8v8zM3 21h8v-6H3v6z' },
  { key: 'orders', label: 'Orders', icon: 'M6 2h9l5 5v15a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm8 1.5V8h4.5' },
  { key: 'products', label: 'Products', icon: 'M12 2 3 7l9 5 9-5-9-5zm0 9-9-5v11l9 5 9-5V6l-9 5z' },
  { key: 'customers', label: 'Customers', icon: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2m20 0v-2a4 4 0 0 0-3-3.87M9 7a4 4 0 1 0 0.001-7.999A4 4 0 0 0 9 7zm12 4a4 4 0 1 0 0.001-7.999A4 4 0 0 0 21 11z' },
  { key: 'inventory', label: 'Inventory', icon: 'M20 7 12 3 4 7m16 0v10l-8 4-8-4V7m16 0-8 4-8-4' },
  { key: 'pos', label: 'Point of Sale', icon: 'M3 5h18v14H3zM7 19h10M8 9h.01M12 9h.01M16 9h.01M8 13h8' },
]

const orders = ref<OrderItem[]>([
  { id: 'ORD-2391', customer: 'Rahim Store', total: 3200, status: 'processing', placedAt: 'Today, 10:12 AM' },
  { id: 'ORD-2390', customer: 'Green Basket', total: 1780, status: 'pending', placedAt: 'Today, 9:40 AM' },
  { id: 'ORD-2389', customer: 'Noor Mart', total: 5980, status: 'shipped', placedAt: 'Yesterday, 6:20 PM' },
  { id: 'ORD-2388', customer: 'Daily Buy', total: 1120, status: 'delivered', placedAt: 'Yesterday, 2:05 PM' },
  { id: 'ORD-2387', customer: 'Sunrise Retail', total: 840, status: 'cancelled', placedAt: 'Yesterday, 11:50 AM' },
])

const products = ref<ProductItem[]>([
  { id: 'PRD-101', name: 'Deshi Mustard Oil 1L', category: 'Groceries', price: 265, stock: 58, featured: true },
  { id: 'PRD-102', name: 'Chinigura Rice 5kg', category: 'Groceries', price: 620, stock: 23, featured: true },
  { id: 'PRD-103', name: 'Sundarban Honey 500g', category: 'Organic', price: 860, stock: 9, featured: false },
  { id: 'PRD-104', name: 'Premium Dates 1kg', category: 'Dry Food', price: 1290, stock: 5, featured: false },
  { id: 'PRD-105', name: 'Gawa Ghee 1kg', category: 'Dairy', price: 1710, stock: 14, featured: true },
])

const customers = ref<CustomerItem[]>([
  { id: 'CUS-01', name: 'Rahim Ahmed', email: 'rahim@store.com', orders: 18, spend: 28600 },
  { id: 'CUS-02', name: 'Nusrat Jahan', email: 'nusrat@greenbasket.com', orders: 11, spend: 17400 },
  { id: 'CUS-03', name: 'Imran Hossain', email: 'imran@dailybuy.com', orders: 8, spend: 10820 },
  { id: 'CUS-04', name: 'Fatema Akter', email: 'fatema@shop.com', orders: 22, spend: 35210 },
])

const notifications = ref([
  { id: 'n1', title: 'Low stock alert', detail: 'Premium Dates 1kg has only 5 left.', time: '5m ago', read: false },
  { id: 'n2', title: 'New order received', detail: 'ORD-2392 was placed by FreshMart.', time: '12m ago', read: false },
  { id: 'n3', title: 'Payment settled', detail: '3 transactions settled successfully.', time: '28m ago', read: true },
])

const unreadNotifications = computed(() => notifications.value.filter((item) => !item.read).length)

const markAllNotificationsRead = () => {
  notifications.value = notifications.value.map((item) => ({ ...item, read: true }))
}

const formatMoney = (amount: number) => `BDT ${Math.round(amount).toLocaleString('en-BD')}`

const orderBadgeClass = (status: OrderStatus) => {
  if (status === 'delivered') return 'bg-emerald-100 text-emerald-700 border-emerald-200'
  if (status === 'processing') return 'bg-sky-100 text-sky-700 border-sky-200'
  if (status === 'shipped') return 'bg-indigo-100 text-indigo-700 border-indigo-200'
  if (status === 'cancelled') return 'bg-rose-100 text-rose-700 border-rose-200'
  return 'bg-amber-100 text-amber-700 border-amber-200'
}

const filteredOrders = computed(() => {
  return orders.value.filter((order) => {
    const matchStatus = orderFilter.value === 'all' || order.status === orderFilter.value
    const query = orderSearch.value.trim().toLowerCase()
    const matchSearch = !query || order.id.toLowerCase().includes(query) || order.customer.toLowerCase().includes(query)
    return matchStatus && matchSearch
  })
})

const filteredProducts = computed(() => {
  const query = productSearch.value.trim().toLowerCase()
  if (!query) return products.value
  return products.value.filter((product) => {
    return product.name.toLowerCase().includes(query) || product.category.toLowerCase().includes(query)
  })
})

const filteredCustomers = computed(() => {
  const query = customerSearch.value.trim().toLowerCase()
  if (!query) return customers.value
  return customers.value.filter((customer) => {
    return customer.name.toLowerCase().includes(query) || customer.email.toLowerCase().includes(query)
  })
})

const filteredPosProducts = computed(() => {
  const query = posSearch.value.trim().toLowerCase()
  const availableProducts = products.value.filter((item) => item.stock > 0)
  if (!query) return availableProducts
  return availableProducts.filter((item) => {
    return item.name.toLowerCase().includes(query) || item.category.toLowerCase().includes(query)
  })
})

const totalRevenue = computed(() => orders.value.reduce((sum, order) => sum + order.total, 0))
const pendingOrders = computed(() => orders.value.filter((o) => o.status === 'pending' || o.status === 'processing').length)
const lowStockProducts = computed(() => products.value.filter((p) => p.stock <= 10).length)
const averageOrderValue = computed(() => (orders.value.length ? totalRevenue.value / orders.value.length : 0))

const weeklyRevenueSeries = [42000, 56000, 47000, 69000, 62000, 73000, 81000]
const weeklyLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const revenueMax = computed(() => {
  return Math.max(...weeklyRevenueSeries)
})

const revenueBars = computed(() => {
  return weeklyRevenueSeries.map((amount, index) => {
    const height = Math.max(8, Math.round((amount / revenueMax.value) * 100))
    return {
      label: weeklyLabels[index],
      amount,
      height,
    }
  })
})

const orderStatusSummary = computed(() => {
  const groups = {
    pending: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
  }

  orders.value.forEach((order) => {
    groups[order.status] += 1
  })

  const total = Math.max(1, orders.value.length)

  return [
    { label: 'Delivered', count: groups.delivered, color: 'bg-emerald-500', width: Math.round((groups.delivered / total) * 100) },
    { label: 'Processing', count: groups.processing, color: 'bg-sky-500', width: Math.round((groups.processing / total) * 100) },
    { label: 'Pending', count: groups.pending, color: 'bg-amber-500', width: Math.round((groups.pending / total) * 100) },
    { label: 'Shipped', count: groups.shipped, color: 'bg-indigo-500', width: Math.round((groups.shipped / total) * 100) },
    { label: 'Cancelled', count: groups.cancelled, color: 'bg-rose-500', width: Math.round((groups.cancelled / total) * 100) },
  ]
})

const ordersTrendSeries = [12, 18, 16, 21, 24, 26, 31]
const trendPoints = computed(() => {
  const width = 320
  const height = 120
  const max = Math.max(...ordersTrendSeries)
  const stepX = width / (ordersTrendSeries.length - 1)

  return ordersTrendSeries
    .map((value, index) => {
      const x = Math.round(index * stepX)
      const y = Math.round(height - (value / max) * height)
      return `${x},${y}`
    })
    .join(' ')
})

const categorySales = [
  { label: 'Groceries', amount: 148000 },
  { label: 'Organic', amount: 76000 },
  { label: 'Dairy', amount: 95000 },
  { label: 'Dry Food', amount: 64000 },
  { label: 'Beverage', amount: 59000 },
]

const categoryMax = computed(() => {
  return Math.max(...categorySales.map((item) => item.amount))
})

const categoryBars = computed(() => {
  return categorySales.map((item) => ({
    ...item,
    height: Math.max(10, Math.round((item.amount / categoryMax.value) * 100)),
  }))
})

const pieColors = ['#10b981', '#0ea5e9', '#f59e0b', '#6366f1', '#f43f5e']

const polarToCartesian = (cx: number, cy: number, r: number, angle: number) => {
  const rad = ((angle - 90) * Math.PI) / 180
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  }
}

const describePieSlice = (cx: number, cy: number, r: number, start: number, end: number) => {
  const startPoint = polarToCartesian(cx, cy, r, end)
  const endPoint = polarToCartesian(cx, cy, r, start)
  const largeArc = end - start <= 180 ? '0' : '1'
  return `M ${cx} ${cy} L ${startPoint.x} ${startPoint.y} A ${r} ${r} 0 ${largeArc} 0 ${endPoint.x} ${endPoint.y} Z`
}

const pieSlices = computed(() => {
  const total = Math.max(1, orderStatusSummary.value.reduce((sum, item) => sum + item.count, 0))
  let currentAngle = 0

  return orderStatusSummary.value.map((item, index) => {
    const angle = (item.count / total) * 360
    const slice = {
      ...item,
      colorHex: pieColors[index % pieColors.length],
      path: describePieSlice(80, 80, 65, currentAngle, currentAngle + angle),
    }
    currentAngle += angle
    return slice
  })
})

const scatterPoints = [
  { label: 'Ads A', x: 40, y: 78 },
  { label: 'Ads B', x: 58, y: 64 },
  { label: 'Ads C', x: 72, y: 48 },
  { label: 'Ads D', x: 83, y: 37 },
  { label: 'Ads E', x: 55, y: 58 },
  { label: 'Ads F', x: 68, y: 43 },
]

const histogramBins = computed(() => {
  const values = orders.value.map((order) => order.total)
  const min = Math.min(...values)
  const max = Math.max(...values)
  const binCount = 5
  const binSize = Math.max(1, Math.ceil((max - min + 1) / binCount))

  const bins = Array.from({ length: binCount }, (_, index) => {
    const start = min + index * binSize
    const end = start + binSize - 1
    return { label: `${start}-${end}`, count: 0 }
  })

  values.forEach((value) => {
    const idx = Math.min(Math.floor((value - min) / binSize), binCount - 1)
    bins[idx]!.count += 1
  })

  const maxCount = Math.max(...bins.map((bin) => bin.count), 1)

  return bins.map((bin) => ({
    ...bin,
    height: Math.max(10, Math.round((bin.count / maxCount) * 100)),
  }))
})

const posItemsCount = computed(() => {
  return posCart.value.reduce((total, item) => total + item.qty, 0)
})

const posSubtotal = computed(() => {
  return posCart.value.reduce((total, item) => total + item.unitPrice * item.qty, 0)
})

const posTaxAmount = computed(() => {
  return posSubtotal.value * posTaxRate.value
})

const posManualDiscountAmount = computed(() => {
  return Math.max(0, Math.min(posDiscount.value, posSubtotal.value))
})

const posCouponDiscount = computed(() => {
  const coupon = posAppliedCoupon.value
  if (!coupon) return 0
  if (coupon.type === 'percent') {
    return (posSubtotal.value * coupon.value) / 100
  }
  return coupon.value
})

const posDiscountAmount = computed(() => {
  return Math.max(0, Math.min(posManualDiscountAmount.value + posCouponDiscount.value, posSubtotal.value))
})

const posGrandTotal = computed(() => {
  return Math.max(0, posSubtotal.value + posTaxAmount.value - posDiscountAmount.value)
})

const posInvoicePreviewId = computed(() => {
  return `INV-${1000 + posReceipts.value.length + 1}`
})

const posInvoicePreviewTimestamp = computed(() => {
  return new Date().toLocaleString('en-BD', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
})

const setOrderStatus = (orderId: string, status: OrderStatus) => {
  const target = orders.value.find((order) => order.id === orderId)
  if (!target) return
  target.status = status
}

const handleOrderStatusChange = (orderId: string, event: Event) => {
  const target = event.target as HTMLSelectElement | null
  if (!target) return
  setOrderStatus(orderId, target.value as OrderStatus)
}

const toggleFeatured = (productId: string) => {
  const target = products.value.find((product) => product.id === productId)
  if (!target) return
  target.featured = !target.featured
}

const addStock = (productId: string, amount = 5) => {
  const target = products.value.find((product) => product.id === productId)
  if (!target) return
  target.stock += amount
}

const addProduct = () => {
  const name = newProductName.value.trim()
  const category = newProductCategory.value.trim()
  const price = Number(newProductPrice.value)
  const stock = Number(newProductStock.value)

  if (!name || !category || !Number.isFinite(price) || !Number.isFinite(stock)) return

  const productId = `PRD-${100 + products.value.length + 1}`
  products.value.unshift({
    id: productId,
    name,
    category,
    price,
    stock,
    featured: false,
  })

  newProductName.value = ''
  newProductCategory.value = 'Groceries'
  newProductPrice.value = ''
  newProductStock.value = ''
}

const addToPosCart = (product: ProductItem) => {
  if (product.stock <= 0) return

  const existing = posCart.value.find((item) => item.id === product.id)
  if (existing) {
    if (existing.qty < product.stock) {
      existing.qty += 1
    }
    return
  }

  posCart.value.unshift({
    id: product.id,
    name: product.name,
    unitPrice: product.price,
    qty: 1,
  })
}

const incrementPosQty = (id: string) => {
  const cartItem = posCart.value.find((item) => item.id === id)
  const stockItem = products.value.find((item) => item.id === id)
  if (!cartItem || !stockItem) return
  if (cartItem.qty >= stockItem.stock) return
  cartItem.qty += 1
}

const decrementPosQty = (id: string) => {
  const cartItem = posCart.value.find((item) => item.id === id)
  if (!cartItem) return
  if (cartItem.qty <= 1) {
    posCart.value = posCart.value.filter((item) => item.id !== id)
    return
  }
  cartItem.qty -= 1
}

const clearPosCart = () => {
  posCart.value = []
  posDiscount.value = 0
  posCouponCode.value = ''
  posCouponError.value = ''
  posAppliedCoupon.value = null
}

const applyPosCoupon = () => {
  const normalizedCode = posCouponCode.value.trim().toUpperCase()
  if (!normalizedCode) {
    posCouponError.value = 'Enter a coupon code first.'
    posAppliedCoupon.value = null
    return
  }

  const matched = posCouponRules.find((rule) => rule.code === normalizedCode)
  if (!matched) {
    posCouponError.value = 'Coupon code is not valid.'
    posAppliedCoupon.value = null
    return
  }

  posAppliedCoupon.value = matched
  posCouponCode.value = matched.code
  posCouponError.value = ''
}

const removePosCoupon = () => {
  posAppliedCoupon.value = null
  posCouponCode.value = ''
  posCouponError.value = ''
}

const escapeHtml = (value: string) => {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

const buildPosInvoiceTextFromReceipt = (receipt: PosReceipt) => {
  const lines = [
    `Invoice: ${receipt.invoiceId}`,
    `Receipt: ${receipt.id}`,
    `Created: ${receipt.createdAt}`,
    `Payment: ${receipt.paymentMethod.replace('-', ' ')}`,
    `Coupon: ${receipt.couponCode ?? 'None'}`,
    '',
    'Items:',
    ...receipt.lines.map((line, index) => {
      return `${index + 1}. ${line.name} | ${line.qty} x ${formatMoney(line.unitPrice)} = ${formatMoney(line.qty * line.unitPrice)}`
    }),
    '',
    `Discount: ${formatMoney(receipt.discount)}`,
    `Total: ${formatMoney(receipt.total)}`,
  ]

  return lines.join('\n')
}

const buildPosInvoiceTextFromCurrentSale = () => {
  const lines = [
    `Invoice: ${posInvoicePreviewId.value}`,
    `Created: ${posInvoicePreviewTimestamp.value}`,
    `Payment: ${posPaymentMethod.value.replace('-', ' ')}`,
    `Coupon: ${posAppliedCoupon.value?.code ?? 'None'}`,
    '',
    'Items:',
    ...posCart.value.map((line, index) => {
      return `${index + 1}. ${line.name} | ${line.qty} x ${formatMoney(line.unitPrice)} = ${formatMoney(line.qty * line.unitPrice)}`
    }),
    '',
    `Subtotal: ${formatMoney(posSubtotal.value)}`,
    `Tax: ${formatMoney(posTaxAmount.value)}`,
    `Discount: ${formatMoney(posDiscountAmount.value)}`,
    `Total: ${formatMoney(posGrandTotal.value)}`,
  ]

  return lines.join('\n')
}

const openInvoiceWindow = (title: string, invoiceText: string) => {
  if (typeof window === 'undefined') return
  const popup = window.open('', '_blank', 'noopener,noreferrer,width=860,height=740')
  if (!popup) return
  popup.document.write(`
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>${escapeHtml(title)}</title>
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; margin: 24px; color: #0f172a; }
          h1 { margin: 0 0 12px; font-size: 20px; }
          pre { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px; white-space: pre-wrap; }
        </style>
      </head>
      <body>
        <h1>${escapeHtml(title)}</h1>
        <pre>${escapeHtml(invoiceText)}</pre>
      </body>
    </html>
  `)
  popup.document.close()
}

const viewPosInvoice = (receipt: PosReceipt) => {
  activePosInvoice.value = receipt
  const invoiceText = buildPosInvoiceTextFromReceipt(receipt)
  openInvoiceWindow(`POS Invoice ${receipt.invoiceId}`, invoiceText)
}

const downloadPosInvoice = (receipt: PosReceipt) => {
  const invoiceText = buildPosInvoiceTextFromReceipt(receipt)
  downloadInvoicePdf(receipt.invoiceId, `POS Invoice ${receipt.invoiceId}`, invoiceText.split('\n'))
}

const viewCurrentPosInvoice = () => {
  if (!posCart.value.length) return
  const invoiceText = buildPosInvoiceTextFromCurrentSale()
  openInvoiceWindow(`POS Invoice ${posInvoicePreviewId.value}`, invoiceText)
}

const downloadCurrentPosInvoice = () => {
  if (!posCart.value.length) return
  const invoiceText = buildPosInvoiceTextFromCurrentSale()
  downloadInvoicePdf(posInvoicePreviewId.value, `POS Invoice ${posInvoicePreviewId.value}`, invoiceText.split('\n'))
}

const completePosSale = () => {
  if (!posCart.value.length) return

  const soldLines = posCart.value.map((item) => ({
    id: item.id,
    name: item.name,
    unitPrice: item.unitPrice,
    qty: item.qty,
  }))

  posCart.value.forEach((cartItem) => {
    const stockItem = products.value.find((item) => item.id === cartItem.id)
    if (!stockItem) return
    stockItem.stock = Math.max(0, stockItem.stock - cartItem.qty)
  })

  const receiptNumber = 1000 + posReceipts.value.length + 1
  const invoiceNumber = `INV-${receiptNumber}`
  posReceipts.value.unshift({
    id: `POS-${receiptNumber}`,
    invoiceId: invoiceNumber,
    items: posItemsCount.value,
    total: posGrandTotal.value,
    discount: posDiscountAmount.value,
    couponCode: posAppliedCoupon.value?.code ?? null,
    paymentMethod: posPaymentMethod.value,
    lines: soldLines,
    createdAt: 'Just now',
  })

  clearPosCart()
}
</script>

<template>
  <section v-if="isAdminUser && currentUser" class="min-h-screen bg-[#f4f6fb] text-slate-800">
    <div :class="['grid min-h-screen grid-cols-1 transition-[grid-template-columns] duration-300', isSidebarCollapsed ? 'lg:grid-cols-[88px_minmax(0,1fr)]' : 'lg:grid-cols-[280px_minmax(0,1fr)]']">
      <aside :class="['relative border-r border-slate-200 bg-white/95 py-5 shadow-[8px_0_22px_rgba(15,23,42,0.06)] transition-all duration-300', isSidebarCollapsed ? 'px-2' : 'px-4']">
        <button
          type="button"
          class="absolute -right-3 top-5 hidden h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-sky-300 hover:text-sky-700 lg:inline-flex"
          :aria-label="isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'"
          @click="isSidebarCollapsed = !isSidebarCollapsed"
        >
          <svg class="h-4 w-4 transition-transform duration-300" :class="isSidebarCollapsed ? 'rotate-180' : ''" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>

        <div :class="['rounded-2xl bg-gradient-to-br from-sky-600 to-cyan-500 text-white transition-all duration-300', isSidebarCollapsed ? 'p-2 text-center' : 'p-4']">
          <p v-if="!isSidebarCollapsed" class="text-xs font-semibold uppercase tracking-[0.18em] text-sky-100">BazarPro Admin</p>
          <p v-else class="text-base font-bold text-white">B</p>
          <h1 v-if="!isSidebarCollapsed" class="mt-2 text-xl font-bold">Operations Hub</h1>
          <p v-if="!isSidebarCollapsed" class="mt-1 text-xs text-sky-100">{{ currentUser.name }}</p>
        </div>

        <nav class="mt-5 space-y-1">
          <button
            v-for="section in sections"
            :key="section.key"
            type="button"
            :class="[
              'flex w-full items-center rounded-xl py-2.5 text-sm font-semibold transition',
              isSidebarCollapsed ? 'justify-center px-2' : 'gap-2 px-3 text-left',
              activeSection === section.key ? 'bg-sky-50 text-sky-700 ring-1 ring-sky-200' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            ]"
            :title="isSidebarCollapsed ? section.label : undefined"
            @click="activeSection = section.key"
          >
            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path :d="section.icon" />
            </svg>
            <span v-if="!isSidebarCollapsed">{{ section.label }}</span>
          </button>
        </nav>
      </aside>

      <div class="min-w-0 px-4 py-4 md:px-6 md:py-5 xl:px-8">
        <header class="mb-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p class="text-xs font-semibold uppercase tracking-[0.14em] text-sky-700">Dashboard</p>
              <h2 class="mt-1 text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">Store Management Panel</h2>
              <p class="mt-1 text-sm text-slate-600">Inspired by modern free admin templates: clean navigation, dense data, and fast operations.</p>
            </div>
            <div class="relative flex flex-wrap items-center gap-2">
              <button
                type="button"
                class="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-sky-300 hover:text-sky-700"
                @click="isNotificationsOpen = !isNotificationsOpen"
              >
                <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 1 0-12 0v3.2a2 2 0 0 1-.6 1.4L4 17h5" />
                  <path d="M9 17a3 3 0 0 0 6 0" />
                </svg>
                <span>Notifications</span>
                <span v-if="unreadNotifications" class="inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">{{ unreadNotifications }}</span>
              </button>

              <button type="button" class="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-sky-300 hover:text-sky-700" @click="emits('go-main-site')">
                <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m3 11 9-8 9 8" /><path d="M5 10v10h14V10" /></svg>
                <span>Back to Main Site</span>
              </button>
              <button type="button" class="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-indigo-300 hover:text-indigo-700" @click="emits('go-profile')">
                <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 21a8 8 0 1 0-16 0" /><circle cx="12" cy="7" r="4" /></svg>
                <span>Profile</span>
              </button>
              <button type="button" class="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:border-rose-300" @click="emits('logout')">
                <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="m16 17 5-5-5-5" /><path d="M21 12H9" /></svg>
                <span>Logout</span>
              </button>

              <div v-if="isNotificationsOpen" class="absolute right-0 top-10 z-20 w-[320px] rounded-xl border border-slate-200 bg-white p-3 shadow-xl">
                <div class="mb-2 flex items-center justify-between">
                  <p class="text-xs font-semibold uppercase tracking-wide text-slate-600">Notifications</p>
                  <button type="button" class="text-[11px] font-semibold text-sky-700 hover:text-sky-800" @click="markAllNotificationsRead">Mark all read</button>
                </div>
                <ul class="space-y-2">
                  <li v-for="item in notifications" :key="item.id" class="rounded-lg border border-slate-100 p-2.5">
                    <div class="flex items-start justify-between gap-2">
                      <div>
                        <p class="text-xs font-semibold text-slate-800">{{ item.title }}</p>
                        <p class="mt-0.5 text-xs text-slate-600">{{ item.detail }}</p>
                      </div>
                      <span v-if="!item.read" class="mt-0.5 inline-flex h-2 w-2 rounded-full bg-sky-500"></span>
                    </div>
                    <p class="mt-1 text-[11px] text-slate-500">{{ item.time }}</p>
                  </li>
                </ul>
              </div>

              <div class="rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-600 ring-1 ring-slate-200">
                Logged in as <span class="font-semibold text-slate-900">{{ currentUser.email }}</span>
              </div>
            </div>
          </div>
        </header>

        <section v-if="activeSection === 'overview'" class="space-y-4">
          <div class="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
            <article class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div class="mb-3 flex items-center justify-between">
                <h3 class="inline-flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wide text-slate-700">
                  <svg class="h-3.5 w-3.5 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 3v18h18" /><path d="m7 14 4-4 3 3 5-5" /></svg>
                  Weekly Revenue
                </h3>
                <span class="text-xs font-medium text-slate-500">Last 7 days</span>
              </div>
              <div class="flex h-36 items-end gap-2 rounded-xl bg-slate-50 p-3">
                <div v-for="bar in revenueBars" :key="bar.label" class="flex flex-1 flex-col items-center justify-end">
                  <div
                    class="w-full rounded-md bg-gradient-to-t from-sky-600 to-cyan-400"
                    :style="{ height: `${bar.height}%` }"
                    :title="`${bar.label}: ${formatMoney(bar.amount)}`"
                  ></div>
                  <span class="mt-2 text-[10px] font-semibold uppercase tracking-wide text-slate-500">{{ bar.label }}</span>
                </div>
              </div>
            </article>

            <article class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div class="mb-3 flex items-center justify-between">
                <h3 class="inline-flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wide text-slate-700">
                  <svg class="h-3.5 w-3.5 text-violet-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 21V10" /><path d="M12 21V3" /><path d="M19 21v-6" /></svg>
                  Category Comparison
                </h3>
                <span class="text-xs font-medium text-slate-500">Sales by category</span>
              </div>
              <div class="flex h-36 items-end gap-2 rounded-xl bg-slate-50 p-3">
                <div v-for="bar in categoryBars" :key="bar.label" class="flex flex-1 flex-col items-center justify-end">
                  <div
                    class="w-full rounded-md bg-gradient-to-t from-indigo-600 to-violet-400"
                    :style="{ height: `${bar.height}%` }"
                    :title="`${bar.label}: ${formatMoney(bar.amount)}`"
                  ></div>
                  <span class="mt-2 text-[10px] font-semibold uppercase tracking-wide text-slate-500">{{ bar.label }}</span>
                </div>
              </div>
            </article>

            <article class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div class="mb-3 flex items-center justify-between">
                <h3 class="inline-flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wide text-slate-700">
                  <svg class="h-3.5 w-3.5 text-sky-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 3v18h18" /><path d="m7 14 3-3 4 4 5-6" /></svg>
                  Orders Trend
                </h3>
                <span class="text-xs font-medium text-emerald-600">+14% growth</span>
              </div>
              <svg viewBox="0 0 320 120" class="h-36 w-full rounded-xl bg-slate-50 p-2" role="img" aria-label="Orders trend chart">
                <line x1="0" y1="120" x2="320" y2="120" stroke="#cbd5e1" stroke-width="1" />
                <polyline
                  fill="none"
                  stroke="#0ea5e9"
                  stroke-width="3"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  :points="trendPoints"
                />
              </svg>
            </article>

            <article class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div class="mb-3 flex items-center justify-between">
                <h3 class="inline-flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wide text-slate-700">
                  <svg class="h-3.5 w-3.5 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 2a10 10 0 1 0 10 10H12z" /><path d="M12 2v10h10" /></svg>
                  Order Status Pie
                </h3>
                <span class="text-xs font-medium text-slate-500">Parts of whole</span>
              </div>
              <div class="flex flex-wrap items-center gap-3">
                <svg viewBox="0 0 160 160" class="h-36 w-36" role="img" aria-label="Order status pie chart">
                  <path
                    v-for="slice in pieSlices"
                    :key="`${slice.label}-pie`"
                    :d="slice.path"
                    :fill="slice.colorHex"
                    stroke="#ffffff"
                    stroke-width="1"
                  />
                </svg>
                <ul class="min-w-[140px] flex-1 space-y-1.5 text-xs">
                  <li v-for="slice in pieSlices" :key="`${slice.label}-legend`" class="flex items-center justify-between">
                    <span class="inline-flex items-center gap-1.5 text-slate-600">
                      <span class="h-2.5 w-2.5 rounded-full" :style="{ backgroundColor: slice.colorHex }"></span>
                      {{ slice.label }}
                    </span>
                    <span class="font-semibold text-slate-800">{{ slice.count }}</span>
                  </li>
                </ul>
              </div>
            </article>

            <article class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div class="mb-3 flex items-center justify-between">
                <h3 class="inline-flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wide text-slate-700">
                  <svg class="h-3.5 w-3.5 text-cyan-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="7" cy="16" r="2" /><circle cx="12" cy="10" r="2" /><circle cx="17" cy="6" r="2" /><path d="M9 15l2-3" /><path d="m13 9 2-2" /></svg>
                  Ad Spend vs Orders
                </h3>
                <span class="text-xs font-medium text-slate-500">Scatter correlation</span>
              </div>
              <svg viewBox="0 0 320 140" class="h-36 w-full rounded-xl bg-slate-50 p-2" role="img" aria-label="Scatter chart for ad spend and orders">
                <line x1="24" y1="8" x2="24" y2="126" stroke="#cbd5e1" stroke-width="1" />
                <line x1="24" y1="126" x2="312" y2="126" stroke="#cbd5e1" stroke-width="1" />
                <circle
                  v-for="point in scatterPoints"
                  :key="point.label"
                  :cx="point.x * 3.1"
                  :cy="point.y * 1.2"
                  r="4"
                  fill="#0ea5e9"
                  opacity="0.85"
                >
                  <title>{{ point.label }}</title>
                </circle>
              </svg>
            </article>

            <article class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div class="mb-3 flex items-center justify-between">
                <h3 class="inline-flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wide text-slate-700">
                  <svg class="h-3.5 w-3.5 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 20V10" /><path d="M10 20V4" /><path d="M16 20v-7" /><path d="M22 20v-3" /></svg>
                  Order Value Histogram
                </h3>
                <span class="text-xs font-medium text-slate-500">Distribution</span>
              </div>
              <div class="flex h-36 items-end gap-2 rounded-xl bg-slate-50 p-3">
                <div v-for="bin in histogramBins" :key="bin.label" class="flex flex-1 flex-col items-center justify-end">
                  <div class="w-full rounded-md bg-gradient-to-t from-emerald-600 to-teal-400" :style="{ height: `${bin.height}%` }" :title="`${bin.label}: ${bin.count} orders`"></div>
                  <span class="mt-2 text-[10px] font-semibold text-slate-500">{{ bin.label }}</span>
                </div>
              </div>
            </article>
          </div>

          <div class="grid gap-3 sm:grid-cols-2 2xl:grid-cols-4">
            <article class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p class="inline-flex items-center gap-1 text-xs uppercase tracking-wide text-slate-500"><svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 1v22" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>Total Revenue</p>
              <p class="mt-2 text-2xl font-bold text-slate-900">{{ formatMoney(totalRevenue) }}</p>
              <p class="mt-1 text-xs text-emerald-600">+8.4% vs last month</p>
            </article>
            <article class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p class="inline-flex items-center gap-1 text-xs uppercase tracking-wide text-slate-500"><svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>Pending Orders</p>
              <p class="mt-2 text-2xl font-bold text-slate-900">{{ pendingOrders }}</p>
              <p class="mt-1 text-xs text-amber-600">Requires team action</p>
            </article>
            <article class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p class="inline-flex items-center gap-1 text-xs uppercase tracking-wide text-slate-500"><svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" /><path d="M12 9v4" /><path d="M12 17h.01" /></svg>Low Stock SKU</p>
              <p class="mt-2 text-2xl font-bold text-slate-900">{{ lowStockProducts }}</p>
              <p class="mt-1 text-xs text-rose-600">Replenish soon</p>
            </article>
            <article class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p class="inline-flex items-center gap-1 text-xs uppercase tracking-wide text-slate-500"><svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 3v18h18" /><path d="m6 14 4-4 3 3 5-5" /></svg>Average Order Value</p>
              <p class="mt-2 text-2xl font-bold text-slate-900">{{ formatMoney(averageOrderValue) }}</p>
              <p class="mt-1 text-xs text-sky-600">Healthy checkout trend</p>
            </article>
          </div>

          <div class="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
            <article class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <h3 class="text-sm font-semibold uppercase tracking-wide text-slate-700">Latest Orders</h3>
              <div class="mt-3 overflow-x-auto">
                <table class="min-w-full text-left text-sm">
                  <thead>
                    <tr class="border-b border-slate-200 text-slate-500">
                      <th class="px-2 py-2">Order</th>
                      <th class="px-2 py-2">Customer</th>
                      <th class="px-2 py-2">Placed</th>
                      <th class="px-2 py-2">Total</th>
                      <th class="px-2 py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="order in orders" :key="order.id" class="border-b border-slate-100">
                      <td class="px-2 py-2 font-semibold text-slate-900">{{ order.id }}</td>
                      <td class="px-2 py-2">{{ order.customer }}</td>
                      <td class="px-2 py-2 text-xs text-slate-500">{{ order.placedAt }}</td>
                      <td class="px-2 py-2">{{ formatMoney(order.total) }}</td>
                      <td class="px-2 py-2">
                        <span class="inline-flex rounded-full border px-2 py-0.5 text-xs font-semibold" :class="orderBadgeClass(order.status)">{{ order.status }}</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </article>

            <article class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <h3 class="text-sm font-semibold uppercase tracking-wide text-slate-700">Quick Health</h3>
              <div class="mt-3 space-y-3">
                <div>
                  <div class="mb-1 flex items-center justify-between text-xs text-slate-600"><span>Order Processing</span><span>76%</span></div>
                  <div class="h-2 rounded-full bg-slate-100"><div class="h-2 w-[76%] rounded-full bg-sky-500"></div></div>
                </div>
                <div>
                  <div class="mb-1 flex items-center justify-between text-xs text-slate-600"><span>Inventory Coverage</span><span>64%</span></div>
                  <div class="h-2 rounded-full bg-slate-100"><div class="h-2 w-[64%] rounded-full bg-emerald-500"></div></div>
                </div>
                <div>
                  <div class="mb-1 flex items-center justify-between text-xs text-slate-600"><span>Customer Retention</span><span>82%</span></div>
                  <div class="h-2 rounded-full bg-slate-100"><div class="h-2 w-[82%] rounded-full bg-indigo-500"></div></div>
                </div>
              </div>
            </article>
          </div>
        </section>

        <section v-else-if="activeSection === 'orders'" class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div class="mb-3 flex flex-wrap items-center gap-2">
            <input v-model="orderSearch" type="search" placeholder="Search by order id or customer" class="min-w-[220px] flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-sky-300/60 focus:ring-2" />
            <select v-model="orderFilter" class="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-sky-300/60 focus:ring-2">
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div class="overflow-x-auto">
            <table class="min-w-full text-left text-sm">
              <thead>
                <tr class="border-b border-slate-200 text-slate-500">
                  <th class="px-2 py-2">Order</th>
                  <th class="px-2 py-2">Customer</th>
                  <th class="px-2 py-2">Placed</th>
                  <th class="px-2 py-2">Total</th>
                  <th class="px-2 py-2">Status</th>
                  <th class="px-2 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="order in filteredOrders" :key="order.id" class="border-b border-slate-100">
                  <td class="px-2 py-2 font-semibold text-slate-900">{{ order.id }}</td>
                  <td class="px-2 py-2">{{ order.customer }}</td>
                  <td class="px-2 py-2 text-xs text-slate-500">{{ order.placedAt }}</td>
                  <td class="px-2 py-2">{{ formatMoney(order.total) }}</td>
                  <td class="px-2 py-2"><span class="inline-flex rounded-full border px-2 py-0.5 text-xs font-semibold" :class="orderBadgeClass(order.status)">{{ order.status }}</span></td>
                  <td class="px-2 py-2">
                    <select class="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs" :value="order.status" @change="handleOrderStatusChange(order.id, $event)">
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section v-else-if="activeSection === 'products'" class="space-y-4">
          <article class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <h3 class="text-sm font-semibold uppercase tracking-wide text-slate-700">Add Product</h3>
            <div class="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
              <input v-model="newProductName" type="text" placeholder="Product name" class="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-sky-300/60 focus:ring-2 lg:col-span-2" />
              <input v-model="newProductCategory" type="text" placeholder="Category" class="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-sky-300/60 focus:ring-2" />
              <input v-model="newProductPrice" type="number" min="1" placeholder="Price" class="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-sky-300/60 focus:ring-2" />
              <input v-model="newProductStock" type="number" min="0" placeholder="Stock" class="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-sky-300/60 focus:ring-2" />
            </div>
            <button type="button" class="mt-3 rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700" @click="addProduct">Add Product</button>
          </article>

          <article class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div class="mb-3"><input v-model="productSearch" type="search" placeholder="Search product or category" class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-sky-300/60 focus:ring-2" /></div>
            <div class="overflow-x-auto">
              <table class="min-w-full text-left text-sm">
                <thead>
                  <tr class="border-b border-slate-200 text-slate-500">
                    <th class="px-2 py-2">Name</th>
                    <th class="px-2 py-2">Category</th>
                    <th class="px-2 py-2">Price</th>
                    <th class="px-2 py-2">Stock</th>
                    <th class="px-2 py-2">Featured</th>
                    <th class="px-2 py-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="product in filteredProducts" :key="product.id" class="border-b border-slate-100">
                    <td class="px-2 py-2 font-semibold text-slate-900">{{ product.name }}</td>
                    <td class="px-2 py-2">{{ product.category }}</td>
                    <td class="px-2 py-2">{{ formatMoney(product.price) }}</td>
                    <td class="px-2 py-2" :class="product.stock <= 10 ? 'text-amber-600 font-semibold' : ''">{{ product.stock }}</td>
                    <td class="px-2 py-2">{{ product.featured ? 'Yes' : 'No' }}</td>
                    <td class="px-2 py-2"><button type="button" class="rounded-md border border-slate-200 px-2 py-1 text-xs font-semibold hover:bg-slate-50" @click="toggleFeatured(product.id)">Toggle Featured</button></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </article>
        </section>

        <section v-else-if="activeSection === 'customers'" class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div class="mb-3"><input v-model="customerSearch" type="search" placeholder="Search customer name or email" class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-sky-300/60 focus:ring-2" /></div>
          <div class="overflow-x-auto">
            <table class="min-w-full text-left text-sm">
              <thead>
                <tr class="border-b border-slate-200 text-slate-500">
                  <th class="px-2 py-2">Customer</th>
                  <th class="px-2 py-2">Email</th>
                  <th class="px-2 py-2">Orders</th>
                  <th class="px-2 py-2">Total Spend</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="customer in filteredCustomers" :key="customer.id" class="border-b border-slate-100">
                  <td class="px-2 py-2 font-semibold text-slate-900">{{ customer.name }}</td>
                  <td class="px-2 py-2">{{ customer.email }}</td>
                  <td class="px-2 py-2">{{ customer.orders }}</td>
                  <td class="px-2 py-2">{{ formatMoney(customer.spend) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section v-else-if="activeSection === 'inventory'" class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <h3 class="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-700">Inventory Monitor</h3>
          <div class="space-y-2">
            <article v-for="product in products" :key="product.id" class="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
              <div>
                <p class="font-semibold text-slate-900">{{ product.name }}</p>
                <p class="text-xs text-slate-500">{{ product.category }} | {{ formatMoney(product.price) }}</p>
              </div>
              <div class="flex items-center gap-2">
                <span class="rounded-full px-2 py-0.5 text-xs font-semibold" :class="product.stock <= 10 ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'">{{ product.stock <= 10 ? 'Low stock' : 'In stock' }}: {{ product.stock }}</span>
                <button type="button" class="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs font-semibold hover:bg-slate-100" @click="addStock(product.id, 5)">+5 Stock</button>
              </div>
            </article>
          </div>
        </section>

        <section v-else-if="activeSection === 'pos'" class="space-y-4">
          <div class="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
            <article class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div class="mb-3 flex flex-wrap items-center justify-between gap-2">
                <h3 class="inline-flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wide text-slate-700">
                  <svg class="h-3.5 w-3.5 text-sky-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path d="M3 5h18v14H3z" />
                    <path d="M7 19h10" />
                    <path d="M8 9h.01M12 9h.01M16 9h.01M8 13h8" />
                  </svg>
                  POS Product Picker
                </h3>
                <input
                  v-model="posSearch"
                  type="search"
                  placeholder="Search POS products"
                  class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-sky-300/60 focus:ring-2 sm:w-[260px]"
                />
              </div>

              <div class="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                <button
                  v-for="product in filteredPosProducts"
                  :key="`pos-${product.id}`"
                  type="button"
                  class="rounded-xl border border-slate-200 bg-slate-50 p-3 text-left transition hover:border-sky-300 hover:bg-sky-50"
                  @click="addToPosCart(product)"
                >
                  <p class="text-sm font-semibold text-slate-900">{{ product.name }}</p>
                  <p class="mt-0.5 text-xs text-slate-500">{{ product.category }}</p>
                  <div class="mt-2 flex items-center justify-between text-xs">
                    <span class="font-semibold text-sky-700">{{ formatMoney(product.price) }}</span>
                    <span :class="product.stock <= 10 ? 'text-amber-600' : 'text-emerald-600'">Stock: {{ product.stock }}</span>
                  </div>
                </button>
              </div>
            </article>

            <article class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <h3 class="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-700">Current Sale</h3>
              <div v-if="!posCart.length" class="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-center text-sm text-slate-600">
                Add products to start POS checkout.
              </div>

              <div v-else class="space-y-2">
                <article v-for="item in posCart" :key="`cart-${item.id}`" class="rounded-lg border border-slate-200 p-2.5">
                  <div class="flex items-center justify-between gap-2">
                    <div>
                      <p class="text-sm font-semibold text-slate-900">{{ item.name }}</p>
                      <p class="text-xs text-slate-500">{{ formatMoney(item.unitPrice) }} each</p>
                    </div>
                    <div class="inline-flex items-center rounded-lg border border-slate-200">
                      <button type="button" class="h-7 w-7 text-sm font-bold text-slate-700 hover:bg-slate-100" @click="decrementPosQty(item.id)">-</button>
                      <span class="inline-flex min-w-8 items-center justify-center border-x border-slate-200 text-xs font-semibold">{{ item.qty }}</span>
                      <button type="button" class="h-7 w-7 text-sm font-bold text-slate-700 hover:bg-slate-100" @click="incrementPosQty(item.id)">+</button>
                    </div>
                  </div>
                </article>
              </div>

              <div class="mt-3 space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm">
                <div class="flex items-center justify-between"><span>Items</span><span>{{ posItemsCount }}</span></div>
                <div class="flex items-center justify-between"><span>Subtotal</span><span>{{ formatMoney(posSubtotal) }}</span></div>
                <div class="flex items-center justify-between"><span>Tax (5%)</span><span>{{ formatMoney(posTaxAmount) }}</span></div>
                <div class="flex items-center justify-between gap-2">
                  <label class="text-xs font-medium text-slate-600" for="pos-discount">Manual Discount</label>
                  <input id="pos-discount" v-model.number="posDiscount" type="number" min="0" class="w-24 rounded border border-slate-200 bg-white px-2 py-1 text-right text-xs" />
                </div>
                <div class="flex items-center justify-between"><span>Coupon Discount</span><span>-{{ formatMoney(posCouponDiscount) }}</span></div>
                <div class="flex items-center justify-between"><span>Total Discount</span><span>-{{ formatMoney(posDiscountAmount) }}</span></div>
                <div class="flex items-center justify-between border-t border-slate-200 pt-2 font-semibold text-slate-900"><span>Total</span><span>{{ formatMoney(posGrandTotal) }}</span></div>
              </div>

              <div class="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p class="text-xs font-semibold uppercase tracking-wide text-slate-600">Coupon Code</p>
                <div class="mt-2 flex flex-wrap gap-2">
                  <input
                    v-model="posCouponCode"
                    type="text"
                    placeholder="SAVE10 / FLAT100 / WELCOME50"
                    class="min-w-[180px] flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs uppercase tracking-wide text-slate-700 outline-none ring-sky-300/60 focus:ring-2"
                  />
                  <button type="button" class="rounded-lg bg-sky-600 px-3 py-2 text-xs font-semibold text-white hover:bg-sky-700" @click="applyPosCoupon">Apply</button>
                  <button type="button" class="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 hover:border-slate-400" @click="removePosCoupon">Remove</button>
                </div>
                <p v-if="posAppliedCoupon" class="mt-2 text-xs font-medium text-emerald-700">Applied: {{ posAppliedCoupon.code }} ({{ posAppliedCoupon.label }})</p>
                <p v-else-if="posCouponError" class="mt-2 text-xs font-medium text-rose-600">{{ posCouponError }}</p>
              </div>

              <div class="mt-3 rounded-xl border border-slate-200 bg-white p-3">
                <p class="text-xs font-semibold uppercase tracking-wide text-slate-600">Invoice Preview</p>
                <div class="mt-2 space-y-1 text-xs text-slate-700">
                  <div class="flex items-center justify-between"><span>Invoice No</span><span class="font-semibold text-slate-900">{{ posInvoicePreviewId }}</span></div>
                  <div class="flex items-center justify-between"><span>Items</span><span>{{ posItemsCount }}</span></div>
                  <div class="flex items-center justify-between"><span>Payment</span><span class="capitalize">{{ posPaymentMethod.replace('-', ' ') }}</span></div>
                  <div class="flex items-center justify-between"><span>Coupon</span><span>{{ posAppliedCoupon?.code ?? 'None' }}</span></div>
                </div>
                <div class="mt-3 flex flex-wrap gap-2">
                  <button type="button" class="rounded-lg border border-sky-300 bg-sky-50 px-3 py-1.5 text-xs font-semibold text-sky-700 hover:border-sky-400 disabled:cursor-not-allowed disabled:opacity-50" :disabled="!posCart.length" @click="viewCurrentPosInvoice">View Invoice</button>
                  <button type="button" class="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-slate-400 disabled:cursor-not-allowed disabled:opacity-50" :disabled="!posCart.length" @click="downloadCurrentPosInvoice">Download Invoice</button>
                </div>
              </div>

              <div class="mt-3 grid gap-2 sm:grid-cols-2">
                <select v-model="posPaymentMethod" class="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-sky-300/60 focus:ring-2">
                  <option value="cash">Cash</option>
                  <option value="card">Card</option>
                  <option value="mobile-banking">Mobile Banking</option>
                </select>
                <button
                  type="button"
                  class="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                  :disabled="!posCart.length"
                  @click="completePosSale"
                >
                  Complete Sale
                </button>
              </div>
              <button type="button" class="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:border-slate-300" @click="clearPosCart">Clear Sale</button>
            </article>
          </div>

          <article class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <h3 class="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-700">Recent POS Receipts</h3>
            <div class="overflow-x-auto">
              <table class="min-w-full text-left text-sm">
                <thead>
                  <tr class="border-b border-slate-200 text-slate-500">
                    <th class="px-2 py-2">Receipt</th>
                    <th class="px-2 py-2">Invoice</th>
                    <th class="px-2 py-2">Items</th>
                    <th class="px-2 py-2">Coupon</th>
                    <th class="px-2 py-2">Discount</th>
                    <th class="px-2 py-2">Payment</th>
                    <th class="px-2 py-2">Total</th>
                    <th class="px-2 py-2">Time</th>
                    <th class="px-2 py-2 text-right">Invoice</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="receipt in posReceipts" :key="receipt.id" class="border-b border-slate-100">
                    <td class="px-2 py-2 font-semibold text-slate-900">{{ receipt.id }}</td>
                    <td class="px-2 py-2 font-medium text-slate-700">{{ receipt.invoiceId }}</td>
                    <td class="px-2 py-2">{{ receipt.items }}</td>
                    <td class="px-2 py-2">{{ receipt.couponCode ?? 'N/A' }}</td>
                    <td class="px-2 py-2">{{ formatMoney(receipt.discount) }}</td>
                    <td class="px-2 py-2 capitalize">{{ receipt.paymentMethod.replace('-', ' ') }}</td>
                    <td class="px-2 py-2">{{ formatMoney(receipt.total) }}</td>
                    <td class="px-2 py-2 text-xs text-slate-500">{{ receipt.createdAt }}</td>
                    <td class="px-2 py-2 text-right">
                      <div class="inline-flex gap-1">
                        <button type="button" class="rounded border border-sky-300 bg-sky-50 px-2 py-1 text-[11px] font-semibold text-sky-700 hover:border-sky-400" @click="viewPosInvoice(receipt)">View</button>
                        <button type="button" class="rounded border border-slate-300 bg-white px-2 py-1 text-[11px] font-semibold text-slate-700 hover:border-slate-400" @click="downloadPosInvoice(receipt)">Download</button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div v-if="activePosInvoice" class="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p class="text-xs font-semibold uppercase tracking-wide text-slate-600">Selected Invoice</p>
              <div class="mt-2 grid gap-1 text-xs text-slate-700 sm:grid-cols-2">
                <p><span class="font-semibold text-slate-900">Invoice:</span> {{ activePosInvoice.invoiceId }}</p>
                <p><span class="font-semibold text-slate-900">Receipt:</span> {{ activePosInvoice.id }}</p>
                <p><span class="font-semibold text-slate-900">Payment:</span> {{ activePosInvoice.paymentMethod.replace('-', ' ') }}</p>
                <p><span class="font-semibold text-slate-900">Total:</span> {{ formatMoney(activePosInvoice.total) }}</p>
              </div>
            </div>
          </article>
        </section>
      </div>
    </div>
  </section>

  <section v-else class="mx-auto mt-8 max-w-xl rounded-3xl border border-rose-200 bg-rose-50 p-6 text-center">
    <h2 class="text-2xl font-bold text-rose-800">Admin access required</h2>
    <p class="mt-2 text-sm text-rose-700">Login as admin to view this page.</p>
    <button type="button" class="mt-4 rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700" @click="emits('go-login')">Go to Login</button>
  </section>
</template>
