<script setup lang="ts">
import { ref } from 'vue'

type UserRole = 'customer' | 'admin'

type AuthPayload = {
  name: string
  email: string
  role: UserRole
}

const form = ref<AuthPayload>({
  name: '',
  email: '',
  role: 'customer',
})

const emits = defineEmits<{
  login: [payload: AuthPayload]
  'go-signup': []
}>()

const errorMessage = ref('')

const submit = () => {
  if (!form.value.name.trim() || !form.value.email.trim()) {
    errorMessage.value = 'Name and email are required.'
    return
  }
  errorMessage.value = ''
  emits('login', {
    name: form.value.name,
    email: form.value.email,
    role: form.value.role,
  })
}
</script>

<template>
  <section class="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-sky-50 to-emerald-50 p-6 shadow-[0_24px_60px_rgba(2,132,199,0.12)] md:p-8">
    <div class="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full bg-sky-200/30 blur-3xl"></div>
    <div class="pointer-events-none absolute -bottom-12 -left-10 h-52 w-52 rounded-full bg-emerald-200/30 blur-3xl"></div>

    <div class="relative grid gap-8 md:grid-cols-[1.1fr_1fr]">
      <div>
        <p class="text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">Welcome Back</p>
        <h1 class="mt-2 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">Login to BazarPro</h1>
        <p class="mt-3 max-w-md text-sm text-slate-600 md:text-base">
          Access your orders, profile, and dashboard from one place. Continue with your account details below.
        </p>
      </div>

      <form class="rounded-2xl border border-white/70 bg-white/90 p-5 shadow-lg backdrop-blur" @submit.prevent="submit">
        <label class="mb-3 block text-sm">
          <span class="mb-1 block font-medium text-slate-700">Full Name</span>
          <input v-model="form.name" type="text" class="w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none ring-sky-200 transition focus:ring-2" placeholder="Your full name" />
        </label>

        <label class="mb-3 block text-sm">
          <span class="mb-1 block font-medium text-slate-700">Email Address</span>
          <input v-model="form.email" type="email" class="w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none ring-sky-200 transition focus:ring-2" placeholder="name@example.com" />
        </label>

        <label class="mb-3 block text-sm">
          <span class="mb-1 block font-medium text-slate-700">Login As</span>
          <select v-model="form.role" class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 outline-none ring-sky-200 transition focus:ring-2">
            <option value="customer">Customer</option>
            <option value="admin">Admin</option>
          </select>
        </label>

        <p v-if="errorMessage" class="mb-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-medium text-rose-700">
          {{ errorMessage }}
        </p>

        <button type="submit" class="w-full rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-700">
          Continue to Account
        </button>

        <p class="mt-3 text-center text-sm text-slate-600">
          New here?
          <button type="button" class="font-semibold text-emerald-700 hover:text-emerald-800" @click="emits('go-signup')">
            Create an account
          </button>
        </p>
      </form>
    </div>
  </section>
</template>
