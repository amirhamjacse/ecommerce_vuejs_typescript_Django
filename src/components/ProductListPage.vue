<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

type Product = {
  name: string
  category: string
  price: string
  oldPrice: string
  image: string
  badge?: string
  images?: string[]
  description?: string
  keyFeatures?: string[]
  usageIdeas?: string[]
  brand?: string
  flag?: string
}

const router = useRouter()

const products: Product[] = [
  // Honey Products
  {
    name: 'Sundarban Honey 1kg',
    category: 'Honey',
    price: 'BDT 2,200',
    oldPrice: 'BDT 2,500',
    image: 'https://picsum.photos/seed/pro-sundarban-honey/360/300',
    badge: '-12%',
    brand: 'GhorerBazar',
    flag: 'Offered Items',
    description: 'Pure Sundarban honey harvested from the pristine forests of Bangladesh.',
  },
  {
    name: 'Black Seed Honey 500g',
    category: 'Honey',
    price: 'BDT 680',
    oldPrice: 'BDT 780',
    image: 'https://picsum.photos/seed/pro-black-seed-honey/360/300',
    badge: '-13%',
    brand: 'Honeyraj',
    flag: 'New Arrival',
    description: 'Organic black seed honey with natural benefits.',
  },
  {
    name: 'Lichu Flower Honey 500g',
    category: 'Honey',
    price: 'BDT 520',
    oldPrice: 'BDT 620',
    image: 'https://picsum.photos/seed/pro-lichu-honey/360/300',
    badge: '-16%',
    brand: 'GhorerBazar',
    description: 'Sweet and aromatic lychee flower honey.',
  },
  {
    name: 'Sidr Honey 250g',
    category: 'Honey',
    price: 'BDT 890',
    oldPrice: 'BDT 1,050',
    image: 'https://picsum.photos/seed/pro-sidr-honey/360/300',
    badge: '-15%',
    brand: 'Honeyraj',
    flag: 'Offered Items',
    description: 'Premium Sidr honey from Yemen with unique taste.',
  },
  {
    name: 'Honeycomb 200g',
    category: 'Honey',
    price: 'BDT 450',
    oldPrice: 'BDT 550',
    image: 'https://picsum.photos/seed/pro-honeycomb/360/300',
    badge: '-18%',
    brand: 'GhorerBazar',
    flag: 'New Arrival',
    description: 'Pure honeycomb chunks with natural beeswax.',
  },
  {
    name: 'Organic Honey 1kg',
    category: 'Honey',
    price: 'BDT 1,450',
    oldPrice: 'BDT 1,650',
    image: 'https://picsum.photos/seed/pro-organic-honey/360/300',
    badge: '-12%',
    brand: 'Honeyraj',
    description: 'Certified organic honey from local beekeepers.',
  },
  {
    name: 'Crystal Honey 500g',
    category: 'Honey',
    price: 'BDT 380',
    oldPrice: 'BDT 480',
    image: 'https://picsum.photos/seed/pro-crystal-honey/360/300',
    badge: '-21%',
    brand: 'GhorerBazar',
    flag: 'Offered Items',
    description: 'Crystallized honey with smooth texture.',
  },
  // Home Products
  {
    name: 'Dishwash Liquid 1L',
    category: 'Home',
    price: 'BDT 230',
    oldPrice: 'BDT 270',
    image: 'https://picsum.photos/seed/pro-dishwash/360/300',
    badge: '-15%',
    brand: 'GhorerBazar',
    description: 'Powerful dishwash liquid for daily cleaning.',
  },
  {
    name: 'Laundry Detergent 1kg',
    category: 'Home',
    price: 'BDT 310',
    oldPrice: 'BDT 380',
    image: 'https://picsum.photos/seed/pro-laundry/360/300',
    badge: '-18%',
    brand: 'Honeyraj',
    flag: 'New Arrival',
    description: 'Effective laundry detergent for all fabric types.',
  },
  {
    name: 'Toilet Cleaner 750ml',
    category: 'Home',
    price: 'BDT 210',
    oldPrice: 'BDT 250',
    image: 'https://picsum.photos/seed/pro-cleaner/360/300',
    badge: '-16%',
    brand: 'GhorerBazar',
    description: 'Powerful toilet bowl cleaner.',
  },
]

// Filter states
const selectedCategory = ref<string | null>(null)
const selectedBrand = ref<string | null>(null)
const selectedFlag = ref<string | null>(null)
const minPrice = ref<number>(0)
const maxPrice = ref<number>(5000)
const priceRangeMin = ref<number>(0)
const priceRangeMax = ref<number>(5000)
const showFilters = ref(true)

// Extract unique values
const categories = computed(() => {
  return Array.from(new Set(products.map((p) => p.category))).sort()
})

const brands = computed(() => {
  return Array.from(new Set(products.map((p) => p.brand).filter(Boolean))) as string[]
})

const flags = computed(() => {
  return Array.from(new Set(products.map((p) => p.flag).filter(Boolean))) as string[]
})

