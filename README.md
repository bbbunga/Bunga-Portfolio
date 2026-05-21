# bunga_portofolio

Portfolio Bunga Citra Lestari Situmorang, dibuat dengan Next.js.

## Cara menjalankan

Project ini berada di filesystem WSL. Jalankan perintah dari terminal WSL, bukan dari PowerShell yang sedang berada di path `\\wsl.localhost\...`, karena `cmd.exe` Windows tidak mendukung UNC path sebagai working directory untuk script npm/pnpm.

```bash
cd /home/bunga/hobby/bunga-portofolio
source "$HOME/.nvm/nvm.sh"
pnpm install
pnpm dev
```

Buka `http://localhost:3000` di browser.

## Build production

```bash
cd /home/bunga/hobby/bunga-portofolio
source "$HOME/.nvm/nvm.sh"
pnpm build
```

## Catatan rename

Rename project aman selama source code, metadata package, dan instruksi run memakai nama yang konsisten. Nama package project ini sudah disamakan menjadi `bunga_portofolio`.
