ONLINE-PRODUCT-CATALOG/
├── .vscode/
├── backend/
│ └── my-strapi-project/
│ ├── .strapi/
│ ├── .tmp/
│ ├── config/
│ │ ├── database/
│ │ │ └── migrations/
│ │ │ └── .gitkeep
│ │ ├── admin.ts
│ │ ├── api.ts
│ │ ├── database.ts
│ │ ├── middlewares.ts
│ │ ├── plugins.ts
│ │ └── server.ts
│ ├── database/
│ ├── dist/
│ ├── node_modules/
│ ├── public/
│ │ ├── uploads/
│ │ └── robots.txt
│ ├── src/
│ │ ├── admin/
│ │ │ ├── app.example.tsx
│ │ │ ├── tsconfig.json
│ │ │ └── vite.config.example.ts
│ │ ├── api/
│ │ │ ├── inquiry/
│ │ │ │ ├── content-types/
│ │ │ │ │ └── inquiry/
│ │ │ │ │ ├── lifecycles.ts
│ │ │ │ │ └── schema.json
│ │ │ │ ├── controllers/
│ │ │ │ │ └── inquiry.ts
│ │ │ │ ├── routes/
│ │ │ │ │ └── inquiry.ts
│ │ │ │ └── services/
│ │ │ │ └── inquiry.ts
│ │ │ ├── page/
│ │ │ │ ├── content-types/
│ │ │ │ │ └── page/
│ │ │ │ │ └── schema.json
│ │ │ │ ├── controllers/
│ │ │ │ │ └── page.ts
│ │ │ │ ├── routes/
│ │ │ │ │ └── page.ts
│ │ │ │ └── services/
│ │ │ │ └── page.ts
│ │ │ ├── product/
│ │ │ │ ├── content-types/
│ │ │ │ │ └── product/
│ │ │ │ │ └── schema.json
│ │ │ │ ├── controllers/
│ │ │ │ │ └── product.ts
│ │ │ │ ├── routes/
│ │ │ │ │ ├── 01-custom-product.ts
│ │ │ │ │ └── product.ts
│ │ │ │ └── services/
│ │ │ │ └── product.ts
│ │ │ ├── product-type/
│ │ │ │ ├── content-types/
│ │ │ │ │ └── product-type/
│ │ │ │ │ └── schema.json
│ │ │ │ ├── controllers/
│ │ │ │ │ └── product-type.ts
│ │ │ │ ├── routes/
│ │ │ │ │ └── product-type.ts
│ │ │ │ └── services/
│ │ │ │ └── product-type.ts
│ │ │ └── .gitkeep
│ │ ├── extensions/
│ │ │ └── .gitkeep
│ │ └── index.ts
│ ├── types/
│ │ └── generated/
│ │ ├── components.d.ts
│ │ └── contentTypes.d.ts
│ ├── .env
│ ├── .env.example
│ ├── .gitignore
│ ├── strapi-updater.json
│ ├── favicon.png
│ ├── package-lock.json
│ ├── package.json
│ ├── README.md
│ └── tsconfig.json
├── frontend/
│ ├── .next/
│ ├── node_modules/
│ ├── public/
│ │ ├── alpial-logo.png
│ │ ├── file.svg
│ │ ├── globe.svg
│ │ ├── next.svg
│ │ ├── vercel.svg
│ │ └── window.svg
│ ├── src/
│ │ └── app/
│ │ ├── [slug]/
│ │ │ └── page.tsx
│ │ ├── components/
│ │ │ ├── CookieConsentBanner.tsx
│ │ │ ├── Footer.tsx
│ │ │ ├── GoogleAnalytics.tsx
│ │ │ ├── Header.tsx
│ │ │ ├── ProductCard.tsx
│ │ │ ├── ProductInquiryForm.tsx
│ │ │ ├── RelatedProducts.tsx
│ │ │ └── SuspenseWrapper.tsx
│ │ ├── context/
│ │ │ └── FavoritesContext.tsx
│ │ ├── dashboard/
│ │ │ ├── actions.ts
│ │ │ ├── layout.tsx
│ │ │ ├── LoginForm.tsx
│ │ │ └── page.tsx
│ │ ├── favorites/
│ │ │ └── page.tsx
│ │ ├── products/
│ │ │ └── [documentId]/
│ │ │ ├── page.tsx
│ │ │ └── ProductDetailClient.tsx
│ │ ├── search/
│ │ │ └── page.tsx
│ │ ├── favicon.ico
│ │ ├── globals.css
│ │ ├── layout.tsx
│ │ ├── page.tsx
│ │ └── sitemap.ts
│ ├── .env.local
│ ├── .gitignore
│ ├── eslint.config.mjs
│ ├── next-env.d.ts
│ ├── next.config.ts
│ ├── package-lock.json
│ ├── package.json
│ ├── postcss.config.mjs
│ ├── README.md
│ ├── tailwind.config.js
│ └── tsconfig.json
├── .gitignore
├── DEVELOPER_NOTES.md
├── NEXT_STEPS.md
├── PROJECT_STRUCTURE.md
└── REQUIREMENTS.md
