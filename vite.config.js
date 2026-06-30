import { defineConfig } from 'vite'
import { resolve } from 'node:path'
import { readdirSync } from 'node:fs'
import tailwindcss from '@tailwindcss/vite'

const root = import.meta.dirname

// أدخل كل صفحات HTML في جذر المشروع تلقائياً ضمن عملية البناء
const input = Object.fromEntries(
  readdirSync(root)
    .filter((file) => file.endsWith('.html'))
    .map((file) => [file.slice(0, -5), resolve(root, file)])
)

export default defineConfig({
  // مسارات نسبية حتى تعمل صفحات dist عند فتحها مباشرة أو استضافتها في أي مجلد
  base: './',
  plugins: [tailwindcss()],
  build: {
    rollupOptions: {
      input,
    },
  },
})
