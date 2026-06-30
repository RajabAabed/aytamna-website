# دليل دمج موقع «أيتامنا» داخل Laravel

هذا الملف موجّه لمبرمج Laravel. يشرح بنية الموقع الثابت الحالي (HTML + Vite + Tailwind v4 + FlyonUI)
وكيفية نقله إلى Laravel باستخدام Blade دون كسر أي تصميم أو وظيفة.

> اللغة: عربي RTL (`<html lang="ar" dir="rtl">`). الموقع متجاوب 100% (موبايل/تابلت/ديسكتوب).

---

## 1) نظرة عامة سريعة

- موقع متعدد الصفحات (MPA) — **32 صفحة HTML** في جذر المشروع.
- ملف CSS واحد مركزي: `src/style.css`.
- ملف JS واحد مركزي: `src/main.js` (ES module).
- الأصول في `src/assets/` (صور SVG/JPG + خطوط PingAR بصيغة otf).
- البناء عبر **Vite** (`npm run dev` / `npm run build`).

### التقنيات
| التقنية | الإصدار | الاستخدام |
|---|---|---|
| Tailwind CSS | v4 (`@tailwindcss/vite`) | التنسيق بالكامل (utility-first) |
| FlyonUI | ^2.4.1 | مكوّنات (dropdown, accordion, …) فوق Tailwind |
| Vite | ^8 | البناء والتطوير |
| FontAwesome | Kit (CDN) | الأيقونات |
| FullCalendar | 6.1.15 (CDN) | تقويم الفعاليات (الصفحة الرئيسية فقط) |
| Splide | 4.1.4 (CDN) | الكاروسيل (مقالات/شعارات) |
| خط PingAR | محلي (otf) | الخط الأساسي |
| Tajawal | Google Fonts | خط احتياطي في صفحات الحساب |

---

## 2) بنية الملفات الحالية

```
aytamna/
├─ *.html                      # 32 صفحة
├─ src/
│  ├─ style.css                # كل CSS المخصّص + إعداد Tailwind/FlyonUI
│  ├─ main.js                  # كل JS التفاعلي
│  └─ assets/
│     ├─ images/               # SVG + JPG
│     └─ fonts/PingAR/         # PingAR-{Light,Regular,Medium,Bold,Heavy}.otf
├─ vite.config.js              # يُدخل كل صفحات HTML تلقائياً، base: './'
└─ package.json
```

---

## 3) نظام التصميم (مهم — لا تغيّره)

معرّف داخل `src/style.css`:

### الألوان (عبر `@theme`)
```css
--color-brand-navy:  #213b58;   /* اللون الأساسي للنصوص/الأزرار الداكنة */
--color-brand-green: #82c341;   /* الأخضر الأساسي (CTA) */
--color-brand-sky:   #44b4db;   /* السماوي */
--color-brand-cream: #fafae0;
--gradient-brand: linear-gradient(135deg, #44b4db 0%, #82c341 100%);
--font-sans: "PingAR", system-ui, "Segoe UI", sans-serif;
```
تُستخدم كأصناف Tailwind: `text-brand-navy`, `bg-brand-green`, `border-base-300`, …

### أصناف مكوّنات مخصّصة (في `@layer components`)
| الصنف | الوظيفة |
|---|---|
| `.gradient-bg` | خلفية هيرو متدرّجة (radial) |
| `.gradient-bg-2` | تدرّج خطي (فوتر/أزرار) |
| `.auth-gradient` | تدرّج قطري + وهج (لوحة صفحات الحساب) |
| `.primary-btn` / `.secondary-btn` / `.outline-btn` / `.green-btn` | الأزرار |
| `.heading-1` … `.heading-5` / `.paragraph` | الطباعة |
| `.main-card` | بطاقة قياسية |
| `.header-link` / `.footer-link` | روابط الهيدر/الفوتر |
| `.fixed-header` + `.is-scrolled` | تأثير الهيدر عند التمرير (بلور + حد) |
| `.mobile-drawer` + `.is-open` | قائمة الموبايل المنزلقة |
| `.faq-item` | أكورديون الأسئلة (+/−) |
| `.assoc-tab` / `.assoc-tab-badge` | تبويبات صفحة تفاصيل الجمعية |
| `.dd-option` | عناصر القوائم المنسدلة المخصّصة |
| `.region-map-wrap` | خريطة المملكة التفاعلية |
| `#events-calendar …` | تنسيق FullCalendar الكامل |

> **القاعدة الذهبية:** عند التحويل إلى Blade، انسخ `src/style.css` كما هو إلى `resources/css/app.css`
> دون أي تعديل على هذه الأصناف.

---

## 4) المكوّنات المشتركة — ثلاثة أنواع صفحات

الموقع فيه **3 قوالب** متكرّرة. هذا هو جوهر التحويل: استخرجها إلى Blade layouts.

