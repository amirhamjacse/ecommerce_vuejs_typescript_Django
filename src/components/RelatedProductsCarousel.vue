<script setup lang="ts">
import { computed, ref, watch } from 'vue'

type ProductPreview = {
  name: string
  price: string
  image: string
  images?: string[]
  oldPrice?: string
  category?: string
  badge?: string
  description?: string
  keyFeatures?: string[]
  usageIdeas?: string[]
}

const props = defineProps<{
  products: ProductPreview[]
  currentProductName?: string
  currentCategory?: string
}>()

const emit = defineEmits<{
  (event: 'open-product', product: ProductPreview): void
}>()

const slideIndex = ref(0)
const productsPerSlide = 4

const orderedProducts = computed(() => {
  const filtered = props.products.filter((item) => item.name !== props.currentProductName)

  if (!props.currentCategory) return filtered

  const sameCategory = filtered.filter((item) => item.category === props.currentCategory)
  const otherCategory = filtered.filter((item) => item.category !== props.currentCategory)

  return [...sameCategory, ...otherCategory]
})

const slides = computed(() => {
  const result: ProductPreview[][] = []
  for (let index = 0; index < orderedProducts.value.length; index += productsPerSlide) {
    result.push(orderedProducts.value.slice(index, index + productsPerSlide))
  }
  return result
})

const totalSlides = computed(() => slides.value.length)

const nextSlide = () => {
  if (!totalSlides.value) return
  slideIndex.value = (slideIndex.value + 1) % totalSlides.value
}

const prevSlide = () => {
  if (!totalSlides.value) return
  slideIndex.value = (slideIndex.value - 1 + totalSlides.value) % totalSlides.value
}

const openProduct = (product: ProductPreview) => {
  emit('open-product', product)
}

watch(
  () => [props.currentProductName, props.currentCategory, props.products.length],
  () => {
    slideIndex.value = 0
  }
)
</script>

<template>
  <section class="surface-card overflow-hidden border border-slate-200 bg-gradient-to-br from-white via-emerald-50/40 to-amber-50/30 p-4 md:p-6">
    <div class="mb-4 flex items-center justify-between gap-3">
      <div>
        <p class="text-xs font-semibold uppercase tracking-wide text-emerald-700">More Products</p>
        <h3 class="text-xl font-semibold text-ink">Related Products</h3>
      </div>
      <div class="hidden items-center gap-2 sm:flex">
        <button
          type="button"
          class="inline-flex h-10 w-10 items-center justify-center rounded-full border border-emerald-200 bg-white text-emerald-700 transition hover:border-emerald-400 hover:bg-emerald-50"
          aria-label="Previous related products"
          @click="prevSlide"
        >
          <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
        <button
          type="button"
          class="inline-flex h-10 w-10 items-center justify-center rounded-full border border-emerald-200 bg-white text-emerald-700 transition hover:border-emerald-400 hover:bg-emerald-50"
          aria-label="Next related products"
          @click="nextSlide"
        >
          <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>
      </div>
    </div>

    <p class="mb-4 text-xs text-slate-500">Use the arrow buttons or your keyboard left/right keys to browse more products.</p>

    <div
      tabindex="0"
      class="outline-none"
      @keydown.left.prevent="prevSlide"
      @keydown.right.prevent="nextSlide"
    >
      <div v-if="slides.length > 0" class="overflow-hidden">
        <div class="flex transition-transform duration-500 ease-out" :style="{ transform: `translateX(-${slideIndex * 100}%)` }">
          <div v-for="(slide, pageIndex) in slides" :key="`related-page-${pageIndex}`" class="w-full shrink-0">
            <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <article
                v-for="item in slide"
                :key="item.name"
                class="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg"
              >
                <button type="button" class="w-full text-left" @click="openProduct(item)">
                  <div class="relative overflow-hidden">
                    <img :src="item.image" :alt="item.name" class="h-40 w-full object-cover transition duration-300 group-hover:scale-105" loading="lazy" />
                    <span
                      v-if="item.badge"
                      class="absolute right-2 top-2 rounded-full bg-rose-100 px-2 py-1 text-[11px] font-semibold text-rose-700"
                    >
                      {{ item.badge }}
                    </span>
                  </div>
                  <div class="p-3">
                    <p class="text-xs font-semibold uppercase tracking-wide text-emerald-700">{{ item.category ?? 'Products' }}</p>
                    <h4 class="mt-1 line-clamp-2 text-sm font-semibold text-ink">{{ item.name }}</h4>
                    <div class="mt-2 flex items-center gap-2">
                      <span class="text-sm font-bold text-brand">{{ item.price }}</span>
                      <span v-if="item.oldPrice" class="text-xs text-slate-400 line-through">{{ item.oldPrice }}</span>
                    </div>
                  </div>
                </button>
              </article>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="rounded-xl border border-dashed border-slate-300 bg-white/70 p-5 text-center text-sm text-slate-500">
        More related products will be available soon.
      </div>
    </div>

    <div v-if="slides.length > 1" class="mt-4 flex items-center justify-center gap-2">
      <button
        v-for="(_, dotIndex) in slides"
        :key="`related-dot-${dotIndex}`"
        type="button"
        :aria-label="`Go to related products slide ${dotIndex + 1}`"
        class="h-2.5 rounded-full transition"
        :class="dotIndex === slideIndex ? 'w-6 bg-emerald-600' : 'w-2.5 bg-emerald-200 hover:bg-emerald-300'"
        @click="slideIndex = dotIndex"
      ></button>
    </div>

    <div class="mt-4 flex items-center justify-center gap-2 sm:hidden">
      <button
        type="button"
        class="inline-flex items-center gap-2 rounded-lg border border-emerald-200 bg-white px-3 py-2 text-sm font-semibold text-emerald-700"
        @click="prevSlide"
      >
        Prev
      </button>
      <button
        type="button"
        class="inline-flex items-center gap-2 rounded-lg border border-emerald-200 bg-white px-3 py-2 text-sm font-semibold text-emerald-700"
        @click="nextSlide"
      >
        Next
      </button>
    </div>
  </section>
</template>
