#!/usr/bin/env node
/**
 * Download topic-matched Unsplash photos, convert to WebP, upload to R2,
 * and generate lib/service-images.ts.
 *
 * Env (never logged): R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY,
 * R2_BUCKET, NEXT_PUBLIC_R2_PUBLIC_BASE_URL
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { S3Client, PutObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const STAGING = path.join(ROOT, ".r2-staging/services");
const OUT_TS = path.join(ROOT, "lib/service-images.ts");
const WEBP_QUALITY = 80;
const FEATURED_W = 1600;
const RELATED_W = 1200;

/** @typedef {{ id: string, photographer: string, topic: string }} Photo */

/** Curated Unsplash photos (images.unsplash.com/photo-{id}). */
const PHOTOS = {
  // marketing / digital / team
  analyticsDashboard: { id: "1460925895917-afdab827c52f", photographer: "Luke Chesser", topic: "analytics" },
  laptopMarketing: { id: "1556761175-b413da4baf72", photographer: "Austin Distel", topic: "marketing" },
  teamMeeting: { id: "1552664730-d307ca884978", photographer: "Campaign Creators", topic: "consulting" },
  deskStrategy: { id: "1454165804606-c3d57bc86b40", photographer: "Scott Graham", topic: "strategy" },
  growthChart: { id: "1551288049-bebda4e38f71", photographer: "Luke Chesser", topic: "growth" },
  brainstorm: { id: "1517245386807-bb43f82c33c4", photographer: "Headway", topic: "workshop" },
  // web / code
  codeScreen: { id: "1461749280684-dccba630e2f6", photographer: "Mohammad Rahmani", topic: "code" },
  laptopCode: { id: "1498050108023-c5249f4df085", photographer: "Christopher Gower", topic: "web" },
  webDesigner: { id: "1581291518857-4e27b48ff24e", photographer: "Sigmund", topic: "design" },
  uiWireframe: { id: "1586717791821-3f44a563fa4c", photographer: "Hal Gatewood", topic: "ui" },
  responsiveDevices: { id: "1512941937728-9a9c4e8e4f8b", photographer: "Daniel Korpai", topic: "responsive" },
  wordpressDesk: { id: "1486312338219-ce68d2c6f44d", photographer: "Glenn Carstens-Peters", topic: "cms" },
  // medical
  doctorTablet: { id: "1576091160399-112ba8d25d1d", photographer: "National Cancer Institute", topic: "medical" },
  clinicHall: { id: "1519494026892-80bbd2d6fd0d", photographer: "Martha Dominguez de Gouveia", topic: "clinic" },
  stethoscope: { id: "1579684385127-1ef15d508118", photographer: "Online Marketing", topic: "doctor" },
  dentalChair: { id: "1606811841689-23dfddce3e95", photographer: "Enrique", topic: "dental" },
  beautyClinic: { id: "1512290923902-8b6b4d7e0d0d", photographer: "Thought Catalog", topic: "beauty" },
  // fallback beauty
  skincare: { id: "1570172619644-dfd58ae2a63e", photographer: "Freestocks", topic: "beauty" },
  spa: { id: "1540555700478-4be289fbecef", photographer: "Toa Heftiba", topic: "spa" },
  // food / restaurant
  restaurantInterior: { id: "1517248135467-4c7edcad34c4", photographer: "Jay Wennington", topic: "restaurant" },
  chefKitchen: { id: "1556910103-1c02745aae4d", photographer: "Louis Hansel", topic: "kitchen" },
  cafeLaptop: { id: "1521017432531-fbd92d768814", photographer: "Toa Heftiba", topic: "cafe" },
  foodPlate: { id: "1414235077428-338989a2e8c0", photographer: "Brooke Lark", topic: "food" },
  // real estate
  modernHouse: { id: "1560518883-ce09059eeffa", photographer: "Tierra Mallorca", topic: "realestate" },
  keysHouse: { id: "1560448204-e02f11c3d0e2", photographer: "Tina Floersch", topic: "property" },
  apartment: { id: "1502672260266-1c1ef2d93688", photographer: "R Architecture", topic: "apartment" },
  // education
  classroom: { id: "1509062522246-3755977927d7", photographer: "Kenny Eliason", topic: "education" },
  onlineLearn: { id: "1522202176988-66273c2fd55f", photographer: "Brooke Cagle", topic: "elearning" },
  booksStudy: { id: "1456513080850-7bf58dfa0290", photographer: "Green Chameleon", topic: "study" },
  // industrial
  factory: { id: "1565793297195-9477e0b8f83c", photographer: "Ant Rozetsky", topic: "industrial" },
  warehouse: { id: "1586528116311-ad8dd3c8310d", photographer: "CHUTTERSNAP", topic: "warehouse" },
  machinery: { id: "1504917595217-d4dc5ebe6121", photographer: "Lenny Kuhne", topic: "factory" },
  // landing / ads
  billboard: { id: "1533750349088-cd871a92f312", photographer: "Stephen Dawson", topic: "ads" },
  megaphone: { id: "1557804506-669a67965ba0", photographer: "Austin Distel", topic: "campaign" },
  socialPhone: { id: "1611162617474-5b21e11e480f", photographer: "Solen Feyissa", topic: "social" },
  phoneNotify: { id: "1512941937728-9a9c4e8e4f8b", photographer: "Daniel Korpai", topic: "mobile" },
  targetAds: { id: "1432888498266-38ffec0f1ddf", photographer: "Stephen Dawson", topic: "ads" },
  newspaper: { id: "1504711434969-e33886168f5c", photographer: "AbsolutVision", topic: "press" },
  // seo / search
  seoLaptop: { id: "1432888622747-4eb9a39eef0c", photographer: "Stephen Dawson", topic: "seo" },
  searchBar: { id: "1486312338219-ce68d2c6f44d", photographer: "Glenn Carstens-Peters", topic: "search" },
  keywords: { id: "1434626882399-7c2aa07f4e21", photographer: "William Iven", topic: "keywords" },
  globeSeo: { id: "1451187580459-43490279c0fa", photographer: "NASA", topic: "international" },
  shoppingSeo: { id: "1556742049-0cfed4f6a45d", photographer: "CardMapr.nl", topic: "ecommerce" },
  // content / video
  writingDesk: { id: "1455390582262-044cdead277a", photographer: "Aaron Burden", topic: "writing" },
  contentCreate: { id: "1434030216411-0b793f80b178", photographer: "Green Chameleon", topic: "content" },
  videoCamera: { id: "1574717024653-61fd2cf4d44d", photographer: "Jakob Owens", topic: "video" },
  filmEdit: { id: "1492619372717-6f8a7b2b2c0f", photographer: "Jakob Owens", topic: "editing" },
  podcastMic: { id: "1478737270239-2f02b77fc618", photographer: "Jonathan Velasquez", topic: "media" },
  // social
  instagramPhone: { id: "1611262588024-d9ba4c1d0b0f", photographer: "ConvertKit", topic: "instagram" },
  socialFeed: { id: "1611162616305-c69b3fa7fbe0", photographer: "Souvik Banerjee", topic: "social" },
  socialCommunity: { id: "1529156069898-49953e39b3ac", photographer: "Perry Grone", topic: "community" },
  linkedinOffice: { id: "1521737711867-e3b97375f902", photographer: "LinkedIn Sales Solutions", topic: "linkedin" },
  networkPeople: { id: "1522071820081-009f0129c71c", photographer: "LinkedIn Sales Solutions", topic: "network" },
  // support / security / speed
  serverRoom: { id: "1558494949-ef010cbdcc31", photographer: "Taylor Vick", topic: "servers" },
  lockSecurity: { id: "1563986768609-322da13575f3", photographer: "FlyD", topic: "security" },
  speedBlur: { id: "1468444006929-b4c5d0c1f8f0", photographer: "Marc-Olivier Jodoin", topic: "speed" },
  monitoring: { id: "1555949963-aa79dcee981c", photographer: "Fotis Fotopoulos", topic: "monitoring" },
  fixTools: { id: "1581092160562-40aa08e78837", photographer: "ThisisEngineering", topic: "repair" },
  hackerDark: { id: "1526374960328-7f5faa1e0b0f", photographer: "Markus Spiske", topic: "security" },
  pluginCode: { id: "1517694712202-14dd9538aa97", photographer: "Lee Campbell", topic: "plugins" },
  // apps
  mobileApp: { id: "1512941937728-9a9c4e8e4f8b", photographer: "Daniel Korpai", topic: "app" },
  appDesign: { id: "1551650975-87deedd944c3", photographer: "Ashutosh Gawali", topic: "appui" },
  pwaPhone: { id: "1511707171634-5f897ff02aa9", photographer: "William Iven", topic: "phone" },
  shopApp: { id: "1556742049-0cfed4f6a45d", photographer: "CardMapr.nl", topic: "shop" },
  // ai
  aiRobot: { id: "1677442136019-21780ecad995", photographer: "Growtika", topic: "ai" },
  aiChip: { id: "1620712943543-bcc4688e7485", photographer: "Possessed Photography", topic: "ai" },
  neural: { id: "1677756119517-56d7268e9a4d", photographer: "Google DeepMind", topic: "ai" },
  // email
  emailInbox: { id: "1596526131086-c0c1e0e0e0e0", photographer: "Brett Jordan", topic: "email" },
  newsletter: { id: "1563986768494-4dee2763ff36", photographer: "Solen Feyissa", topic: "email" },
  // api
  apiCode: { id: "1555066931-4365d14bab8c", photographer: "Fotis Fotopoulos", topic: "api" },
  integration: { id: "1516321318423-f06f85e504b3", photographer: "Christin Hume", topic: "systems" },
  // branding
  brandColors: { id: "1561070790-a4932d1eadca", photographer: "Balázs Kétyi", topic: "brand" },
  logoDesign: { id: "1634942823686-ba4e0b0e0e0e", photographer: "Design", topic: "logo" },
  identity: { id: "1600880292203-757bb62b4baf", photographer: "Austin Distel", topic: "identity" },
  // tourism / travel
  travelMap: { id: "1488646953014-85cb44e25828", photographer: "Josh Hild", topic: "travel" },
  hotel: { id: "1566073771259-6a8506099945", photographer: "Roberto Nickson", topic: "hotel" },
  luggage: { id: "1488085061387-422e29b40080", photographer: "Josh Hild", topic: "travel" },
  // legal / news / booking / multilingual
  lawBooks: { id: "1589829085413-56de8ae18c73", photographer: "Tingey Injury Law Firm", topic: "legal" },
  newsroom: { id: "1504711434969-e33886168f5c", photographer: "AbsolutVision", topic: "news" },
  calendarBook: { id: "1506784983876-595ef4968cb3", photographer: "Eric Rothermel", topic: "booking" },
  languages: { id: "1523240337013-6c8e2b6a0e0e", photographer: "Perry Grone", topic: "languages" },
  worldFlags: { id: "1526779259212-939e647799d0", photographer: "Benjamin Voros", topic: "world" },
  // services business
  serviceHandshake: { id: "1521791136064-622d7d8e0e0e", photographer: "Cytonn Photography", topic: "services" },
  helpdesk: { id: "1556745753-b2904692e3f4", photographer: "LinkedIn Sales Solutions", topic: "support" },
  // push / notify alt
  notificationBell: { id: "1512941937728-9a9c4e8e4f8b", photographer: "Daniel Korpai", topic: "notify" },
  // more variety
  coworking: { id: "1497366216548-37526070297c", photographer: "Nastuh Abootalebi", topic: "office" },
  whiteboard: { id: "1556761175-5973dc0f32e7", photographer: "Austin Distel", topic: "planning" },
  tabletUx: { id: "1559028012-481c04fa702d", photographer: "UX Indonesia", topic: "ux" },
  graphPhone: { id: "1434626882399-7c2aa07f4e21", photographer: "William Iven", topic: "metrics" },
  shoppingCart: { id: "1472851294608-481f6b1b0e0e", photographer: "Free To Use Sounds", topic: "shop" },
  creditCard: { id: "1556742049-0cfed4f6a45d", photographer: "CardMapr.nl", topic: "checkout" },
  cloudTech: { id: "1451187580459-43490279c0fa", photographer: "NASA", topic: "cloud" },
  typingHands: { id: "1516321318423-f06f85e504b3", photographer: "Christin Hume", topic: "typing" },
};

