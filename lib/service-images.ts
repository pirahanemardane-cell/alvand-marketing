import { mediaUrl } from "@/lib/media";

export type ServiceImageAsset = {
  /** Path under media/ for mediaUrl() */
  path: string;
  alt: string;
  width: number;
  height: number;
  photographer: string;
  unsplashId: string;
};

export type ServiceImageSet = {
  featured: ServiceImageAsset;
  related: ServiceImageAsset[];
};

function asset(
  path: string,
  alt: string,
  width: number,
  height: number,
  photographer: string,
  unsplashId: string
): ServiceImageAsset {
  return { path, alt, width, height, photographer, unsplashId };
}

export function serviceImageSrc(image: ServiceImageAsset): string {
  return mediaUrl(image.path);
}

const hubServiceImages: ServiceImageSet = {
  featured: asset("images/plp/plp-01-khadamat-digital-marketing-criteria-before-choosing-service.webp", "اینفوگرافیک چهار معیار انتخاب خدمات دیجیتال مارکتینگ: هدف قابل‌اندازه‌گیری، محل ریزش مشتری، افق زمانی و منابع داخلی", 1400, 503, "الوند مارکتینگ", "76fb10b19e5de8ea"),
  related: [
    asset("images/plp/plp-01-khadamat-digital-marketing-service-effect-timeline.webp", "نمودار زمانی شروع اثر خدمات دیجیتال مارکتینگ: تبلیغات از روزهای اول، طراحی سایت پس از تحویل، سئو معمولاً از ماه سوم", 1400, 732, "الوند مارکتینگ", "d1ba6da71e2ccdc6"),
    asset("images/plp/plp-01-khadamat-digital-marketing-limited-budget-start-order.webp", "اینفوگرافیک چهار مرحله ترتیب شروع خدمات دیجیتال مارکتینگ با بودجه محدود، از مسیر تماس سایت تا سئو و محتوا", 1400, 474, "الوند مارکتینگ", "cd12558c12862145"),
  ],
};

export { hubServiceImages };









































































































const img_plp_02: ServiceImageSet = {
  featured: asset("images/plp/plp-02-tarahi-site-site-type-by-goal.webp", "اینفوگرافیک انتخاب نوع پروژه طراحی سایت بر اساس هدف: سایت شرکتی، فروشگاه آنلاین، کاتالوگ با استعلام قیمت، بازطراحی و لندینگ پیج", 1400, 527, "الوند مارکتینگ", "4edacc3fd97dd085"),
  related: [
    asset("images/plp/plp-02-tarahi-site-wordpress-admin-pages-panel.webp", "تصویر واقعی پنل مدیریت وردپرس در بخش برگه‌ها؛ تیم کسب‌وکار پس از طراحی سایت متن و صفحات را خودش ویرایش می‌کند", 1440, 900, "الوند مارکتینگ", "2e4977e406b0d41b"),
    asset("images/plp/plp-02-tarahi-site-pre-project-checklist.webp", "چک‌لیست آماده‌سازی پیش از شروع پروژه طراحی سایت شامل لوگو، فهرست صفحات، متن، نمونه سایت‌ها، دسترسی دامنه و سرچ کنسول", 1400, 457, "الوند مارکتینگ", "3a1b7edbfb029011"),
  ],
};

const img_plp_03: ServiceImageSet = {
  featured: asset("images/plp/plp-03-seo-four-seo-service-types.webp", "اینفوگرافیک چهار بخش خدمات سئو: سئو تکنیکال، سئو داخلی، سئو خارجی و سئو محلی، با تمرکز و کاربرد هرکدام", 1400, 495, "الوند مارکتینگ", "53d78e9982851576"),
  related: [
    asset("images/plp/plp-03-seo-gsc-performance-report.webp", "بازسازی گزارش Performance سرچ کنسول با داده نمونه: کلیک کل، نمایش کل، CTR میانگین و جایگاه میانگین برای گزارش ماهانه سئو", 1440, 900, "الوند مارکتینگ", "5e1caba45ad34dfa"),
    asset("images/plp/plp-03-seo-seo-vs-ppc-traffic-pattern.webp", "نمودار مفهومی مقایسه سئو و تبلیغات کلیکی: ورودی تبلیغات از روزهای اول و قطع با توقف بودجه، ورودی سئو معمولاً از ماه سوم و ماندگارتر", 1400, 753, "الوند مارکتینگ", "5fd592683348c9b4"),
    asset("images/plp/plp-03-seo-seo-12-month-roadmap.webp", "نقشه زمانی دوازده‌ماهه قرارداد سئو در سه دوره: آدیت و رفع مشکلات فنی، تقویت صفحات برای کلمات رقابتی و تثبیت رتبه‌ها", 1400, 643, "الوند مارکتینگ", "298fa58d7191e7ed"),
  ],
};

const img_plp_04: ServiceImageSet = {
  featured: asset("images/plp/plp-04-tolid-mohtava-content-delivery-standard.webp", "اینفوگرافیک پنج استاندارد تولید محتوا: هدف مشخص، کلمه کلیدی بدون تکرار مصنوعی، ساختار خوانا، دقت اطلاعات و عنوان و متای سئو", 1400, 439, "الوند مارکتینگ", "a3bba7b60d748304"),
  related: [
    asset("images/plp/plp-04-tolid-mohtava-content-order-dos-and-donts.webp", "مقایسه اطلاعاتی که کیفیت تولید محتوا را بالا می‌برد با اشتباهات رایج در سفارش محتوا", 1400, 576, "الوند مارکتینگ", "744135c24de06629"),
  ],
};

const img_plp_05: ServiceImageSet = {
  featured: asset("images/plp/plp-05-hoosh-masnooi-ai-human-task-split.webp", "اینفوگرافیک تقسیم کار هوش مصنوعی و انسان در چهار فرایند بازاریابی، همراه با نقطه تأیید انسانی پیش از انتشار", 1400, 694, "الوند مارکتینگ", "6d2666f9e474dd38"),
  related: [
    asset("images/plp/plp-05-hoosh-masnooi-ai-tools-limits.webp", "اینفوگرافیک محدودیت‌های ابزارهای هوش مصنوعی در مارکتینگ: دسترسی و پرداخت برای کاربران ایرانی، کیفیت خروجی فارسی، حریم خصوصی و اشتباهات رایج", 1400, 462, "الوند مارکتینگ", "117a0a244bae097a"),
  ],
};

const img_plp_06: ServiceImageSet = {
  featured: asset("images/plp/plp-06-tablighat-interneti-campaign-management-deliverables.webp", "اینفوگرافیک پنج بخش مدیریت کمپین تبلیغات اینترنتی از تعیین هدف و مخاطب تا گزارش هزینه به‌ازای نتیجه", 1400, 437, "الوند مارکتینگ", "f1ea83248e1b2352"),
  related: [
    asset("images/plp/plp-06-tablighat-interneti-ads-commitments-vs-not-guaranteed.webp", "مقایسه موارد قابل تعهد و غیرقابل تضمین در تبلیغات اینترنتی؛ کنترل بودجه و گزارش شفاف در برابر تعداد فروش و هزینه هر کلیک", 1400, 576, "الوند مارکتینگ", "6af93f8ea3b022a6"),
  ],
};

const img_plp_07: ServiceImageSet = {
  featured: asset("images/plp/plp-07-shabake-haye-ejtemaei-instagram-vs-linkedin-management.webp", "مقایسه مدیریت اینستاگرام و مدیریت لینکدین از نظر مخاطب، قالب محتوا، شاخص موفقیت، زبان محتوا و حداقل قرارداد", 1400, 594, "الوند مارکتینگ", "f407113f3cff3024"),
  related: [
    asset("images/plp/plp-07-shabake-haye-ejtemaei-social-media-pre-contract-tips.webp", "اینفوگرافیک چهار نکته پیش از شروع مدیریت شبکه‌های اجتماعی: مالکیت دسترسی حساب، تعیین شاخص، پاسخ دایرکت حداکثر ۲۴ ساعت و قرارداد لینکدین", 1400, 467, "الوند مارکتینگ", "363857ce95788d1e"),
  ],
};

const img_plp_08: ServiceImageSet = {
  featured: asset("images/plp/plp-08-poshtibani-site-website-support-services-map.webp", "اینفوگرافیک شش خدمت پشتیبانی سایت: نگهداری دوره‌ای، افزایش سرعت، امنیت، مانیتورینگ، نصب قالب و افزونه وردپرس و رفع ارور سایت", 1400, 586, "الوند مارکتینگ", "0959a7e7c760eaa2"),
  related: [
    asset("images/plp/plp-08-poshtibani-site-monthly-support-vs-one-off.webp", "مقایسه قرارداد پشتیبانی ماهانه سایت با سفارش موردی از نظر کاربرد و خدمات شامل", 1400, 613, "الوند مارکتینگ", "2732694939065ad4"),
  ],
};

const img_plp_09: ServiceImageSet = {
  featured: asset("images/plp/plp-09-tarahi-sakht-application-app-build-paths.webp", "مقایسه سه مسیر طراحی اپلیکیشن: اپ نیتیو یا کراس‌پلتفرم، وب اپلیکیشن و تقویت سایت فعلی، با کاربرد و محدودیت هرکدام", 1400, 507, "الوند مارکتینگ", "cb525823efdbca8d"),
  related: [
    asset("images/plp/plp-09-tarahi-sakht-application-app-estimate-prerequisites.webp", "اینفوگرافیک پنج مورد لازم برای برآورد هزینه طراحی اپلیکیشن: قابلیت‌های نسخه اول، نقش کاربران، پلتفرم، اتصال‌ها و نگهداری", 1400, 468, "الوند مارکتینگ", "f1fd0bf025c9ef47"),
  ],
};

const img_plp_10: ServiceImageSet = {
  featured: asset("images/plp/plp-10-abzarhaye-analytics-analytics-tools-roles.webp", "اینفوگرافیک نقش ابزارهای آنالیتیکس در ردیابی تبدیل سایت: سرچ کنسول پیش از کلیک، تگ منیجر برای ثبت رویداد و گوگل آنالیتیکس پس از ورود", 1400, 497, "الوند مارکتینگ", "5f803e26d17870f7"),
  related: [
    asset("images/plp/plp-10-abzarhaye-analytics-ga4-traffic-acquisition-key-events.webp", "بازسازی گزارش Traffic acquisition در گوگل آنالیتیکس ۴ با داده نمونه؛ ستون Key events نشان می‌دهد هر کانال چند تبدیل آورده است", 1440, 900, "الوند مارکتینگ", "81047fd3034a96e7"),
    asset("images/plp/plp-10-abzarhaye-analytics-measurement-common-mistakes.webp", "اینفوگرافیک چهار اشتباه رایج در اندازه‌گیری و ردیابی تبدیل سایت مانند شمارش دوباره به‌خاطر نصب چندباره تگ", 1400, 404, "الوند مارکتینگ", "77d7d77df1fe548e"),
  ],
};

const img_plp_11: ServiceImageSet = {
  featured: asset("images/plp/plp-11-api-yekparche-sazi-api-project-scoping.webp", "اینفوگرافیک چهار مرحله تعریف پروژه طراحی API: سیستم مبدأ و مقصد، فیلدها و رفتار در خطا، احراز هویت و لاگ، و محیط آزمایش", 1400, 407, "الوند مارکتینگ", "fd00666947541a15"),
  related: [
    asset("images/plp/plp-11-api-yekparche-sazi-api-security-ownership.webp", "اینفوگرافیک سه قاعده امنیتی طراحی API: نگهداری امن کلید و توکن، دسترسی حداقلی به داده مشتری و مالکیت مستندات و کلیدها نزد کارفرما", 1400, 432, "الوند مارکتینگ", "778dc6345a6b1293"),
  ],
};

