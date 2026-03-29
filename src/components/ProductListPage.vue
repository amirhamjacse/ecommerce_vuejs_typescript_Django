<script setup lang="ts">
import { ref, computed, watch } from 'vue'
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

type AddToCartPayload = {
  name: string
  price: string
  image: string
}

const props = defineProps<{
  onAddToCart?: (item: AddToCartPayload) => void
}>()

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
  {
    name: 'Floor Cleaner Lemon 1L',
    category: 'Home',
    price: 'BDT 290',
    oldPrice: 'BDT 340',
    image: 'https://picsum.photos/seed/pro-floor-cleaner/360/300',
    badge: '-15%',
    brand: 'GhorerBazar',
    description: 'Fresh lemon floor cleaner for daily hygiene.',
  },
  {
    name: 'Kitchen Tissue Roll Pack',
    category: 'Home',
    price: 'BDT 180',
    oldPrice: 'BDT 220',
    image: 'https://picsum.photos/seed/pro-tissue/360/300',
    badge: '-18%',
    brand: 'Honeyraj',
    flag: 'Offered Items',
    description: 'Soft and absorbent kitchen tissue roll pack.',
  },
  {
    name: 'Glass Cleaner 500ml',
    category: 'Home',
    price: 'BDT 240',
    oldPrice: 'BDT 290',
    image: 'https://picsum.photos/seed/pro-glass-cleaner/360/300',
    badge: '-17%',
    brand: 'GhorerBazar',
    description: 'Streak-free glass cleaner for mirrors and windows.',
  },
  {
    name: 'Hand Wash Refill 1L',
    category: 'Home',
    price: 'BDT 320',
    oldPrice: 'BDT 380',
    image: 'https://picsum.photos/seed/pro-handwash/360/300',
    badge: '-16%',
    brand: 'Honeyraj',
    flag: 'New Arrival',
    description: 'Antibacterial hand wash refill for family use.',
  },
  {
    name: 'Air Freshener Citrus',
    category: 'Home',
    price: 'BDT 260',
    oldPrice: 'BDT 310',
    image: 'https://picsum.photos/seed/pro-air-freshener/360/300',
    badge: '-16%',
    brand: 'GhorerBazar',
    description: 'Long-lasting room freshener with citrus notes.',
  },
  {
    name: 'Natural Neem Honey 500g',
    category: 'Honey',
    price: 'BDT 760',
    oldPrice: 'BDT 890',
    image: 'https://picsum.photos/seed/pro-neem-honey/360/300',
    badge: '-15%',
    brand: 'Honeyraj',
    flag: 'New Arrival',
    description: 'Raw neem honey with earthy flavor and wellness benefits.',
  },
  {
    name: 'Wild Forest Honey 750g',
    category: 'Honey',
    price: 'BDT 1,250',
    oldPrice: 'BDT 1,420',
    image: 'https://picsum.photos/seed/pro-wild-honey/360/300',
    badge: '-12%',
    brand: 'GhorerBazar',
    flag: 'Offered Items',
    description: 'Wild forest honey with deep aroma and rich taste.',
  },
  {
    name: 'Mustard Flower Honey 500g',
    category: 'Honey',
    price: 'BDT 590',
    oldPrice: 'BDT 690',
    image: 'https://picsum.photos/seed/pro-mustard-honey/360/300',
    badge: '-14%',
    brand: 'Honeyraj',
    description: 'Monofloral mustard flower honey with smooth sweetness.',
  },
  {
    name: 'Tulsi Honey 350g',
    category: 'Honey',
    price: 'BDT 540',
    oldPrice: 'BDT 620',
    image: 'https://picsum.photos/seed/pro-tulsi-honey/360/300',
    badge: '-13%',
    brand: 'GhorerBazar',
    description: 'Tulsi infused honey for tea and daily immunity care.',
  },
  {
    name: 'Raw Mountain Honey 1kg',
    category: 'Honey',
    price: 'BDT 1,980',
    oldPrice: 'BDT 2,250',
    image: 'https://picsum.photos/seed/pro-mountain-honey/360/300',
    badge: '-12%',
    brand: 'Honeyraj',
    flag: 'Offered Items',
    description: 'Unprocessed mountain honey with natural pollen traces.',
  },
  {
    name: 'Bee Pollen Honey Mix 300g',
    category: 'Honey',
    price: 'BDT 640',
    oldPrice: 'BDT 740',
    image: 'https://picsum.photos/seed/pro-bee-pollen-honey/360/300',
    badge: '-14%',
    brand: 'GhorerBazar',
    flag: 'New Arrival',
    description: 'Honey blend enriched with bee pollen.',
  },
  {
    name: 'Bathroom Cleaner 1L',
    category: 'Home',
    price: 'BDT 280',
    oldPrice: 'BDT 330',
    image: 'https://picsum.photos/seed/pro-bathroom-cleaner/360/300',
    badge: '-15%',
    brand: 'Honeyraj',
    description: 'Removes hard water stains and soap scum quickly.',
  },
  {
    name: 'Fabric Fresh Spray 250ml',
    category: 'Home',
    price: 'BDT 190',
    oldPrice: 'BDT 240',
    image: 'https://picsum.photos/seed/pro-fabric-spray/360/300',
    badge: '-21%',
    brand: 'GhorerBazar',
    description: 'Refreshes curtains, sofas, and bedsheets instantly.',
  },
  {
    name: 'Dish Scrub Pack 6pcs',
    category: 'Home',
    price: 'BDT 130',
    oldPrice: 'BDT 165',
    image: 'https://picsum.photos/seed/pro-dish-scrub/360/300',
    badge: '-21%',
    brand: 'Honeyraj',
    flag: 'Offered Items',
    description: 'Heavy duty scrub pads for kitchen cleaning.',
  },
  {
    name: 'Shoe Deodorizer Spray',
    category: 'Home',
    price: 'BDT 340',
    oldPrice: 'BDT 390',
    image: 'https://picsum.photos/seed/pro-shoe-deodorizer/360/300',
    badge: '-13%',
    brand: 'GhorerBazar',
    flag: 'New Arrival',
    description: 'Neutralizes odor and keeps shoes fresh longer.',
  },
  {
    name: 'Microwave Cleaner Gel',
    category: 'Home',
    price: 'BDT 270',
    oldPrice: 'BDT 320',
    image: 'https://picsum.photos/seed/pro-microwave-cleaner/360/300',
    badge: '-16%',
    brand: 'Honeyraj',
    description: 'Easy-clean gel for ovens and microwaves.',
  },
]

