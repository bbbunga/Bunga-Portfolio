# 🚀 Quick Reference - Portfolio Updates

## ⚡ TL;DR

**Apa yang berubah:**
1. ✅ Warna tema: Hijau → Purple/Lilac
2. ✅ Skills: Sekarang punya emoji icons
3. ✅ Projects: Ada tombol "Preview" dengan modal popup

**Yang harus dilakukan:**
1. ⚠️ **REPLACE** file `preview1.png`, `preview2.png`, `preview3.png`, `preview4.png` di folder `/public/` dengan screenshot project asli
2. ✅ Test semua fitur
3. ✅ Deploy

---

## 🎨 Color Palette Baru

### Light Mode
```css
--accent-primary: #9333ea;      /* Purple 600 */
--accent-primary-hover: #7e22ce; /* Purple 700 */
```

### Dark Mode
```css
--accent-primary: #a855f7;      /* Purple 400 */
--accent-primary-hover: #c084fc; /* Purple 300 */
```

---

## 🎯 Preview Images - ACTION REQUIRED!

### Current Status: ❌ PLACEHOLDER
File di `/public/` masih dummy, **HARUS DIGANTI!**

### Spesifikasi:
- **Format:** PNG atau JPG
- **Size:** 1200x800px (16:9)
- **File size:** < 500KB
- **Quality:** High, tapi optimized

### Cara Replace:
1. Screenshot project Anda
2. Rename jadi `preview1.png`, `preview2.png`, dst
3. Copy ke `/public/` (overwrite file lama)
4. Refresh browser

### Project Mapping:
```
preview1.png → Clothing Rental Application
preview2.png → MyLodies (https://mylodies.xyz/)
preview3.png → Diffusion Model (https://tribevis-ai.vercel.app/)  
preview4.png → Sign Language Recognition
```

---

## 🧪 Quick Test

```bash
# 1. Run dev server
pnpm dev

# 2. Open browser
http://localhost:3000

# 3. Test checklist:
☐ Klik "Preview" button → Modal muncul
☐ Klik X button → Modal close
☐ Klik backdrop → Modal close  
☐ Tekan ESC → Modal close
☐ Check emoji icons di skills section
☐ Toggle dark/light mode → Purple theme di keduanya
☐ Test responsive di mobile
```

---

## 📝 Key Features

### Preview Modal:
- **Trigger:** Click "Preview" button
- **Close:** 3 ways (X, backdrop, ESC)
- **Content:** Screenshot + title + link to live site
- **Animation:** Smooth slide-up + fade-in
- **Responsive:** Fullscreen di mobile, centered di desktop

### Skill Icons:
- **Before:** Plain text
- **After:** Text + emoji icon
- **Interaction:** Emoji scale up on hover
- **Design:** Modern, professional

### Color Theme:
- **Before:** Green/Teal accent
- **After:** Purple/Lilac accent
- **Modes:** Optimized untuk light & dark
- **Consistency:** Semua components updated

---

## 🐛 Troubleshooting

### Preview images tidak muncul?
```bash
# Check file ada di public/
dir public\preview*.png

# Check console browser
# Buka DevTools > Console > cari error
```

### Modal tidak smooth?
```bash
# Clear cache
Ctrl + Shift + Delete (Chrome)
# Atau buka Incognito mode
```

### Port 3000 busy?
```bash
# Kill process
netstat -ano | findstr :3000
taskkill /PID [PID_NUMBER] /F

# Atau pakai port lain
pnpm dev -- --port 3001
```

---

## 📦 Files Changed

```
Modified:
✏️ src/app/page.tsx
✏️ src/app/globals.css

Created:
✨ public/preview1.png (placeholder - GANTI!)
✨ public/preview2.png (placeholder - GANTI!)
✨ public/preview3.png (placeholder - GANTI!)
✨ public/preview4.png (placeholder - GANTI!)
✨ CHANGES_LOG.md
✨ HOW_TO_RUN.md
✨ SUMMARY_PERUBAHAN.md
✨ QUICK_REFERENCE.md (this file)
```

---

## ✅ Ready to Deploy?

**Checklist:**
- [ ] Preview images diganti dengan screenshot asli
- [ ] Test di browser (Chrome, Firefox, Safari)
- [ ] Test responsive (desktop, tablet, mobile)
- [ ] Test dark/light mode
- [ ] Build success: `pnpm build`
- [ ] No console errors
- [ ] All links working

**If YES → Deploy! 🚀**

---

## 📚 Documentation

- `CHANGES_LOG.md` - Detailed changelog
- `HOW_TO_RUN.md` - Setup & run instructions  
- `SUMMARY_PERUBAHAN.md` - Complete summary
- `QUICK_REFERENCE.md` - This file (quick guide)

---

## 🎉 Done!

Portfolio Anda sekarang:
✅ Lebih modern dengan purple theme  
✅ Lebih interactive dengan preview modal  
✅ Lebih profesional dengan skill icons  

**Next:** Replace preview images → Test → Deploy! 🚀