const img_plp_12: ServiceImageSet = {
  featured: asset("images/plp/plp-12-email-marketing-email-campaign-prerequisites.webp", "اینفوگرافیک چهار پیش‌نیاز ایمیل مارکتینگ: لیست با رضایت و لغو اشتراک، هدف واحد، ردیابی کلیک و تبدیل و احراز هویت دامنه ارسال", 1400, 437, "الوند مارکتینگ", "961348e2056e4c5d"),
  related: [
    asset("images/plp/plp-12-email-marketing-email-pre-send-checklist.webp", "چک‌لیست کنترل پیش از ارسال ایمیل مارکتینگ: هدف واحد، بررسی لینک‌ها در موبایل، لینک لغو اشتراک، پارامتر ردیابی و ارسال آزمایشی", 1400, 574, "الوند مارکتینگ", "6a1f5a9ad5c20868"),
  ],
};

const img_plp_13: ServiceImageSet = {
  featured: asset("images/plp/plp-13-moshavere-digital-marketing-consulting-session-prep.webp", "چک‌لیست آماده‌سازی پیش از جلسه مشاوره دیجیتال مارکتینگ: هدف سه یا شش‌ماهه، وضعیت سایت و کانال‌ها، محدوده بودجه و تجربه همکاری‌های قبلی", 1400, 437, "الوند مارکتینگ", "5ac41c380d9097a1"),
  related: [
    asset("images/plp/plp-13-moshavere-digital-marketing-free-consulting-outcomes.webp", "اینفوگرافیک سه خروجی جلسه اول مشاوره رایگان دیجیتال مارکتینگ: اولویت‌بندی کانال‌ها، تشخیص کارهای زودهنگام و اطلاعات لازم برای برآورد", 1400, 474, "الوند مارکتینگ", "e2bdd3938f6c4a36"),
  ],
};

const img_plp_14: ServiceImageSet = {
  featured: asset("images/plp/plp-14-branding-branding-scope-deliverables.webp", "اینفوگرافیک چهار بخش خدمات برندینگ: طراحی هویت بصری، طراحی لوگو با چند طرح اولیه، برندبوک و برندینگ دیجیتال", 1400, 505, "الوند مارکتینگ", "c5591108ad4dcd05"),
  related: [
    asset("images/plp/plp-14-branding-digital-branding-vs-graphic-design.webp", "مقایسه برندینگ دیجیتال با طراحی گرافیکی: هماهنگی پیام سایت، لحن شبکه اجتماعی و وعده تبلیغات علاوه بر ظاهر", 1400, 582, "الوند مارکتینگ", "f523b2de126eba59"),
  ],
};

const img_plp_15: ServiceImageSet = {
  featured: asset("images/plp/plp-15-tarahi-site-wordpress-wordpress-block-editor-editing.webp", "تصویر واقعی ویرایشگر بلوکی وردپرس فارسی در حال ویرایش یک برگه؛ افزودن بلوک، ویرایش متن و ذخیره تغییرات در سایت وردپرسی", 1440, 900, "الوند مارکتینگ", "22bb783f5a73b2ce"),
  related: [
    asset("images/plp/plp-15-tarahi-site-wordpress-ready-vs-custom-wordpress-theme.webp", "مقایسه طراحی سایت وردپرس با قالب آماده و قالب اختصاصی از نظر ظاهر، زمان راه‌اندازی، هزینه، کاربرد و توسعه بعدی", 1400, 594, "الوند مارکتینگ", "410ab532bb7e8828"),
  ],
};

const img_plp_16: ServiceImageSet = {
  featured: asset("images/plp/plp-16-tarahi-site-kodnevisi-custom-code-needed-or-not.webp", "مقایسه نشانه‌های نیاز به طراحی سایت کدنویسی اختصاصی با مواردی که وردپرس کافی است", 1400, 594, "الوند مارکتینگ", "6605525f0c5846da"),
  related: [
    asset("images/plp/plp-16-tarahi-site-kodnevisi-source-code-ownership.webp", "اینفوگرافیک مالکیت در طراحی سایت اختصاصی: تحویل کامل کد منبع پس از تسویه، مستند فنی، ثبت دامنه و هاست به نام کسب‌وکار و دسترسی کامل مدیر", 1400, 432, "الوند مارکتینگ", "c7d9fb0983cb9fbe"),
    asset("images/plp/plp-16-tarahi-site-kodnevisi-custom-site-order-steps.webp", "اینفوگرافیک شش مرحله طراحی سایت کدنویسی اختصاصی از جلسه شناخت و تحلیل امکانات تا استقرار و آموزش", 1400, 615, "الوند مارکتینگ", "3b1ee0153a370f05"),
  ],
};

const img_plp_17: ServiceImageSet = {
  featured: asset("images/plp/plp-17-tarahi-site-elementor-elementor-editor-live-editing.webp", "تصویر واقعی ویرایشگر المنتور در سایت آزمایشی؛ پنل ابزارک‌ها و ویرایش مستقیم تیتر روی صفحه در طراحی سایت با المنتور", 1440, 900, "الوند مارکتینگ", "6f096e1c59bece87"),
  related: [
    asset("images/plp/plp-17-tarahi-site-elementor-elementor-global-colors-fonts.webp", "تصویر واقعی تنظیمات سراسری المنتور برای رنگ و فونت؛ در سایت المنتوری اصولی رنگ و فونت از یک‌جا برای کل سایت تعیین می‌شود", 1440, 900, "الوند مارکتینگ", "187d8a255c7db090"),
    asset("images/plp/plp-17-tarahi-site-elementor-elementor-project-steps.webp", "اینفوگرافیک شش مرحله طراحی سایت با المنتور: جلسه شناخت، وایرفریم، سیستم سراسری و قالب‌ها، ساخت صفحات، بهینه‌سازی سرعت و آموزش", 1400, 652, "الوند مارکتینگ", "afdafa75b62efd20"),
  ],
};

const img_plp_18: ServiceImageSet = {
  featured: asset("images/plp/plp-18-baztarahi-site-three-redesign-levels.webp", "اینفوگرافیک سه سطح بازطراحی سایت: نوسازی هدفمند با ریسک سئو پایین، بازطراحی ظاهر با ریسک متوسط و تغییر پلتفرم با ریسک بالا بدون نقشه ریدایرکت", 1400, 635, "الوند مارکتینگ", "15d4451e6ce0e715"),
  related: [
    asset("images/plp/plp-18-baztarahi-site-redirects-301-rank-math.webp", "تصویر واقعی بخش تغییر مسیرها در افزونه Rank Math با نمونه ریدایرکت ۳۰۱ آدرس‌های قدیمی به آدرس‌های جدید در بازطراحی سایت", 1440, 900, "الوند مارکتینگ", "3337647edf4d9017"),
    asset("images/plp/plp-18-baztarahi-site-staging-noindex-wordpress-reading.webp", "تصویر واقعی تنظیمات خواندن وردپرس با گزینه نمایش به موتورهای جست‌وجو؛ در نسخه آزمایشی بازطراحی فعال و در روز انتشار غیرفعال می‌شود", 1440, 900, "الوند مارکتینگ", "8a2508ef3adcb967"),
    asset("images/plp/plp-18-baztarahi-site-redesign-order-steps.webp", "اینفوگرافیک هفت مرحله بازطراحی سایت از بررسی سایت فعلی و نقشه آدرس‌ها تا انتشار و پایش رتبه‌ها", 1400, 683, "الوند مارکتینگ", "60e5e3accd1ff45e"),
  ],
};

const img_plp_19: ServiceImageSet = {
  featured: asset("images/plp/plp-19-tarahi-site-foroushgahi-store-four-decisions.webp", "اینفوگرافیک چهار تصمیم پیش از طراحی سایت فروشگاهی: ساختار محصول، روش پرداخت، روش ارسال و مدیریت موجودی", 1400, 496, "الوند مارکتینگ", "6e5a44ac8a0223d8"),
  related: [
    asset("images/plp/plp-19-tarahi-site-foroushgahi-woocommerce-product-inventory.webp", "تصویر واقعی صفحه ویرایش محصول ووکامرس فارسی با شناسه محصول و موجودی انبار؛ همان ساختاری که در ورود ۱۰ محصول اولیه فروشگاه رعایت می‌شود", 1440, 900, "الوند مارکتینگ", "e57e6cc0b4d1150d"),
    asset("images/plp/plp-19-tarahi-site-foroushgahi-store-phase-1-vs-phase-2.webp", "مقایسه امکانات ضروری فاز اول سایت فروشگاهی با امکاناتی که پس از داده واقعی در فاز دوم اضافه می‌شود", 1400, 582, "الوند مارکتینگ", "7bedf050945de905"),
  ],
};

const img_plp_20: ServiceImageSet = {
  featured: asset("images/plp/plp-20-tarahi-site-sherkati-corporate-catalog-landing-store.webp", "مقایسه سایت شرکتی، کاتالوگ آنلاین با استعلام قیمت، لندینگ پیج و فروشگاه اینترنتی بر اساس کاربرد و هدف", 1400, 475, "الوند مارکتینگ", "2a1c2d78da107a75"),
  related: [
    asset("images/plp/plp-20-tarahi-site-sherkati-corporate-site-order-steps.webp", "اینفوگرافیک شش مرحله طراحی سایت شرکتی از جلسه شناخت و نقشه صفحات تا اتصال فرم‌ها، تست و آموزش پنل", 1400, 556, "الوند مارکتینگ", "25400a8a3e818ce0"),
    asset("images/plp/plp-20-tarahi-site-sherkati-corporate-site-materials-checklist.webp", "چک‌لیست مواد لازم برای طراحی سایت شرکتی: لوگو و رنگ برند، فهرست خدمات، تصاویر واقعی و سوابق و مجوزها", 1400, 463, "الوند مارکتینگ", "acf0954f9527d0e6"),
  ],
};

const img_plp_21: ServiceImageSet = {
  featured: asset("images/plp/plp-21-seo-technical-gsc-page-indexing-report.webp", "بازسازی گزارش Page indexing در سرچ کنسول گوگل با داده نمونه؛ دلایل ایندکس نشدن صفحات مانند noindex و Crawled - currently not indexed در سئو تکنیکال", 1440, 1000, "الوند مارکتینگ", "6b6ae388cfafb63d"),
  related: [
    asset("images/plp/plp-21-seo-technical-gsc-crawl-stats-host-status.webp", "بازسازی گزارش Crawl stats سرچ کنسول با وضعیت هاست و افزایش خطای سرور؛ نشانه در دسترس نبودن هاست داخلی برای ربات گوگل", 1440, 900, "الوند مارکتینگ", "6b67890a61b964a6"),
    asset("images/plp/plp-21-seo-technical-technical-seo-steps.webp", "اینفوگرافیک پنج مرحله سئو تکنیکال: دریافت دسترسی، خزش و بررسی سرچ کنسول، فهرست اولویت‌دار، اجرای اصلاحات و کنترل نتیجه", 1400, 501, "الوند مارکتینگ", "46f999d0bb39f219"),
  ],
};

