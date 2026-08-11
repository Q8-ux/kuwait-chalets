# Mawj — Kuwait Chalets | موج — شاليهات الكويت

A bilingual Arabic/English marketplace experience for discovering and comparing public chalet rental listings across Kuwait.

واجهة ثنائية اللغة لاكتشاف إعلانات تأجير الشاليهات في الكويت، تصفيتها، حفظها ومقارنتها مع الرجوع إلى المصدر الأصلي.

## Features | المزايا

- Arabic/English interface with automatic RTL/LTR layout
- Search, region and amenity filters, sorting and approximate map view
- Favorites stored locally in the browser
- Side-by-side comparison for up to three chalets
- Source-confidence labels and direct links to original public listings
- Responsive desktop and mobile layout

## Transparency | الشفافية

The chalet data is summarized from public listing pages and may change. Images are illustrative and are not copied from the original ads. Always verify price, availability, advertiser identity, contract and refund terms before paying.

بيانات الشاليهات مختصرة من صفحات إعلانية عامة وقد تتغير. الصور تعبيرية وليست منسوخة من الإعلانات الأصلية. يجب التحقق من السعر والتوفر وهوية المعلن والعقد وشروط الاسترداد قبل الدفع.

## Local development

Requires Node.js 22 or newer.

```bash
npm ci
npm run dev
```

Build the GitHub Pages version:

```bash
npm run build:pages
```

The static output is generated in `pages-dist/` with the `/kuwait-chalets/` base path.

## Deployment

Pushes to `main` trigger `.github/workflows/pages.yml`, which builds the static Vite entry and deploys it to GitHub Pages.

Expected public URL: `https://q8-ux.github.io/kuwait-chalets/`
