/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark-bg': '#2b2b2b', // Màu nền chính giống trong ảnh
        'dark-panel': '#333333', // Màu nền các panel con
        'dark-border': '#555555', // Màu viền
        'alert-red': '#ff4d4f', // Màu đỏ cảnh báo
        'alert-yellow': '#faad14', // Màu vàng cảnh báo
      },
    },
  },
  plugins: [],
}
