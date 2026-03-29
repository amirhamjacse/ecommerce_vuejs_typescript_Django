<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'

type Product = {
  name: string
  category: string
  price: string
  oldPrice: string
  image: string
  badge?: string
}

type CartProduct = {
  name: string
  price: string
  image: string
}

type CartItem = {
  id: string
  name: string
  image: string
  unitPrice: number
  qty: number
}

const carouselPosters = [
  {
    title: 'Fresh groceries delivered fast across Bangladesh',
    subtitle: 'Clean product browsing and quick checkout for daily needs.',
    cta: 'Shop Now',
    image: 'https://picsum.photos/seed/pro-ecom-hero-1/1240/560',
  },
  {
    title: 'Daily essentials with smart prices and reliable delivery',
    subtitle: 'Trusted collections for grocery, organic items, and household products.',
    cta: 'View Deals',
    image: 'https://picsum.photos/seed/pro-ecom-hero-2/1240/560',
  },
]

const staticPoster = {
  title: 'Weekend Mega Offer',
  subtitle: 'Get exclusive discounts on top category products.',
  image: 'https://picsum.photos/seed/pro-static-poster/760/920',
}

const defaultPoster = {
  title: 'Fresh Grocery Deals',
  subtitle: 'Best picks for your home essentials.',
  cta: 'Shop Now',
  image: 'https://picsum.photos/seed/pro-ecom-hero-fallback/1240/560',
}

const activePoster = ref(0)

const nextPoster = () => {
  activePoster.value = (activePoster.value + 1) % carouselPosters.length
}

const prevPoster = () => {
  activePoster.value = (activePoster.value - 1 + carouselPosters.length) % carouselPosters.length
}

let posterTimer: ReturnType<typeof setInterval> | undefined
let flashSaleTimer: ReturnType<typeof setInterval> | undefined
let topSellingTimer: ReturnType<typeof setInterval> | undefined

const stopAutoPoster = () => {
  if (posterTimer) {
    clearInterval(posterTimer)
    posterTimer = undefined
  }
}

const startAutoPoster = () => {
  if (posterTimer || carouselPosters.length < 2) return
  posterTimer = setInterval(() => {
    nextPoster()
  }, 4500)
}

const handleVisibilityChange = () => {
  if (document.hidden) {
    stopAutoPoster()
    stopAutoFlashSale()
    stopAutoTopSelling()
    return
  }
  startAutoPoster()
  startAutoFlashSale()
  startAutoTopSelling()
}

const showBackToTop = ref(false)

const handlePageScroll = () => {
  showBackToTop.value = window.scrollY > 320
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  startAutoPoster()
  startAutoFlashSale()
  startAutoTopSelling()
  document.addEventListener('visibilitychange', handleVisibilityChange)
  window.addEventListener('scroll', handlePageScroll, { passive: true })
  handlePageScroll()
})

onUnmounted(() => {
  stopAutoPoster()
  stopAutoFlashSale()
  stopAutoTopSelling()
  document.removeEventListener('visibilitychange', handleVisibilityChange)
  window.removeEventListener('scroll', handlePageScroll)
})

const featuredQuickCategories = [
  { name: 'See all', image: 'https://picsum.photos/seed/featured-see-all/120/120' },
  { name: 'Oil and Ghee', image: 'https://picsum.photos/seed/featured-oil-ghee/120/120' },
  { name: 'Organic', image: 'https://picsum.photos/seed/featured-organic/120/120' },
  { name: 'Honey', image: 'https://picsum.photos/seed/featured-honey/120/120' },
  { name: 'Dates', image: 'https://picsum.photos/seed/featured-dates/120/120' },
  { name: 'Spices', image: 'https://picsum.photos/seed/featured-spices/120/120' },
  { name: 'Nuts and Seeds', image: 'https://picsum.photos/seed/featured-nuts-seeds/120/120' },
  { name: 'Beverage', image: 'https://picsum.photos/seed/featured-beverage/120/120' },
  { name: 'Rice', image: 'https://picsum.photos/seed/featured-rice/120/120' },
  { name: 'Flours and Lentils', image: 'https://picsum.photos/seed/featured-flours-lentils/120/120' },
  { name: 'Functional Food', image: 'https://picsum.photos/seed/featured-functional-food/120/120' },
]

const flashSaleItems: Product[] = [
  {
    name: 'Deshi Onion 1kg',
    category: 'Vegetables',
    price: 'BDT 118',
    oldPrice: 'BDT 145',
    image: 'https://picsum.photos/seed/pro-onion/360/300',
    badge: '-19%',
  },
  {
    name: 'Hilsa Fish Premium',
    category: 'Fish and Meat',
    price: 'BDT 1,390',
    oldPrice: 'BDT 1,620',
    image: 'https://picsum.photos/seed/pro-fish/360/300',
    badge: '-14%',
  },
  {
    name: 'Chinigura Rice 5kg',
    category: 'Groceries',
    price: 'BDT 620',
    oldPrice: 'BDT 730',
    image: 'https://picsum.photos/seed/pro-rice/360/300',
    badge: '-15%',
  },
  {
    name: 'Mustard Oil 1L',
    category: 'Essentials',
    price: 'BDT 265',
    oldPrice: 'BDT 295',
    image: 'https://picsum.photos/seed/pro-oil/360/300',
    badge: '-10%',
  },
]