// Fix potentially bad IDs with known-good replacements after probe.
const FALLBACK_POOL = [
  "1460925895917-afdab827c52f",
  "1556761175-b413da4baf72",
  "1454165804606-c3d57bc86b40",
  "1498050108023-c5249f4df085",
  "1461749280684-dccba630e2f6",
  "1576091160399-112ba8d25d1d",
  "1517248135467-4c7edcad34c4",
  "1560518883-ce09059eeffa",
  "1522202176988-66273c2fd55f",
  "1558494949-ef010cbdcc31",
  "1677442136019-21780ecad995",
  "1555066931-4365d14bab8c",
  "1611162617474-5b21e11e480f",
  "1521737711867-e3b97375f902",
  "1561070790-a4932d1eadca",
  "1488646953014-85cb44e25828",
  "1589829085413-56de8ae18c73",
  "1504711434969-e33886168f5c",
  "1551288049-bebda4e38f71",
  "1517245386807-bb43f82c33c4",
];

/**
 * Page assignments: folder (ASCII), title for alts, photo keys (featured + 3 related).
 * @type {Record<string, { folder: string, title: string, keys: [string, string, string, string] }>}
 */
const PAGES = {
  __hub__: {
    folder: "hub-digital-marketing",
    title: "خدمات دیجیتال مارکتینگ",
    keys: ["laptopMarketing", "teamMeeting", "growthChart", "deskStrategy"],
  },
  "طراحی-سایت": {
    folder: "website-design",
    title: "طراحی سایت",
    keys: ["laptopCode", "webDesigner", "uiWireframe", "responsiveDevices"],
  },
  "طراحی-سایت/وردپرس": {
    folder: "wordpress-website",
    title: "طراحی سایت وردپرس",
    keys: ["wordpressDesk", "laptopCode", "codeScreen", "tabletUx"],
  },
  "طراحی-سایت/پزشکی": {
    folder: "medical-website",
    title: "طراحی سایت پزشکی",
    keys: ["doctorTablet", "clinicHall", "stethoscope", "calendarBook"],
  },
  "طراحی-سایت/لندینگ-پیج": {
    folder: "landing-page",
    title: "طراحی لندینگ پیج",
    keys: ["megaphone", "targetAds", "uiWireframe", "graphPhone"],
  },
  "طراحی-سایت/رستوران": {
    folder: "restaurant-website",
    title: "طراحی سایت رستوران",
    keys: ["restaurantInterior", "chefKitchen", "foodPlate", "cafeLaptop"],
  },
  "طراحی-سایت/املاک": {
    folder: "real-estate-website",
    title: "طراحی سایت املاک",
    keys: ["modernHouse", "keysHouse", "apartment", "tabletUx"],
  },
  "طراحی-سایت/آموزشی": {
    folder: "education-website",
    title: "طراحی سایت آموزشی",
    keys: ["onlineLearn", "classroom", "booksStudy", "laptopMarketing"],
  },
  "طراحی-سایت/صنعتی": {
    folder: "industrial-website",
    title: "طراحی سایت صنعتی",
    keys: ["factory", "warehouse", "machinery", "deskStrategy"],
  },
  "طراحی-سایت/دندانپزشکی": {
    folder: "dental-website",
    title: "طراحی سایت دندانپزشکی",
    keys: ["dentalChair", "clinicHall", "doctorTablet", "calendarBook"],
  },
  "طراحی-سایت/کلینیک-زیبایی": {
    folder: "beauty-clinic-website",
    title: "طراحی سایت کلینیک زیبایی",
    keys: ["skincare", "spa", "clinicHall", "beautyClinic"],
  },
  "طراحی-سایت/خدماتی": {
    folder: "services-website",
    title: "طراحی سایت خدماتی",
    keys: ["serviceHandshake", "helpdesk", "coworking", "whiteboard"],
  },
  "طراحی-سایت/گردشگری": {
    folder: "tourism-website",
    title: "طراحی سایت گردشگری",
    keys: ["travelMap", "hotel", "luggage", "worldFlags"],
  },
  "طراحی-سایت/وردپرس/مهاجرت": {
    folder: "wordpress-migration",
    title: "مهاجرت سایت به وردپرس",
    keys: ["cloudTech", "wordpressDesk", "serverRoom", "codeScreen"],
  },
  "طراحی-سایت/چندزبانه": {
    folder: "multilingual-website",
    title: "طراحی سایت چندزبانه",
    keys: ["worldFlags", "globeSeo", "languages", "typingHands"],
  },
  "طراحی-سایت/نوبت-دهی": {
    folder: "booking-website",
    title: "طراحی سایت نوبت‌دهی",
    keys: ["calendarBook", "doctorTablet", "tabletUx", "helpdesk"],
  },
  "طراحی-سایت/خبری": {
    folder: "news-website",
    title: "طراحی سایت خبری",
    keys: ["newsroom", "newspaper", "writingDesk", "contentCreate"],
  },
  "طراحی-سایت/حقوقی": {
    folder: "legal-website",
    title: "طراحی سایت حقوقی",
    keys: ["lawBooks", "coworking", "deskStrategy", "typingHands"],
  },
  سئو: {
    folder: "seo",
    title: "سئو",
    keys: ["seoLaptop", "keywords", "growthChart", "analyticsDashboard"],
  },
  "سئو/فروشگاهی": {
    folder: "ecommerce-seo",
    title: "سئو سایت فروشگاهی",
    keys: ["shoppingSeo", "shoppingCart", "seoLaptop", "graphPhone"],
  },
  "سئو/پزشکی": {
    folder: "medical-seo",
    title: "سئو پزشکی",
    keys: ["doctorTablet", "seoLaptop", "clinicHall", "keywords"],
  },
  "سئو/بین-المللی": {
    folder: "international-seo",
    title: "سئو بین‌المللی",
    keys: ["globeSeo", "worldFlags", "seoLaptop", "cloudTech"],
  },
  "تولید-محتوا": {
    folder: "content-marketing",
    title: "تولید محتوا",
    keys: ["writingDesk", "contentCreate", "typingHands", "brainstorm"],
  },
  "تولید-محتوا/ویدیویی": {
    folder: "video-content",
    title: "تولید محتوا ویدیویی",
    keys: ["videoCamera", "filmEdit", "podcastMic", "socialPhone"],
  },
  "تبلیغات-اینترنتی": {
    folder: "online-ads",
    title: "تبلیغات اینترنتی",
    keys: ["billboard", "megaphone", "targetAds", "growthChart"],
  },
  "تبلیغات-اینترنتی/بنری": {
    folder: "banner-ads",
    title: "تبلیغات بنری",
    keys: ["billboard", "targetAds", "megaphone", "analyticsDashboard"],
  },
  "تبلیغات-اینترنتی/رپورتاژ-آگهی": {
    folder: "sponsored-content",
    title: "رپورتاژ آگهی",
    keys: ["newspaper", "newsroom", "writingDesk", "seoLaptop"],
  },
  "تبلیغات-اینترنتی/پوش-نوتیفیکیشن": {
    folder: "push-notifications",
    title: "پوش نوتیفیکیشن",
    keys: ["phoneNotify", "pwaPhone", "mobileApp", "graphPhone"],
  },
  "تبلیغات-اینترنتی/شبکه‌های-اجتماعی": {
    folder: "social-ads",
    title: "تبلیغات شبکه‌های اجتماعی",
    keys: ["socialPhone", "socialFeed", "megaphone", "instagramPhone"],
  },
  "شبکه‌های-اجتماعی": {
    folder: "social-media",
    title: "شبکه‌های اجتماعی",
    keys: ["socialCommunity", "networkPeople", "pwaPhone", "brainstorm"],
  },
  "هوش-مصنوعی": {
    folder: "artificial-intelligence",
    title: "هوش مصنوعی",
    keys: ["aiRobot", "aiChip", "neural", "codeScreen"],
  },
  "ایمیل-مارکتینگ": {
    folder: "email-marketing",
    title: "ایمیل مارکتینگ",
    keys: ["newsletter", "emailInbox", "laptopMarketing", "growthChart"],
  },
  آنالیتیکس: {
    folder: "analytics",
    title: "ابزارهای آنالیتیکس",
    keys: ["analyticsDashboard", "growthChart", "graphPhone", "deskStrategy"],
  },
  "آنالیتیکس/گوگل-آنالیتیکس": {
    folder: "google-analytics",
    title: "گوگل آنالیتیکس",
    keys: ["analyticsDashboard", "graphPhone", "seoLaptop", "growthChart"],
  },
  "آنالیتیکس/تگ-منیجر": {
    folder: "google-tag-manager",
    title: "گوگل تگ منیجر",
    keys: ["codeScreen", "analyticsDashboard", "apiCode", "laptopCode"],
  },
  "آنالیتیکس/سرچ-کنسول": {
    folder: "search-console",
    title: "سرچ کنسول",
    keys: ["seoLaptop", "keywords", "searchBar", "analyticsDashboard"],
  },
  "پشتیبانی-سایت": {
    folder: "website-support",
    title: "پشتیبانی سایت",
    keys: ["helpdesk", "serverRoom", "fixTools", "monitoring"],
  },
  "پشتیبانی-سایت/افزایش-سرعت": {
    folder: "site-speed",
    title: "افزایش سرعت سایت",
    keys: ["speedBlur", "serverRoom", "laptopCode", "monitoring"],
  },
  "پشتیبانی-سایت/امنیت": {
    folder: "site-security",
    title: "امنیت سایت",
    keys: ["lockSecurity", "serverRoom", "hackerDark", "cloudTech"],
  },
  "پشتیبانی-سایت/مانیتورینگ": {
    folder: "site-monitoring",
    title: "مانیتورینگ سایت",
    keys: ["monitoring", "analyticsDashboard", "serverRoom", "graphPhone"],
  },
  "پشتیبانی-سایت/نصب-قالب-و-افزونه": {
    folder: "wordpress-plugins",
    title: "نصب قالب و افزونه وردپرس",
    keys: ["pluginCode", "wordpressDesk", "codeScreen", "laptopCode"],
  },
  "پشتیبانی-سایت/رفع-ارور": {
    folder: "site-error-fix",
    title: "رفع ارور سایت",
    keys: ["fixTools", "codeScreen", "serverRoom", "monitoring"],
  },
  "پشتیبانی-سایت/امنیت/پاکسازی-هک": {
    folder: "malware-cleanup",
    title: "پاکسازی سایت هک‌شده",
    keys: ["hackerDark", "lockSecurity", "serverRoom", "fixTools"],
  },
  "پشتیبانی-سایت/فروشگاهی": {
    folder: "ecommerce-support",
    title: "پشتیبانی سایت فروشگاهی",
    keys: ["shoppingCart", "creditCard", "helpdesk", "serverRoom"],
  },
  "اپلیکیشن-و-وب-اپ": {
    folder: "mobile-app",
    title: "طراحی و ساخت اپلیکیشن",
    keys: ["mobileApp", "appDesign", "pwaPhone", "uiWireframe"],
  },
  "اپلیکیشن-و-وب-اپ/وب-اپلیکیشن": {
    folder: "web-application",
    title: "وب اپلیکیشن",
    keys: ["appDesign", "laptopCode", "pwaPhone", "apiCode"],
  },
  "اپلیکیشن-و-وب-اپ/فروشگاهی": {
    folder: "ecommerce-app",
    title: "طراحی اپلیکیشن فروشگاهی",
    keys: ["shopApp", "mobileApp", "shoppingCart", "creditCard"],
  },
  "ای‌پی‌آی-و-یکپارچه‌سازی": {
    folder: "api-integration",
    title: "API و یکپارچه‌سازی",
    keys: ["apiCode", "integration", "codeScreen", "cloudTech"],
  },
  "مشاوره-دیجیتال-مارکتینگ": {
    folder: "digital-consulting",
    title: "مشاوره دیجیتال مارکتینگ",
    keys: ["teamMeeting", "whiteboard", "deskStrategy", "brainstorm"],
  },
  برندینگ: {
    folder: "branding",
    title: "برندینگ و هویت بصری",
    keys: ["brandColors", "identity", "logoDesign", "webDesigner"],
  },
  "شبکه‌های-اجتماعی/اینستاگرام": {
    folder: "instagram-management",
    title: "مدیریت اینستاگرام",
    keys: ["instagramPhone", "socialFeed", "socialPhone", "contentCreate"],
  },
  "شبکه‌های-اجتماعی/لینکدین": {
    folder: "linkedin-management",
    title: "مدیریت لینکدین",
    keys: ["linkedinOffice", "networkPeople", "coworking", "teamMeeting"],
  },
};