const img_plp_22: ServiceImageSet = {
  featured: asset("images/plp/plp-22-seo-dakheli-rank-math-seo-title-meta.webp", "تصویر واقعی افزونه Rank Math در ویرایشگر وردپرس با کلمه کلیدی کانونی و امتیاز سئو داخلی یک نوشته نمونه", 1440, 900, "الوند مارکتینگ", "68e95b1042c8a265"),
  related: [
    asset("images/plp/plp-22-seo-dakheli-rank-math-snippet-pixel-limit.webp", "تصویر واقعی ویرایشگر پیش‌نمایش نتیجه جست‌وجو در Rank Math با شمارنده طول عنوان و توضیحات متا بر حسب پیکسل", 1440, 1000, "الوند مارکتینگ", "23c7998b056131c3"),
    asset("images/plp/plp-22-seo-dakheli-on-page-technical-off-page-local-seo.webp", "مقایسه سئو داخلی، سئو تکنیکال، سئو خارجی و سئو محلی بر اساس مشکلی که هرکدام حل می‌کند", 1400, 532, "الوند مارکتینگ", "dcbfaa3addf7b62b"),
    asset("images/plp/plp-22-seo-dakheli-gsc-performance-pages-position.webp", "بازسازی گزارش Performance سرچ کنسول در زبانه Pages با ستون‌های کلیک، نمایش، CTR و میانگین جایگاه برای اولویت‌بندی صفحات در سئو داخلی", 1440, 900, "الوند مارکتینگ", "546311b8e10d40ec"),
  ],
};

const img_plp_23: ServiceImageSet = {
  featured: asset("images/plp/plp-23-seo-khareji-link-site-selection-criteria.webp", "اینفوگرافیک شش معیار انتخاب سایت برای لینک سازی خارجی: ارتباط موضوعی، ترافیک واقعی، کیفیت محتوا، وضعیت ایندکس، جایگاه لینک و تعداد لینک خروجی", 1400, 652, "الوند مارکتینگ", "7452607dea8e22f0"),
  related: [
    asset("images/plp/plp-23-seo-khareji-link-building-value-vs-risk.webp", "نمودار کیفی ارزش و ریسک روش‌های لینک سازی؛ رپورتاژ در رسانه مرتبط، محتوای مهمان و محتوای قابل ارجاع در برابر خرید انبوه بک‌لینک", 1400, 594, "الوند مارکتینگ", "7ab6a517c679d715"),
    asset("images/plp/plp-23-seo-khareji-gsc-links-report.webp", "بازسازی گزارش Links سرچ کنسول با بخش لینک‌های خارجی، صفحات پرلینک و سایت‌های لینک‌دهنده برای کنترل گزارش سئو خارجی", 1440, 900, "الوند مارکتینگ", "7402ac0df1ffc0a6"),
  ],
};

const img_plp_24: ServiceImageSet = {
  featured: asset("images/plp/plp-24-seo-mahalli-google-maps-possible-vs-not-iran.webp", "مقایسه آنچه در ثبت گوگل مپ برای کسب‌وکار ایرانی ممکن است، مانند افزودن مکان و نظر مشتری، با آنچه ممکن نیست مانند پنل مالک گوگل بیزینس پروفایل", 1400, 631, "الوند مارکتینگ", "731ec38436eb904c"),
  related: [
    asset("images/plp/plp-24-seo-mahalli-google-maps-add-missing-place.webp", "بازسازی فرم Add a missing place در گوگل مپ با نام، دسته‌بندی، نشانی، تلفن، ساعات کاری و وب‌سایت نمونه برای ثبت مکان کسب‌وکار", 1440, 880, "الوند مارکتینگ", "a3d4803476c17fd6"),
    asset("images/plp/plp-24-seo-mahalli-nap-consistency-maps.webp", "جدول هماهنگی اطلاعات مکان NAP در سئو محلی: نام، نشانی، تلفن و ساعات کاری یکسان در گوگل مپ، نشان، بلد و سایت", 1400, 615, "الوند مارکتینگ", "b92a9a2ab910c9d0"),
  ],
};

const img_plp_25: ServiceImageSet = {
  featured: asset("images/plp/plp-25-tolid-mohtava-instagram-instagram-reel-deliverables.webp", "اینفوگرافیک تحویلی هر ریلز در تولید محتوای اینستاگرام: ایده و سناریو، فیلم‌برداری، تدوین عمودی ۹:۱۶ با زیرنویس، کاور و کپشن", 1400, 437, "الوند مارکتینگ", "9a29ec6a9287d40f"),
  related: [
    asset("images/plp/plp-25-tolid-mohtava-instagram-instagram-content-order-steps.webp", "اینفوگرافیک هفت مرحله تولید محتوای اینستاگرام: بریف، تأیید تقویم و سناریو، روز تولید، تدوین، بازبینی، تأیید نهایی و انتشار", 1400, 703, "الوند مارکتینگ", "f58a4eafe6de0a80"),
    asset("images/plp/plp-25-tolid-mohtava-instagram-production-day-checklist.webp", "چک‌لیست آمادگی روز تولید محتوای اینستاگرام: سناریوهای تأییدشده، محصول آماده، افراد جلوی دوربین، محل ضبط با نور کافی و لباس هماهنگ با برند", 1400, 525, "الوند مارکتینگ", "49ee4efaca2b07ac"),
  ],
};

const img_plp_26: ServiceImageSet = {
  featured: asset("images/plp/plp-26-tolid-mohtava-ai-ai-vs-human-content-roles.webp", "اینفوگرافیک تقسیم کار در تولید محتوا با هوش مصنوعی: سهم ابزار و سهم انسان در تحقیق، ساختار، پیش‌نویس، اعداد، لحن فارسی و تصویر", 1400, 710, "الوند مارکتینگ", "fc9b9218d60243eb"),
  related: [
    asset("images/plp/plp-26-tolid-mohtava-ai-ai-content-google-safe-vs-risky.webp", "مقایسه استفاده کم‌ریسک و پرریسک از هوش مصنوعی در تولید محتوا از نگاه سیاست‌های گوگل", 1400, 582, "الوند مارکتینگ", "a3fb4f019f83f098"),
    asset("images/plp/plp-26-tolid-mohtava-ai-ai-persian-content-errors.webp", "اینفوگرافیک شش خطای رایج هوش مصنوعی در محتوای فارسی مانند اطلاعات ساختگی، لحن ترجمه‌ای و رعایت نشدن نیم‌فاصله، با راه کنترل هرکدام", 1400, 635, "الوند مارکتینگ", "ec7dad5c93cd31cf"),
  ],
};

const img_plp_27: ServiceImageSet = {
  featured: asset("images/plp/plp-27-chatbot-chatbot-types-compare.webp", "مقایسه سه نوع چت بات سناریومحور، هوش مصنوعی و ترکیبی از نظر روش کار، کاربرد و محدودیت", 1400, 575, "الوند مارکتینگ", "ea554db67d5a240b"),
  related: [
    asset("images/plp/plp-27-chatbot-chatbot-performance-kpis.webp", "اینفوگرافیک چهار شاخص عملکرد چت بات: نرخ پاسخ بدون ارجاع، نرخ ارجاع به انسان، سؤالات بی‌پاسخ و تبدیل گفت‌وگو به سفارش", 1400, 437, "الوند مارکتینگ", "14293b5f27a1960b"),
    asset("images/plp/plp-27-chatbot-chatbot-common-mistakes.webp", "اینفوگرافیک شش اشتباه رایج در راه اندازی چت بات مانند نبود راه رسیدن به پشتیبان انسانی و پاسخ قیمت از اطلاعات قدیمی", 1400, 578, "الوند مارکتینگ", "bb22026ff4e1041c"),
  ],
};

const img_plp_28: ServiceImageSet = {
  featured: asset("images/plp/plp-28-automation-bazaryabi-marketing-automation-levels.webp", "اینفوگرافیک سه سطح اتوماسیون بازاریابی: اتوماسیون ساده، اتوماسیون ایمیل مارکتینگ و پیامک و اتوماسیون هوش مصنوعی", 1400, 501, "الوند مارکتینگ", "0803113afca21966"),
  related: [
    asset("images/plp/plp-28-automation-bazaryabi-automation-tool-criteria.webp", "اینفوگرافیک پنج معیار انتخاب ابزار اتوماسیون بازاریابی: دسترسی از ایران، اتصال به سایت و CRM، پیامک داخلی، رابط فارسی و هزینه بر اساس حجم", 1400, 497, "الوند مارکتینگ", "49c40f8ccc5f8c68"),
    asset("images/plp/plp-28-automation-bazaryabi-automation-implementation-steps.webp", "اینفوگرافیک هفت مرحله پیاده‌سازی اتوماسیون بازاریابی از نقشه مسیر مشتری و انتخاب سناریو تا تست با داده آزمایشی و پایش", 1400, 616, "الوند مارکتینگ", "9e9cd0c419f3110f"),
  ],
};

const img_plp_29: ServiceImageSet = {
  featured: asset("images/plp/plp-29-google-ads-google-ads-service-deliverables.webp", "اینفوگرافیک خدمات مدیریت کمپین گوگل ادز: تحقیق کلمات، نگارش متن تبلیغ، راه‌اندازی کمپین، بهینه‌سازی مستمر و گزارش هفتگی", 1400, 467, "الوند مارکتینگ", "22e565e75a4c8a0a"),
  related: [
    asset("images/plp/plp-29-google-ads-google-ads-order-steps.webp", "اینفوگرافیک پنج مرحله سفارش گوگل ادز از جلسه شناخت و تحقیق کلمات تا گزارش هفتگی و تصمیم ماهانه", 1400, 437, "الوند مارکتینگ", "42dec7a0aa129ef0"),
  ],
};

const img_plp_30: ServiceImageSet = {
  featured: asset("images/plp/plp-30-tablighat-keliki-click-quality-control.webp", "اینفوگرافیک چهار روش کنترل کیفیت کلیک در تبلیغات کلیکی: بررسی جایگاه نمایش، کنترل کلیک تصادفی، مقایسه زمان ماندگاری و تطبیق کلیک با آنالیتیکس", 1400, 433, "الوند مارکتینگ", "0d3af9f9ba17b420"),
  related: [
    asset("images/plp/plp-30-tablighat-keliki-ppc-payment-models-cpc-cpm-cpa.webp", "اینفوگرافیک مدل‌های پرداخت تبلیغات کلیکی: هزینه به‌ازای کلیک CPC، هزینه به‌ازای هزار نمایش CPM و هزینه به‌ازای اقدام CPA", 1400, 512, "الوند مارکتینگ", "9e3c9ed1f9f2c583"),
    asset("images/plp/plp-30-tablighat-keliki-ppc-failure-causes.webp", "اینفوگرافیک شش علت نتیجه نگرفتن از تبلیغات کلیکی مانند قضاوت بر اساس تعداد کلیک، نبود برچسب UTM و ارسال کاربر به صفحه اصلی", 1400, 578, "الوند مارکتینگ", "2b627963e7c17315"),
  ],
};

const img_plp_31: ServiceImageSet = {
  featured: asset("images/plp/plp-31-tablighat-banari-banner-ad-placement-types.webp", "اینفوگرافیک چهار نوع جایگاه تبلیغات بنری: سایت‌های پربازدید، سایت‌های تخصصی، شبکه نمایشی گوگل و پلتفرم‌های آگهی، با نحوه خرید و کاربرد", 1400, 565, "الوند مارکتینگ", "7e76c19ba301f5c0"),
  related: [
    asset("images/plp/plp-31-tablighat-banari-banner-campaign-report-kpis.webp", "اینفوگرافیک شاخص‌های گزارش تبلیغات بنری: نرخ کلیک هر جایگاه، هزینه به‌ازای کلیک یا هزار نمایش، نرخ پرش و هزینه هر نتیجه", 1400, 438, "الوند مارکتینگ", "5cc198323b74cb65"),
    asset("images/plp/plp-31-tablighat-banari-banner-file-checklist.webp", "چک‌لیست آماده‌سازی فایل بنر تبلیغاتی: ابعاد و حجم مطابق جایگاه، یک پیام و دعوت به اقدام، خوانایی متن فارسی در موبایل و هماهنگی با صفحه مقصد", 1400, 457, "الوند مارکتینگ", "87a5a7881c375629"),
  ],
};