### النوع (أ) — صفحات بهيدر ثابت `fixed-header` (20 صفحة)
الهيدر `<header id="site-header" class="fixed-header fixed top-0 z-50 w-full">` + الـ drawer + الفوتر.
يشمل: `index, about, associations, associations-finder, associations-details, awards, blog,
contactus, courses, donor, events, faq, images, initiatives, news, privacy, reassured,
research, terms-conditions, 404`.

### النوع (ب) — صفحات تفاصيل بهيدر لاصق `sticky` (5 صفحات)
الهيدر `class="sticky top-0 z-50 border-b border-base-300 backdrop-blur"` (بدون تأثير سكروول).
يشمل: `blog-details, event-details, initiatives-details, news-details, research-details`.

> ⚠️ لا تخلط بين النوعين — لكل واحد ستايل هيدر مختلف.

### النوع (ج) — صفحات الحساب (بدون هيدر/فوتر) (7 صفحات)
تخطيط نصفين: لوحة `auth-gradient` + نموذج. يشمل:
`login, register, verify, verify-success, forgot-password, reset-password, reset-verify`.

**الخلاصة:** أنشئ 3 layouts في Blade:
`layouts/app.blade.php` (نوع أ)، `layouts/sticky.blade.php` (نوع ب)، `layouts/auth.blade.php` (نوع ج).

---

## 5) جافاسكربت — `src/main.js` (مع حماية الوجود)

كل وظيفة محمية بفحص وجود عنصرها، فلا تتعطّل أي صفحة. الوظائف بالترتيب:

| الوظيفة | يعمل عند وجود | ملاحظات |
|---|---|---|
| تهيئة Splide | `.splide` | breakpoints: 1024→2، 640→1 |
| تأثير الهيدر عند التمرير | `#site-header` | يضيف/يزيل `.is-scrolled` |
| فتح/إغلاق الـ drawer | `#mobile-drawer`, `#drawer-overlay`, `#menu-open`, `#menu-close` | + إغلاق بـ Escape |
| تحديث نص القوائم المنسدلة | `.dd-option` | يحدّث `.dd-label` |
| تقويم الفعاليات | `#events-calendar` + `window.FullCalendar` | بيانات أيام مضمّنة + tooltip |
| الخريطة التفاعلية | `#sa-map`, `#region-name`, `#region-list` | `regionsData` حسب id المنطقة |
| التبويبات | `.assoc-tab` / `.assoc-panel` | |
| رمز التحقق OTP | `.otp-input` | تنقّل تلقائي + عدّاد + تفعيل الزر |

> انسخ `main.js` كما هو إلى `resources/js/app.js`. الوحيد الذي يحتاج انتباهاً:
> بيانات التقويم والخريطة **مكتوبة يدوياً (hardcoded)** — لو أردت ربطها بقاعدة بيانات Laravel،
> مرّرها من Blade كـ JSON (انظر القسم 9).

---

## 6) المكتبات الخارجية (CDN حالياً)

موجودة كوسوم `<script>`/`<link>` داخل الصفحات:

```html
<!-- FontAwesome (kit) — في كل الصفحات قبل </body> -->
<script src="https://kit.fontawesome.com/c150b48bd0.js" crossorigin="anonymous"></script>

<!-- Splide — في كل الصفحات -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@splidejs/splide@4.1.4/dist/css/splide.min.css" />
<script src="https://cdn.jsdelivr.net/npm/@splidejs/splide@4.1.4/dist/js/splide.min.js"></script>

<!-- FullCalendar — في index.html فقط -->
<script src="https://cdn.jsdelivr.net/npm/fullcalendar@6.1.15/index.global.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/fullcalendar@6.1.15/locales-all.global.min.js"></script>
```

**خيارك:** إمّا إبقاؤها CDN داخل الـ layout (الأسهل)، أو نقلها إلى npm وحزمها مع Vite (الأنظف للإنتاج):
```bash
npm i @splidejs/splide @fullcalendar/core @fullcalendar/daygrid @fullcalendar/interaction
npm i @fortawesome/fontawesome-free
```
> ملاحظة: `main.js` يستخدم `window.Splide` و`window.FullCalendar` (نسخ global). إذا انتقلت إلى npm modules،
> عدّل الاستيراد في `app.js` (import + إنشاء instance) بدل النسخ العامة.

---

## 7) خطة التحويل إلى Laravel (خطوة بخطوة)

### 7.1 إنشاء المشروع وتثبيت الحزم
```bash
composer create-project laravel/laravel aytamna
cd aytamna
npm install
npm install tailwindcss @tailwindcss/vite flyonui
```

### 7.2 `vite.config.js`
```js
import { defineConfig } from 'vite'
import laravel from 'laravel-vite-plugin'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    laravel({
      input: ['resources/css/app.css', 'resources/js/app.js'],
      refresh: true,
    }),
    tailwindcss(),
  ],
})
```

