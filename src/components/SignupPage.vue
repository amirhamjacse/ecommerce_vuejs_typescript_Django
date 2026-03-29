<script setup lang="ts">
import { ref } from 'vue'

type UserRole = 'customer' | 'admin'

type SignupPayload = {
  name: string
  email: string
  role: UserRole
}

const form = ref({
  name: '',
  email: '',
  password: '',
  role: 'customer' as UserRole,
})

const emits = defineEmits<{
  signup: [payload: SignupPayload]
  'go-login': []
}>()

const errorMessage = ref('')

const submit = () => {
  if (!form.value.name.trim() || !form.value.email.trim() || !form.value.password.trim()) {
    errorMessage.value = 'Name, email, and password are required.'
    return
  }
  errorMessage.value = ''
  emits('signup', {
    name: form.value.name,
    email: form.value.email,
    role: form.value.role,
  })
}
</script>

<template>
  <section class="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-amber-50 to-orange-50 p-6 shadow-[0_24px_60px_rgba(249,115,22,0.12)] md:p-8">
    <div class="pointer-events-none absolute -left-16 -top-20 h-56 w-56 rounded-full bg-orange-200/30 blur-3xl"></div>
    <div class="pointer-events-none absolute -bottom-16 right-0 h-60 w-60 rounded-full bg-amber-200/35 blur-3xl"></div>

    <div class="relative grid gap-8 md:grid-cols-[1.1fr_1fr]">
      <div>
        <p class="text-xs font-semibold uppercase tracking-[0.18em] text-orange-700">Create Account</p>
        <h1 class="mt-2 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">Start Shopping Smarter</h1>
        <p class="mt-3 max-w-md text-sm text-slate-600 md:text-base">
          Sign up to track orders, manage profile details, and access role-based tools.
        </p>
      </div>

      <form class="rounded-2xl border border-white/70 bg-white/90 p-5 shadow-lg backdrop-blur" @submit.prevent="submit">
        <label class="mb-3 block text-sm">
          <span class="mb-1 block font-medium text-slate-700">Full Name</span>
          <input v-model="form.name" type="text" class="w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none ring-orange-200 transition focus:ring-2" placeholder="Your full name" />
        </label>

        <label class="mb-3 block text-sm">
          <span class="mb-1 block font-medium text-slate-700">Email Address</span>
          <input v-model="form.email" type="email" class="w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none ring-orange-200 transition focus:ring-2" placeholder="name@example.com" />
        </label>

        <label class="mb-3 block text-sm">
          <span class="mb-1 block font-medium text-slate-700">Password</span>
          <input v-model="form.password" type="password" class="w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none ring-orange-200 transition focus:ring-2" placeholder="At least 8 characters" />
        </label>

        <label class="mb-3 block text-sm">
          <span class="mb-1 block font-medium text-slate-700">Account Type</span>
          <select v-model="form.role" class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 outline-none ring-orange-200 transition focus:ring-2">
            <option value="customer">Customer</option>
            <option value="admin">Admin</option>
          </select>
        </label>

        <p v-if="errorMessage" class="mb-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-medium text-rose-700">
          {{ errorMessage }}
        </p>

        <button type="submit" class="w-full rounded-xl bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-700">
          Create Account
        </button>

        <p class="mt-3 text-center text-sm text-slate-600">
          Already have an account?
          <button type="button" class="font-semibold text-sky-700 hover:text-sky-800" @click="emits('go-login')">
            Login now
          </button>
        </p>
      </form>
    </div>
  </section>
</template>