const img_plp_32: ServiceImageSet = {
  featured: asset("images/plp/plp-32-reportage-agahi-seo-vs-news-reportage.webp", "مقایسه رپورتاژ آگهی برای سئو با رپورتاژ خبری و برندینگ از نظر هدف، رسانه مناسب، نقش لینک و معیار سنجش", 1400, 594, "الوند مارکتینگ", "573840f6fd4565f9"),
  related: [
    asset("images/plp/plp-32-reportage-agahi-reportage-media-criteria.webp", "اینفوگرافیک شش معیار انتخاب رسانه برای رپورتاژ آگهی: هم‌موضوعی، ایندکس صفحات، بازدید واقعی، تعداد رپورتاژها، ماندگاری و نوع لینک", 1400, 645, "الوند مارکتینگ", "058ac6820ebbc858"),
    asset("images/plp/plp-32-reportage-agahi-reportage-order-steps.webp", "اینفوگرافیک شش مرحله سفارش رپورتاژ آگهی از تعیین هدف و پیشنهاد رسانه تا ثبت، کنترل ایندکس و تحویل گزارش", 1400, 615, "الوند مارکتینگ", "3ed90e54f214e6d9"),
  ],
};

const img_plp_33: ServiceImageSet = {
  featured: asset("images/plp/plp-33-push-notification-push-notification-types.webp", "مقایسه سه نوع پوش نوتیفیکیشن: وب‌پوش سایت، پوش درون‌اپ اندروید و پوش وب اپلیکیشن PWA از نظر محل نمایش، پیش‌نیاز و محدودیت آیفون", 1400, 509, "الوند مارکتینگ", "f7599ec80412d154"),
  related: [
    asset("images/plp/plp-33-push-notification-push-vs-email-vs-sms.webp", "جدول مقایسه پوش نوتیفیکیشن با ایمیل مارکتینگ و پیامک از نظر اطلاعات تماس لازم، هزینه ارسال، طول پیام و کاربرد", 1400, 544, "الوند مارکتینگ", "5e7428b2b5b0b511"),
    asset("images/plp/plp-33-push-notification-push-subscriber-mistakes.webp", "اینفوگرافیک پنج خطای پوش نوتیفیکیشن: درخواست اجازه در ثانیه اول، ارسال روزانه تکراری، ارسال یکسان به همه، لینک به صفحه اصلی و ارسال شبانه", 1400, 522, "الوند مارکتینگ", "a1e0eaa3670c8084"),
  ],
};

const img_plp_34: ServiceImageSet = {
  featured: asset("images/plp/plp-34-tablighat-shabakeh-ejtemaei-social-ads-platforms-compare.webp", "مقایسه پلتفرم‌های تبلیغات شبکه‌های اجتماعی اینستاگرام، ایتا، بله و لینکدین از نظر مخاطب غالب، مدل تبلیغ و کاربرد", 1400, 554, "الوند مارکتینگ", "dde538a52b2cc4c2"),
  related: [
    asset("images/plp/plp-34-tablighat-shabakeh-ejtemaei-fake-follower-check.webp", "اینفوگرافیک پنج نشانه فالوور فیک پیش از خرید تبلیغ اینستاگرام: فاصله فالوور و بازدید استوری، کامنت تکراری، رشد ناگهانی، ترکیب جغرافیایی و نبود آمار", 1400, 492, "الوند مارکتینگ", "43821cbd02cdc1bd"),
    asset("images/plp/plp-34-tablighat-shabakeh-ejtemaei-social-ads-campaign-steps.webp", "اینفوگرافیک شش مرحله کمپین تبلیغات شبکه‌های اجتماعی از تعیین هدف و انتخاب پلتفرم تا اجرای آزمایشی و گزارش هفتگی", 1400, 586, "الوند مارکتینگ", "ef62f27fa2dfddb3"),
  ],
};

const img_plp_35: ServiceImageSet = {
  featured: asset("images/plp/plp-35-modiriat-instagram-instagram-content-calendar-sample.webp", "نمونه تقویم محتوای اینستاگرام در مدیریت پیج با زمان انتشار، قالب ریلز و استوری، هدف محتوا، پیام اقدام و وضعیت تأیید", 1400, 617, "الوند مارکتینگ", "7faf0c1ce66ad506"),
  related: [
    asset("images/plp/plp-35-modiriat-instagram-instagram-insights-account-overview.webp", "بازسازی بخش Insights اینستاگرام در حساب حرفه‌ای با بازدید، تعامل، بازدید پروفایل و کلیک لینک بیو برای گزارش ماهانه مدیریت اینستاگرام", 900, 920, "الوند مارکتینگ", "4ff53bf6230f6785"),
    asset("images/plp/plp-35-modiriat-instagram-instagram-two-factor-authentication.webp", "بازسازی صفحه تأیید دومرحله‌ای اینستاگرام در Accounts Center با روش برنامه احراز هویت و پیامک برای امنیت و مالکیت پیج", 1100, 920, "الوند مارکتینگ", "d15bdeb0c2fe3d9d"),
  ],
};

const img_plp_36: ServiceImageSet = {
  featured: asset("images/plp/plp-36-modiriat-linkedin-linkedin-company-page-vs-executive-profile.webp", "مقایسه صفحه شرکت لینکدین با پروفایل شخصی مدیران از نظر دسترسی ارگانیک، نقش، محتوای مناسب و پیش‌نیاز", 1400, 582, "الوند مارکتینگ", "841e7388ef764c92"),
  related: [
    asset("images/plp/plp-36-modiriat-linkedin-linkedin-profile-checklist-anatomy.webp", "بازسازی بخش‌های پروفایل لینکدین شامل عکس، کاور، تیتر، درباره، سوابق و آدرس اختصاصی با شماره‌گذاری چک‌لیست ساخت لینکدین حرفه‌ای", 1300, 880, "الوند مارکتینگ", "53adec90f3c1ede9"),
    asset("images/plp/plp-36-modiriat-linkedin-linkedin-page-analytics-demographics.webp", "بازسازی بخش Analytics صفحه شرکت در لینکدین با نمایش، نرخ تعامل و ترکیب بینندگان بر اساس سمت شغلی و صنعت", 1300, 640, "الوند مارکتینگ", "8544cfe6cdbefdcd"),
  ],
};

const img_plp_37: ServiceImageSet = {
  featured: asset("images/plp/plp-37-afzayesh-sorat-site-core-web-vitals-thresholds.webp", "اینفوگرافیک شاخص‌های Core Web Vitals در افزایش سرعت سایت: LCP، INP و CLS با محدوده خوب، نیازمند بهبود و ضعیف طبق گوگل", 1400, 692, "الوند مارکتینگ", "9a7302f6977072be"),
  related: [
    asset("images/plp/plp-37-afzayesh-sorat-site-lighthouse-report-wordpress.webp", "تصویر واقعی گزارش Lighthouse سایت وردپرسی آزمایشی با امتیاز Performance و شاخص‌های LCP و CLS برای اندازه‌گیری پیش از افزایش سرعت سایت", 836, 641, "الوند مارکتینگ", "92aab96735865e94"),
    asset("images/plp/plp-37-afzayesh-sorat-site-site-speed-project-steps.webp", "اینفوگرافیک هفت مرحله افزایش سرعت سایت از اندازه‌گیری اولیه و عیب‌یابی تا نسخه پشتیبان، اجرا روی Staging، آزمون و گزارش قبل و بعد", 1400, 675, "الوند مارکتینگ", "0952a9d1b4c1d9dd"),
  ],
};

const img_plp_38: ServiceImageSet = {
  featured: asset("images/plp/plp-38-amniat-site-wordpress-user-roles-least-privilege.webp", "تصویر واقعی فهرست کاربران وردپرس با نقش مدیر، ویرایشگر، نویسنده و مدیر فروشگاه؛ بازبینی نقش‌ها در افزایش امنیت سایت وردپرس", 1440, 900, "الوند مارکتینگ", "1679bdaef70b1297"),
  related: [
    asset("images/plp/plp-38-amniat-site-wordpress-updates-screen.webp", "تصویر واقعی صفحه به‌روزرسانی‌های وردپرس برای هسته، افزونه‌ها و پوسته‌ها؛ بخشی از نگهداری امنیت سایت وردپرس", 1440, 900, "الوند مارکتینگ", "d416563759862f56"),
    asset("images/plp/plp-38-amniat-site-malware-cleanup-steps.webp", "اینفوگرافیک هفت مرحله پاکسازی سایت آلوده: نسخه از وضعیت فعلی، بررسی فایل‌ها، حذف آلودگی، بستن مسیر نفوذ، تغییر رمزها، بازبینی گوگل و گزارش", 1400, 674, "الوند مارکتینگ", "f6ae864ecbfdee52"),
    asset("images/plp/plp-38-amniat-site-site-owner-access-checklist.webp", "چک‌لیست دسترسی‌های مالک سایت: مدیر کل وردپرس، پنل هاست و دامنه، سرچ کنسول و آنالیتیکس و نسخه پشتیبان خارج از سرور", 1400, 399, "الوند مارکتینگ", "f2d1da92838c93e6"),
  ],
};

const img_plp_39: ServiceImageSet = {
  featured: asset("images/plp/plp-39-monitoring-site-website-monitoring-checks.webp", "اینفوگرافیک هشت مورد پایش در مانیتورینگ سایت: آپتایم، محتوای صفحه، زمان پاسخ، انقضای SSL و دامنه، فرم‌ها و مسیر خرید، تغییر فایل‌ها و نسخه پشتیبان", 1400, 645, "الوند مارکتینگ", "960e81de6ed699f0"),
  related: [
    asset("images/plp/plp-39-monitoring-site-uptime-percent-to-downtime.webp", "نمودار تبدیل درصد آپتایم به حداکثر زمان قطعی سایت در ماه برای ۹۹، ۹۹٫۵، ۹۹٫۹ و ۹۹٫۹۹ درصد در مانیتورینگ سایت", 1400, 561, "الوند مارکتینگ", "9cea2be63e8e9741"),
    asset("images/plp/plp-39-monitoring-site-free-monitoring-vs-managed.webp", "مقایسه ابزار مانیتورینگ رایگان با سرویس مانیتورینگ سایت با پیگیری از نظر کار انجام‌شده، نقاط پایش داخل و خارج ایران و پایش مسیر خرید", 1400, 545, "الوند مارکتینگ", "e35d42ea903717e7"),
  ],
};

const img_plp_40: ServiceImageSet = {
  featured: asset("images/plp/plp-40-nasb-ghaleb-afzoneh-wordpress-wordpress-site-language-persian.webp", "تصویر واقعی تنظیمات عمومی وردپرس با زبان سایت فارسی و منطقه زمانی تهران؛ پایه فارسی‌سازی هنگام نصب قالب راست‌چین", 1440, 900, "الوند مارکتینگ", "18fb9d7d477b44cf"),
  related: [
    asset("images/plp/plp-40-nasb-ghaleb-afzoneh-wordpress-wordpress-plugin-install-elementor.webp", "تصویر واقعی صفحه افزودن افزونه در وردپرس با جست‌وجوی المنتور و دکمه نصب، برای نصب افزونه‌های لازم قالب", 1440, 900, "الوند مارکتینگ", "8d5b68976df995e2"),
    asset("images/plp/plp-40-nasb-ghaleb-afzoneh-wordpress-wordpress-theme-install-methods.webp", "اینفوگرافیک پنج روش نصب قالب وردپرس: از پیشخوان، دستی روی هاست، بسته نصبی، داپلیکیتور و لوکال‌هاست با کاربرد و نکته هرکدام", 1400, 536, "الوند مارکتینگ", "388b15896685bffc"),
    asset("images/plp/plp-40-nasb-ghaleb-afzoneh-wordpress-wordpress-theme-upload-dashboard.webp", "تصویر واقعی بارگذاری فایل zip قالب از پیشخوان وردپرس در بخش افزودن پوسته؛ ساده‌ترین روش نصب قالب وردپرس", 1440, 900, "الوند مارکتینگ", "a19873b88da729f6"),
    asset("images/plp/plp-40-nasb-ghaleb-afzoneh-wordpress-theme-plugin-install-steps.webp", "اینفوگرافیک هفت مرحله نصب قالب وردپرس مثل دمو: بررسی، نسخه پشتیبان، نسخه آزمایشی، نصب و درون‌ریزی دمو، فارسی‌سازی، آزمون و تحویل", 1400, 645, "الوند مارکتینگ", "4ec99ffaa16db5fc"),
  ],
};