### 7.3 نقل الملفات
| من (الحالي) | إلى (Laravel) |
|---|---|
| `src/style.css` | `resources/css/app.css` |
| `src/main.js` | `resources/js/app.js` |
| `src/assets/fonts/` | `resources/fonts/` (ثم عدّل مسارات `@font-face`) أو `public/fonts/` |
| `src/assets/images/` | `public/assets/images/` |

داخل `resources/js/app.js` أضف أعلى الملف:
```js
import '../css/app.css';
import 'flyonui/flyonui.js';
```
(هذان السطران موجودان أصلاً في `main.js` — أبقِهما، فقط صحّح المسار النسبي للـ css.)

> **مسارات الخطوط:** في `app.css` غيّر `url("./assets/fonts/PingAR/...")` إلى المسار الجديد
> (مثلاً `url("/fonts/PingAR/PingAR-Regular.otf")` لو وضعتها في `public/fonts`).

### 7.4 استخراج الـ Layout الرئيسي (نوع أ)
`resources/views/layouts/app.blade.php`:
```blade
<!doctype html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>@yield('title', 'أيتامنا')</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@splidejs/splide@4.1.4/dist/css/splide.min.css" />
  @vite(['resources/css/app.css', 'resources/js/app.js'])
  @stack('head')
</head>
<body>
  @include('partials.header')   {{-- الهيدر fixed-header + الـ drawer --}}

  @yield('content')

  @include('partials.footer')

  <script src="https://kit.fontawesome.com/c150b48bd0.js" crossorigin="anonymous"></script>
  <script src="https://cdn.jsdelivr.net/npm/@splidejs/splide@4.1.4/dist/js/splide.min.js"></script>
  @stack('scripts')   {{-- صفحة index تضيف هنا سكربتات FullCalendar --}}
</body>
</html>
```

- انسخ كتلة الهيدر + الـ drawer (من `<header …>` حتى نهاية `</aside>`) إلى `partials/header.blade.php`.
- انسخ كتلة `<footer>` إلى `partials/footer.blade.php`.
- كرّر نفس الفكرة لـ `layouts/sticky.blade.php` (نوع ب) — نفس البنية لكن بهيدر sticky.
- `layouts/auth.blade.php` (نوع ج) — بلا هيدر/فوتر، فقط `<head>` + `@yield('content')` + سكربت FA.

### 7.5 تحويل كل صفحة إلى Blade
خذ المحتوى بين `<main>` و`</main>` فقط من كل صفحة وضعه في view يرث الـ layout المناسب.

مثال `resources/views/index.blade.php`:
```blade
@extends('layouts.app')
@section('title', 'الرئيسية — أيتامنا')

@section('content')
  {{-- محتوى <main> الخاص بالصفحة الرئيسية كما هو --}}
@endsection

@push('scripts')
  <script src="https://cdn.jsdelivr.net/npm/fullcalendar@6.1.15/index.global.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/fullcalendar@6.1.15/locales-all.global.min.js"></script>
@endpush
```

مثال صفحة حساب `resources/views/login.blade.php`:
```blade
@extends('layouts.auth')
@section('title', 'تسجيل دخول — أيتامنا')
@section('content')
  {{-- محتوى <main> الخاص بصفحة الدخول --}}
@endsection
```

### 7.6 الروابط (`routes/web.php`) + جدول التحويل الكامل
```php
use Illuminate\Support\Facades\Route;

Route::view('/', 'index')->name('home');
Route::view('/about', 'about')->name('about');
// ... إلخ
```

| الصفحة الحالية | المسار المقترح | اسم الـ view | النوع/الـ layout |
|---|---|---|---|
| index.html | `/` | index | أ (app) |
| about.html | `/about` | about | أ |
| associations.html | `/associations` | associations | أ |
| associations-finder.html | `/associations/finder` | associations-finder | أ |
| associations-details.html | `/associations/{id}` | associations-details | أ |
| awards.html | `/awards` | awards | أ |
| blog.html | `/blog` | blog | أ |
| blog-details.html | `/blog/{slug}` | blog-details | **ب (sticky)** |
| contactus.html | `/contact` | contactus | أ |
| courses.html | `/courses` | courses | أ |
| donor.html | `/donor` | donor | أ |
| events.html | `/events` | events | أ |
| event-details.html | `/events/{id}` | event-details | **ب** |
| faq.html | `/faq` | faq | أ |
| images.html | `/gallery` | images | أ |
| initiatives.html | `/initiatives` | initiatives | أ |
| initiatives-details.html | `/initiatives/{id}` | initiatives-details | **ب** |
| news.html | `/news` | news | أ |
| news-details.html | `/news/{slug}` | news-details | **ب** |
| privacy.html | `/privacy` | privacy | أ |
| reassured.html | `/reassured` | reassured | أ |
| research.html | `/research` | research | أ |
| research-details.html | `/research/{id}` | research-details | **ب** |
| terms-conditions.html | `/terms` | terms-conditions | أ |
| 404.html | (Laravel fallback) | errors.404 | أ |
| login.html | `/login` | login | **ج (auth)** |
| register.html | `/register` | register | **ج** |
| verify.html | `/verify` | verify | **ج** |
| verify-success.html | `/verify/success` | verify-success | **ج** |
| forgot-password.html | `/password/forgot` | forgot-password | **ج** |
| reset-verify.html | `/password/verify` | reset-verify | **ج** |
| reset-password.html | `/password/reset` | reset-password | **ج** |

