<script setup lang="ts">
type UserRole = 'customer' | 'admin'

type UserSession = {
  name: string
  email: string
  role: UserRole
}

defineProps<{
  currentUser: UserSession | null
  isAdminUser: boolean
}>()

const emits = defineEmits<{
  logout: []
  'go-login': []
  'go-admin': []
}>()
</script>

<template>
  <section v-if="currentUser" class="rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-cyan-50 to-teal-50 p-6 shadow-[0_18px_55px_rgba(20,184,166,0.15)] md:p-8">
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <p class="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">Profile</p>
        <h1 class="mt-1 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">{{ currentUser.name }}</h1>
        <p class="mt-2 text-sm text-slate-600">Manage your account details and quick actions.</p>
      </div>
      <span class="rounded-full bg-teal-100 px-3 py-1 text-xs font-semibold uppercase text-teal-800">{{ currentUser.role }}</span>
    </div>

    <div class="mt-6 grid gap-4 md:grid-cols-2">
      <article class="rounded-2xl border border-white/70 bg-white/85 p-5 shadow-sm">
        <p class="text-xs uppercase tracking-wide text-slate-500">Email</p>
        <p class="mt-2 text-base font-semibold text-slate-800">{{ currentUser.email }}</p>
      </article>
      <article class="rounded-2xl border border-white/70 bg-white/85 p-5 shadow-sm">
        <p class="text-xs uppercase tracking-wide text-slate-500">Member Since</p>
        <p class="mt-2 text-base font-semibold text-slate-800">January 2026</p>
      </article>
    </div>

    <div class="mt-6 flex flex-wrap gap-2">
      <button
        v-if="isAdminUser"
        type="button"
        class="rounded-xl border border-indigo-300 bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700 hover:border-indigo-400 hover:bg-indigo-100"
        @click="emits('go-admin')"
      >
        Open Admin Dashboard
      </button>
      <button
        type="button"
        class="rounded-xl border border-rose-300 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 hover:border-rose-400 hover:bg-rose-100"
        @click="emits('logout')"
      >
        Logout
      </button>
    </div>
  </section>

  <section v-else class="rounded-3xl border border-amber-200 bg-amber-50 p-6 text-center">
    <h2 class="text-2xl font-bold text-amber-800">You are not logged in</h2>
    <p class="mt-2 text-sm text-amber-700">Login to access your profile and account features.</p>
    <button type="button" class="mt-4 rounded-xl bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700" @click="emits('go-login')">
      Go to Login
    </button>
  </section>
</template>