const img_plp_41: ServiceImageSet = {
  featured: asset("images/plp/plp-41-rafe-error-site-site-error-dont-do.webp", "اینفوگرافیک چهار کار اشتباه هنگام ارور سایت: بازگردانی پشت‌سرهم بکاپ، حذف افزونه از هاست، ویرایش فایل‌های اصلی و تغییر DNS", 1400, 499, "الوند مارکتینگ", "7d4a0b89353ca613"),
  related: [
    asset("images/plp/plp-41-rafe-error-site-wordpress-critical-error-500.webp", "تصویر واقعی پیام «یک خطای مهم در این وب سایت رخ داده است» وردپرس فارسی؛ نشانه رایج ارور ۵۰۰ که در رفع ارور سایت بررسی می‌شود", 1100, 330, "الوند مارکتینگ", "e6e2002ae2f95e17"),
    asset("images/plp/plp-41-rafe-error-site-wordpress-site-health-check.webp", "تصویر واقعی ابزار سلامت سایت وردپرس با وضعیت کلی و فهرست مشکلات بحرانی و پیشنهادها در عیب‌یابی سایت", 1440, 900, "الوند مارکتینگ", "7a1c9f0a401282d1"),
    asset("images/plp/plp-41-rafe-error-site-site-troubleshooting-steps.webp", "اینفوگرافیک شش مرحله رفع ارور سایت: دریافت اطلاعات، نسخه پشتیبان از وضعیت فعلی، بررسی لاگ‌ها، رفع خطا، آزمون و گزارش علت", 1400, 645, "الوند مارکتینگ", "f73cde3cce2bb825"),
  ],
};

const img_plp_42: ServiceImageSet = {
  featured: asset("images/plp/plp-42-web-application-ios-safari-add-to-home-screen.webp", "بازسازی مراحل افزودن وب اپلیکیشن PWA به صفحه اصلی آیفون از منوی اشتراک‌گذاری سافاری با گزینه Add to Home Screen", 1400, 920, "الوند مارکتینگ", "a1355e6579f60c97"),
  related: [
    asset("images/plp/plp-42-web-application-web-app-build-steps.webp", "اینفوگرافیک هشت مرحله ساخت وب اپلیکیشن از جلسه شناخت و سند نیازمندی تا توسعه مرحله‌ای، آزمون، انتشار و پشتیبانی", 1400, 645, "الوند مارکتینگ", "c7702807bb41971f"),
    asset("images/plp/plp-42-web-application-web-app-company-criteria.webp", "اینفوگرافیک پنج معیار انتخاب شرکت طراحی وب اپلیکیشن: مالکیت کد و داده، سند نیازمندی، تحویل مرحله‌ای، نمونه کار مشابه و پشتیبانی", 1400, 463, "الوند مارکتینگ", "851a4a33fa77a47e"),
  ],
};

const img_plp_43: ServiceImageSet = {
  featured: asset("images/plp/plp-43-google-analytics-ga4-mark-key-events.webp", "بازسازی بخش Events در تنظیمات گوگل آنالیتیکس ۴ با گزینه Mark as key event برای خرید، ارسال فرم، کلیک تماس و کلیک واتساپ", 1440, 780, "الوند مارکتینگ", "311f14120f333f8e"),
  related: [
    asset("images/plp/plp-43-google-analytics-ga4-search-console-link.webp", "بازسازی صفحه Search Console links در تنظیمات گوگل آنالیتیکس ۴ با پراپرتی دامنه example-shop.ir متصل به جریان داده وب", 1440, 560, "الوند مارکتینگ", "a27e3e95632a47db"),
    asset("images/plp/plp-43-google-analytics-ga4-unwanted-referrals-payment-gateway.webp", "بازسازی تنظیم List unwanted referrals در گوگل آنالیتیکس ۴ با دامنه نمونه درگاه پرداخت بانکی برای حذف ارجاع درگاه بانکی", 1440, 620, "الوند مارکتینگ", "9dcb054dc73eeb92"),
    asset("images/plp/plp-43-google-analytics-ga4-data-retention-14-months.webp", "بازسازی صفحه Data retention در گوگل آنالیتیکس ۴ با مدت نگهداری داده کاربر و رویداد روی ۱۴ ماه", 1440, 760, "الوند مارکتینگ", "a3393b0cdbad155e"),
    asset("images/plp/plp-43-google-analytics-ga4-setup-steps.webp", "اینفوگرافیک شش مرحله راه‌اندازی گوگل آنالیتیکس ۴: تعریف اهداف، بررسی وضعیت، طرح ردیابی، نصب و پیکربندی، آزمون و تحویل", 1400, 645, "الوند مارکتینگ", "9ee1c0122270384e"),
  ],
};

const img_plp_44: ServiceImageSet = {
  featured: asset("images/plp/plp-44-google-tag-manager-gtm-install-container-code.webp", "بازسازی پنجره Install Google Tag Manager با کد head و noscript body برای نصب گوگل تگ منیجر روی سایت", 1440, 720, "الوند مارکتینگ", "5548626997226391"),
  related: [
    asset("images/plp/plp-44-google-tag-manager-gtm-ga4-event-tel-click-tag.webp", "بازسازی تگ GA4 Event در گوگل تگ منیجر برای رویداد phone_click با تریگر کلیک روی لینک‌های tel", 1440, 620, "الوند مارکتینگ", "122678107ab82d67"),
    asset("images/plp/plp-44-google-tag-manager-gtm-preview-tag-assistant.webp", "بازسازی حالت پیش‌نمایش گوگل تگ منیجر در Tag Assistant که اجرای تگ phone_click را پس از رویداد Link Click نشان می‌دهد", 1440, 620, "الوند مارکتینگ", "29cdc420f9d6c3db"),
    asset("images/plp/plp-44-google-tag-manager-gtm-submit-publish-version.webp", "بازسازی پنجره Submit Changes در گوگل تگ منیجر با Publish and Create Version، نام و توضیح نسخه", 1440, 640, "الوند مارکتینگ", "b66a428fea601e67"),
    asset("images/plp/plp-44-google-tag-manager-gtm-common-data-errors.webp", "اینفوگرافیک شش خطای رایج در گوگل تگ منیجر مانند ثبت دوباره بازدید، تریگر نادرست فرم و انتشار بدون پیش‌نمایش", 1400, 665, "الوند مارکتینگ", "2aa2f461fb9585c6"),
  ],
};

const img_plp_45: ServiceImageSet = {
  featured: asset("images/plp/plp-45-search-console-gsc-select-property-type.webp", "بازسازی پنجره Select property type در سرچ کنسول گوگل با دو گزینه Domain و URL prefix برای ثبت سایت در سرچ کنسول", 1440, 900, "الوند مارکتینگ", "01b56515f88fc6bd"),
  related: [
    asset("images/plp/plp-45-search-console-gsc-dns-txt-verification.webp", "بازسازی مراحل تأیید مالکیت دامنه در سرچ کنسول با رکورد TXT در DNS", 1440, 900, "الوند مارکتینگ", "fec507c4eb1cf0db"),
    asset("images/plp/plp-45-search-console-rank-math-webmaster-tools-verification.webp", "تصویر واقعی تنظیمات ابزارهای وبمستر در افزونه Rank Math برای وارد کردن کد تأیید سرچ کنسول در سایت وردپرسی", 1440, 900, "الوند مارکتینگ", "1e6451fd2878d882"),
    asset("images/plp/plp-45-search-console-gsc-sitemaps-submit.webp", "بازسازی گزارش Sitemaps سرچ کنسول با ثبت sitemap_index.xml و وضعیت Success", 1440, 560, "الوند مارکتینگ", "800b7ba4b1bfc418"),
    asset("images/plp/plp-45-search-console-gsc-users-permissions.webp", "بازسازی صفحه Users and permissions در سرچ کنسول با سطوح دسترسی Owner، Full و Restricted", 1440, 560, "الوند مارکتینگ", "3cfa8a1bcbb1ab1b"),
  ],
};

const img_pdp_01: ServiceImageSet = {
  featured: asset("images/pdp/pdp-01-tarahi-site-pezeshki-medical-site-versions.webp", "اینفوگرافیک چهار نسخه طراحی سایت پزشکی: مطب تک‌پزشک، کلینیک چندتخصصی، بیمارستان و درمانگاه، آزمایشگاه و مرکز تصویربرداری با نیاز اصلی و ماژول‌های کلیدی هرکدام", 1400, 547, "الوند مارکتینگ", "4442ea47ce38d88c"),
  related: [
    asset("images/pdp/pdp-01-tarahi-site-pezeshki-medical-site-compliance-rules.webp", "اینفوگرافیک ضوابط نظام پزشکی در طراحی سایت مطب: مشخصات و شماره نظام پزشکی، عنوان تخصص، نشانی و تلفن ثابت، کد QR مجوز، نام‌گذاری مطب، تصویر بیمار و برند تجهیزات", 1400, 723, "الوند مارکتینگ", "bb3a17dc0a59d202"),
    asset("images/pdp/pdp-01-tarahi-site-pezeshki-medical-site-design-steps.webp", "اینفوگرافیک هفت مرحله طراحی سایت پزشکی از جلسه شناخت و بررسی ضوابط تا تست نوبت‌گیری با گوشی و آموزش پنل منشی", 1400, 855, "الوند مارکتینگ", "1bf96f6eaa32c647"),
  ],
};

const img_pdp_02: ServiceImageSet = {
  featured: asset("images/pdp/pdp-02-tarahi-landing-page-landing-page-deliverables.webp", "اینفوگرافیک اجزای لندینگ پیج: بخش اول منطبق با آگهی، نگارش صفحه فرود، فرم کوتاه یا دکمه تماس و واتساپ، عناصر اعتمادساز، سرعت موبایل، ردیابی تبدیل و صفحه تشکر", 1400, 703, "الوند مارکتینگ", "b244a10c03403edd"),
  related: [
    asset("images/pdp/pdp-02-tarahi-landing-page-ga4-landing-key-events.webp", "نمای بازسازی‌شده بخش Key events در گوگل آنالیتیکس ۴ با داده نمونه؛ ارسال فرم صفحه فرود، کلیک تماس و کلیک واتساپ به‌عنوان رویداد کلیدی", 1440, 620, "الوند مارکتینگ", "9b6d9d6976093b68"),
    asset("images/pdp/pdp-02-tarahi-landing-page-landing-page-by-channel.webp", "اینفوگرافیک نیاز لندینگ پیج در هر کانال ورودی: گوگل ادز، تبلیغات اینستاگرام، پیامک و ایمیل، رویداد و وبینار", 1400, 538, "الوند مارکتینگ", "a2b0b100277967ad"),
    asset("images/pdp/pdp-02-tarahi-landing-page-landing-vs-site-page-vs-template.webp", "جدول مقایسه لندینگ پیج اختصاصی با صفحه معمولی داخل سایت و قالب آماده صفحه‌ساز از نظر تمرکز روی یک اقدام، هم‌خوانی با آگهی، سرعت موبایل و ردیابی تبدیل", 1400, 597, "الوند مارکتینگ", "58380ddd5e3ef77c"),
  ],
};