const topSellingProducts = [
  {
    name: 'Deshi Mustard Oil 5 liter',
    tag: 'Best Selling',
    price: '৳1,470',
    oldPrice: '৳1,550',
    save: 'Save ৳80',
    image: 'https://picsum.photos/seed/top-mustard-oil/420/320',
  },
  {
    name: 'Gawa Ghee 1kg',
    tag: 'Best Selling',
    price: '৳1,710',
    oldPrice: '৳1,800',
    save: 'Save ৳90',
    image: 'https://picsum.photos/seed/top-gawa-ghee/420/320',
  },
  {
    name: 'Sundarban Honey 1kg',
    tag: 'Offered Items',
    price: '৳2,200',
    oldPrice: '৳2,500',
    save: 'Save ৳300',
    image: 'https://picsum.photos/seed/top-sundarban-honey/420/320',
  },
  {
    name: 'Lachcha Semai 1kg',
    tag: 'Best Selling',
    price: '৳1,400',
    oldPrice: '৳1,500',
    save: 'Save ৳100',
    image: 'https://picsum.photos/seed/top-lachcha-semai/420/320',
  },
]

const staticSplitBanners = [
  {
    title: 'Healthy Kitchen Collection',
    subtitle: 'Premium oils, ghee, spices, and pantry essentials.',
    image: 'https://picsum.photos/seed/static-split-left/1000/520',
  },
  {
    title: 'Organic and Functional Foods',
    subtitle: 'Honey, dates, nuts, and curated wellness products.',
    image: 'https://picsum.photos/seed/static-split-right/1000/520',
  },
]

const popularItems: Product[] = [
  {
    name: 'Farm Fresh Eggs (12 pcs)',
    category: 'Dairy and Eggs',
    price: 'BDT 155',
    oldPrice: 'BDT 180',
    image: 'https://picsum.photos/seed/pro-egg/360/300',
  },
  {
    name: 'PRAN UHT Milk 1L',
    category: 'Milk',
    price: 'BDT 108',
    oldPrice: 'BDT 120',
    image: 'https://picsum.photos/seed/pro-milk/360/300',
  },
  {
    name: 'ACI Salt 1kg',
    category: 'Essentials',
    price: 'BDT 46',
    oldPrice: 'BDT 52',
    image: 'https://picsum.photos/seed/pro-salt/360/300',
  },
  {
    name: 'Teer Flour 2kg',
    category: 'Groceries',
    price: 'BDT 168',
    oldPrice: 'BDT 190',
    image: 'https://picsum.photos/seed/pro-flour/360/300',
  },
  {
    name: 'Orange Juice 1L',
    category: 'Beverages',
    price: 'BDT 148',
    oldPrice: 'BDT 170',
    image: 'https://picsum.photos/seed/pro-juice/360/300',
  },
  {
    name: 'Body Wash 500ml',
    category: 'Personal Care',
    price: 'BDT 420',
    oldPrice: 'BDT 480',
    image: 'https://picsum.photos/seed/pro-bodywash/360/300',
  },
  {
    name: 'Organic Honey 250g',
    category: 'Health Food',
    price: 'BDT 370',
    oldPrice: 'BDT 420',
    image: 'https://picsum.photos/seed/pro-honey/360/300',
  },
  {
    name: 'Dishwash Liquid 1L',
    category: 'Home Care',
    price: 'BDT 230',
    oldPrice: 'BDT 270',
    image: 'https://picsum.photos/seed/pro-dishwash/360/300',
  },
  {
    name: 'Basmati Rice 2kg',
    category: 'Groceries',
    price: 'BDT 460',
    oldPrice: 'BDT 520',
    image: 'https://picsum.photos/seed/pro-basmati/360/300',
  },
  {
    name: 'Potato 1kg',
    category: 'Vegetables',
    price: 'BDT 52',
    oldPrice: 'BDT 65',
    image: 'https://picsum.photos/seed/pro-potato/360/300',
  },
  {
    name: 'Chicken Broiler 1kg',
    category: 'Fish and Meat',
    price: 'BDT 285',
    oldPrice: 'BDT 320',
    image: 'https://picsum.photos/seed/pro-chicken/360/300',
  },
  {
    name: 'Frozen Peas 500g',
    category: 'Frozen Food',
    price: 'BDT 165',
    oldPrice: 'BDT 190',
    image: 'https://picsum.photos/seed/pro-peas/360/300',
  },
  {
    name: 'Banana (12 pcs)',
    category: 'Fruits',
    price: 'BDT 115',
    oldPrice: 'BDT 140',
    image: 'https://picsum.photos/seed/pro-banana/360/300',
  },
  {
    name: 'Tomato Ketchup 500g',
    category: 'Snacks',
    price: 'BDT 195',
    oldPrice: 'BDT 220',
    image: 'https://picsum.photos/seed/pro-ketchup/360/300',
  },
  {
    name: 'Shampoo 340ml',
    category: 'Personal Care',
    price: 'BDT 355',
    oldPrice: 'BDT 410',
    image: 'https://picsum.photos/seed/pro-shampoo/360/300',
  },
  {
    name: 'Mineral Water 1.5L',
    category: 'Beverages',
    price: 'BDT 42',
    oldPrice: 'BDT 50',
    image: 'https://picsum.photos/seed/pro-water/360/300',
  },
  {
    name: 'Toilet Cleaner 750ml',
    category: 'Home Care',
    price: 'BDT 210',
    oldPrice: 'BDT 250',
    image: 'https://picsum.photos/seed/pro-cleaner/360/300',
  },
  {
    name: 'Baby Diaper Pack',
    category: 'Baby Care',
    price: 'BDT 720',
    oldPrice: 'BDT 820',
    image: 'https://picsum.photos/seed/pro-diaper/360/300',
  },
  {
    name: 'Dates Premium 500g',
    category: 'Dry Foods',
    price: 'BDT 590',
    oldPrice: 'BDT 650',
    image: 'https://picsum.photos/seed/pro-dates/360/300',
  },
  {
    name: 'Green Chili 250g',
    category: 'Vegetables',
    price: 'BDT 36',
    oldPrice: 'BDT 45',
    image: 'https://picsum.photos/seed/pro-chili/360/300',
  },
]