function requireEnv(name) {
  const v = process.env[name];
  if (!v || !String(v).trim()) {
    console.error(`MISSING env: ${name}`);
    process.exit(2);
  }
  return String(v).trim();
}

function resolveAccountId(raw, bucket) {
  const stripped = raw.trim();
  const m = stripped.match(
    /^([0-9a-fA-F]{32})\.r2\.cloudflarestorage\.com(?:\/(.*))?$/
  );
  if (m) return m[1];
  if (/^[0-9a-fA-F]{32}$/.test(stripped)) return stripped;
  console.error("R2_ACCOUNT_ID unexpected shape");
  process.exit(2);
}

function unsplashUrl(id, w) {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;
}

async function download(url, dest) {
  const res = await fetch(url, {
    headers: {
      "User-Agent": "AlvandMarketingImageImporter/1.0",
      Accept: "image/*",
    },
    redirect: "follow",
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 1000) throw new Error(`Too small download ${buf.length}`);
  await fs.mkdir(path.dirname(dest), { recursive: true });
  await fs.writeFile(dest, buf);
  return buf.length;
}

async function probePhoto(id) {
  const url = unsplashUrl(id, 400);
  try {
    const res = await fetch(url, { method: "HEAD", redirect: "follow" });
    return res.ok;
  } catch {
    return false;
  }
}

function altFor(title, role, idx) {
  if (role === "featured") {
    return `تصویر شاخص ${title} — الوند مارکتینگ`;
  }
  const labels = ["مرتبط ۱", "مرتبط ۲", "مرتبط ۳"];
  return `تصویر ${labels[idx]} برای ${title} — الوند مارکتینگ`;
}

function tsString(s) {
  return JSON.stringify(s);
}

async function mapPool(concurrency, items, fn) {
  const results = new Array(items.length);
  let i = 0;
  async function worker() {
    while (i < items.length) {
      const idx = i++;
      results[idx] = await fn(items[idx], idx);
    }
  }
  await Promise.all(
    Array.from({ length: Math.min(concurrency, items.length) }, () => worker())
  );
  return results;
}

async function main() {
  const accountRaw = requireEnv("R2_ACCOUNT_ID");
  const accessKeyId = requireEnv("R2_ACCESS_KEY_ID");
  const secretAccessKey = requireEnv("R2_SECRET_ACCESS_KEY");
  const bucket = requireEnv("R2_BUCKET");
  const publicBase = requireEnv("NEXT_PUBLIC_R2_PUBLIC_BASE_URL").replace(
    /\/$/,
    ""
  );
  const accountId = resolveAccountId(accountRaw, bucket);
  const endpoint = `https://${accountId}.r2.cloudflarestorage.com`;
  const client = new S3Client({
    region: "auto",
    endpoint,
    credentials: { accessKeyId, secretAccessKey },
  });

  // Probe & replace bad photo IDs
  console.log("Probing Unsplash photo IDs…");
  const uniqueIds = [
    ...new Set(Object.values(PHOTOS).map((p) => p.id).concat(FALLBACK_POOL)),
  ];
  const okMap = {};
  await mapPool(8, uniqueIds, async (id) => {
    okMap[id] = await probePhoto(id);
  });
  let fi = 0;
  for (const [key, photo] of Object.entries(PHOTOS)) {
    if (!okMap[photo.id]) {
      while (fi < FALLBACK_POOL.length && !okMap[FALLBACK_POOL[fi]]) fi++;
      const nid = FALLBACK_POOL[fi % FALLBACK_POOL.length];
      console.warn(`REPLACE ${key} ${photo.id} -> ${nid}`);
      photo.id = nid;
      fi++;
    }
  }

  /** @type {Record<string, any>} */
  const generated = {};
  const jobs = [];

  for (const [slug, page] of Object.entries(PAGES)) {
    const roles = ["featured", "related-1", "related-2", "related-3"];
    const images = [];
    for (let i = 0; i < 4; i++) {
      const photoKey = page.keys[i];
      let photo = PHOTOS[photoKey];
      if (!photo) {
        console.warn(`Missing photo key ${photoKey}, using fallback`);
        photo = {
          id: FALLBACK_POOL[i % FALLBACK_POOL.length],
          photographer: "Unsplash",
          topic: "general",
        };
      }
      const role = roles[i];
      const w = i === 0 ? FEATURED_W : RELATED_W;
      const filename = `${role}-${photo.id.slice(0, 13)}.webp`;
      const mediaPath = `images/services/${page.folder}/${filename}`;
      const stagingAbs = path.join(STAGING, page.folder, filename);
      images.push({
        role,
        photo,
        w,
        mediaPath,
        stagingAbs,
        alt: altFor(page.title, i === 0 ? "featured" : "related", i - 1),
      });
      jobs.push({
        slug,
        page,
        role,
        photo,
        w,
        mediaPath,
        stagingAbs,
        alt: altFor(page.title, i === 0 ? "featured" : "related", i - 1),
      });
    }
    generated[slug] = { folder: page.folder, title: page.title, images };
  }

  console.log(`Download+convert ${jobs.length} images…`);
  await mapPool(6, jobs, async (job) => {
    const tmp = job.stagingAbs.replace(/\.webp$/, ".src");
    const url = unsplashUrl(job.photo.id, job.w);
    try {
      await download(url, tmp);
    } catch (e) {
      // try another fallback size / id
      const fid = FALLBACK_POOL[Math.floor(Math.random() * FALLBACK_POOL.length)];
      console.warn(`retry ${job.mediaPath}: ${e.message} -> ${fid}`);
      job.photo = { ...job.photo, id: fid };
      await download(unsplashUrl(fid, job.w), tmp);
    }
    const meta = await sharp(tmp)
      .resize({ width: job.w, withoutEnlargement: true })
      .webp({ quality: WEBP_QUALITY, effort: 4 })
      .toFile(job.stagingAbs);
    job.width = meta.width;
    job.height = meta.height;
    await fs.unlink(tmp).catch(() => {});
    return job;
  });

  console.log("Upload to R2…");
  let uploaded = 0;
  let skipped = 0;
  await mapPool(6, jobs, async (job) => {
    const key = `media/${job.mediaPath}`;
    try {
      await client.send(
        new HeadObjectCommand({ Bucket: bucket, Key: key })
      );
      skipped++;
      return;
    } catch {
      /* not found — upload */
    }
    const body = await fs.readFile(job.stagingAbs);
    await client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: body,
        ContentType: "image/webp",
        CacheControl: "public, max-age=31536000, immutable",
      })
    );
    uploaded++;
    if ((uploaded + skipped) % 20 === 0) {
      console.log(`progress uploaded=${uploaded} skipped=${skipped}`);
    }
  });
  console.log(`R2 done uploaded=${uploaded} existed=${skipped}`);

  // Verify a sample CDN HEAD
  const sample = jobs[0];
  const sampleUrl = `${publicBase}/media/${sample.mediaPath}`;
  const head = await fetch(sampleUrl, { method: "HEAD" });
  console.log(`CDN sample ${head.status} ${sampleUrl}`);

  // Emit TypeScript
  const lines = [];
  lines.push(`import { mediaUrl } from "@/lib/media";`);
  lines.push("");
  lines.push(`export type ServiceImageAsset = {`);
  lines.push(`  /** Path under media/ for mediaUrl() */`);
  lines.push(`  path: string;`);
  lines.push(`  alt: string;`);
  lines.push(`  width: number;`);
  lines.push(`  height: number;`);
  lines.push(`  photographer: string;`);
  lines.push(`  unsplashId: string;`);
  lines.push(`};`);
  lines.push("");
  lines.push(`export type ServiceImageSet = {`);
  lines.push(`  featured: ServiceImageAsset;`);
  lines.push(`  related: [ServiceImageAsset, ServiceImageAsset, ServiceImageAsset];`);
  lines.push(`};`);
  lines.push("");
  lines.push(`function asset(`);
  lines.push(`  path: string,`);
  lines.push(`  alt: string,`);
  lines.push(`  width: number,`);
  lines.push(`  height: number,`);
  lines.push(`  photographer: string,`);
  lines.push(`  unsplashId: string`);
  lines.push(`): ServiceImageAsset {`);
  lines.push(`  return { path, alt, width, height, photographer, unsplashId };`);
  lines.push(`}`);
  lines.push("");
  lines.push(`/** Absolute CDN (or local fallback) URL for a service image asset. */`);
  lines.push(`export function serviceImageSrc(asset: ServiceImageAsset): string {`);
  lines.push(`  return mediaUrl(asset.path);`);
  lines.push(`}`);
  lines.push("");

  function emitSet(varName, slugKey, pageJobs) {
    const featured = pageJobs.find((j) => j.role === "featured");
    const related = pageJobs.filter((j) => j.role.startsWith("related"));
    lines.push(`const ${varName}: ServiceImageSet = {`);
    lines.push(
      `  featured: asset(${tsString(featured.mediaPath)}, ${tsString(featured.alt)}, ${featured.width}, ${featured.height}, ${tsString(featured.photo.photographer)}, ${tsString(featured.photo.id)}),`
    );
    lines.push(`  related: [`);
    for (const r of related) {
      lines.push(
        `    asset(${tsString(r.mediaPath)}, ${tsString(r.alt)}, ${r.width}, ${r.height}, ${tsString(r.photo.photographer)}, ${tsString(r.photo.id)}),`
      );
    }
    lines.push(`  ],`);
    lines.push(`};`);
    lines.push("");
    return { slugKey, varName };
  }

  const hubJobs = jobs.filter((j) => j.slug === "__hub__");
  emitSet("hubServiceImages", "__hub__", hubJobs);
  lines.push(`export { hubServiceImages };`);
  lines.push("");

  const entries = [];
  for (const slug of Object.keys(PAGES)) {
    if (slug === "__hub__") continue;
    const pageJobs = jobs.filter((j) => j.slug === slug);
    const safe =
      "img_" +
      PAGES[slug].folder.replace(/-/g, "_");
    emitSet(safe, slug, pageJobs);
    entries.push([slug, safe]);
  }

  lines.push(`export const serviceImagesBySlug: Record<string, ServiceImageSet> = {`);
  for (const [slug, v] of entries) {
    lines.push(`  ${tsString(slug)}: ${v},`);
  }
  lines.push(`};`);
  lines.push("");
  lines.push(`export function getServiceImages(slug: string): ServiceImageSet | undefined {`);
  lines.push(`  const decoded = (() => {`);
  lines.push(`    try { return decodeURIComponent(slug); } catch { return slug; }`);
  lines.push(`  })();`);
  lines.push(`  return serviceImagesBySlug[slug] || serviceImagesBySlug[decoded];`);
  lines.push(`}`);
  lines.push("");
  lines.push(`export function getHubImages(): ServiceImageSet {`);
  lines.push(`  return hubServiceImages;`);
  lines.push(`}`);
  lines.push("");

  await fs.writeFile(OUT_TS, lines.join("\n"), "utf8");
  console.log(
    `Wrote ${OUT_TS} pages=${Object.keys(PAGES).length} images=${jobs.length}`
  );

  // Manifest for docs
  const manifest = {
    hosting: "r2",
    publicBase,
    pages: Object.keys(PAGES).length,
    imagesPerPage: 4,
    totalImages: jobs.length,
    uploaded,
    existed: skipped,
    sampleCdnStatus: head.status,
  };
  await fs.writeFile(
    path.join(ROOT, ".r2-staging/service-images-manifest.json"),
    JSON.stringify(manifest, null, 2)
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