const img_pdp_03: ServiceImageSet = {
  featured: asset("images/pdp/pdp-03-seo-site-foroushgahi-woocommerce-product-categories.webp", "تصویر واقعی صفحه دسته‌های محصولات ووکامرس با نام دسته، نامک، دسته مادر و متن توضیح دسته؛ پایه معماری دسته و زیردسته در سئو فروشگاهی", 1440, 900, "الوند مارکتینگ", "8e0e7ace2ef74e6b"),
  related: [
    asset("images/pdp/pdp-03-seo-site-foroushgahi-store-technical-seo-problems.webp", "اینفوگرافیک مشکلات سئو تکنیکال فروشگاه اینترنتی: آدرس‌های ترکیبی فیلتر، محصول ناموجود، صفحه‌بندی دسته‌ها، نتایج جست‌وجوی داخلی و سرعت کاتالوگ بزرگ همراه با اثر و اقدام", 1400, 650, "الوند مارکتینگ", "cbbf5cc8b7afe085"),
    asset("images/pdp/pdp-03-seo-site-foroushgahi-gsc-product-snippets.webp", "نمای بازسازی‌شده گزارش Product snippets در سرچ کنسول با داده نمونه؛ محصولات با داده ساختاریافته نامعتبر، دلیل خطا و هشدار نبود نظر خریداران", 1440, 900, "الوند مارکتینگ", "c7db209e534ff700"),
    asset("images/pdp/pdp-03-seo-site-foroushgahi-store-seo-process.webp", "اینفوگرافیک هفت گام سئو سایت فروشگاهی: ممیزی فروشگاه، نقشه کلمات دسته و محصول، اصلاحات فنی، بهینه‌سازی دسته‌های پرسود، محتوا و لینک داخلی، لینک‌سازی و گزارش ماهانه", 1400, 645, "الوند مارکتینگ", "0eedd70e5947c5bd"),
  ],
};

const img_pdp_04: ServiceImageSet = {
  featured: asset("images/pdp/pdp-04-tarahi-site-restaurant-restaurant-site-versions.webp", "اینفوگرافیک نسخه‌های طراحی سایت رستوران: رستوران و فست‌فود با سفارش بیرون‌بر، رستوران و کافی‌شاپ با رزرو، کافه و رستوران زنجیره‌ای با منوی هر شعبه", 1400, 537, "الوند مارکتینگ", "42cde95bc54dfb26"),
  related: [
    asset("images/pdp/pdp-04-tarahi-site-restaurant-restaurant-qr-menu-features.webp", "اینفوگرافیک امکانات منوی دیجیتال QR رستوران: منوی HTML به‌جای PDF، دسته‌بندی و عکس هر غذا، ناموجود کردن موقت آیتم، QR اختصاصی هر میز و منوی دوزبانه", 1400, 522, "الوند مارکتینگ", "26a0b5dd6ee8667d"),
    asset("images/pdp/pdp-04-tarahi-site-restaurant-restaurant-site-steps.webp", "اینفوگرافیک هفت مرحله طراحی سایت رستوران از جلسه شناخت و ساختار منو تا تست سفارش واقعی با اسکن QR و آموزش تغییر منو", 1600, 466, "الوند مارکتینگ", "cee768b22c47dc32"),
  ],
};

const img_pdp_05: ServiceImageSet = {
  featured: asset("images/pdp/pdp-05-tarahi-site-amlak-real-estate-site-versions.webp", "اینفوگرافیک سه نسخه طراحی سایت املاک: دفتر مشاور املاک، گروه چنددفتری و سازنده و انبوه‌ساز با نیاز اصلی و ماژول‌های کلیدی", 1400, 507, "الوند مارکتینگ", "8e6015c99766e184"),
  related: [
    asset("images/pdp/pdp-05-tarahi-site-amlak-real-estate-listing-fields.webp", "اینفوگرافیک امکانات ثبت آگهی املاک: فیلدهای تخصصی ملک، ودیعه و اجاره جدا از قیمت فروش، فیلتر محله، گالری با واترمارک، کد فایل و فایل‌های ویژه", 1400, 605, "الوند مارکتینگ", "54d6fb6201951138"),
    asset("images/pdp/pdp-05-tarahi-site-amlak-real-estate-site-comparison.webp", "جدول مقایسه سایت املاک اختصاصی با پلتفرم‌های عمومی آگهی و قالب آماده املاک از نظر رقابت در صفحه، فیلدها، پنل مشاور، مالکیت داده و جذب ترافیک", 1400, 597, "الوند مارکتینگ", "90a9f4d4148637f2"),
  ],
};

const img_pdp_06: ServiceImageSet = {
  featured: asset("images/pdp/pdp-06-tarahi-site-amoozeshi-education-site-versions.webp", "اینفوگرافیک چهار نسخه طراحی سایت آموزشی: آموزشگاه حضوری، مدرس مستقل، آکادمی چندمدرسه و آموزش سازمانی با نیاز اصلی و ماژول‌های کلیدی", 1400, 507, "الوند مارکتینگ", "435a1c8ee776b259"),
  related: [
    asset("images/pdp/pdp-06-tarahi-site-amoozeshi-secure-course-video.webp", "اینفوگرافیک پخش امن ویدیو در سایت آموزشی: پخش رمزنگاری‌شده، واترمارک پویا با شماره دانشجو، محدودیت تعداد دستگاه، میزبانی جداگانه ویدیو و فایل‌های تکمیلی", 1400, 463, "الوند مارکتینگ", "b0372e11f5a87bdb"),
    asset("images/pdp/pdp-06-tarahi-site-amoozeshi-education-site-steps.webp", "اینفوگرافیک هفت مرحله طراحی سایت آموزشی از جلسه شناخت و ساختار دوره تا بارگذاری دوره نمونه، تست خرید و آموزش پنل", 1400, 771, "الوند مارکتینگ", "26be3fad14b9c6d8"),
  ],
};

const img_pdp_07: ServiceImageSet = {
  featured: asset("images/pdp/pdp-07-tarahi-site-sanati-industrial-site-versions.webp", "اینفوگرافیک نیاز هر نوع سایت صنعتی: کارخانه، تولیدی، تأمین‌کننده تجهیزات و قطعات و صادرکننده با ماژول‌های کلیدی هرکدام", 1400, 537, "الوند مارکتینگ", "933ddba9ce808f35"),
  related: [
    asset("images/pdp/pdp-07-tarahi-site-sanati-industrial-online-catalog.webp", "اینفوگرافیک امکانات کاتالوگ صنعتی آنلاین: جدول مشخصات فنی، فیلتر با پارامتر فنی، دانلود دیتاشیت و کاتالوگ PDF، محصولات مرتبط و مدیریت کاتالوگ از پنل", 1400, 492, "الوند مارکتینگ", "32048c12e3bdf1cf"),
    asset("images/pdp/pdp-07-tarahi-site-sanati-industrial-site-comparison.webp", "جدول مقایسه سایت صنعتی با کاتالوگ و استعلام، فروشگاه اینترنتی و سایت شرکتی ساده از نظر مشخصات فنی، مسیر خرید و کاربرد", 1400, 482, "الوند مارکتینگ", "370708d3ce4986fe"),
  ],
};

const img_pdp_08: ServiceImageSet = {
  featured: asset("images/pdp/pdp-08-tarahi-site-dandanpezeshki-dental-appointment-by-treatment.webp", "اینفوگرافیک نوبت‌دهی سایت دندانپزشکی بر اساس نوع درمان: معاینه و جرم‌گیری، ترمیم و درمان ریشه، مشاوره ایمپلنت، ارتودنسی و مسیر اورژانسی دندان‌درد", 1400, 622, "الوند مارکتینگ", "7b53192230d608fa"),
  related: [
    asset("images/pdp/pdp-08-tarahi-site-dandanpezeshki-dental-site-compliance.webp", "اینفوگرافیک ضوابط سایت دندانپزشکی: نبود گالری قبل و بعد، شرایط تصویر بیمار، عدم استفاده از عنوان زیبایی، نبود برند ایمپلنت، نام و عنوان مطابق پروانه و کد QR مجوز", 1400, 522, "الوند مارکتینگ", "c18a3fa243f19a9b"),
    asset("images/pdp/pdp-08-tarahi-site-dandanpezeshki-dental-site-steps.webp", "اینفوگرافیک هفت مرحله طراحی سایت دندانپزشکی از جلسه شناخت و بررسی ضوابط تا تست نوبت‌گیری برای چند نوع درمان و آموزش پنل", 1400, 646, "الوند مارکتینگ", "184264c1cc7c35d4"),
  ],
};

const img_pdp_09: ServiceImageSet = {
  featured: asset("images/pdp/pdp-09-tarahi-site-clinic-zibayi-beauty-clinic-site-versions.webp", "اینفوگرافیک تفاوت سایت کلینیک زیبایی دارای پروانه، کلینیک پوست و مو، مطب پزشک و سالن زیبایی غیرپزشکی از نظر خدمات قابل معرفی و ماژول‌ها", 1400, 537, "الوند مارکتینگ", "48b0c0182ec23466"),
  related: [
    asset("images/pdp/pdp-09-tarahi-site-clinic-zibayi-beauty-clinic-advertising-rules.webp", "اینفوگرافیک ضوابط تبلیغات پزشکی در سایت کلینیک زیبایی: گالری قبل و بعد، تصویر مراجع، عنوان کلینیک و مرکز، عنوان زیبایی، برند دستگاه، چهره افراد مشهور و وعده نتیجه", 1400, 765, "الوند مارکتینگ", "9ef5da5b28814460"),
    asset("images/pdp/pdp-09-tarahi-site-clinic-zibayi-beauty-clinic-site-comparison.webp", "جدول مقایسه سایت تخصصی کلینیک زیبایی با سایت پزشکی عمومی و صفحه اینستاگرام از نظر درمان چندجلسه‌ای، رزرو مشاوره، ضوابط و مالکیت داده مراجعان", 1400, 540, "الوند مارکتینگ", "e275ac42295630ab"),
  ],
};

const img_pdp_10: ServiceImageSet = {
  featured: asset("images/pdp/pdp-10-seo-pezeshki-medical-content-credibility-checklist.webp", "چک‌لیست محتوای سلامت در سئو پزشکی: صفحه هر خدمت و بیماری، نام نویسنده یا بازبین پزشکی و تاریخ بازبینی، منابع علمی، تأیید نهایی پزشک و هماهنگی با ضوابط تبلیغات", 1400, 574, "الوند مارکتینگ", "74e141f032d6671e"),
  related: [
    asset("images/pdp/pdp-10-seo-pezeshki-gsc-doctor-name-queries.webp", "نمای بازسازی‌شده گزارش عملکرد سرچ کنسول با فیلتر جست‌وجوهای نام پزشک نمونه؛ عبارت‌های نام پزشک همراه با نوبت، آدرس و تخصص", 1440, 1090, "الوند مارکتینگ", "d6a40023a8e43cef"),
    asset("images/pdp/pdp-10-seo-pezeshki-dental-equipment-health-tourism-seo.webp", "اینفوگرافیک تمرکز سئو در سه حوزه: سئو سایت دندان‌پزشکی، سئو سایت تجهیزات پزشکی و گردشگری سلامت", 1400, 463, "الوند مارکتینگ", "155570d70eb220d2"),
    asset("images/pdp/pdp-10-seo-pezeshki-medical-seo-process.webp", "اینفوگرافیک هفت گام اجرای سئو پزشکی از بررسی وضعیت و سئو محلی تا محتوای سلامت و گزارش ماهانه", 1400, 855, "الوند مارکتینگ", "325cccdcba470c25"),
  ],
};