const services = [
  { icon: 'delivery', title: 'Fast Delivery', subtitle: 'Same day in selected areas' },
  { icon: 'quality', title: 'Quality Checked', subtitle: 'Products verified before dispatch' },
  { icon: 'payment', title: 'Secure Payments', subtitle: 'bKash, Nagad, card, and COD' },
  { icon: 'return', title: 'Easy Return', subtitle: 'Simple return support on issues' },
]

const quickStats = [
  { title: '10K+', subtitle: 'Orders Delivered Weekly' },
  { title: '4.9/5', subtitle: 'Average Customer Rating' },
  { title: '64', subtitle: 'District Coverage' },
  { title: '1200+', subtitle: 'Daily Fresh Items' },
]

const collectionTabs = ['All', 'Groceries', 'Beverages', 'Personal Care', 'Home Care'] as const
type CollectionTab = (typeof collectionTabs)[number]
const activeCollection = ref<CollectionTab>('All')

const filteredPopularItems = computed(() => {
  if (activeCollection.value === 'All') return popularItems
  return popularItems.filter((item) => item.category === activeCollection.value)
})

const currentPoster = computed(() => {
  return carouselPosters[activePoster.value] ?? carouselPosters[0] ?? defaultPoster
})

const parsePrice = (priceText: string): number => {
  const numericValue = Number(priceText.replace(/[^0-9.]/g, ''))
  return Number.isFinite(numericValue) ? numericValue : 0
}

const formatPrice = (amount: number): string => {
  return `BDT ${Math.round(amount).toLocaleString('en-BD')}`
}

const buildCartId = (name: string): string => {
  return name.trim().toLowerCase()
}

const isCartOpen = ref(false)
const cartItems = ref<CartItem[]>([])

const cartCount = computed(() => {
  return cartItems.value.reduce((total, item) => total + item.qty, 0)
})

const cartSubtotal = computed(() => {
  return cartItems.value.reduce((total, item) => total + item.unitPrice * item.qty, 0)
})

const openCart = () => {
  isCartOpen.value = true
}

const closeCart = () => {
  isCartOpen.value = false
}

const addToCart = (item: CartProduct) => {
  const id = buildCartId(item.name)
  const existing = cartItems.value.find((cartItem) => cartItem.id === id)
  if (existing) {
    existing.qty += 1
    return
  }

  cartItems.value.unshift({
    id,
    name: item.name,
    image: item.image,
    unitPrice: parsePrice(item.price),
    qty: 1,
  })
}

const incrementCartItem = (id: string) => {
  const item = cartItems.value.find((cartItem) => cartItem.id === id)
  if (!item) return
  item.qty += 1
}

const decrementCartItem = (id: string) => {
  const item = cartItems.value.find((cartItem) => cartItem.id === id)
  if (!item) return
  if (item.qty <= 1) {
    cartItems.value = cartItems.value.filter((cartItem) => cartItem.id !== id)
    return
  }
  item.qty -= 1
}

const removeCartItem = (id: string) => {
  cartItems.value = cartItems.value.filter((cartItem) => cartItem.id !== id)
}

const clearCart = () => {
  cartItems.value = []
}

const buyNow = (item: CartProduct) => {
  addToCart(item)
  openCart()
}

const buildSlideWindows = <T>(items: T[], size: number): T[][] => {
  if (!items.length) return []

  // If we have size or fewer items, rotate order so users can still slide card-by-card.
  if (items.length <= size) {
    return items.map((_, start) => {
      return Array.from({ length: size }, (_, offset) => items[(start + offset) % items.length]!)
    })
  }

  const windows: T[][] = []
  for (let index = 0; index <= items.length - size; index += 1) {
    windows.push(items.slice(index, index + size))
  }
  return windows
}

const activeFlashSaleSlide = ref(0)
const flashSaleSlides = computed(() => buildSlideWindows(flashSaleItems, 4))

const activeTopSellingSlide = ref(0)
const topSellingSlides = computed(() => buildSlideWindows(topSellingProducts, 4))

const getSwipeClientX = (event: TouchEvent | MouseEvent): number | null => {
  if ('touches' in event) {
    if (event.touches.length > 0) return event.touches[0]!.clientX
    if (event.changedTouches.length > 0) return event.changedTouches[0]!.clientX
    return null
  }
  return event.clientX
}

const swipeThreshold = 36
const flashSwipeStartX = ref<number | null>(null)
const topSwipeStartX = ref<number | null>(null)

const goToFlashSaleSlide = (index: number) => {
  const total = flashSaleSlides.value.length
  if (!total) return
  activeFlashSaleSlide.value = (index + total) % total
}

const nextFlashSaleSlide = () => {
  goToFlashSaleSlide(activeFlashSaleSlide.value + 1)
}

const prevFlashSaleSlide = () => {
  goToFlashSaleSlide(activeFlashSaleSlide.value - 1)
}

const stopAutoFlashSale = () => {
  if (flashSaleTimer) {
    clearInterval(flashSaleTimer)
    flashSaleTimer = undefined
  }
}

const startAutoFlashSale = () => {
  if (flashSaleTimer || flashSaleSlides.value.length < 2) return
  flashSaleTimer = setInterval(() => {
    nextFlashSaleSlide()
  }, 3500)
}

const restartAutoFlashSale = () => {
  stopAutoFlashSale()
  startAutoFlashSale()
}

