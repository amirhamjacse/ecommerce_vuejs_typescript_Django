<script setup lang="ts">
import { computed, ref } from 'vue'

type UserRole = 'customer' | 'admin'

type UserSession = {
  name: string
  email: string
  role: UserRole
}

type DashboardSection = 'overview' | 'orders' | 'products' | 'customers' | 'inventory'
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

defineProps<{
  currentUser: UserSession | null
  isAdminUser: boolean
}>()

const emits = defineEmits<{
  'go-login': []
}>()

const activeSection = ref<DashboardSection>('overview')
const orderSearch = ref('')
const orderFilter = ref<OrderStatus | 'all'>('all')
const productSearch = ref('')
const customerSearch = ref('')
const newProductName = ref('')
const newProductCategory = ref('Groceries')
const newProductPrice = ref('')
const newProductStock = ref('')

const sections: Array<{ key: DashboardSection; label: string; icon: string }> = [
  { key: 'overview', label: 'Overview', icon: 'M3 13h8V3H3v10zM13 21h8v-6h-8v6zM13 11h8V3h-8v8zM3 21h8v-6H3v6z' },
  { key: 'orders', label: 'Orders', icon: 'M6 2h9l5 5v15a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm8 1.5V8h4.5' },
  { key: 'products', label: 'Products', icon: 'M12 2 3 7l9 5 9-5-9-5zm0 9-9-5v11l9 5 9-5V6l-9 5z' },
  { key: 'customers', label: 'Customers', icon: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2m20 0v-2a4 4 0 0 0-3-3.87M9 7a4 4 0 1 0 0.001-7.999A4 4 0 0 0 9 7zm12 4a4 4 0 1 0 0.001-7.999A4 4 0 0 0 21 11z' },
  { key: 'inventory', label: 'Inventory', icon: 'M20 7 12 3 4 7m16 0v10l-8 4-8-4V7m16 0-8 4-8-4' },
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

const totalRevenue = computed(() => orders.value.reduce((sum, order) => sum + order.total, 0))
const pendingOrders = computed(() => orders.value.filter((o) => o.status === 'pending' || o.status === 'processing').length)
const lowStockProducts = computed(() => products.value.filter((p) => p.stock <= 10).length)
const averageOrderValue = computed(() => (orders.value.length ? totalRevenue.value / orders.value.length : 0))

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
</script>

<template>
  <section v-if="isAdminUser && currentUser" class="min-h-screen bg-[#f4f6fb] text-slate-800">
    <div class="grid min-h-screen grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)]">
      <aside class="relative border-r border-slate-200 bg-white/95 px-4 py-5 shadow-[8px_0_22px_rgba(15,23,42,0.06)]">
        <div class="rounded-2xl bg-gradient-to-br from-sky-600 to-cyan-500 p-4 text-white">
          <p class="text-xs font-semibold uppercase tracking-[0.18em] text-sky-100">BazarPro Admin</p>
          <h1 class="mt-2 text-xl font-bold">Operations Hub</h1>
          <p class="mt-1 text-xs text-sky-100">{{ currentUser.name }}</p>
        </div>

        <nav class="mt-5 space-y-1">
          <button
            v-for="section in sections"
            :key="section.key"
            type="button"
            class="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition"
            :class="activeSection === section.key ? 'bg-sky-50 text-sky-700 ring-1 ring-sky-200' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'"
            @click="activeSection = section.key"
          >
            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path :d="section.icon" />
            </svg>
            <span>{{ section.label }}</span>
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
            <div class="rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-600 ring-1 ring-slate-200">
              Logged in as <span class="font-semibold text-slate-900">{{ currentUser.email }}</span>
            </div>
          </div>
        </header>

        <section v-if="activeSection === 'overview'" class="space-y-4">
          <div class="grid gap-3 sm:grid-cols-2 2xl:grid-cols-4">
            <article class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p class="text-xs uppercase tracking-wide text-slate-500">Total Revenue</p>
              <p class="mt-2 text-2xl font-bold text-slate-900">{{ formatMoney(totalRevenue) }}</p>
              <p class="mt-1 text-xs text-emerald-600">+8.4% vs last month</p>
            </article>
            <article class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p class="text-xs uppercase tracking-wide text-slate-500">Pending Orders</p>
              <p class="mt-2 text-2xl font-bold text-slate-900">{{ pendingOrders }}</p>
              <p class="mt-1 text-xs text-amber-600">Requires team action</p>
            </article>
            <article class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p class="text-xs uppercase tracking-wide text-slate-500">Low Stock SKU</p>
              <p class="mt-2 text-2xl font-bold text-slate-900">{{ lowStockProducts }}</p>
              <p class="mt-1 text-xs text-rose-600">Replenish soon</p>
            </article>
            <article class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p class="text-xs uppercase tracking-wide text-slate-500">Average Order Value</p>
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

        <section v-else class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
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
      </div>
    </div>
  </section>

  <section v-else class="mx-auto mt-8 max-w-xl rounded-3xl border border-rose-200 bg-rose-50 p-6 text-center">
    <h2 class="text-2xl font-bold text-rose-800">Admin access required</h2>
    <p class="mt-2 text-sm text-rose-700">Login as admin to view this page.</p>
    <button type="button" class="mt-4 rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700" @click="emits('go-login')">Go to Login</button>
  </section>
</template>
