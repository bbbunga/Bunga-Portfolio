# Changelog - Portfolio Redesign

## 🎨 Perubahan Tema Warna
- Mengubah tema dari hijau ke **lilac/ungu** yang lebih profesional
- Warna utama: `#9333ea` (purple-600) untuk light mode
- Warna utama: `#a855f7` (purple-400) untuk dark mode
- Menyesuaikan gradasi warna untuk light dan dark mode
- Semua warna accent sekarang menggunakan skema ungu/lilac

## ✨ Fitur Baru: Preview Modal untuk Projects
- Menambahkan tombol **"Preview"** di setiap project card
- Ketika diklik, akan muncul modal/popup dengan screenshot project
- Modal features:
  - Backdrop blur effect
  - Smooth animations (slide up + fade in)
  - Close button dengan hover effect
  - Bisa ditutup dengan:
    - Klik tombol X
    - Klik area backdrop
    - Tekan tombol Escape
  - Link ke "Visit Live Site" (jika ada demo URL)
  - Responsive untuk mobile dan desktop

## 🎯 Emoji Icons untuk Skills
- Setiap skill sekarang memiliki emoji icon yang relevan
- Contoh:
  - 💻 Web Development
  - 🎨 UI/UX Design
  - 🐘 PHP
  - 🐬 MySQL
  - 🧠 Machine Learning
  - 👁️ Computer Vision
  - 🐙 Git/GitHub
  - dll.
- Emoji icons akan scale up saat hover
- Design lebih menarik dan profesional

## 📁 File Preview Images
Telah dibuat placeholder untuk 4 gambar preview:
- `/public/preview1.png` - Clothing Rental Application
- `/public/preview2.png` - MyLodies
- `/public/preview3.png` - Diffusion Model Face Synthesis
- `/public/preview4.png` - Sign Language Recognition

**⚠️ Note:** Silakan replace file-file placeholder ini dengan screenshot asli dari project Anda.

## 🎨 CSS Improvements
- Menambahkan styling untuk modal overlay dan content
- Improved button styling dengan 2 buttons (Show More/Less + Preview)
- Better hover effects dan transitions
- Responsive design untuk mobile

## 🚀 Cara Mengganti Preview Images

1. Siapkan screenshot dari masing-masing project (format PNG atau JPG)
2. Resize gambar ke ukuran yang sesuai (recommended: 1200x800px atau 16:9 ratio)
3. Rename dan replace file di folder `public/`:
   - `preview1.png` - Screenshot Clothing Rental Application
   - `preview2.png` - Screenshot MyLodies
   - `preview3.png` - Screenshot Diffusion Model
   - `preview4.png` - Screenshot Sign Language Recognition

## 🎯 Testing Checklist

- [ ] Test tombol Preview di semua project cards
- [ ] Test modal close dengan klik backdrop
- [ ] Test modal close dengan tombol Escape
- [ ] Test modal close dengan tombol X
- [ ] Test responsiveness di mobile
- [ ] Test dark/light mode switching
- [ ] Verify semua emoji icons tampil dengan benar
- [ ] Replace placeholder images dengan screenshot asli

## 📱 Responsive Behavior
- Desktop: Modal muncul di tengah layar dengan max-width 900px
- Mobile: Modal fullscreen dengan padding yang sesuai
- Smooth scroll disabled saat modal terbuka
- Body scroll locked saat modal aktif
