# 🚀 Cara Menjalankan Portfolio

## Prerequisites
- Node.js (v18 atau lebih baru)
- pnpm (package manager)

## Install Dependencies
```bash
pnpm install
```

## Jalankan Development Server
```bash
pnpm dev
```

Aplikasi akan berjalan di: **http://localhost:3000**

## Build untuk Production
```bash
pnpm build
pnpm start
```

## 📋 Checklist Sebelum Deploy

### 1. Ganti Preview Images ✅
Replace file-file placeholder di folder `public/`:
- `preview1.png` → Screenshot Clothing Rental Application
- `preview2.png` → Screenshot MyLodies  
- `preview3.png` → Screenshot Diffusion Model
- `preview4.png` → Screenshot Sign Language Recognition

**Rekomendasi ukuran gambar:**
- Aspect ratio: 16:9
- Resolusi: 1200x800px atau 1920x1080px
- Format: PNG atau JPG
- Ukuran file: < 500KB (untuk performance)

### 2. Test Semua Fitur ✅
- [ ] Test tombol "Preview" di setiap project
- [ ] Test modal bisa ditutup dengan 3 cara (X button, backdrop, ESC)
- [ ] Test responsive di mobile dan desktop
- [ ] Test dark/light mode toggle
- [ ] Test semua link eksternal (GitHub, LinkedIn, Demo sites)
- [ ] Verify semua emoji icons tampil dengan benar

### 3. Optimasi Gambar (Optional) ✅
Gunakan tools seperti:
- TinyPNG (https://tinypng.com/)
- Squoosh (https://squoosh.app/)
- ImageOptim (Mac)

### 4. Update Content (Jika Perlu) ✅
- Update bio/about section
- Update project descriptions
- Update contact information
- Update skills list

## 🎨 Fitur Baru

### 1. **Preview Modal**
- Klik tombol "Preview" untuk melihat screenshot project
- Modal dengan blur backdrop effect
- Smooth animations
- 3 cara untuk menutup modal

### 2. **Emoji Icons di Skills**
- Setiap skill punya icon emoji yang relevan
- Hover effect dengan scale animation
- Design lebih menarik dan modern

### 3. **Tema Lilac/Purple**
- Warna ungu/lilac yang profesional
- Optimized untuk light dan dark mode
- Consistent color scheme

## 🛠️ Tech Stack
- **Framework:** Next.js 16
- **UI:** React 19
- **Styling:** Tailwind CSS 4 + Custom CSS
- **Language:** TypeScript
- **Deployment:** (Vercel/Netlify recommended)

## 📝 Notes
- Development server berjalan di port 3000
- Hot reload enabled
- TypeScript untuk type safety
- Responsive design mobile-first

## 🐛 Troubleshooting

### Port 3000 sudah digunakan?
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID [PID_NUMBER] /F

# Atau gunakan port lain
pnpm dev -- --port 3001
```

### Build error?
```bash
# Clean cache dan reinstall
rm -rf .next node_modules
pnpm install
pnpm dev
```

### Images tidak muncul?
- Pastikan file preview1.png - preview4.png ada di folder `/public/`
- Check console browser untuk error
- Verify file path dan nama file exact match