// Parse price from "BDT 2,200" format
const parsePrice = (priceText: string): number => {
  const numericValue = Number(priceText.replace(/[^0-9.]/g, ''))
  return Number.isFinite(numericValue) ? numericValue : 0
}

// Filter products
const filteredProducts = computed(() => {
  return products.filter((product) => {
    // Category filter
    if (selectedCategory.value && product.category !== selectedCategory.value) return false

    // Brand filter
    if (selectedBrand.value && product.brand !== selectedBrand.value) return false

    // Flag filter
    if (selectedFlag.value && product.flag !== selectedFlag.value) return false

    // Price range filter
    const productPrice = parsePrice(product.price)
    if (productPrice < priceRangeMin.value || productPrice > priceRangeMax.value) return false

    return true
  })
})

const resetFilters = () => {
  selectedCategory.value = null
  selectedBrand.value = null
  selectedFlag.value = null
  priceRangeMin.value = 0
  priceRangeMax.value = 5000
}

const openProductDetail = (product: Product) => {
  const productSlug = product.name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '')
  router.push({ name: 'product-detail', params: { productName: productSlug } })
}
</script>

<template>
  <div class="relative mx-auto max-w-[1500px] overflow-hidden px-2 py-4 md:px-3 lg:px-4">
    <!-- Back Button -->
    <div class="mb-6">
      <button
        @click="$router.back()"
        class="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-brand hover:text-brand"
      >
        <svg
          class="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M15 18l-6-6 6-6" />
        </svg>
        Back
      </button>
    </div>

    <!-- Page Title -->
    <h1 class="text-3xl font-bold text-slate-900 md:text-4xl mb-8">All Products</h1>

    <!-- Main Content -->
    <div class="grid gap-6 lg:grid-cols-[250px_1fr]">
      <!-- Sidebar Filters -->
      <aside class="lg:sticky lg:top-24 lg:h-fit">
        <div class="rounded-2xl border border-slate-200 bg-white p-5">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold text-slate-900">Filters</h2>
            <button
              v-if="selectedCategory || selectedBrand || selectedFlag || priceRangeMin > 0 || priceRangeMax < 5000"
              @click="resetFilters"
              class="text-xs font-semibold text-brand hover:underline"
            >
              Reset
            </button>
          </div>

          <!-- Toggle Filters on Mobile -->
          <button
            @click="showFilters = !showFilters"
            class="lg:hidden w-full mb-4 py-2 px-3 text-sm font-semibold border border-slate-200 rounded-lg hover:bg-slate-50"
          >
            {{ showFilters ? 'Hide' : 'Show' }} Filters
          </button>

          <div :class="['space-y-5', showFilters ? 'block' : 'hidden lg:block']">
            <!-- Category Filter -->
            <div class="border-t border-slate-200 pt-4">
              <h3 class="mb-3 text-sm font-semibold text-slate-900">Category</h3>
              <div class="space-y-2">
                <button
                  @click="selectedCategory = null"
                  class="flex w-full items-center gap-2 px-2 py-1.5 text-sm transition rounded hover:bg-slate-50"
                  :class="selectedCategory === null ? 'text-brand font-semibold' : 'text-slate-700'"
                >
                  <span class="h-4 w-4 rounded border-2" :class="selectedCategory === null ? 'border-brand bg-brand' : 'border-slate-300'" />
                  All Categories
                </button>
                <button
                  v-for="category in categories"
                  :key="category"
                  @click="selectedCategory = category === selectedCategory ? null : category"
                  class="flex w-full items-center gap-2 px-2 py-1.5 text-sm transition rounded hover:bg-slate-50"
                  :class="selectedCategory === category ? 'text-brand font-semibold' : 'text-slate-700'"
                >
                  <span
                    class="h-4 w-4 rounded border-2"
                    :class="selectedCategory === category ? 'border-brand bg-brand' : 'border-slate-300'"
                  />
                  {{ category }}
                </button>
              </div>
            </div>

            <!-- Price Range Filter -->
            <div class="border-t border-slate-200 pt-4">
              <h3 class="mb-3 text-sm font-semibold text-slate-900">Price Range</h3>
              <div class="space-y-3">
                <div class="flex gap-2">
                  <input
                    v-model.number="priceRangeMin"
                    type="number"
                    placeholder="Min"
                    class="flex-1 rounded-lg border border-slate-200 px-2 py-1.5 text-sm focus:border-brand focus:outline-none"
                  />
                  <span class="flex items-center text-slate-500">-</span>
                  <input
                    v-model.number="priceRangeMax"
                    type="number"
                    placeholder="Max"
                    class="flex-1 rounded-lg border border-slate-200 px-2 py-1.5 text-sm focus:border-brand focus:outline-none"
                  />
                </div>
                <p class="text-xs text-slate-500">
                  BDT {{ priceRangeMin.toLocaleString() }} - BDT {{ priceRangeMax.toLocaleString() }}
                </p>
              </div>
            </div>

            <!-- Brand Filter -->
            <div class="border-t border-slate-200 pt-4">
              <h3 class="mb-3 text-sm font-semibold text-slate-900">Brands</h3>
              <div class="space-y-2">
                <button
                  @click="selectedBrand = null"
                  class="flex w-full items-center gap-2 px-2 py-1.5 text-sm transition rounded hover:bg-slate-50"
                  :class="selectedBrand === null ? 'text-brand font-semibold' : 'text-slate-700'"
                >
                  <span class="h-4 w-4 rounded border-2" :class="selectedBrand === null ? 'border-brand bg-brand' : 'border-slate-300'" />
                  All Brands
                </button>
                <button
                  v-for="brand in brands"
                  :key="brand"
                  @click="selectedBrand = brand === selectedBrand ? null : brand"
                  class="flex w-full items-center gap-2 px-2 py-1.5 text-sm transition rounded hover:bg-slate-50"
                  :class="selectedBrand === brand ? 'text-brand font-semibold' : 'text-slate-700'"
                >
                  <span
                    class="h-4 w-4 rounded border-2"
                    :class="selectedBrand === brand ? 'border-brand bg-brand' : 'border-slate-300'"
                  />
                  {{ brand }}
                </button>
              </div>
            </div>

            <!-- Product Flag Filter -->
            <div class="border-t border-slate-200 pt-4">
              <h3 class="mb-3 text-sm font-semibold text-slate-900">Product Flag</h3>
              <div class="space-y-2">
                <button
                  @click="selectedFlag = null"
                  class="flex w-full items-center gap-2 px-2 py-1.5 text-sm transition rounded hover:bg-slate-50"
                  :class="selectedFlag === null ? 'text-brand font-semibold' : 'text-slate-700'"
                >
                  <span class="h-4 w-4 rounded border-2" :class="selectedFlag === null ? 'border-brand bg-brand' : 'border-slate-300'" />
                  All Items
                </button>
                <button
                  v-for="flag in flags"
                  :key="flag"
                  @click="selectedFlag = flag === selectedFlag ? null : flag"
                  class="flex w-full items-center gap-2 px-2 py-1.5 text-sm transition rounded hover:bg-slate-50"
                  :class="selectedFlag === flag ? 'text-brand font-semibold' : 'text-slate-700'"
                >
                  <span
                    class="h-4 w-4 rounded border-2"
                    :class="selectedFlag === flag ? 'border-brand bg-brand' : 'border-slate-300'"
                  />
                  {{ flag }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <!-- Products Grid -->
      <main>
        <!-- Results Count -->
        <div class="mb-4 flex items-center justify-between">
          <p class="text-sm font-medium text-slate-600">
            Showing <span class="font-semibold text-slate-900">{{ filteredProducts.length }}</span>
            products
          </p>
        </div>

        <!-- No Results Message -->
        <div
          v-if="filteredProducts.length === 0"
          class="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center"
        >
          <svg
            class="mx-auto h-12 w-12 text-slate-400 mb-3"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <p class="text-sm font-medium text-slate-600">No products found</p>
          <p class="mt-1 text-xs text-slate-500">Try adjusting your filters</p>
          <button
            @click="resetFilters"
            class="mt-3 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark"
          >
            Reset Filters
          </button>
        </div>

        <!-- Products Grid -->
        <div v-else class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <article
            v-for="product in filteredProducts"
            :key="product.name"
            class="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg cursor-pointer"
            @click="openProductDetail(product)"
          >
            <!-- Image -->
            <div class="relative overflow-hidden h-40">
              <img
                :src="product.image"
                :alt="product.name"
                class="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                loading="lazy"
              />
              <!-- Badge -->
              <div
                v-if="product.badge"
                class="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-rose-100 px-2.5 py-1 text-xs font-semibold text-rose-700"
              >
                {{ product.badge }}
              </div>
              <!-- Flag -->
              <div
                v-if="product.flag"
                class="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-700"
              >
                {{ product.flag }}
              </div>
            </div>

            <!-- Content -->
            <div class="p-3">
              <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">{{ product.category }}</p>
              <h3 class="mt-1 line-clamp-2 text-sm font-semibold text-slate-900">{{ product.name }}</h3>

              <!-- Price -->
              <div class="mt-2 flex items-center gap-2">
                <span class="text-sm font-bold text-brand">{{ product.price }}</span>
                <span v-if="product.oldPrice" class="text-xs text-slate-400 line-through">{{ product.oldPrice }}</span>
              </div>

              <!-- Brand -->
              <p v-if="product.brand" class="mt-2 text-xs text-slate-500">{{ product.brand }}</p>

              <!-- Add to Cart Button -->
              <button
                @click.stop
                class="mt-3 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-brand hover:text-brand"
              >
                Add to Cart
              </button>
            </div>
          </article>
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
/* Smooth transitions for filters */
:deep(.transition) {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}
</style>
