<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ProductListPage from './components/ProductListPage.vue'
import RelatedProductsCarousel from './components/RelatedProductsCarousel.vue'
import LoginPage from './components/LoginPage.vue'
import SignupPage from './components/SignupPage.vue'
import UserProfilePage from './components/UserProfilePage.vue'
import AdminDashboardPage from './components/AdminDashboardPage.vue'
import CheckoutPage from './components/CheckoutPage.vue'

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

type WishlistItem = {
  id: string
  name: string
  price: string
  image: string
}

type ProductPreview = {
  name: string
  price: string
  image: string
  images?: string[]
  oldPrice?: string
  category?: string
  badge?: string
  tag?: string
  save?: string
  description?: string
  keyFeatures?: string[]
  usageIdeas?: string[]
}

type ProductReview = {
  id: string
  name: string
  rating: number
  comment: string
  date: string
}

type UserRole = 'customer' | 'admin'

type UserSession = {
  name: string
  email: string
  role: UserRole
}

const route = useRoute()
const router = useRouter()

const slugifyProductName = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '')
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

const defaultPoster = {
  title: 'Fresh Grocery Deals',
  subtitle: 'Best picks for your home essentials.',
  cta: 'Shop Now',
  image: 'https://picsum.photos/seed/pro-ecom-hero-fallback/1240/560',
}

const sideHeroBanner = {
  title: '30% OFF Fresh Essentials',
  subtitle: 'Limited-time discount on pantry staples and daily needs.',
  cta: 'Grab Offer',
  image: 'https://picsum.photos/seed/pro-static-poster/760/920',
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
let cartToastTimer: ReturnType<typeof setTimeout> | undefined
let cartShakeTimer: ReturnType<typeof setTimeout> | undefined

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
const sessionStorageKey = 'bazarpro-user-session'

const currentUser = ref<UserSession | null>(null)

const isLoggedIn = computed(() => currentUser.value !== null)
const isAdminUser = computed(() => currentUser.value?.role === 'admin')

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

  const rawSession = localStorage.getItem(sessionStorageKey)
  if (!rawSession) return

  try {
    const parsedSession = JSON.parse(rawSession) as UserSession
    if (parsedSession?.email && parsedSession?.name && parsedSession?.role) {
      currentUser.value = parsedSession
    }
  } catch {
    localStorage.removeItem(sessionStorageKey)
  }
})