// Filter states
const selectedCategory = ref<string | null>(null)
const selectedBrand = ref<string | null>(null)
const selectedFlag = ref<string | null>(null)
const priceRangeMin = ref<number>(0)
const priceRangeMax = ref<number>(5000)
const minPriceInput = ref<string>('0')
const maxPriceInput = ref<string>('5000')
const showFilters = ref(true)
const sortBy = ref<'featured' | 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc'>('featured')
const itemsPerPage = ref<number>(16)
const currentPage = ref<number>(1)

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

const clampPrice = (value: number): number => {
  if (!Number.isFinite(value) || value < 0) return 0
  return Math.round(value)
}

const parsePriceInput = (value: string): number => {
  const sanitized = value.replace(/[^0-9.]/g, '')
  return clampPrice(Number(sanitized))
}

const formatBdt = (value: number): string => {
  return new Intl.NumberFormat('en-BD', {
    maximumFractionDigits: 0,
  }).format(value)
}

const applyPriceRange = () => {
  const parsedMin = parsePriceInput(minPriceInput.value)
  const parsedMax = parsePriceInput(maxPriceInput.value)

  if (parsedMin <= parsedMax) {
    priceRangeMin.value = parsedMin
    priceRangeMax.value = parsedMax
    minPriceInput.value = String(parsedMin)
    maxPriceInput.value = String(parsedMax)
    return
  }

  priceRangeMin.value = parsedMax
  priceRangeMax.value = parsedMin
  minPriceInput.value = String(parsedMax)
  maxPriceInput.value = String(parsedMin)
}

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

const sortedProducts = computed(() => {
  const result = [...filteredProducts.value]

  if (sortBy.value === 'price-asc') {
    result.sort((a, b) => parsePrice(a.price) - parsePrice(b.price))
  } else if (sortBy.value === 'price-desc') {
    result.sort((a, b) => parsePrice(b.price) - parsePrice(a.price))
  } else if (sortBy.value === 'name-asc') {
    result.sort((a, b) => a.name.localeCompare(b.name))
  } else if (sortBy.value === 'name-desc') {
    result.sort((a, b) => b.name.localeCompare(a.name))
  }

  return result
})

const totalPages = computed(() => {
  const total = Math.ceil(sortedProducts.value.length / itemsPerPage.value)
  return total > 0 ? total : 1
})

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return sortedProducts.value.slice(start, end)
})

const startItem = computed(() => {
  if (sortedProducts.value.length === 0) return 0
  return (currentPage.value - 1) * itemsPerPage.value + 1
})

const endItem = computed(() => {
  return Math.min(currentPage.value * itemsPerPage.value, sortedProducts.value.length)
})

watch([selectedCategory, selectedBrand, selectedFlag, priceRangeMin, priceRangeMax, sortBy, itemsPerPage], () => {
  currentPage.value = 1
})

watch([sortedProducts, itemsPerPage], () => {
  if (currentPage.value > totalPages.value) {
    currentPage.value = totalPages.value
  }
})