> داخل الـ Blade استبدل `href="login.html"` بـ `href="{{ route('login') }}"` (أو `{{ url('/login') }}`).
> الروابط الحالية كلها نسبية وصحيحة، لكن استخدام `route()` أفضل للصيانة.

### 7.7 الأصول (الصور)
- ضع الصور في `public/assets/images/`.
- في الـ Blade استبدل `src="/src/assets/images/x.svg"` بـ `src="{{ asset('assets/images/x.svg') }}"`.
- يمكن أتمتة الاستبدال بـ find/replace: `src="/src/assets/` ← `src="{{ asset('assets/`  (مع ضبط `}}`).

### 7.8 صفحة 404
احذف `404.html` واستخدم `resources/views/errors/404.blade.php` (Laravel يلتقطها تلقائياً).
انقل محتوى `<main>` فقط واجعلها ترث `layouts.app`.

---

## 8) نقاط مهمة ومزالق

1. **RTL:** أبقِ `dir="rtl" lang="ar"` على `<html>`. كل التنسيق مبني عليه.
2. **FlyonUI JS:** ضروري `import 'flyonui/flyonui.js'` في `app.js` وإلا لن تعمل القوائم المنسدلة/الأكورديون.
3. **الخطوط:** لا تنسَ نقل مجلد `PingAR` وتصحيح مسارات `@font-face`.
4. **ترتيب RTL في الـ flex:** عناصر صفحات الحساب تعتمد على أن أول عنصر flex يقع يميناً (اللوحة المتدرّجة أولاً ثم النموذج). لا تعكس الترتيب.
5. **CRLF:** بعض الملفات بنهايات أسطر CRLF — انتبه عند المعالجة الآلية.
6. **`@vite`:** يستبدل كل وسوم `<script>`/`<link>` الخاصة بـ `src/main.js` و`src/style.css`. لا تضع الملفين يدوياً.
7. **البناء:** `npm run build` ثم `php artisan serve`. للإنتاج: استضافة PHP + `npm run build`.

---

## 9) (اختياري) ربط بيانات التقويم/الخريطة بقاعدة البيانات

بيانات أيام التقويم والمناطق حالياً hardcoded في `app.js`. لتغذيتها من Laravel:

في الـ Blade:
```blade
@push('scripts')
<script>
  window.AYTAMNA_EVENTS  = @json($eventsByDay);   // { "2026-03-20": ["..."], ... }
  window.AYTAMNA_REGIONS = @json($regions);        // { SAU1097: { name, items }, ... }
</script>
@endpush
```
ثم في `app.js` اقرأ `window.AYTAMNA_EVENTS`/`window.AYTAMNA_REGIONS` بدل الكائنات المكتوبة يدوياً
(مع إبقاء قيمة افتراضية لو غير موجودة).

---

## 10) قائمة تحقق نهائية

- [ ] `app.css` = نسخة طبق الأصل من `src/style.css` (+ مسارات خطوط مصحّحة).
- [ ] `app.js` = نسخة من `src/main.js` (+ `import '../css/app.css'`).
- [ ] الخطوط في مكانها وتظهر (PingAR).
- [ ] 3 layouts: app / sticky / auth.
- [ ] header/footer partials مستخرجة.
- [ ] كل الصفحات الـ 32 تحوّلت إلى views وترث الـ layout الصحيح.
- [ ] الروابط تستخدم `route()` / `url()`.
- [ ] الصور عبر `asset()`.
- [ ] FontAwesome + Splide في الـ layouts؛ FullCalendar في index فقط (`@push('scripts')`).
- [ ] 404 عبر `errors/404.blade.php`.
- [ ] فحص متجاوب: موبايل/تابلت/ديسكتوب.
- [ ] `npm run build` ينجح بلا أخطاء.

---

*ملاحظة أخيرة: لا حاجة لإعادة كتابة أي CSS أو JS — فقط إعادة تنظيم الـ HTML داخل Blade وربط الأصول.
التصميم والوظائف جاهزة بالكامل.*