onUnmounted(() => {
  stopAutoPoster()
  stopAutoFlashSale()
  stopAutoTopSelling()
  if (cartToastTimer) {
    clearTimeout(cartToastTimer)
    cartToastTimer = undefined
  }
  if (cartShakeTimer) {
    clearTimeout(cartShakeTimer)
    cartShakeTimer = undefined
  }
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
    images: [
      'https://picsum.photos/seed/pro-dates/360/300',
      'https://picsum.photos/seed/pro-dates-2/360/300',
      'https://picsum.photos/seed/pro-dates-3/360/300',
      'https://picsum.photos/seed/pro-dates-4/360/300',
    ],
    description:
      'Grown in the fertile lands of the Middle East, Ghorer Bazar Medjool Dates are premium-quality, naturally sweet, and delightfully soft. Known as the "King of Dates," Medjool dates are rich in fiber, potassium, and essential nutrients—making them a healthy alternative to refined sugar and an ideal natural energy booster.',
    keyFeatures: [
      'Large, plump, and juicy Medjool dates',
      'Naturally sweet with a rich caramel-like flavor',
      'Excellent source of dietary fiber, potassium, magnesium & antioxidants',
      '100% natural, with no preservatives or added sugar',
      'Perfect for snacking, baking, or adding to smoothies & desserts',
    ],
    usageIdeas: [
      'Enjoy as a wholesome snack anytime',
      'Stuff with nuts or cheese for a gourmet delight',
      'Blend into smoothies, shakes, or energy bars',
      'Use as a natural sweetener in baking and cooking',
    ],
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

const formatTaka = (amount: number): string => {
  return `৳${amount.toFixed(2)}`
}

const buildCartId = (name: string): string => {
  return name.trim().toLowerCase()
}

const isCartOpen = ref(false)
const isWishlistOpen = ref(false)
const isProductDetailOpen = ref(false)
const cartItems = ref<CartItem[]>([])
const cartToastMessage = ref('')
const showCartToast = ref(false)
type ToastTone = 'success' | 'warning' | 'info'
const toastTone = ref<ToastTone>('success')
const cartShake = ref(false)
const wishlistLimit = 50
const wishlistItems = ref<WishlistItem[]>([])
const selectedProduct = ref<ProductPreview | null>(null)
const detailQty = ref(1)
const activeDetailImage = ref(0)
const isImageZoomed = ref(false)
const zoomedImageIndex = ref(0)
const moreProductsListRef = ref<HTMLDivElement | null>(null)
const moreProductsActiveIndex = ref(0)

const defaultProductReviews: ProductReview[] = [
  {
    id: 'review-1',
    name: 'Rahim Ahmed',
    rating: 5,
    comment: 'Product quality is excellent and the packaging was very secure. Will order again.',
    date: '2 days ago',
  },
  {
    id: 'review-2',
    name: 'Nusrat Jahan',
    rating: 4,
    comment: 'Fresh and exactly as shown. Delivery was on time. Price could be slightly lower.',
    date: '1 week ago',
  },
  {
    id: 'review-3',
    name: 'Imran Hossain',
    rating: 5,
    comment: 'Great value for money and customer support was very responsive.',
    date: '2 weeks ago',
  },
]

const cartCount = computed(() => {
  return cartItems.value.reduce((total, item) => total + item.qty, 0)
})

const cartSubtotal = computed(() => {
  return cartItems.value.reduce((total, item) => total + item.unitPrice * item.qty, 0)
})

const wishlistCount = computed(() => {
  return wishlistItems.value.length
})

const toastClass = computed(() => {
  if (toastTone.value === 'warning') {
    return 'border-amber-300 bg-amber-500 text-white ring-amber-300/40'
  }
  if (toastTone.value === 'info') {
    return 'border-sky-300 bg-sky-500 text-white ring-sky-300/40'
  }
  return 'border-emerald-300 bg-emerald-600 text-white ring-emerald-300/40'
})

const allProducts = computed(() => {
  return [...flashSaleItems, ...topSellingProducts, ...popularItems]
})

const relatedProductPool = computed<ProductPreview[]>(() => {
  return allProducts.value.map((product) => ({
    name: product.name,
    price: product.price,
    image: product.image,
    oldPrice: product.oldPrice,
    category: 'category' in product ? product.category : 'Products',
    badge: 'badge' in product ? product.badge : undefined,
    images: 'images' in product ? product.images : undefined,
    description: 'description' in product ? product.description : undefined,
    keyFeatures: 'keyFeatures' in product ? product.keyFeatures : undefined,
    usageIdeas: 'usageIdeas' in product ? product.usageIdeas : undefined,
  }))
})

const moreProductsSidebarList = computed(() => {
  const currentName = selectedProduct.value?.name
  const list = relatedProductPool.value.filter((product) => product.name !== currentName)
  return list.slice(0, 24)
})

const focusMoreProductsItem = (index: number) => {
  const list = moreProductsSidebarList.value
  if (!list.length) return

  const clampedIndex = Math.max(0, Math.min(index, list.length - 1))
  moreProductsActiveIndex.value = clampedIndex

  const itemEl = moreProductsListRef.value?.querySelector<HTMLButtonElement>(`[data-more-product-index="${clampedIndex}"]`)
  itemEl?.focus()
  itemEl?.scrollIntoView({ block: 'nearest' })
}

const handleMoreProductsKeydown = (event: KeyboardEvent) => {
  if (!moreProductsSidebarList.value.length) return

  if (event.key === 'ArrowDown') {
    event.preventDefault()
    focusMoreProductsItem(moreProductsActiveIndex.value + 1)
    return
  }

  if (event.key === 'ArrowUp') {
    event.preventDefault()
    focusMoreProductsItem(moreProductsActiveIndex.value - 1)
    return
  }

  if (event.key === 'ArrowRight' || event.key === 'Enter') {
    event.preventDefault()
    const activeItem = moreProductsSidebarList.value[moreProductsActiveIndex.value]
    if (activeItem) {
      openProductDetail(activeItem)
    }
  }
}

const isDetailPageShown = computed(() => {
  return route.name === 'product-detail'
})

const isProductsListPageShown = computed(() => {
  return route.name === 'products-list'
})

const isLoginPageShown = computed(() => {
  return route.name === 'login'
})

const isSignupPageShown = computed(() => {
  return route.name === 'signup'
})

const isAuthPageShown = computed(() => {
  return route.name === 'login' || route.name === 'signup'
})

const isProfilePageShown = computed(() => {
  return route.name === 'profile'
})

const isAdminPageShown = computed(() => {
  return route.name === 'admin-dashboard'
})

const isCheckoutPageShown = computed(() => {
  return route.name === 'checkout'
})

const routeProductSlug = computed(() => {
  const param = route.params.productName
  return typeof param === 'string' ? param : null
})

const currentProductFromRoute = computed(() => {
  if (!routeProductSlug.value) return null

  const product = allProducts.value.find((p) => slugifyProductName(p.name) === routeProductSlug.value)

  if (!product) {
    const storedProductRaw = sessionStorage.getItem(`product-preview:${routeProductSlug.value}`)
    if (!storedProductRaw) return null

    try {
      return JSON.parse(storedProductRaw) as ProductPreview
    } catch {
      return null
    }
  }

  return {
    name: product.name,
    price: product.price,
    image: product.image,
    oldPrice: product.oldPrice,
    category: 'category' in product ? product.category : 'Products',
    badge: 'badge' in product ? product.badge : undefined,
    images: 'images' in product ? product.images : undefined,
    description: 'description' in product ? product.description : undefined,
    keyFeatures: 'keyFeatures' in product ? product.keyFeatures : undefined,
    usageIdeas: 'usageIdeas' in product ? product.usageIdeas : undefined,
  } as ProductPreview
})

watch(
  () => [route.name, routeProductSlug.value],
  ([newRouteName, newProductSlug]) => {
    if (newRouteName === 'product-detail') {
      selectedProduct.value = currentProductFromRoute.value
      isProductDetailOpen.value = true
      // Trigger top scroll when switching between detail products.
      if (newProductSlug) {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    } else {
      selectedProduct.value = null
      isProductDetailOpen.value = false
    }
  },
  { immediate: true }
)

watch(
  () => [selectedProduct.value?.name, moreProductsSidebarList.value.length],
  () => {
    moreProductsActiveIndex.value = 0
  }
)

watch(
  () => [route.name, isLoggedIn.value],
  ([routeName, loggedIn]) => {
    if (routeName === 'checkout' && !loggedIn) {
      triggerToast('Please sign in or sign up to place an order', 'warning')
      router.replace({ name: 'signup' })
    }
  }
)

const openCart = () => {
  isWishlistOpen.value = false
  isCartOpen.value = true
}

const goToLogin = () => {
  closeWishlist()
  closeCart()
  router.push({ name: 'login' })
}

const goToSignup = () => {
  closeWishlist()
  closeCart()
  router.push({ name: 'signup' })
}

const goToProfile = () => {
  if (!isLoggedIn.value) {
    goToLogin()
    return
  }
  closeWishlist()
  closeCart()
  router.push({ name: 'profile' })
}

const goToAdminDashboard = () => {
  if (!isLoggedIn.value) {
    goToLogin()
    return
  }

  if (!isAdminUser.value) {
    triggerToast('Admin access required for dashboard', 'warning')
    return
  }

  closeWishlist()
  closeCart()
  router.push({ name: 'admin-dashboard' })
}

const handleAuthSuccess = (payload: UserSession) => {
  currentUser.value = {
    name: payload.name.trim(),
    email: payload.email.trim(),
    role: payload.role,
  }
  localStorage.setItem(sessionStorageKey, JSON.stringify(currentUser.value))
  triggerToast(`Welcome ${currentUser.value.name}`, 'success')
  router.push({ name: 'home' })
}

const logout = () => {
  const currentName = currentUser.value?.name ?? 'User'
  currentUser.value = null
  localStorage.removeItem(sessionStorageKey)
  router.push({ name: 'home' })
  triggerToast(`${currentName} logged out`, 'info')
}

const closeCart = () => {
  isCartOpen.value = false
}

const openWishlist = () => {
  isCartOpen.value = false
  isWishlistOpen.value = true
}

const closeWishlist = () => {
  isWishlistOpen.value = false
}

const goToCheckout = () => {
  if (!cartItems.value.length) return

  if (!isLoggedIn.value) {
    triggerToast('Create an account to continue checkout', 'warning')
    goToSignup()
    return
  }

  closeCart()
  router.push({ name: 'checkout' })
}

const openProductDetail = (item: ProductPreview) => {
  isCartOpen.value = false
  isWishlistOpen.value = false
  detailQty.value = 1
  isImageZoomed.value = false
  const productSlug = slugifyProductName(item.name)
  router.push({ name: 'product-detail', params: { productName: productSlug } })
}

const addProductListItemToCart = (item: CartProduct) => {
  addToCart(item)
}

const closeProductDetail = () => {
  detailQty.value = 1
  activeDetailImage.value = 0
  if (isImageZoomed.value) {
    closeImageZoom()
  }
  router.push({ name: 'home' })
}

const selectedProductReviews = computed(() => {
  const activeProduct = selectedProduct.value
  if (!activeProduct) return defaultProductReviews
  return defaultProductReviews.map((review, index) => ({
    ...review,
    id: `${buildCartId(activeProduct.name)}-${index + 1}`,
  }))
})

const detailProductImages = computed(() => {
  if (!selectedProduct.value) return []
  const images = selectedProduct.value.images
  if (images && images.length > 0) return images
  return [selectedProduct.value.image]
})

const currentDetailImage = computed(() => {
  const images = detailProductImages.value
  return images[activeDetailImage.value] || images[0] || ''
})

const nextDetailImage = () => {
  const max = detailProductImages.value.length - 1
  activeDetailImage.value = activeDetailImage.value >= max ? 0 : activeDetailImage.value + 1
}

const prevDetailImage = () => {
  const max = detailProductImages.value.length - 1
  activeDetailImage.value = activeDetailImage.value <= 0 ? max : activeDetailImage.value - 1
}

const handleZoomKeydown = (event: KeyboardEvent) => {
  if (!isImageZoomed.value) return
  if (event.key === 'Escape') {
    closeImageZoom()
    event.preventDefault()
  } else if (event.key === 'ArrowLeft') {
    prevZoomedImage()
    event.preventDefault()
  } else if (event.key === 'ArrowRight') {
    nextZoomedImage()
    event.preventDefault()
  }
}

const openImageZoom = (index: number) => {
  zoomedImageIndex.value = index
  isImageZoomed.value = true
  document.addEventListener('keydown', handleZoomKeydown)
  document.body.style.overflow = 'hidden'
}

const closeImageZoom = () => {
  isImageZoomed.value = false
  document.removeEventListener('keydown', handleZoomKeydown)
  document.body.style.overflow = 'auto'
}

const nextZoomedImage = () => {
  const max = detailProductImages.value.length - 1
  zoomedImageIndex.value = zoomedImageIndex.value >= max ? 0 : zoomedImageIndex.value + 1
}

const prevZoomedImage = () => {
  const max = detailProductImages.value.length - 1
  zoomedImageIndex.value = zoomedImageIndex.value <= 0 ? max : zoomedImageIndex.value - 1
}

const addDetailProductToCart = () => {
  if (!selectedProduct.value) return
  for (let count = 0; count < detailQty.value; count += 1) {
    addToCart(selectedProduct.value)
  }
}

const buyDetailProduct = () => {
  addDetailProductToCart()
  closeProductDetail()
  openCart()
}

const triggerToast = (message: string, tone: ToastTone = 'success') => {
  cartToastMessage.value = message
  toastTone.value = tone
  showCartToast.value = true

  if (cartToastTimer) {
    clearTimeout(cartToastTimer)
  }

  cartToastTimer = setTimeout(() => {
    showCartToast.value = false
  }, 1800)
}

const triggerCartToast = (productName: string) => {
  triggerToast(`${productName} added to cart`, 'success')
  cartShake.value = true

  if (cartShakeTimer) {
    clearTimeout(cartShakeTimer)
  }

  cartShakeTimer = setTimeout(() => {
    cartShake.value = false
  }, 520)
}

const isWishlisted = (name: string) => {
  const id = buildCartId(name)
  return wishlistItems.value.some((wishlistItem) => wishlistItem.id === id)
}

const toggleWishlist = (item: CartProduct) => {
  const id = buildCartId(item.name)
  const exists = wishlistItems.value.some((wishlistItem) => wishlistItem.id === id)

  if (exists) {
    wishlistItems.value = wishlistItems.value.filter((wishlistItem) => wishlistItem.id !== id)
    triggerToast(`${item.name} removed from wishlist`, 'info')
    return
  }

  if (wishlistItems.value.length >= wishlistLimit) {
    triggerToast(`Wishlist limit is ${wishlistLimit} items`, 'warning')
    return
  }

  wishlistItems.value.unshift({
    id,
    name: item.name,
    price: item.price,
    image: item.image,
  })
  triggerToast(`${item.name} added to wishlist`, 'success')
}

const removeWishlistItem = (id: string) => {
  wishlistItems.value = wishlistItems.value.filter((wishlistItem) => wishlistItem.id !== id)
}

const addToCart = (item: CartProduct) => {
  const id = buildCartId(item.name)
  const existing = cartItems.value.find((cartItem) => cartItem.id === id)
  if (existing) {
    existing.qty += 1
    triggerCartToast(item.name)
    return
  }

  cartItems.value.unshift({
    id,
    name: item.name,
    image: item.image,
    unitPrice: parsePrice(item.price),
    qty: 1,
  })

  triggerCartToast(item.name)
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

const placeOrderFromCheckout = () => {
  if (!isLoggedIn.value) {
    triggerToast('Please sign in before placing an order', 'warning')
    goToSignup()
    return
  }

  if (!cartItems.value.length) {
    triggerToast('Your cart is empty', 'warning')
    return
  }
  clearCart()
  triggerToast('Order placed successfully', 'success')
  router.push({ name: 'home' })
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
  <div :class="isAdminPageShown ? 'relative min-h-screen w-full overflow-hidden bg-slate-100 px-0 py-0' : isAuthPageShown ? 'relative mx-auto min-h-screen max-w-[980px] overflow-hidden px-4 py-8 md:px-6 md:py-10' : 'relative mx-auto min-h-screen max-w-[1500px] overflow-hidden px-2 py-4 md:px-3 lg:px-4'">

    <header v-if="!isAdminPageShown && !isAuthPageShown" class="rise-in rise-in-delay-1 sticky top-3 z-20 mt-3 overflow-hidden rounded-2xl border border-slate-200/80 bg-white/95 shadow-[0_14px_30px_rgba(15,23,42,0.1)] backdrop-blur-xl">
      <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-4 py-2 text-xs text-slate-600 md:text-sm">
        <p class="inline-flex flex-wrap items-center gap-2">
          <span class="inline-flex items-center gap-1.5">
            <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7 12.8 12.8 0 0 0 .7 2.8 2 2 0 0 1-.5 2.1L8 10a16 16 0 0 0 6 6l1.4-1.3a2 2 0 0 1 2.1-.5 12.8 12.8 0 0 0 2.8.7A2 2 0 0 1 22 16.9z" />
            </svg>
            <span>Hotline +880 1700 000000</span>
          </span>
          <span class="text-slate-300">|</span>
          <span class="inline-flex items-center gap-1.5">
            <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="m3 7 9 6 9-6" />
            </svg>
            <span>support@bazarbd.com</span>
          </span>
        </p>
        <div class="flex items-center gap-3">
          <a class="inline-flex items-center gap-1.5 hover:text-brand" href="#">
            <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M3 7h18" />
              <path d="M8 7V5a4 4 0 0 1 8 0v2" />
              <rect x="3" y="7" width="18" height="13" rx="2" />
              <path d="m9 14 2 2 4-4" />
            </svg>
            <span>Track Order</span>
          </a>
          <button class="inline-flex items-center gap-1.5 hover:text-brand" type="button" @click="goToProfile">
            <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M20 21a8 8 0 1 0-16 0" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span>My Profile</span>
          </button>
          <a class="inline-flex items-center gap-1.5 hover:text-brand" href="#">
            <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <span>Support</span>
          </a>
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
          <button
            class="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:border-brand hover:text-brand"
            type="button"
            @click="isLoggedIn ? goToProfile() : goToLogin()"
          >
            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M20 21a8 8 0 1 0-16 0" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span>{{ isLoggedIn ? 'Profile' : 'Login' }}</span>
          </button>
          <button class="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:border-brand hover:text-brand" type="button" @click="openWishlist">
            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
            </svg>
            <span>Wishlist ({{ wishlistCount }})</span>
          </button>
          <button
            v-if="isLoggedIn"
            class="inline-flex items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700 hover:border-indigo-400 hover:bg-indigo-100"
            type="button"
            @click="goToAdminDashboard"
          >
            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M12 3 4 7l8 4 8-4-8-4z" />
              <path d="m4 7 8 4 8-4" />
              <path d="M4 12l8 4 8-4" />
              <path d="M4 17l8 4 8-4" />
            </svg>
            <span>Admin</span>
          </button>
          <button
            class="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-dark"
            type="button"
            @click="openCart"
          >
            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <circle cx="9" cy="20" r="1" />
              <circle cx="17" cy="20" r="1" />
              <path d="M5 5h2l2 10h9l2-7H8" />
            </svg>
            <span>Cart ({{ cartCount }}) {{ formatPrice(cartSubtotal) }}</span>
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
      v-if="!isAdminPageShown && !isAuthPageShown && (isCartOpen || isWishlistOpen)"
      type="button"
      class="fixed inset-0 z-30 bg-slate-900/40"
      aria-label="Close panel"
      @click="closeCart(); closeWishlist()"
    ></button>

    <aside
      v-if="!isAdminPageShown && !isAuthPageShown"
      class="fixed right-0 top-0 z-40 flex h-screen w-full max-w-md flex-col border-l border-slate-200 bg-white shadow-2xl transition-transform duration-300"
      :class="isWishlistOpen ? 'translate-x-0' : 'translate-x-full'"
      aria-label="Wishlist"
    >
      <div class="flex items-center justify-between border-b border-slate-100 px-5 py-4">
        <div>
          <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Wishlist</p>
          <h3 class="text-lg font-semibold text-ink">Saved Items ({{ wishlistCount }}/{{ wishlistLimit }})</h3>
        </div>
        <button
          type="button"
          class="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:border-brand hover:text-brand"
          @click="closeWishlist"
        >
          Close
        </button>
      </div>

      <div class="flex-1 overflow-y-auto px-5 py-4">
        <div v-if="!wishlistItems.length" class="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5 text-center">
          <p class="text-sm font-medium text-slate-600">Your wishlist is empty.</p>
          <p class="mt-1 text-xs text-slate-500">Tap the heart icon on any product to save it.</p>
        </div>

        <div v-else class="space-y-3">
          <article
            v-for="wishlistItem in wishlistItems"
            :key="wishlistItem.id"
            class="rounded-xl border border-slate-200 p-3"
          >
            <div class="flex gap-3">
              <img :src="wishlistItem.image" :alt="wishlistItem.name" class="h-14 w-14 rounded-lg object-cover" loading="lazy" />
              <div class="min-w-0 flex-1">
                <p class="line-clamp-2 text-sm font-semibold text-ink">{{ wishlistItem.name }}</p>
                <p class="mt-1 text-sm font-semibold text-brand">{{ wishlistItem.price }}</p>
              </div>
              <button
                type="button"
                class="inline-flex h-8 w-8 items-center justify-center rounded-full border border-rose-200 text-rose-600 transition hover:bg-rose-50 hover:text-rose-700"
                aria-label="Remove from wishlist"
                @click="removeWishlistItem(wishlistItem.id)"
              >
                <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            </div>

            <div class="mt-3 grid grid-cols-2 gap-2">
              <button
                type="button"
                class="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-2 text-xs font-semibold text-slate-700 transition hover:border-brand hover:text-brand"
                @click="addToCart(wishlistItem)"
              >
                <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <circle cx="9" cy="20" r="1" />
                  <circle cx="17" cy="20" r="1" />
                  <path d="M5 5h2l2 10h9l2-7H8" />
                </svg>
                <span>Add to cart</span>
              </button>
              <button
                type="button"
                class="rounded-lg bg-brand px-2.5 py-2 text-xs font-semibold text-white hover:bg-brand-dark"
                @click="buyNow(wishlistItem)"
              >
                Buy now
              </button>
            </div>
          </article>
        </div>
      </div>
    </aside>

    <aside
      v-if="!isAdminPageShown && !isAuthPageShown"
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
                <p class="mt-1 text-xs font-medium text-slate-600">
                  {{ formatPrice(item.unitPrice) }} × {{ item.qty }} =
                  <span class="font-bold text-brand">{{ formatPrice(item.unitPrice * item.qty) }}</span>
                </p>
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
                class="inline-flex h-8 w-8 items-center justify-center rounded-full border border-rose-200 text-rose-600 transition hover:bg-rose-50 hover:text-rose-700"
                @click="removeCartItem(item.id)"
                aria-label="Remove item"
              >
                <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
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
            @click="goToCheckout"
          >
            Checkout
          </button>
        </div>
      </div>
    </aside>

    <main v-if="isLoginPageShown" class="mt-6">
      <LoginPage @login="handleAuthSuccess" @go-signup="goToSignup" />
    </main>

    <main v-else-if="isSignupPageShown" class="mt-6">
      <SignupPage @signup="handleAuthSuccess" @go-login="goToLogin" />
    </main>

    <main v-else-if="isProfilePageShown" class="mt-6">
      <UserProfilePage :current-user="currentUser" :is-admin-user="isAdminUser" @logout="logout" @go-login="goToLogin" @go-admin="goToAdminDashboard" />
    </main>

    <main v-else-if="isAdminPageShown" class="mt-6">
      <AdminDashboardPage :current-user="currentUser" :is-admin-user="isAdminUser" @go-login="goToLogin" />
    </main>

    <main v-else-if="isCheckoutPageShown" class="mt-6">
      <CheckoutPage :cart-items="cartItems" :cart-subtotal="cartSubtotal" @place-order="placeOrderFromCheckout" @go-shopping="() => router.push({ name: 'home' })" />
    </main>

    <main v-else-if="isProductsListPageShown" class="mt-6">
      <ProductListPage :on-add-to-cart="addProductListItemToCart" />
    </main>

    <main v-else-if="isProductDetailOpen && selectedProduct" class="mt-6 space-y-6 md:space-y-7">
      <section class="surface-card p-4 md:p-6">
        <button
          type="button"
          class="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-brand hover:text-brand"
          @click="closeProductDetail"
        >
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="m15 18-6-6 6-6" />
          </svg>
          Back to products
        </button>
      </section>

      <!-- Main Content Grid: Left (all content) + Right (sidebar) -->
      <div class="grid gap-5 lg:grid-cols-[1fr_400px]">
        <!-- Left: All Sections -->
        <div class="space-y-6 md:space-y-7">
          <section class="rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-sm ring-1 ring-slate-100 md:p-6">
            <div class="mt-4 grid gap-5 md:grid-cols-[45%_55%]"> 
          <div>
            <div class="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
              <img :src="currentDetailImage" :alt="selectedProduct.name" class="h-[300px] w-full object-cover md:h-[460px]" loading="lazy" />
              <div v-if="detailProductImages.length > 1" class="absolute inset-x-0 bottom-4 flex items-center justify-between px-3">
                <button
                  type="button"
                  class="h-7 w-7 rounded-full border border-white/30 bg-black/40 text-white backdrop-blur transition hover:bg-black/60"
                  aria-label="Previous image"
                  @click="prevDetailImage"
                >
                  ‹
                </button>
                <span class="text-xs font-medium text-white/70">{{ activeDetailImage + 1 }} / {{ detailProductImages.length }}</span>
                <button
                  type="button"
                  class="h-7 w-7 rounded-full border border-white/30 bg-black/40 text-white backdrop-blur transition hover:bg-black/60"
                  aria-label="Next image"
                  @click="nextDetailImage"
                >
                  ›
                </button>
              </div>
              <button
                v-if="detailProductImages.length > 0"
                type="button"
                class="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/30 bg-black/40 text-white backdrop-blur transition hover:bg-black/60"
                aria-label="Zoom image"
                @click.stop="openImageZoom(activeDetailImage)"
              >
                <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                  <path d="M11 8v6" />
                  <path d="M8 11h6" />
                </svg>
              </button>
            </div>

            <div v-if="detailProductImages.length > 1" class="mt-3 flex gap-2 overflow-x-auto pb-1">
              <button
                v-for="(image, index) in detailProductImages"
                :key="`thumb-${index}`"
                type="button"
                class="h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition"
                :class="activeDetailImage === index ? 'border-brand shadow-md' : 'border-slate-200 hover:border-slate-300'"
                @click="activeDetailImage = index"
              >
                <img :src="image" :alt="`Product image ${index + 1}`" class="h-full w-full object-cover" loading="lazy" />
              </button>
            </div>
          </div>

          <div>
            <p class="text-xs font-semibold uppercase tracking-wide text-brand">Product Details</p>
            <h2 class="mt-2 text-2xl font-semibold text-ink md:text-3xl">{{ selectedProduct.name }}</h2>
            <p class="mt-1 text-sm text-slate-600">Category: {{ selectedProduct.category ?? 'Grocery Essentials' }}</p>

            <div class="mt-3 flex flex-wrap items-center gap-3">
              <span class="text-2xl font-bold text-brand">{{ selectedProduct.price }}</span>
              <span v-if="selectedProduct.oldPrice" class="text-base text-slate-400 line-through">{{ selectedProduct.oldPrice }}</span>
              <span v-if="selectedProduct.badge" class="rounded-full bg-rose-100 px-2.5 py-1 text-xs font-semibold text-rose-700">{{ selectedProduct.badge }}</span>
            </div>

            <p v-if="selectedProduct.description" class="mt-4 text-sm leading-6 text-slate-600">
              {{ selectedProduct.description }}
            </p>
            <p v-else class="mt-4 text-sm leading-6 text-slate-600">
              Carefully selected quality product for daily use. Fresh stock, hygienic handling, and reliable delivery support across your city.
            </p>

            <ul v-if="selectedProduct.keyFeatures && selectedProduct.keyFeatures.length > 0" class="mt-4 space-y-1.5 text-sm text-slate-700">
              <li v-for="(feature, index) in selectedProduct.keyFeatures" :key="`feature-${index}`">{{ feature }}</li>
            </ul>
            <ul v-else class="mt-4 space-y-1.5 text-sm text-slate-700">
              <li>Fresh stock with quality check before dispatch</li>
              <li>Secure packaging to keep items safe in transit</li>
              <li>Fast delivery with quick support on issues</li>
            </ul>

            <div v-if="selectedProduct.usageIdeas && selectedProduct.usageIdeas.length > 0" class="mt-4">
              <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Usage Ideas:</p>
              <ul class="mt-2 space-y-1 text-sm text-slate-600">
                <li v-for="(idea, index) in selectedProduct.usageIdeas" :key="`idea-${index}`">• {{ idea }}</li>
              </ul>
            </div>

            <div class="mt-5 flex flex-wrap items-center gap-3">
              <div class="inline-flex items-center overflow-hidden rounded-lg border border-slate-200">
                <button
                  type="button"
                  class="h-10 w-10 text-lg font-semibold text-slate-700 hover:bg-slate-100"
                  @click="detailQty = Math.max(1, detailQty - 1)"
                >
                  -
                </button>
                <span class="inline-flex h-10 min-w-10 items-center justify-center border-x border-slate-200 text-sm font-semibold text-slate-700">{{ detailQty }}</span>
                <button
                  type="button"
                  class="h-10 w-10 text-lg font-semibold text-slate-700 hover:bg-slate-100"
                  @click="detailQty += 1"
                >
                  +
                </button>
              </div>

              <button
                type="button"
                class="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:border-brand hover:text-brand"
                @click="toggleWishlist(selectedProduct)"
              >
                <svg class="h-4 w-4" viewBox="0 0 24 24" :class="isWishlisted(selectedProduct.name) ? 'fill-rose-500 text-rose-500' : 'fill-transparent text-slate-500'" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
                </svg>
                Wishlist
              </button>
            </div>

            <div class="mt-5 grid grid-cols-2 gap-2">
              <button
                type="button"
                class="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-200 px-4 py-3 text-sm font-semibold text-emerald-700 hover:border-emerald-400"
                @click="addDetailProductToCart"
              >
                <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <circle cx="9" cy="20" r="1" />
                  <circle cx="17" cy="20" r="1" />
                  <path d="M5 5h2l2 10h9l2-7H8" />
                </svg>
                Add to cart
              </button>
              <button
                type="button"
                class="rounded-xl bg-brand px-4 py-3 text-sm font-semibold text-white hover:bg-brand-dark"
                @click="buyDetailProduct"
              >
                Buy now
              </button>
            </div>
          </div>
        </div>
      </section>

          <!-- Product Description & Images -->
          <div class="rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-sm ring-1 ring-slate-100 md:p-6">
            <h3 class="text-2xl font-semibold text-ink">Product Description & Images</h3>
            <p v-if="selectedProduct.description" class="mt-3 text-base leading-7 text-slate-700">{{ selectedProduct.description }}</p>
            <p v-else class="mt-3 text-base leading-7 text-slate-700">Carefully selected quality product for daily use. Fresh stock, hygienic handling, and reliable delivery support across your city.</p>

            <div v-if="selectedProduct.keyFeatures && selectedProduct.keyFeatures.length > 0" class="mt-5">
              <h4 class="font-semibold text-ink">Key Features:</h4>
              <ul class="mt-2 space-y-1.5 text-sm text-slate-700">
                <li v-for="(feature, index) in selectedProduct.keyFeatures" :key="`key-feature-${index}`" class="flex items-start gap-2">
                  <span class="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-brand"></span>
                  <span>{{ feature }}</span>
                </li>
              </ul>
            </div>

            <div v-if="selectedProduct.usageIdeas && selectedProduct.usageIdeas.length > 0" class="mt-5">
              <h4 class="font-semibold text-ink">Usage Ideas:</h4>
              <ul class="mt-2 space-y-1.5 text-sm text-slate-700">
                <li v-for="(idea, index) in selectedProduct.usageIdeas" :key="`usage-idea-${index}`" class="flex items-start gap-2">
                  <span class="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-600"></span>
                  <span>{{ idea }}</span>
                </li>
              </ul>
            </div>
          </div>

          <div v-if="detailProductImages.length > 0" class="rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-sm ring-1 ring-slate-100 md:p-6">
            <h3 class="text-xl font-semibold text-ink">Product Gallery</h3>
            <div class="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <button
                v-for="(image, index) in detailProductImages"
                :key="`gallery-${index}`"
                type="button"
                class="group relative overflow-hidden rounded-lg border border-slate-200 transition hover:border-brand"
                @click="openImageZoom(index)"
              >
                <img :src="image" :alt="`Product image ${index + 1}`" class="h-32 w-full object-cover transition group-hover:scale-105" loading="lazy" />
                <div class="absolute inset-0 flex items-center justify-center bg-black/0 transition group-hover:bg-black/40">
                  <svg class="h-6 w-6 text-white opacity-0 transition group-hover:opacity-100" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" />
                    <path d="M11 8v6" />
                    <path d="M8 11h6" />
                  </svg>
                </div>
              </button>
            </div>
          </div>

          <div class="rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-sm ring-1 ring-slate-100 md:p-6">
            <div class="mb-3 flex items-center justify-between gap-2">
              <h3 class="text-xl font-semibold text-ink">Customer Reviews</h3>
              <p class="text-sm text-slate-500">{{ selectedProductReviews.length }} reviews</p>
            </div>
            <div class="grid gap-3 md:grid-cols-3">
              <article v-for="review in selectedProductReviews" :key="review.id" class="rounded-xl border border-slate-200 bg-white p-4">
                <div class="flex items-center justify-between gap-2">
                  <p class="text-sm font-semibold text-ink">{{ review.name }}</p>
                  <p class="text-xs text-slate-500">{{ review.date }}</p>
                </div>
                <p class="mt-1 text-sm text-amber-500">{{ '★'.repeat(review.rating) }}{{ '☆'.repeat(5 - review.rating) }}</p>
                <p class="mt-2 text-sm leading-6 text-slate-600">{{ review.comment }}</p>
              </article>
            </div>
          </div>
        </div>

        <!-- Right: Sticky Sidebar -->
        <aside class="hidden lg:block">
          <div
            class="sticky top-3 h-[calc(100vh-56px)] flex flex-col rounded-lg border border-slate-200 bg-gradient-to-br from-emerald-50 to-white p-4 shadow-md"
            tabindex="0"
            @keydown="handleMoreProductsKeydown"
          >
            <h4 class="text-sm font-semibold text-ink">More Products</h4>
            <div ref="moreProductsListRef" class="mt-3 flex-1 space-y-2 overflow-y-auto pr-1">
              <button
                v-for="(product, productIndex) in moreProductsSidebarList"
                :key="product.name"
                type="button"
                :data-more-product-index="productIndex"
                class="group flex w-full gap-3 overflow-hidden rounded-lg border bg-white p-3 transition hover:border-brand hover:bg-emerald-50 focus:outline-none"
                :class="productIndex === moreProductsActiveIndex ? 'border-brand ring-1 ring-emerald-300' : 'border-slate-200'"
                @click="openProductDetail(product)"
                @focus="moreProductsActiveIndex = productIndex"
                @mouseenter="moreProductsActiveIndex = productIndex"
              >
                <div class="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md">
                  <img :src="product.image" :alt="product.name" class="h-full w-full object-cover transition group-hover:scale-105" loading="lazy" />
                  <div v-if="product.badge" class="absolute inset-0 flex items-end justify-end">
                    <span class="bg-rose-500 px-1 py-0.5 text-[9px] font-bold text-white">{{ product.badge }}</span>
                  </div>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="line-clamp-2 text-sm font-semibold text-slate-900">{{ product.name }}</p>
                  <p v-if="product.category" class="mt-0.5 text-xs text-slate-500">{{ product.category }}</p>
                  <p class="mt-1 text-sm font-bold text-brand">{{ product.price }}</p>
                  <p v-if="product.oldPrice" class="text-xs text-slate-400 line-through">{{ product.oldPrice }}</p>
                </div>
              </button>
            </div>
          </div>
        </aside>
      </div>

      <RelatedProductsCarousel
        v-if="selectedProduct"
        :products="relatedProductPool"
        :current-product-name="selectedProduct.name"
        :current-category="selectedProduct.category"
        @open-product="openProductDetail"
      />

      <transition name="zoom-fade">
        <div
          v-if="isImageZoomed && selectedProduct && detailProductImages.length > 0"
          class="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black/95 backdrop-blur-sm"
          @click="closeImageZoom"
        >
          <!-- Close Button -->
          <button
            type="button"
            class="absolute right-6 top-6 z-[10001] inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur transition duration-200 hover:bg-white/20 hover:border-white/40"
            aria-label="Close (ESC)"
            @click.stop="closeImageZoom"
          >
            <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>

          <!-- Image Counter & Product Title -->
          <div class="absolute top-6 left-6 z-[10001]">
            <p class="text-sm font-medium text-white/70">{{ selectedProduct.name }}</p>
            <p class="mt-1 text-xs font-medium text-white/50">{{ zoomedImageIndex + 1 }} / {{ detailProductImages.length }}</p>
          </div>

          <!-- Main Image Container -->
          <div class="relative flex h-full w-full max-w-6xl items-center justify-center px-20 py-16" @click.stop>
            <img
              :src="detailProductImages[zoomedImageIndex]"
              :alt="`${selectedProduct.name} - Image ${zoomedImageIndex + 1}`"
              class="h-auto max-h-[75vh] w-auto max-w-full object-contain transition-opacity duration-300"
              loading="lazy"
            />

            <!-- Previous Button -->
            <button
              v-if="detailProductImages.length > 1"
              type="button"
              class="absolute left-6 top-1/2 z-[10001] inline-flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur transition duration-200 hover:bg-white/20 hover:border-white/40 group"
              aria-label="Previous (←)"
              @click.stop="prevZoomedImage"
            >
              <svg class="h-6 w-6 transition group-hover:-translate-x-0.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
              </svg>
            </button>

            <!-- Next Button -->
            <button
              v-if="detailProductImages.length > 1"
              type="button"
              class="absolute right-6 top-1/2 z-[10001] inline-flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur transition duration-200 hover:bg-white/20 hover:border-white/40 group"
              aria-label="Next (→)"
              @click.stop="nextZoomedImage"
            >
              <svg class="h-6 w-6 transition group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z" />
              </svg>
            </button>
          </div>

          <!-- Thumbnail Strip -->
          <div v-if="detailProductImages.length > 1" class="absolute bottom-6 left-1/2 z-[10001] -translate-x-1/2 flex items-center justify-center gap-2 rounded-full bg-black/40 backdrop-blur px-4 py-3">
            <div class="flex gap-2 overflow-x-auto max-w-[80vw]">
              <button
                v-for="(_, index) in detailProductImages"
                :key="`zoom-thumb-${index}`"
                type="button"
                class="h-12 w-12 shrink-0 overflow-hidden rounded-lg border-2 transition-all duration-200"
                :class="zoomedImageIndex === index ? 'border-white shadow-lg shadow-white/40' : 'border-white/20 hover:border-white/40 opacity-60 hover:opacity-100'"
                @click.stop="zoomedImageIndex = index"
              >
                <img :src="detailProductImages[index]" :alt="`Thumbnail ${index + 1}`" class="h-full w-full object-cover" loading="lazy" />
              </button>
            </div>
          </div>

          <!-- Keyboard Hints -->
          <div class="absolute bottom-6 right-6 z-[10001] text-center text-xs text-white/50 font-medium">
            <p>← → or Arrow Keys to navigate</p>
            <p>ESC to close</p>
          </div>
        </div>
      </transition>
    </main>

    <main v-else class="mt-6 space-y-6 md:space-y-7">
      <section class="rise-in grid grid-cols-1 gap-3 md:gap-5 md:grid-cols-[70%_30%]">
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
          <img :src="sideHeroBanner.image" :alt="sideHeroBanner.title" class="h-[320px] w-full object-cover md:h-[390px]" loading="lazy" />
          <div class="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent"></div>
          <div class="absolute inset-x-0 bottom-0 p-5 text-white">
            <p class="inline-flex rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-brand">Special Offer</p>
            <h3 class="mt-2 text-xl font-semibold">{{ sideHeroBanner.title }}</h3>
            <p class="mt-1 text-sm text-emerald-100">{{ sideHeroBanner.subtitle }}</p>
            <button class="mt-4 rounded-lg bg-white px-3 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-100" type="button">
              {{ sideHeroBanner.cta }}
            </button>
          </div>
        </aside>

      </section>

      <section class="surface-card rise-in rise-in-delay-1 p-4 md:p-5">
        <div class="mb-4 flex items-center justify-between">
          <div>
            <p class="text-xs font-semibold uppercase tracking-wide text-brand">Featured Categories</p>
            <h2 class="text-2xl font-semibold">Shop by featured category</h2>
          </div>
          <RouterLink to="/products" class="text-sm font-medium text-brand hover:underline">See all categories</RouterLink>
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
          <RouterLink to="/products" class="inline-flex rounded-lg border border-amber-200 bg-white px-3 py-2 text-sm font-semibold text-amber-700 hover:border-amber-400">
            View all deals
          </RouterLink>
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
                <article v-for="item in slide" :key="item.name" :class="`${limitedOfferCard} cursor-pointer`" @click="openProductDetail(item)">
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
                    <div class="mt-1 flex items-start justify-between gap-2">
                      <h3 class="text-base font-semibold text-ink">{{ item.name }}</h3>
                      <button
                        type="button"
                        class="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-200 transition hover:border-rose-300 hover:bg-rose-50"
                        :aria-label="isWishlisted(item.name) ? 'Remove from wishlist' : 'Add to wishlist'"
                        @click.stop="toggleWishlist(item)"
                      >
                        <svg
                          class="h-4 w-4"
                          viewBox="0 0 24 24"
                          :class="isWishlisted(item.name) ? 'fill-rose-500 text-rose-500' : 'fill-transparent text-slate-400'"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          aria-hidden="true"
                        >
                          <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
                        </svg>
                      </button>
                    </div>
                    <div class="mt-2 flex items-center gap-2">
                      <span class="text-lg font-bold text-amber-700">{{ item.price }}</span>
                      <span class="text-sm text-slate-400 line-through">{{ item.oldPrice }}</span>
                    </div>
                    <button class="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-amber-600 px-3 py-2.5 text-sm font-semibold text-white hover:bg-amber-700" type="button" @click.stop="addToCart(item)">
                      <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <circle cx="9" cy="20" r="1" />
                        <circle cx="17" cy="20" r="1" />
                        <path d="M5 5h2l2 10h9l2-7H8" />
                      </svg>
                      <span>Add to cart</span>
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
                    <RouterLink to="/products" class="text-sm font-medium text-brand hover:underline">See all</RouterLink>
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
                  :class="`${topSellingCard} cursor-pointer`"
                  @click="openProductDetail(item)"
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
                    <div class="mt-2 flex items-start justify-between gap-2">
                      <h3 class="text-base font-semibold text-ink">{{ item.name }}</h3>
                      <button
                        type="button"
                        class="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-200 transition hover:border-rose-300 hover:bg-rose-50"
                        :aria-label="isWishlisted(item.name) ? 'Remove from wishlist' : 'Add to wishlist'"
                        @click.stop="toggleWishlist(item)"
                      >
                        <svg
                          class="h-4 w-4"
                          viewBox="0 0 24 24"
                          :class="isWishlisted(item.name) ? 'fill-rose-500 text-rose-500' : 'fill-transparent text-slate-400'"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          aria-hidden="true"
                        >
                          <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
                        </svg>
                      </button>
                    </div>
                    <div class="mt-2 flex items-center gap-2">
                      <span class="text-lg font-bold text-emerald-700">{{ item.price }}</span>
                      <span class="text-sm text-slate-400 line-through">{{ item.oldPrice }}</span>
                    </div>
                    <p class="mt-1 text-sm font-medium text-emerald-700">{{ item.save }}</p>
                    <div class="mt-3 grid grid-cols-2 gap-2">
                      <button
                        class="inline-flex items-center justify-center gap-1.5 rounded-xl border border-emerald-200 px-3 py-2.5 text-sm font-semibold text-emerald-700 transition hover:border-emerald-500"
                        type="button"
                        @click.stop="addToCart(item)"
                      >
                        <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                          <circle cx="9" cy="20" r="1" />
                          <circle cx="17" cy="20" r="1" />
                          <path d="M5 5h2l2 10h9l2-7H8" />
                        </svg>
                        <span>Add To Cart</span>
                      </button>
                      <button class="rounded-xl bg-emerald-600 px-3 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700" type="button" @click.stop="buyNow(item)">
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
          <RouterLink to="/products" class="text-sm font-medium text-brand hover:underline">See all</RouterLink>
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
          <article v-for="item in filteredPopularItems" :key="item.name" :class="`${productCard} cursor-pointer`" @click="openProductDetail(item)">
            <div class="overflow-hidden">
              <img :src="item.image" :alt="item.name" :class="productThumb" loading="lazy" />
            </div>
            <div class="p-4">
              <p class="text-xs text-slate-500">{{ item.category }}</p>
              <div class="mt-1 flex items-start justify-between gap-2">
                <h3 class="text-[15px] font-semibold text-ink">{{ item.name }}</h3>
                <button
                  type="button"
                  class="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-200 transition hover:border-rose-300 hover:bg-rose-50"
                  :aria-label="isWishlisted(item.name) ? 'Remove from wishlist' : 'Add to wishlist'"
                  @click.stop="toggleWishlist(item)"
                >
                  <svg
                    class="h-4 w-4"
                    viewBox="0 0 24 24"
                    :class="isWishlisted(item.name) ? 'fill-rose-500 text-rose-500' : 'fill-transparent text-slate-400'"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
                  </svg>
                </button>
              </div>
              <div class="mt-2 flex items-center gap-2">
                <span class="text-base font-bold text-brand">{{ item.price }}</span>
                <span class="text-xs text-slate-400 line-through">{{ item.oldPrice }}</span>
              </div>
              <button :class="`${productBtn} inline-flex items-center justify-center gap-1.5`" type="button" @click.stop="addToCart(item)">
                <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <circle cx="9" cy="20" r="1" />
                  <circle cx="17" cy="20" r="1" />
                  <path d="M5 5h2l2 10h9l2-7H8" />
                </svg>
                <span>Add to cart</span>
              </button>
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

    <footer v-if="!isAdminPageShown && !isAuthPageShown" class="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md">
      <div class="grid gap-6 p-5 md:grid-cols-2 lg:grid-cols-3">
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

    <div
      v-if="!isAdminPageShown && !isAuthPageShown"
      class="fixed left-1/2 top-6 z-50 inline-flex min-w-[280px] max-w-[90vw] -translate-x-1/2 items-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold shadow-2xl ring-2 transition duration-300"
      :class="[toastClass, showCartToast ? 'toast-pop pointer-events-auto opacity-100' : 'pointer-events-none -translate-y-2 opacity-0']"
      role="status"
      aria-live="polite"
    >
      <svg v-if="toastTone === 'success'" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="m20 6-11 11-5-5" />
      </svg>
      <svg v-else-if="toastTone === 'warning'" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M12 9v4" />
        <path d="M12 17h.01" />
        <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
      </svg>
      <svg v-else class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 8v4" />
        <path d="M12 16h.01" />
      </svg>
      {{ cartToastMessage }}
    </div>

    <button
      v-if="!isAdminPageShown && !isAuthPageShown"
      type="button"
      class="fixed right-0 top-1/2 z-30 flex w-[84px] -translate-y-1/2 flex-col overflow-hidden rounded-l-2xl border border-r-0 border-brand/35 bg-brand text-white shadow-[-8px_12px_22px_rgba(0,0,0,0.18)] transition duration-300 hover:bg-brand-dark"
      :class="[isCartOpen ? 'pointer-events-none opacity-0' : 'pointer-events-auto opacity-100', cartShake ? 'cart-tab-shake' : '']"
      aria-label="Open cart"
      @click="openCart"
    >
      <div class="flex min-h-[86px] flex-col items-center justify-center px-2 py-2">
        <svg
          class="h-6 w-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M6 8h12l-1 12H7L6 8z" />
          <path d="M9 8V6a3 3 0 1 1 6 0v2" />
        </svg>
        <div class="mt-1 text-center text-sm leading-tight">
          <span class="font-bold">{{ cartCount }}</span>
          <span class="ml-1">Items</span>
        </div>
      </div>
      <p class="w-full bg-white px-1 py-2 text-center text-sm font-bold leading-none text-brand">
        {{ formatTaka(cartSubtotal) }}
      </p>
    </button>

    <button
      v-if="!isAdminPageShown && !isAuthPageShown"
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

<style scoped>
.cart-tab-shake {
  animation: cartTabShake 0.52s ease;
}

.toast-pop {
  animation: toastPop 0.26s ease;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.zoom-fade-enter-active {
  animation: zoomFadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.zoom-fade-leave-active {
  animation: zoomFadeOut 0.25s cubic-bezier(0.7, 0, 0.84, 0);
}

@keyframes zoomFadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes zoomFadeOut {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

@keyframes cartTabShake {
  0% {
    transform: translateY(-50%) translateX(0);
  }

  25% {
    transform: translateY(-50%) translateX(-6px);
  }

  50% {
    transform: translateY(-50%) translateX(5px);
  }

  75% {
    transform: translateY(-50%) translateX(-3px);
  }

  100% {
    transform: translateY(-50%) translateX(0);
  }
}

@keyframes toastPop {
  from {
    transform: translateX(-50%) translateY(-8px) scale(0.96);
  }

  to {
    transform: translateX(-50%) translateY(0) scale(1);
  }
}
</style>