const img_pdp_11: ServiceImageSet = {
  featured: asset("images/pdp/pdp-11-tarahi-application-foroushgahi-shop-app-features.webp", "اینفوگرافیک امکانات اپلیکیشن فروشگاهی در دو بخش خرید و پرداخت و بازگرداندن مشتری: ورود با کد یک‌بارمصرف، سبد خرید ماندگار، اعلان، علاقه‌مندی‌ها و سفارش دوباره", 1400, 594, "الوند مارکتینگ", "49da51e3d06f215b"),
  related: [
    asset("images/pdp/pdp-11-tarahi-application-foroushgahi-native-crossplatform-pwa-comparison.webp", "جدول مقایسه اپ نیتیو، اپ کراس‌پلتفرم و وب‌اپلیکیشن فروشگاهی PWA از نظر روش ساخت، کارایی، انتشار در مارکت و کاربرد", 1400, 568, "الوند مارکتینگ", "9739b619eda6589b"),
    asset("images/pdp/pdp-11-tarahi-application-foroushgahi-shop-app-build-steps.webp", "اینفوگرافیک هفت مرحله ساخت اپلیکیشن فروشگاهی از تعریف نسخه اول و اتصال API به فروشگاه تا انتشار در مارکت‌ها و تحویل کد منبع کامل", 1400, 645, "الوند مارکتینگ", "033f1d8ab3f5125b"),
  ],
};

const img_pdp_12: ServiceImageSet = {
  featured: asset("images/pdp/pdp-12-tarahi-site-khadamati-service-business-types.webp", "اینفوگرافیک کسب‌وکارهای مناسب سایت خدماتی: تعمیرات و تأسیسات، نظافت و سم‌پاشی، باربری و اسباب‌کشی، نصب تجهیزات و دوربین، خدمات خودرو در محل و خدمات مراقبتی در منزل", 1400, 547, "الوند مارکتینگ", "66bef00dc5fc37d9"),
  related: [
    asset("images/pdp/pdp-12-tarahi-site-khadamati-service-request-panel-flow.webp", "اینفوگرافیک پنل مدیریت درخواست در سایت خدماتی: وضعیت درخواست‌ها، ارجاع به کارشناس با پیامک، ثبت هزینه نهایی و پرداخت آنلاین و گزارش به تفکیک خدمت و منطقه", 1400, 437, "الوند مارکتینگ", "e7ffe544db167c2a"),
    asset("images/pdp/pdp-12-tarahi-site-khadamati-service-vs-corporate-vs-landing.webp", "جدول مقایسه سایت خدماتی، سایت شرکتی و لندینگ پیج از نظر هدف اصلی، صفحات، امکانات ویژه و کاربرد", 1400, 540, "الوند مارکتینگ", "901e1a404dfec759"),
  ],
};

const img_pdp_13: ServiceImageSet = {
  featured: asset("images/pdp/pdp-13-tarahi-site-gardeshgari-tourism-site-versions.webp", "اینفوگرافیک نسخه‌های طراحی سایت گردشگری: آژانس گردشگری، برگزارکننده تور طبیعت‌گردی، هتل و هتل‌آپارتمان و اقامتگاه بوم‌گردی با ماژول‌های کلیدی", 1400, 706, "الوند مارکتینگ", "a76bc3c59c211285"),
  related: [
    asset("images/pdp/pdp-13-tarahi-site-gardeshgari-hotel-booking-features.webp", "اینفوگرافیک امکانات سایت رزرو هتل: انواع اتاق، تقویم نرخ و موجودی، رزرو مستقیم و بیعانه، مدیریت رزروها در پنل پذیرش و هماهنگی موجودی با سامانه‌های رزرو", 1400, 492, "الوند مارکتینگ", "ca992cf7f0ae2822"),
    asset("images/pdp/pdp-13-tarahi-site-gardeshgari-tourism-site-steps.webp", "اینفوگرافیک هفت مرحله طراحی سایت گردشگری از تعریف ساختار تور یا اتاق و قواعد لغو تا پیاده‌سازی موتور رزرو و تست رزرو واقعی", 1600, 467, "الوند مارکتینگ", "94fa385921f643e3"),
  ],
};

const img_pdp_14: ServiceImageSet = {
  featured: asset("images/pdp/pdp-14-tolid-mohtava-video-video-content-types.webp", "اینفوگرافیک انواع تولید محتوای ویدیویی: معرفی برند، معرفی محصول، ویدیوی آموزشی، ریلز و استوری اینستاگرام، ویدیوی تبلیغاتی و ویدیوی هوش مصنوعی با کاربرد هرکدام", 1400, 768, "الوند مارکتینگ", "b5d9b9392c7f3fd3"),
  related: [
    asset("images/pdp/pdp-14-tolid-mohtava-video-video-project-deliverables.webp", "اینفوگرافیک تحویلی‌های پروژه تولید ویدیو: سناریو و استوری‌بورد، تصویربرداری، تدوین و صداگذاری، زیرنویس، خروجی هر کانال، فایل‌های خام و دو مرحله اصلاح", 1400, 645, "الوند مارکتینگ", "045389ca9276a7cf"),
    asset("images/pdp/pdp-14-tolid-mohtava-video-video-production-methods-comparison.webp", "جدول مقایسه تصویربرداری حرفه‌ای حضوری، ضبط توسط تیم شما با راهنما و ویدیوی هوش مصنوعی از نظر کیفیت تصویر، حس واقعی بودن برند و کاربرد", 1400, 540, "الوند مارکتینگ", "2ce9a7df9d4c3839"),
  ],
};

const img_pdp_15: ServiceImageSet = {
  featured: asset("images/pdp/pdp-15-mohajerat-site-be-wordpress-wordpress-tools-import.webp", "تصویر واقعی صفحه درون‌ریزی وردپرس فارسی با درون‌ریز WordPress و RSS؛ مسیر انتقال نوشته‌ها، برگه‌ها و رسانه از سایت قبلی", 1440, 900, "الوند مارکتینگ", "95806f0df9d6031a"),
  related: [
    asset("images/pdp/pdp-15-mohajerat-site-be-wordpress-migration-seo-preservation.webp", "اینفوگرافیک حفظ سئو در مهاجرت سایت به وردپرس: فهرست آدرس‌های فعلی، نقشه ریدایرکت ۳۰۱، اصلاح لینک‌های داخلی، حفظ هدینگ و متن صفحات پررتبه و پایش خطاهای ۴۰۴", 1400, 466, "الوند مارکتینگ", "b99335e77d8c0ef9"),
    asset("images/pdp/pdp-15-mohajerat-site-be-wordpress-wordpress-permalink-structure.webp", "تصویر واقعی تنظیمات پیوند یکتای وردپرس با ساختار سفارشی؛ هم‌شکل کردن آدرس‌های تازه با آدرس‌های قدیمی برای کاهش ریدایرکت", 1440, 900, "الوند مارکتینگ", "df15ca7a64dae358"),
    asset("images/pdp/pdp-15-mohajerat-site-be-wordpress-migration-vs-upgrade-vs-redesign.webp", "جدول مقایسه مهاجرت به وردپرس، ارتقای نسخه سیستم فعلی و بازطراحی کامل از نظر ظاهر، محتوا و آدرس‌ها، ریسک سئو و مدیریت محتوا", 1400, 597, "الوند مارکتینگ", "8a41ac00a0767f4f"),
  ],
};

const img_pdp_16: ServiceImageSet = {
  featured: asset("images/pdp/pdp-16-paksazi-site-hack-shode-hacked-site-signs-first-actions.webp", "اینفوگرافیک نشانه‌های سایت هک‌شده همراه با اقدام فوری و کاری که نباید انجام شود: ریدایرکت مشکوک، صفحات اسپم در گوگل، کاربر مدیر ناشناس، هشدار هاستینگ و ایمیل اسپم", 1400, 650, "الوند مارکتینگ", "0e4856a5b39dca14"),
  related: [
    asset("images/pdp/pdp-16-paksazi-site-hack-shode-wordpress-plugins-audit.webp", "تصویر واقعی فهرست افزونه‌های وردپرس با افزونه غیرفعال و نسخه هر افزونه؛ بررسی افزونه‌ها برای پیدا کردن و بستن مسیر نفوذ", 1440, 900, "الوند مارکتینگ", "e3119fbd56647305"),
    asset("images/pdp/pdp-16-paksazi-site-hack-shode-gsc-security-issues.webp", "نمای بازسازی‌شده گزارش Security issues در سرچ کنسول با داده نمونه؛ نوع آلودگی، نمونه آدرس‌ها و درخواست بازبینی پس از پاکسازی", 1440, 820, "الوند مارکتینگ", "9743dd68dd1d20e9"),
    asset("images/pdp/pdp-16-paksazi-site-hack-shode-wordpress-profile-password-sessions.webp", "تصویر واقعی بخش مدیریت حساب در پروفایل کاربر وردپرس با ایجاد رمز تازه و خروج از همه نشست‌های دیگر؛ امن‌سازی دسترسی‌ها پس از پاکسازی هک", 1440, 900, "الوند مارکتینگ", "259e1c383c176256"),
  ],
};

const img_pdp_17: ServiceImageSet = {
  featured: asset("images/pdp/pdp-17-tarahi-site-chandzabane-bilingual-or-multilingual-decision.webp", "اینفوگرافیک انتخاب سایت دوزبانه یا چندزبانه بر اساس وضعیت کسب‌وکار: مشتری خارجی محدود، صادرات به بازار عربی‌زبان، مخاطب اصلی خارجی و کاتالوگ بزرگ", 1400, 538, "الوند مارکتینگ", "ccfbf4512f3dfcf6"),
  related: [
    asset("images/pdp/pdp-17-tarahi-site-chandzabane-language-url-structures.webp", "جدول مقایسه ساختار آدرس سایت چندزبانه: زیرپوشه، زیردامنه و دامنه جدا با نمونه آدرس، مزیت، محدودیت و کاربرد", 1400, 568, "الوند مارکتینگ", "5082973a3fe06462"),
    asset("images/pdp/pdp-17-tarahi-site-chandzabane-rtl-ltr-layout-checks.webp", "اینفوگرافیک الزامات چیدمان راست‌چین و چپ‌چین: پشتیبانی کامل RTL و LTR، فونت هر خط، اعداد و تاریخ مطابق عرف هر زبان و تست موبایل هر زبان", 1400, 432, "الوند مارکتینگ", "f09299f167fc332b"),
  ],
};

const img_pdp_18: ServiceImageSet = {
  featured: asset("images/pdp/pdp-18-tarahi-site-nobat-dehi-booking-unit-by-business.webp", "اینفوگرافیک واحد نوبت و نکته کلیدی سامانه نوبت‌دهی برای سالن زیبایی، مشاوره و روانشناسی، باشگاه و کلاس، کارواش و خدمات خودرو و مطب و کلینیک", 1400, 546, "الوند مارکتینگ", "beb16f92eb6c573a"),
  related: [
    asset("images/pdp/pdp-18-tarahi-site-nobat-dehi-booking-panels-and-reports.webp", "اینفوگرافیک پنل‌های سامانه نوبت‌دهی: پنل مدیر با همه تقویم‌ها، پنل پرسنل، پنل مشتری و گزارش نوبت‌های بی‌حضور", 1400, 409, "الوند مارکتینگ", "0cdaf71fb277aa12"),
    asset("images/pdp/pdp-18-tarahi-site-nobat-dehi-booking-system-comparison.webp", "جدول مقایسه سامانه نوبت اختصاصی، اپلیکیشن‌های عمومی نوبت‌دهی و نوبت دستی از نظر هزینه هر نوبت، نمایش کنار رقبا، انعطاف قواعد، داده مشتری و یادآوری", 1400, 540, "الوند مارکتینگ", "322cb7f7202af5c7"),
  ],
};