const resetFilters = () => {
  selectedCategory.value = null
  selectedBrand.value = null
  selectedFlag.value = null
  priceRangeMin.value = 0
  priceRangeMax.value = 5000
  minPriceInput.value = '0'
  maxPriceInput.value = '5000'
  sortBy.value = 'featured'
  itemsPerPage.value = 16
  currentPage.value = 1
}

const goToPage = (page: number) => {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
}

const openProductDetail = (product: Product) => {
  const productSlug = product.name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '')

  const productPreview = {
    name: product.name,
    price: product.price,
    image: product.image,
    oldPrice: product.oldPrice,
    category: product.category,
    badge: product.badge,
    images: product.images,
    description: product.description,
    keyFeatures: product.keyFeatures,
    usageIdeas: product.usageIdeas,
  }

  sessionStorage.setItem(`product-preview:${productSlug}`, JSON.stringify(productPreview))
  router.push({ name: 'product-detail', params: { productName: productSlug } })
}

const addToCartFromList = (product: Product) => {
  props.onAddToCart?.({
    name: product.name,
    price: product.price,
    image: product.image,
  })
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
                <div class="rounded-xl border border-slate-200 bg-slate-50/70 p-3">
                  <div class="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
                    <input
                      v-model="minPriceInput"
                      type="number"
                      min="0"
                      step="1"
                      inputmode="numeric"
                      placeholder="0"
                      class="min-w-0 rounded-lg border border-slate-200 bg-white px-2 py-2 text-sm focus:border-brand focus:outline-none"
                    />
                    <span class="text-slate-500">-</span>
                    <input
                      v-model="maxPriceInput"
                      type="number"
                      min="0"
                      step="1"
                      inputmode="numeric"
                      placeholder="5000"
                      class="min-w-0 rounded-lg border border-slate-200 bg-white px-2 py-2 text-sm focus:border-brand focus:outline-none"
                    />
                  </div>
                  <button
                    type="button"
                    class="mt-2 w-full rounded-lg bg-brand px-3 py-2 text-xs font-semibold text-white hover:bg-brand-dark"
                    @click="applyPriceRange"
                  >
                    Go
                  </button>
                </div>
                <p class="text-xs font-medium text-slate-600">
                  BDT {{ formatBdt(priceRangeMin) }} - BDT {{ formatBdt(priceRangeMax) }}
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
        <!-- Top Controls -->
        <div class="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div class="flex items-center gap-2">
            <label for="sort-by" class="text-sm font-semibold text-slate-700">Sort By</label>
            <select
              id="sort-by"
              v-model="sortBy"
              class="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-brand focus:outline-none"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Name: A to Z</option>
              <option value="name-desc">Name: Z to A</option>
            </select>
          </div>

          <div class="flex flex-wrap items-center gap-3 md:justify-end">
            <p class="text-sm font-medium text-slate-600">
              Showing <span class="font-semibold text-slate-900">{{ startItem }}</span>
              - <span class="font-semibold text-slate-900">{{ endItem }}</span>
              of <span class="font-semibold text-slate-900">{{ sortedProducts.length }}</span>
            </p>
            <div class="flex items-center gap-2">
              <label for="items-per-page" class="text-sm font-semibold text-slate-700">Show</label>
              <select
                id="items-per-page"
                v-model.number="itemsPerPage"
                class="rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-sm text-slate-700 focus:border-brand focus:outline-none"
              >
                <option :value="16">16</option>
                <option :value="24">24</option>
                <option :value="32">32</option>
              </select>
            </div>
          </div>
        </div>

        <!-- No Results Message -->
        <div
          v-if="sortedProducts.length === 0"
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
            v-for="product in paginatedProducts"
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
                @click.stop="addToCartFromList(product)"
                class="mt-3 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-brand hover:text-brand"
              >
                Add to Cart
              </button>
            </div>
          </article>
        </div>

        <div v-if="sortedProducts.length > itemsPerPage" class="mt-6 flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            class="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-brand hover:text-brand disabled:cursor-not-allowed disabled:opacity-50"
            :disabled="currentPage === 1"
            @click="goToPage(currentPage - 1)"
          >
            Prev
          </button>

          <button
            v-for="page in totalPages"
            :key="`page-${page}`"
            type="button"
            class="rounded-lg border px-3 py-2 text-sm font-semibold transition"
            :class="
              currentPage === page
                ? 'border-brand bg-brand text-white'
                : 'border-slate-200 bg-white text-slate-700 hover:border-brand hover:text-brand'
            "
            @click="goToPage(page)"
          >
            {{ page }}
          </button>

          <button
            type="button"
            class="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-brand hover:text-brand disabled:cursor-not-allowed disabled:opacity-50"
            :disabled="currentPage === totalPages"
            @click="goToPage(currentPage + 1)"
          >
            Next
          </button>
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