const handleFlashSwipeStart = (event: TouchEvent | MouseEvent) => {
  flashSwipeStartX.value = getSwipeClientX(event)
}

const handleFlashSwipeEnd = (event: TouchEvent | MouseEvent) => {
  const endX = getSwipeClientX(event)
  if (flashSwipeStartX.value === null || endX === null) {
    flashSwipeStartX.value = null
    return
  }

  const distance = endX - flashSwipeStartX.value
  if (Math.abs(distance) >= swipeThreshold) {
    if (distance < 0) nextFlashSaleSlide()
    else prevFlashSaleSlide()
    restartAutoFlashSale()
  }
  flashSwipeStartX.value = null
}

const handleFlashMouseLeave = () => {
  flashSwipeStartX.value = null
  startAutoFlashSale()
}

const goToTopSellingSlide = (index: number) => {
  const total = topSellingSlides.value.length
  if (!total) return
  activeTopSellingSlide.value = (index + total) % total
}

const nextTopSellingSlide = () => {
  goToTopSellingSlide(activeTopSellingSlide.value + 1)
}

const prevTopSellingSlide = () => {
  goToTopSellingSlide(activeTopSellingSlide.value - 1)
}

const stopAutoTopSelling = () => {
  if (topSellingTimer) {
    clearInterval(topSellingTimer)
    topSellingTimer = undefined
  }
}

const startAutoTopSelling = () => {
  if (topSellingTimer || topSellingSlides.value.length < 2) return
  topSellingTimer = setInterval(() => {
    nextTopSellingSlide()
  }, 3900)
}

const restartAutoTopSelling = () => {
  stopAutoTopSelling()
  startAutoTopSelling()
}

const handleTopSellingSwipeStart = (event: TouchEvent | MouseEvent) => {
  topSwipeStartX.value = getSwipeClientX(event)
}

const handleTopSellingSwipeEnd = (event: TouchEvent | MouseEvent) => {
  const endX = getSwipeClientX(event)
  if (topSwipeStartX.value === null || endX === null) {
    topSwipeStartX.value = null
    return
  }

  const distance = endX - topSwipeStartX.value
  if (Math.abs(distance) >= swipeThreshold) {
    if (distance < 0) nextTopSellingSlide()
    else prevTopSellingSlide()
    restartAutoTopSelling()
  }
  topSwipeStartX.value = null
}

const handleTopSellingMouseLeave = () => {
  topSwipeStartX.value = null
  startAutoTopSelling()
}

const productCard =
  'group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg'
const productThumb = 'h-40 w-full object-cover transition duration-300 group-hover:scale-105'
const productBtn =
  'mt-3 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-brand hover:text-brand'

const limitedOfferCard =
  'group overflow-hidden rounded-3xl border border-amber-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-amber-300 hover:shadow-lg'
const limitedOfferThumb = 'h-52 w-full object-cover transition duration-300 group-hover:scale-105'

const topSellingCard =
  'group overflow-hidden rounded-3xl border border-emerald-200 bg-white shadow-[0_12px_30px_rgba(16,185,129,0.12)] transition duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-[0_18px_40px_rgba(16,185,129,0.2)]'
const topSellingThumb = 'h-52 w-full object-cover transition duration-300 group-hover:scale-105'
</script>

