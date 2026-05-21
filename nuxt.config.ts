// https://nuxt.com/docs/api/configuration/nuxt-config
// export default defineNuxtConfig({
//   compatibilityDate: '2025-07-15',
//   devtools: { enabled: true }
// })

// nuxt.config.ts
// export default defineNuxtConfig({
//   // Nuxt 4のフォルダ構造（app/ フォルダベース）を明示的に有効化
//   future: {
//     compatibilityVersion: 4,
//   },
//   
//   // Tailwind CSSモジュールの登録
//   modules: [
//     '@nuxtjs/tailwindcss'
//   ],
// 
//   compatibilityDate: '2026-05-20'
// })

// nuxt.config.ts
export default defineNuxtConfig({
  future: {
    compatibilityVersion: 4,
  },
  
  // @nuxtjs/supabase を追加
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/supabase'
  ],

  // Supabaseの設定（リダイレクトを一旦オフにして開発しやすくする）
  supabase: {
    redirect: false
  },

  compatibilityDate: '2026-05-20'
})