const img_pdp_19: ServiceImageSet = {
  featured: asset("images/pdp/pdp-19-tarahi-site-khabari-news-site-versions.webp", "اینفوگرافیک نسخه‌های طراحی سایت خبری: خبرگزاری، خبری تحلیلی، نشریه تخصصی و صنفی و روابط عمومی سازمان با نیاز اصلی و ماژول‌های کلیدی", 1400, 507, "الوند مارکتینگ", "651e8489e1af23d6"),
  related: [
    asset("images/pdp/pdp-19-tarahi-site-khabari-wordpress-editorial-post-status.webp", "تصویر واقعی فهرست نوشته‌های وردپرس با وضعیت‌های پیش‌نویس، در انتظار بررسی و زمان‌بندی‌شده؛ گردش کار خبرنگار و سردبیر در سایت خبری", 1440, 900, "الوند مارکتینگ", "dd74eb6b398e0f21"),
    asset("images/pdp/pdp-19-tarahi-site-khabari-wordpress-user-roles.webp", "تصویر واقعی فرم افزودن کاربر وردپرس با انتخاب نقش نویسنده، ویرایشگر یا مدیر؛ حساب و سطح دسترسی جداگانه برای هر عضو تحریریه", 1440, 900, "الوند مارکتینگ", "24c4e204b594bcd1"),
    asset("images/pdp/pdp-19-tarahi-site-khabari-news-site-comparison.webp", "جدول مقایسه سایت خبری اختصاصی، قالب خبری آماده و کانال پیام‌رسان از نظر گردش کار تحریریه، سرعت زیر بار، دیده شدن در گوگل، بایگانی و درآمد تبلیغاتی", 1400, 594, "الوند مارکتینگ", "213ff30060ebd11a"),
  ],
};

const img_pdp_20: ServiceImageSet = {
  featured: asset("images/pdp/pdp-20-seo-beynolmelali-international-market-research.webp", "اینفوگرافیک تحقیق بازار در سئو بین‌المللی: تقاضا، رقابت، توان فروش و هزینه محتوا با پرسش و منبع داده هرکدام", 1400, 612, "الوند مارکتینگ", "44582cff7291a508"),
  related: [
    asset("images/pdp/pdp-20-seo-beynolmelali-gsc-performance-countries.webp", "نمای بازسازی‌شده گزارش عملکرد سرچ کنسول در زبانه کشورها با داده نمونه؛ کلیک، نمایش و جایگاه سایت در هر کشور بازار هدف", 1440, 1090, "الوند مارکتینگ", "01c599cc6a1ddc08"),
    asset("images/pdp/pdp-20-seo-beynolmelali-multilingual-technical-seo.webp", "اینفوگرافیک سئو تکنیکال سایت چندزبانه: ساختار آدرس زبان‌ها، پیاده‌سازی و بررسی hreflang، سرعت برای کاربر خارجی و نقشه سایت چندزبانه", 1400, 433, "الوند مارکتینگ", "570fec14f6f6b845"),
    asset("images/pdp/pdp-20-seo-beynolmelali-international-seo-process.webp", "اینفوگرافیک شش گام اجرای سئو بین‌المللی از تحقیق بازار و کلمات هر کشور تا گزارش ورودی هر نسخه زبانی", 1600, 466, "الوند مارکتینگ", "c1871d41acfe72b1"),
  ],
};

const img_pdp_21: ServiceImageSet = {
  featured: asset("images/pdp/pdp-21-poshtibani-site-foroushgahi-safe-woocommerce-update-flow.webp", "اینفوگرافیک روند به‌روزرسانی امن ووکامرس: تست روی نسخه آزمایشی، بررسی سازگاری درگاه و افزونه‌ها، اجرا در ساعات کم‌فروش و استفاده از قالب و افزونه اورجینال", 1400, 436, "الوند مارکتینگ", "afdad8512427067a"),
  related: [
    asset("images/pdp/pdp-21-poshtibani-site-foroushgahi-woocommerce-system-status.webp", "تصویر واقعی صفحه وضعیت سیستم ووکامرس با نسخه ووکامرس و وردپرس و زبانه گزارش‌ها؛ بررسی خطاها و پرداخت‌های ناموفق در پشتیبانی فروشگاه", 1440, 900, "الوند مارکتینگ", "b7613344950ea038"),
    asset("images/pdp/pdp-21-poshtibani-site-foroushgahi-store-campaign-readiness-checklist.webp", "چک‌لیست آمادگی فروشگاه اینترنتی پیش از کمپین: ظرفیت هاست و کش، تست کد تخفیف، پایش روزهای اوج، نسخه پشتیبان، تست خرید و بازگشت از درگاه و کنترل موجودی", 1400, 457, "الوند مارکتینگ", "bd2e32e840bf1fd6"),
    asset("images/pdp/pdp-21-poshtibani-site-foroushgahi-store-support-comparison.webp", "جدول مقایسه قرارداد پشتیبانی سایت فروشگاهی، پشتیبانی موردی هنگام خرابی و نگهداری توسط تیم داخلی از نظر پیشگیری، به‌روزرسانی، زمان پاسخ و نسخه پشتیبان", 1400, 597, "الوند مارکتینگ", "4314212b8d1f985e"),
  ],
};

const img_pdp_22: ServiceImageSet = {
  featured: asset("images/pdp/pdp-22-tarahi-site-hoghooghi-law-site-versions.webp", "اینفوگرافیک نسخه‌های طراحی سایت حقوقی: وکیل مستقل، دفتر وکالت مشترک و مؤسسه حقوقی با نیاز اصلی و ماژول‌های کلیدی", 1400, 507, "الوند مارکتینگ", "f520161024a79395"),
  related: [
    asset("images/pdp/pdp-22-tarahi-site-hoghooghi-law-site-professional-rules.webp", "اینفوگرافیک ملاحظات شئون وکالت در سایت حقوقی: نبود وعده نتیجه، عناوین مطابق پروانه، لحن رسمی، نبود ادعای ارتباط با مراجع قضایی و محرمانگی اطلاعات موکلان", 1400, 614, "الوند مارکتینگ", "2093ef62a2380128"),
    asset("images/pdp/pdp-22-tarahi-site-hoghooghi-law-site-steps.webp", "اینفوگرافیک هفت مرحله طراحی سایت حقوقی از تعریف صفحات حوزه‌های کاری تا پیاده‌سازی رزرو و پرداخت مشاوره و بازبینی متن نهایی با شما", 1600, 465, "الوند مارکتینگ", "64597e8ad333bb20"),
  ],
};

export const serviceImagesBySlug: Record<string, ServiceImageSet> = {
  "آنالیتیکس": img_plp_10,
  "آنالیتیکس/تگ-منیجر": img_plp_44,
  "آنالیتیکس/سرچ-کنسول": img_plp_45,
  "آنالیتیکس/گوگل-آنالیتیکس": img_plp_43,
  "اپلیکیشن-و-وب-اپ": img_plp_09,
  "اپلیکیشن-و-وب-اپ/وب-اپلیکیشن": img_plp_42,
  "ای-پی-آی-و-یکپارچه-سازی": img_plp_11,
  "ایمیل-مارکتینگ": img_plp_12,
  "ای‌پی‌آی-و-یکپارچه‌سازی": img_plp_11,
  "برندینگ": img_plp_14,
  "تبلیغات-اینترنتی": img_plp_06,
  "تبلیغات-اینترنتی/بنری": img_plp_31,
  "تبلیغات-اینترنتی/رپورتاژ-آگهی": img_plp_32,
  "تبلیغات-اینترنتی/شبکه-های-اجتماعی": img_plp_34,
  "تبلیغات-اینترنتی/شبکه‌های-اجتماعی": img_plp_34,
  "تبلیغات-اینترنتی/پوش-نوتیفیکیشن": img_plp_33,
  "تبلیغات-اینترنتی/کلیکی": img_plp_30,
  "تبلیغات-اینترنتی/گوگل-ادز": img_plp_29,
  "تولید-محتوا": img_plp_04,
  "تولید-محتوا/اینستاگرام": img_plp_25,
  "تولید-محتوا/هوش-مصنوعی": img_plp_26,
  "سئو": img_plp_03,
  "سئو/تکنیکال": img_plp_21,
  "سئو/خارجی": img_plp_23,
  "سئو/داخلی": img_plp_22,
  "سئو/محلی": img_plp_24,
  "شبکه-های-اجتماعی": img_plp_07,
  "شبکه-های-اجتماعی/اینستاگرام": img_plp_35,
  "شبکه-های-اجتماعی/لینکدین": img_plp_36,
  "شبکه‌های-اجتماعی": img_plp_07,
  "شبکه‌های-اجتماعی/اینستاگرام": img_plp_35,
  "شبکه‌های-اجتماعی/لینکدین": img_plp_36,
  "طراحی-سایت": img_plp_02,
  "طراحی-سایت/المنتور": img_plp_17,
  "طراحی-سایت/بازطراحی": img_plp_18,
  "طراحی-سایت/شرکتی": img_plp_20,
  "طراحی-سایت/فروشگاهی": img_plp_19,
  "طراحی-سایت/وردپرس": img_plp_15,
  "طراحی-سایت/کدنویسی": img_plp_16,
  "مشاوره-دیجیتال-مارکتینگ": img_plp_13,
  "هوش-مصنوعی": img_plp_05,
  "هوش-مصنوعی/اتوماسیون-بازاریابی": img_plp_28,
  "هوش-مصنوعی/چت-بات": img_plp_27,
  "پشتیبانی-سایت": img_plp_08,
  "پشتیبانی-سایت/افزایش-سرعت": img_plp_37,
  "پشتیبانی-سایت/امنیت": img_plp_38,
  "پشتیبانی-سایت/رفع-ارور": img_plp_41,
  "پشتیبانی-سایت/مانیتورینگ": img_plp_39,
  "پشتیبانی-سایت/نصب-قالب-و-افزونه": img_plp_40,
  "اپلیکیشن-و-وب-اپ/فروشگاهی": img_pdp_11,
  "تولید-محتوا/ویدیویی": img_pdp_14,
  "سئو/بین-المللی": img_pdp_20,
  "سئو/فروشگاهی": img_pdp_03,
  "سئو/پزشکی": img_pdp_10,
  "طراحی-سایت/آموزشی": img_pdp_06,
  "طراحی-سایت/املاک": img_pdp_05,
  "طراحی-سایت/حقوقی": img_pdp_22,
  "طراحی-سایت/خبری": img_pdp_19,
  "طراحی-سایت/خدماتی": img_pdp_12,
  "طراحی-سایت/دندانپزشکی": img_pdp_08,
  "طراحی-سایت/رستوران": img_pdp_04,
  "طراحی-سایت/صنعتی": img_pdp_07,
  "طراحی-سایت/لندینگ-پیج": img_pdp_02,
  "طراحی-سایت/نوبت-دهی": img_pdp_18,
  "طراحی-سایت/وردپرس/مهاجرت": img_pdp_15,
  "طراحی-سایت/پزشکی": img_pdp_01,
  "طراحی-سایت/چندزبانه": img_pdp_17,
  "طراحی-سایت/کلینیک-زیبایی": img_pdp_09,
  "طراحی-سایت/گردشگری": img_pdp_13,
  "پشتیبانی-سایت/امنیت/پاکسازی-هک": img_pdp_16,
  "پشتیبانی-سایت/فروشگاهی": img_pdp_21,
};

export function getServiceImages(slug: string): ServiceImageSet | undefined {
  const decoded = (() => {
    try { return decodeURIComponent(slug); } catch { return slug; }
  })();
  return serviceImagesBySlug[slug] || serviceImagesBySlug[decoded];
}

export function getHubImages(): ServiceImageSet {
  return hubServiceImages;
}