<template>
  <div class="relative mx-auto max-w-[1500px] overflow-hidden px-2 py-4 md:px-3 lg:px-4">

    <div class="rise-in rounded-xl border border-brand/20 px-4 py-2 text-center text-[13px] font-medium text-brand shadow-sm md:text-sm">
      Pro Store Template: consistent product cards, compact categories, and scalable layout for any ecommerce niche.
    </div>

    <header class="rise-in rise-in-delay-1 sticky top-3 z-20 mt-3 overflow-hidden rounded-2xl border border-slate-200/80 bg-white/95 shadow-[0_14px_30px_rgba(15,23,42,0.1)] backdrop-blur-xl">
      <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-4 py-2 text-xs text-slate-600 md:text-sm">
        <p>Hotline +880 1700 000000 | support@bazarbd.com</p>
        <div class="flex items-center gap-3">
          <a class="hover:text-brand" href="#">Track Order</a>
          <a class="hover:text-brand" href="#">My Account</a>
          <a class="hover:text-brand" href="#">Support</a>
        </div>
      </div>

      <div class="flex flex-wrap items-center gap-3 px-4 py-3 md:flex-nowrap md:gap-4">
        <a class="inline-flex min-w-fit items-center gap-2 text-ink" href="#">
          <span class="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-brand text-lg font-bold text-white">B</span>
          <span class="font-display text-xl font-semibold tracking-tight">BazarPro</span>
        </a>

        <div class="flex min-w-[240px] flex-1 items-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50 focus-within:ring-2 focus-within:ring-brand/30">
          <button class="h-11 border-r border-slate-200 px-3 text-sm font-medium text-slate-700" type="button">All</button>
          <input
            class="h-11 w-full bg-transparent px-3 text-sm outline-none"
            type="search"
            placeholder="Search products"
            aria-label="Search products"
          />
          <button class="h-11 bg-brand px-4 text-sm font-semibold text-white hover:bg-brand-dark" type="button">Search</button>
        </div>

        <div class="ml-auto flex items-center gap-2 md:ml-0">
          <button class="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:border-brand hover:text-brand" type="button">
            Wishlist
          </button>
          <button
            class="rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90"
            type="button"
            @click="openCart"
          >
            Cart ({{ cartCount }}) {{ formatPrice(cartSubtotal) }}
          </button>
        </div>
      </div>

      <nav class="hidden items-center gap-2 border-t border-slate-100 px-4 py-2 text-sm font-medium text-slate-700 md:flex">
        <a class="rounded-md bg-brand-soft px-3 py-1.5 text-brand" href="#">Browse</a>
        <a class="rounded-md px-3 py-1.5 hover:bg-slate-100" href="#">Deals</a>
        <a class="rounded-md px-3 py-1.5 hover:bg-slate-100" href="#">New Arrival</a>
        <a class="rounded-md px-3 py-1.5 hover:bg-slate-100" href="#">Trending</a>
        <a class="rounded-md px-3 py-1.5 hover:bg-slate-100" href="#">Popular Brands</a>
      </nav>
    </header>

    <button
      v-if="isCartOpen"
      type="button"
      class="fixed inset-0 z-30 bg-slate-900/40"
      aria-label="Close cart"
      @click="closeCart"
    ></button>

    <aside
      class="fixed right-0 top-0 z-40 flex h-screen w-full max-w-md flex-col border-l border-slate-200 bg-white shadow-2xl transition-transform duration-300"
      :class="isCartOpen ? 'translate-x-0' : 'translate-x-full'"
      aria-label="Shopping cart"
    >
      <div class="flex items-center justify-between border-b border-slate-100 px-5 py-4">
        <div>
          <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Cart Summary</p>
          <h3 class="text-lg font-semibold text-ink">Your Cart ({{ cartCount }})</h3>
        </div>
        <button
          type="button"
          class="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:border-brand hover:text-brand"
          @click="closeCart"
        >
          Close
        </button>
      </div>

      <div class="flex-1 overflow-y-auto px-5 py-4">
        <div v-if="!cartItems.length" class="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5 text-center">
          <p class="text-sm font-medium text-slate-600">Your cart is empty.</p>
          <p class="mt-1 text-xs text-slate-500">Add products from the cards to see them here.</p>
        </div>

        <div v-else class="space-y-3">
          <article
            v-for="item in cartItems"
            :key="item.id"
            class="rounded-xl border border-slate-200 p-3"
          >
            <div class="flex gap-3">
              <img :src="item.image" :alt="item.name" class="h-14 w-14 rounded-lg object-cover" loading="lazy" />
              <div class="min-w-0 flex-1">
                <p class="line-clamp-2 text-sm font-semibold text-ink">{{ item.name }}</p>
                <p class="text-xs text-slate-500">{{ formatPrice(item.unitPrice) }} each</p>
                <p class="mt-1 text-sm font-semibold text-brand">{{ formatPrice(item.unitPrice * item.qty) }}</p>
              </div>
            </div>

            <div class="mt-3 flex items-center justify-between">
              <div class="inline-flex items-center overflow-hidden rounded-lg border border-slate-200">
                <button
                  type="button"
                  class="h-8 w-8 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                  @click="decrementCartItem(item.id)"
                >
                  -
                </button>
                <span class="inline-flex h-8 min-w-9 items-center justify-center border-x border-slate-200 text-sm font-semibold text-slate-700">{{ item.qty }}</span>
                <button
                  type="button"
                  class="h-8 w-8 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                  @click="incrementCartItem(item.id)"
                >
                  +
                </button>
              </div>

              <button
                type="button"
                class="text-xs font-semibold text-rose-600 hover:text-rose-700"
                @click="removeCartItem(item.id)"
              >
                Remove
              </button>
            </div>
          </article>
        </div>
      </div>

      <div class="border-t border-slate-100 px-5 py-4">
        <div class="mb-3 flex items-center justify-between text-sm">
          <span class="font-medium text-slate-600">Subtotal</span>
          <span class="text-lg font-bold text-ink">{{ formatPrice(cartSubtotal) }}</span>
        </div>
        <div class="grid grid-cols-2 gap-2">
          <button
            type="button"
            class="rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold text-slate-700 hover:border-brand hover:text-brand disabled:cursor-not-allowed disabled:opacity-50"
            :disabled="!cartItems.length"
            @click="clearCart"
          >
            Clear cart
          </button>
          <button
            type="button"
            class="rounded-xl bg-brand px-3 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-50"
            :disabled="!cartItems.length"
          >
            Checkout
          </button>
        </div>
      </div>
    </aside>

    <main class="mt-6 space-y-6 md:space-y-7">
      <section class="rise-in grid grid-cols-1 gap-3 md:gap-5 lg:grid-cols-[70%_30%]">
        <article
          class="relative overflow-hidden rounded-3xl border border-slate-100 shadow-xl ring-1 ring-black/5"
          @mouseenter="stopAutoPoster"
          @mouseleave="startAutoPoster"
          @focusin="stopAutoPoster"
          @focusout="startAutoPoster"
        >
          <img :src="currentPoster.image" :alt="currentPoster.title" class="h-[320px] w-full object-cover md:h-[390px]" loading="lazy" />
          <div class="absolute inset-0 bg-gradient-to-r from-[#07291d]/90 via-[#0a402f]/60 to-transparent"></div>
          <div class="absolute inset-0 p-6 md:p-9">
            <span class="inline-flex rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand">Premium Grocery Store</span>
            <h1 class="mt-3 max-w-[620px] text-3xl font-semibold leading-tight text-white md:text-5xl">{{ currentPoster.title }}</h1>
            <p class="mt-3 max-w-[560px] text-sm text-emerald-50 md:text-base">{{ currentPoster.subtitle }}</p>
            <button class="mt-5 rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-orange-900/20" type="button">
              {{ currentPoster.cta }}
            </button>
          </div>
          <div class="absolute inset-x-0 bottom-4 flex items-center justify-between px-4 md:px-6">
            <div class="flex gap-2">
              <button
                v-for="(item, index) in carouselPosters"
                :key="item.title"
                type="button"
                :class="index === activePoster ? 'w-6 bg-white' : 'w-2.5 bg-white/60'"
                class="h-2.5 rounded-full transition"
                :aria-label="`Go to poster ${index + 1}`"
                @click="activePoster = index"
              ></button>
            </div>
            <div class="flex gap-2">
              <button
                class="h-8 w-8 rounded-full border border-white/40 bg-black/20 text-white backdrop-blur hover:bg-black/35"
                type="button"
                aria-label="Previous poster"
                @click="prevPoster"
              >
                ‹
              </button>
              <button
                class="h-8 w-8 rounded-full border border-white/40 bg-black/20 text-white backdrop-blur hover:bg-black/35"
                type="button"
                aria-label="Next poster"
                @click="nextPoster"
              >
                ›
              </button>
            </div>
          </div>
        </article>

        <aside class="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg">
          <img :src="staticPoster.image" :alt="staticPoster.title" class="h-[320px] w-full object-cover md:h-[390px]" loading="lazy" />
          <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
          <div class="absolute inset-x-0 bottom-0 p-5 text-white">
            <p class="inline-flex rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-brand">Static Poster</p>
            <h3 class="mt-2 text-xl font-semibold">{{ staticPoster.title }}</h3>
            <p class="text-sm text-emerald-100">{{ staticPoster.subtitle }}</p>
          </div>
        </aside>
      </section>

      <section class="rise-in grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <article
          v-for="stat in quickStats"
          :key="stat.title"
          class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
          <p class="text-2xl font-semibold text-ink">{{ stat.title }}</p>
          <p class="text-xs font-medium uppercase tracking-wide text-slate-500">{{ stat.subtitle }}</p>
        </article>
      </section>

      <section class="surface-card rise-in rise-in-delay-1 p-4 md:p-5">
        <div class="mb-4 flex items-center justify-between">
          <div>
            <p class="text-xs font-semibold uppercase tracking-wide text-brand">Featured Categories</p>
            <h2 class="text-2xl font-semibold">Shop by featured category</h2>
          </div>
          <a class="text-sm font-medium text-brand hover:underline" href="#">See all categories</a>
        </div>

        <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-11">
          <a
            v-for="category in featuredQuickCategories"
            :key="category.name"
            href="#"
            class="group rounded-xl border border-slate-200 bg-white p-3 text-center transition hover:-translate-y-0.5 hover:border-brand/50 hover:shadow-md"
          >
            <img
              :src="category.image"
              :alt="category.name"
              class="mx-auto h-14 w-14 rounded-full border border-slate-200 object-cover ring-4 ring-slate-50"
              loading="lazy"
            />
            <p class="mt-2 text-xs font-medium text-slate-700 transition group-hover:text-brand">{{ category.name }}</p>
          </a>
        </div>
      </section>

      <section class="surface-card rise-in rise-in-delay-1 p-4 md:p-6">
        <div class="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div>
            <p class="text-xs font-semibold uppercase tracking-wide text-amber-700">Flash Sale</p>
            <h2 class="text-2xl font-semibold">Limited time offers</h2>
          </div>
          <button class="rounded-lg border border-amber-200 bg-white px-3 py-2 text-sm font-semibold text-amber-700 hover:border-amber-400" type="button">
            View all deals
          </button>
        </div>

        <div
          class="relative overflow-hidden"
          @mouseenter="stopAutoFlashSale"
          @mouseleave="handleFlashMouseLeave"
          @mousedown="handleFlashSwipeStart"
          @mouseup="handleFlashSwipeEnd"
          @touchstart="handleFlashSwipeStart"
          @touchend="handleFlashSwipeEnd"
          @touchcancel="flashSwipeStartX = null"
        >
          <button
            type="button"
            class="absolute left-2 top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-amber-200 bg-white/95 text-amber-700 shadow-sm transition hover:border-amber-400 hover:bg-white lg:flex"
            aria-label="Previous flash sale slide"
            @click="prevFlashSaleSlide(); restartAutoFlashSale()"
          >
            ‹
          </button>
          <button
            type="button"
            class="absolute right-2 top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-amber-200 bg-white/95 text-amber-700 shadow-sm transition hover:border-amber-400 hover:bg-white lg:flex"
            aria-label="Next flash sale slide"
            @click="nextFlashSaleSlide(); restartAutoFlashSale()"
          >
            ›
          </button>
          <div class="flex transition-transform duration-500 ease-out" :style="{ transform: `translateX(-${activeFlashSaleSlide * 100}%)` }">
            <div v-for="(slide, slideIndex) in flashSaleSlides" :key="`flash-sale-slide-${slideIndex}`" class="w-full shrink-0">
              <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <article v-for="item in slide" :key="item.name" :class="limitedOfferCard">
                  <div class="relative overflow-hidden">
                    <img :src="item.image" :alt="item.name" :class="limitedOfferThumb" loading="lazy" />
                    <span
                      v-if="item.badge"
                      class="absolute left-3 top-3 rounded-full bg-rose-500 px-2.5 py-1 text-xs font-semibold text-white"
                    >
                      {{ item.badge }}
                    </span>
                  </div>
                  <div class="p-4">
                    <p class="text-xs text-slate-500">{{ item.category }}</p>
                    <h3 class="mt-1 text-base font-semibold text-ink">{{ item.name }}</h3>
                    <div class="mt-2 flex items-center gap-2">
                      <span class="text-lg font-bold text-amber-700">{{ item.price }}</span>
                      <span class="text-sm text-slate-400 line-through">{{ item.oldPrice }}</span>
                    </div>
                    <button class="mt-4 w-full rounded-xl bg-amber-600 px-3 py-2.5 text-sm font-semibold text-white hover:bg-amber-700" type="button" @click="addToCart(item)">
                      Add to cart
                    </button>
                  </div>
                </article>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-4 flex items-center justify-center gap-2">
          <button
            v-for="(_, dotIndex) in flashSaleSlides"
            :key="`flash-sale-dot-${dotIndex}`"
            type="button"
            class="h-2.5 rounded-full transition"
            :class="activeFlashSaleSlide === dotIndex ? 'w-6 bg-amber-600' : 'w-2.5 bg-amber-200 hover:bg-amber-300'"
            :aria-label="`Go to flash sale slide ${dotIndex + 1}`"
            @click="goToFlashSaleSlide(dotIndex); restartAutoFlashSale()"
          ></button>
        </div>
      </section>

      <section class="surface-card rise-in p-4 md:p-6">
        <div class="mb-4 flex items-center justify-between">
          <div>
            <p class="text-xs font-semibold uppercase tracking-wide text-emerald-700">Top Selling Products</p>
            <h2 class="text-2xl font-semibold">Top Selling Products</h2>
          </div>
        </div>

        <div
          class="relative overflow-hidden"
          @mouseenter="stopAutoTopSelling"
          @mouseleave="handleTopSellingMouseLeave"
          @mousedown="handleTopSellingSwipeStart"
          @mouseup="handleTopSellingSwipeEnd"
          @touchstart="handleTopSellingSwipeStart"
          @touchend="handleTopSellingSwipeEnd"
          @touchcancel="topSwipeStartX = null"
        >
          <button
            type="button"
            class="absolute left-2 top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-emerald-200 bg-white/95 text-emerald-700 shadow-sm transition hover:border-emerald-400 hover:bg-white lg:flex"
            aria-label="Previous top selling slide"
            @click="prevTopSellingSlide(); restartAutoTopSelling()"
          >
            ‹
          </button>
          <button
            type="button"
            class="absolute right-2 top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-emerald-200 bg-white/95 text-emerald-700 shadow-sm transition hover:border-emerald-400 hover:bg-white lg:flex"
            aria-label="Next top selling slide"
            @click="nextTopSellingSlide(); restartAutoTopSelling()"
          >
            ›
          </button>
          <div class="flex transition-transform duration-500 ease-out" :style="{ transform: `translateX(-${activeTopSellingSlide * 100}%)` }">
            <div v-for="(slide, slideIndex) in topSellingSlides" :key="`top-selling-slide-${slideIndex}`" class="w-full shrink-0">
              <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <article
                  v-for="item in slide"
                  :key="item.name"
                  :class="topSellingCard"
                >
                  <div class="overflow-hidden">
                    <img
                      :src="item.image"
                      :alt="item.name"
                      :class="topSellingThumb"
                      loading="lazy"
                    />
                  </div>
                  <div class="p-4">
                    <span class="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">{{ item.tag }}</span>
                    <h3 class="mt-2 text-base font-semibold text-ink">{{ item.name }}</h3>
                    <div class="mt-2 flex items-center gap-2">
                      <span class="text-lg font-bold text-emerald-700">{{ item.price }}</span>
                      <span class="text-sm text-slate-400 line-through">{{ item.oldPrice }}</span>
                    </div>
                    <p class="mt-1 text-sm font-medium text-emerald-700">{{ item.save }}</p>
                    <div class="mt-3 grid grid-cols-2 gap-2">
                      <button
                        class="rounded-xl border border-emerald-200 px-3 py-2.5 text-sm font-semibold text-emerald-700 transition hover:border-emerald-500"
                        type="button"
                        @click="addToCart(item)"
                      >
                        Add To Cart
                      </button>
                      <button class="rounded-xl bg-emerald-600 px-3 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700" type="button" @click="buyNow(item)">
                        Buy now
                      </button>
                    </div>
                  </div>
                </article>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-4 flex items-center justify-center gap-2">
          <button
            v-for="(_, dotIndex) in topSellingSlides"
            :key="`top-selling-dot-${dotIndex}`"
            type="button"
            class="h-2.5 rounded-full transition"
            :class="activeTopSellingSlide === dotIndex ? 'w-6 bg-emerald-600' : 'w-2.5 bg-emerald-200 hover:bg-emerald-300'"
            :aria-label="`Go to top selling slide ${dotIndex + 1}`"
            @click="goToTopSellingSlide(dotIndex); restartAutoTopSelling()"
          ></button>
        </div>
      </section>

      <section class="rise-in grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-5">
        <article
          v-for="banner in staticSplitBanners"
          :key="banner.title"
          class="relative overflow-hidden rounded-3xl border border-slate-200 shadow-sm"
        >
          <img :src="banner.image" :alt="banner.title" class="h-[220px] w-full object-cover md:h-[280px]" loading="lazy" />
          <div class="absolute inset-0 bg-gradient-to-r from-black/65 via-black/25 to-transparent"></div>
          <div class="absolute inset-0 p-5 md:p-6">
            <h3 class="max-w-[320px] text-lg font-semibold text-white md:text-2xl">{{ banner.title }}</h3>
            <p class="mt-2 max-w-[360px] text-xs text-slate-100 md:text-sm">{{ banner.subtitle }}</p>
            <button class="mt-4 rounded-lg bg-white/95 px-3 py-2 text-xs font-semibold text-slate-800 hover:bg-white" type="button">
              Explore
            </button>
          </div>
        </article>
      </section>

      <section class="surface-card rise-in rise-in-delay-2 p-4 md:p-5">
        <div class="mb-4 flex items-center justify-between">
          <h2 class="text-2xl font-semibold">Popular Products</h2>
          <a class="text-sm font-medium text-brand hover:underline" href="#">See all</a>
        </div>

        <div class="mb-4 flex flex-wrap gap-2">
          <button
            v-for="tab in collectionTabs"
            :key="tab"
            type="button"
            class="rounded-full border px-3 py-1.5 text-xs font-semibold transition"
            :class="
              activeCollection === tab
                ? 'border-brand bg-brand text-white'
                : 'border-slate-200 bg-white text-slate-700 hover:border-brand hover:text-brand'
            "
            @click="activeCollection = tab"
          >
            {{ tab }}
          </button>
        </div>

        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <article v-for="item in filteredPopularItems" :key="item.name" :class="productCard">
            <div class="overflow-hidden">
              <img :src="item.image" :alt="item.name" :class="productThumb" loading="lazy" />
            </div>
            <div class="p-4">
              <p class="text-xs text-slate-500">{{ item.category }}</p>
              <h3 class="mt-1 text-[15px] font-semibold text-ink">{{ item.name }}</h3>
              <div class="mt-2 flex items-center gap-2">
                <span class="text-base font-bold text-brand">{{ item.price }}</span>
                <span class="text-xs text-slate-400 line-through">{{ item.oldPrice }}</span>
              </div>
              <button :class="productBtn" type="button" @click="addToCart(item)">Add to cart</button>
            </div>
          </article>
        </div>
      </section>

      <section class="surface-card rise-in p-4 md:p-5">
        <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <article v-for="point in services" :key="point.title" class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-md">
            <span class="inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand-soft text-brand">
              <svg
                v-if="point.icon === 'delivery'"
                class="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <rect x="1" y="3" width="15" height="13" rx="2" />
                <path d="M16 8h4l3 3v5h-7z" />
                <circle cx="5.5" cy="18.5" r="1.5" />
                <circle cx="18.5" cy="18.5" r="1.5" />
              </svg>
              <svg
                v-else-if="point.icon === 'quality'"
                class="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <path d="M12 2l7 4v6c0 5-3.5 8.5-7 10-3.5-1.5-7-5-7-10V6z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
              <svg
                v-else-if="point.icon === 'payment'"
                class="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <rect x="2" y="5" width="20" height="14" rx="2" />
                <path d="M2 10h20" />
                <path d="M6 15h3" />
              </svg>
              <svg
                v-else
                class="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <path d="M3 10h7V3" />
                <path d="M21 14h-7v7" />
                <path d="M5 19a9 9 0 0 1 0-14" />
                <path d="M19 5a9 9 0 0 1 0 14" />
              </svg>
            </span>
            <h3 class="mt-3 text-sm font-semibold text-ink">{{ point.title }}</h3>
            <p class="mt-1 text-xs text-slate-600">{{ point.subtitle }}</p>
          </article>
        </div>
      </section>
    </main>

    <footer class="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md">
      <div class="grid gap-6 p-5 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <h3 class="text-lg font-semibold">BazarPro</h3>
          <p class="mt-2 text-sm text-slate-600">
            One professional style that works across all ecommerce categories.
          </p>
        </div>
        <div>
          <h4 class="text-sm font-semibold uppercase tracking-wide text-slate-500">Company</h4>
          <ul class="mt-2 space-y-1 text-sm text-slate-700">
            <li><a class="hover:text-brand" href="#">About</a></li>
            <li><a class="hover:text-brand" href="#">Blog</a></li>
            <li><a class="hover:text-brand" href="#">Careers</a></li>
          </ul>
        </div>
        <div>
          <h4 class="text-sm font-semibold uppercase tracking-wide text-slate-500">Help</h4>
          <ul class="mt-2 space-y-1 text-sm text-slate-700">
            <li><a class="hover:text-brand" href="#">FAQ</a></li>
            <li><a class="hover:text-brand" href="#">Shipping</a></li>
            <li><a class="hover:text-brand" href="#">Returns</a></li>
          </ul>
        </div>
        <div>
          <h4 class="text-sm font-semibold uppercase tracking-wide text-slate-500">Newsletter</h4>
          <form class="mt-2 flex items-center overflow-hidden rounded-lg border border-slate-200" @submit.prevent>
            <input class="h-10 w-full px-3 text-sm outline-none" type="email" placeholder="Enter your email" aria-label="Email" />
            <button class="h-10 bg-brand px-3 text-sm font-semibold text-white hover:bg-brand-dark" type="submit">Join</button>
          </form>
        </div>
      </div>
      <div class="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-5 py-3 text-xs text-slate-500 md:text-sm">
        <p>Copyright © 2026 BazarPro</p>
        <div class="flex items-center gap-2">
          <span class="text-[11px] uppercase tracking-wide text-slate-400"></span>
          <img
            src="https://backoffice.ghorerbazar.com/company_logo/faysy1756641916.png"
            alt="GhorerBazar payment methods"
            class="h-32 w-auto rounded bg-white p-1"
            loading="lazy"
          />
        </div>
      </div>
    </footer>

    <button
      type="button"
      class="fixed bottom-5 right-5 z-30 flex h-11 w-11 items-center justify-center rounded-full border border-brand/30 bg-white text-brand shadow-lg transition duration-300 hover:-translate-y-0.5 hover:border-brand hover:bg-brand hover:text-white"
      :class="showBackToTop ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'"
      aria-label="Back to top"
      @click="scrollToTop"
    >
      <svg
        class="h-5 w-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path d="m18 15-6-6-6 6" />
      </svg>
    </button>
  </div>
</template>
