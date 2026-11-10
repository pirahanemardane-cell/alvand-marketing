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
  related: [ServiceImageAsset, ServiceImageAsset, ServiceImageAsset];
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
  featured: asset("images/services/hub-digital-marketing/featured-1556761175-b413.webp", "تصویر شاخص خدمات دیجیتال مارکتینگ — الوند مارکتینگ", 1200, 900, "Austin Distel", "1556761175-b413da4baf72"),
  related: [
    asset("images/services/hub-digital-marketing/related-1-1552664730-d307.webp", "تصویر مرتبط 1 برای خدمات دیجیتال مارکتینگ — الوند مارکتینگ", 900, 600, "Campaign Creators", "1552664730-d307ca884978"),
    asset("images/services/hub-digital-marketing/related-2-1551288049-bebd.webp", "تصویر مرتبط 2 برای خدمات دیجیتال مارکتینگ — الوند مارکتینگ", 900, 600, "Luke Chesser", "1551288049-bebda4e38f71"),
    asset("images/services/hub-digital-marketing/related-3-1454165804606-c.webp", "تصویر مرتبط 3 برای خدمات دیجیتال مارکتینگ — الوند مارکتینگ", 900, 600, "Scott Graham", "1454165804606-c3d57bc86b40"),
  ],
};

export { hubServiceImages };

const img_website_design: ServiceImageSet = {
  featured: asset("images/services/website-design/featured-1498050108023-c.webp", "تصویر شاخص طراحی سایت — الوند مارکتینگ", 1200, 799, "Christopher Gower", "1498050108023-c5249f4df085"),
  related: [
    asset("images/services/website-design/related-1-1581291518857-4.webp", "تصویر مرتبط 1 برای طراحی سایت — الوند مارکتینگ", 900, 600, "Sigmund", "1581291518857-4e27b48ff24e"),
    asset("images/services/website-design/related-2-1586717791821-3.webp", "تصویر مرتبط 2 برای طراحی سایت — الوند مارکتینگ", 900, 600, "Hal Gatewood", "1586717791821-3f44a563fa4c"),
    asset("images/services/website-design/related-3-1559028012-481c.webp", "تصویر مرتبط 3 برای طراحی سایت — الوند مارکتینگ", 900, 710, "UX Indonesia", "1559028012-481c04fa702d"),
  ],
};

const img_wordpress_website: ServiceImageSet = {
  featured: asset("images/services/wordpress-website/featured-1486312338219-c.webp", "تصویر شاخص طراحی سایت وردپرس — الوند مارکتینگ", 1200, 798, "Glenn Carstens-Peters", "1486312338219-ce68d2c6f44d"),
  related: [
    asset("images/services/wordpress-website/related-1-1517694712202-1.webp", "تصویر مرتبط 1 برای طراحی سایت وردپرس — الوند مارکتینگ", 900, 600, "Lee Campbell", "1517694712202-14dd9538aa97"),
    asset("images/services/wordpress-website/related-2-1461749280684-d.webp", "تصویر مرتبط 2 برای طراحی سایت وردپرس — الوند مارکتینگ", 900, 601, "Mohammad Rahmani", "1461749280684-dccba630e2f6"),
    asset("images/services/wordpress-website/related-3-1498050108023-c.webp", "تصویر مرتبط 3 برای طراحی سایت وردپرس — الوند مارکتینگ", 900, 599, "Christopher Gower", "1498050108023-c5249f4df085"),
  ],
};

const img_medical_website: ServiceImageSet = {
  featured: asset("images/services/medical-website/featured-1576091160399-1.webp", "تصویر شاخص طراحی سایت پزشکی — الوند مارکتینگ", 1200, 800, "National Cancer Institute", "1576091160399-112ba8d25d1d"),
  related: [
    asset("images/services/medical-website/related-1-1519494026892-8.webp", "تصویر مرتبط 1 برای طراحی سایت پزشکی — الوند مارکتینگ", 900, 613, "Martha Dominguez de Gouveia", "1519494026892-80bbd2d6fd0d"),
    asset("images/services/medical-website/related-2-1579684385127-1.webp", "تصویر مرتبط 2 برای طراحی سایت پزشکی — الوند مارکتینگ", 900, 900, "Online Marketing", "1579684385127-1ef15d508118"),
    asset("images/services/medical-website/related-3-1666214280557-f.webp", "تصویر مرتبط 3 برای طراحی سایت پزشکی — الوند مارکتینگ", 900, 600, "Julian Myles", "1666214280557-f1b5022eb634"),
  ],
};

const img_landing_page: ServiceImageSet = {
  featured: asset("images/services/landing-page/featured-1557804506-669a.webp", "تصویر شاخص طراحی لندینگ پیج — الوند مارکتینگ", 1200, 900, "Austin Distel", "1557804506-669a67965ba0"),
  related: [
    asset("images/services/landing-page/related-1-1533750349088-c.webp", "تصویر مرتبط 1 برای طراحی لندینگ پیج — الوند مارکتینگ", 900, 600, "Stephen Dawson", "1533750349088-cd871a92f312"),
    asset("images/services/landing-page/related-2-1586717791821-3.webp", "تصویر مرتبط 2 برای طراحی لندینگ پیج — الوند مارکتینگ", 900, 600, "Hal Gatewood", "1586717791821-3f44a563fa4c"),
    asset("images/services/landing-page/related-3-1551288049-bebd.webp", "تصویر مرتبط 3 برای طراحی لندینگ پیج — الوند مارکتینگ", 900, 600, "Luke Chesser", "1551288049-bebda4e38f71"),
  ],
};

const img_restaurant_website: ServiceImageSet = {
  featured: asset("images/services/restaurant-website/featured-1517248135467-4.webp", "تصویر شاخص طراحی سایت رستوران — الوند مارکتینگ", 1200, 800, "Jay Wennington", "1517248135467-4c7edcad34c4"),
  related: [
    asset("images/services/restaurant-website/related-1-1556910103-1c02.webp", "تصویر مرتبط 1 برای طراحی سایت رستوران — الوند مارکتینگ", 900, 600, "Louis Hansel", "1556910103-1c02745aae4d"),
    asset("images/services/restaurant-website/related-2-1414235077428-3.webp", "تصویر مرتبط 2 برای طراحی سایت رستوران — الوند مارکتینگ", 900, 600, "Brooke Lark", "1414235077428-338989a2e8c0"),
    asset("images/services/restaurant-website/related-3-1521017432531-f.webp", "تصویر مرتبط 3 برای طراحی سایت رستوران — الوند مارکتینگ", 900, 600, "Toa Heftiba", "1521017432531-fbd92d768814"),
  ],
};

const img_real_estate_website: ServiceImageSet = {
  featured: asset("images/services/real-estate-website/featured-1560518883-ce09.webp", "تصویر شاخص طراحی سایت املاک — الوند مارکتینگ", 1200, 901, "Tierra Mallorca", "1560518883-ce09059eeffa"),
  related: [
    asset("images/services/real-estate-website/related-1-1560448204-e02f.webp", "تصویر مرتبط 1 برای طراحی سایت املاک — الوند مارکتینگ", 900, 600, "Tina Floersch", "1560448204-e02f11c3d0e2"),
    asset("images/services/real-estate-website/related-2-1502672260266-1.webp", "تصویر مرتبط 2 برای طراحی سایت املاک — الوند مارکتینگ", 900, 670, "R Architecture", "1502672260266-1c1ef2d93688"),
    asset("images/services/real-estate-website/related-3-1600596542815-f.webp", "تصویر مرتبط 3 برای طراحی سایت املاک — الوند مارکتینگ", 900, 597, "Spacejoy", "1600596542815-ffad4c1539a9"),
  ],
};

const img_education_website: ServiceImageSet = {
  featured: asset("images/services/education-website/featured-1522202176988-6.webp", "تصویر شاخص طراحی سایت آموزشی — الوند مارکتینگ", 1200, 800, "Brooke Cagle", "1522202176988-66273c2fd55f"),
  related: [
    asset("images/services/education-website/related-1-1509062522246-3.webp", "تصویر مرتبط 1 برای طراحی سایت آموزشی — الوند مارکتینگ", 900, 560, "Kenny Eliason", "1509062522246-3755977927d7"),
    asset("images/services/education-website/related-2-1455390582262-0.webp", "تصویر مرتبط 2 برای طراحی سایت آموزشی — الوند مارکتینگ", 900, 676, "Aaron Burden", "1455390582262-044cdead277a"),
    asset("images/services/education-website/related-3-1498050108023-c.webp", "تصویر مرتبط 3 برای طراحی سایت آموزشی — الوند مارکتینگ", 900, 599, "Christopher Gower", "1498050108023-c5249f4df085"),
  ],
};

const img_industrial_website: ServiceImageSet = {
  featured: asset("images/services/industrial-website/featured-1586528116311-a.webp", "تصویر شاخص طراحی سایت صنعتی — الوند مارکتینگ", 1200, 800, "CHUTTERSNAP", "1586528116311-ad8dd3c8310d"),
  related: [
    asset("images/services/industrial-website/related-1-1581092160562-4.webp", "تصویر مرتبط 1 برای طراحی سایت صنعتی — الوند مارکتینگ", 900, 600, "ThisisEngineering", "1581092160562-40aa08e78837"),
    asset("images/services/industrial-website/related-2-1558494949-ef01.webp", "تصویر مرتبط 2 برای طراحی سایت صنعتی — الوند مارکتینگ", 900, 505, "Taylor Vick", "1558494949-ef010cbdcc31"),
    asset("images/services/industrial-website/related-3-1516321318423-f.webp", "تصویر مرتبط 3 برای طراحی سایت صنعتی — الوند مارکتینگ", 900, 600, "Christin Hume", "1516321318423-f06f85e504b3"),
  ],
};

const img_dental_website: ServiceImageSet = {
  featured: asset("images/services/dental-website/featured-1606811841689-2.webp", "تصویر شاخص طراحی سایت دندانپزشکی — الوند مارکتینگ", 1200, 900, "Enrique", "1606811841689-23dfddce3e95"),
  related: [
    asset("images/services/dental-website/related-1-1519494026892-8.webp", "تصویر مرتبط 1 برای طراحی سایت دندانپزشکی — الوند مارکتینگ", 900, 613, "Martha Dominguez de Gouveia", "1519494026892-80bbd2d6fd0d"),
    asset("images/services/dental-website/related-2-1576091160399-1.webp", "تصویر مرتبط 2 برای طراحی سایت دندانپزشکی — الوند مارکتینگ", 900, 600, "National Cancer Institute", "1576091160399-112ba8d25d1d"),
    asset("images/services/dental-website/related-3-1666214280557-f.webp", "تصویر مرتبط 3 برای طراحی سایت دندانپزشکی — الوند مارکتینگ", 900, 600, "Julian Myles", "1666214280557-f1b5022eb634"),
  ],
};

const img_beauty_clinic_website: ServiceImageSet = {
  featured: asset("images/services/beauty-clinic-website/featured-1540555700478-4.webp", "تصویر شاخص طراحی سایت کلینیک زیبایی — الوند مارکتینگ", 1200, 800, "Toa Heftiba", "1540555700478-4be289fbecef"),
  related: [
    asset("images/services/beauty-clinic-website/related-1-1519494026892-8.webp", "تصویر مرتبط 1 برای طراحی سایت کلینیک زیبایی — الوند مارکتینگ", 900, 613, "Martha Dominguez de Gouveia", "1519494026892-80bbd2d6fd0d"),
    asset("images/services/beauty-clinic-website/related-2-1666214280557-f.webp", "تصویر مرتبط 2 برای طراحی سایت کلینیک زیبایی — الوند مارکتینگ", 900, 600, "Julian Myles", "1666214280557-f1b5022eb634"),
    asset("images/services/beauty-clinic-website/related-3-1600880292203-7.webp", "تصویر مرتبط 3 برای طراحی سایت کلینیک زیبایی — الوند مارکتینگ", 900, 600, "Austin Distel", "1600880292203-757bb62b4baf"),
  ],
};

const img_services_website: ServiceImageSet = {
  featured: asset("images/services/services-website/featured-1552664730-d307.webp", "تصویر شاخص طراحی سایت خدماتی — الوند مارکتینگ", 1200, 800, "Campaign Creators", "1552664730-d307ca884978"),
  related: [
    asset("images/services/services-website/related-1-1497366216548-3.webp", "تصویر مرتبط 1 برای طراحی سایت خدماتی — الوند مارکتینگ", 900, 601, "Nastuh Abootalebi", "1497366216548-37526070297c"),
    asset("images/services/services-website/related-2-1556761175-5973.webp", "تصویر مرتبط 2 برای طراحی سایت خدماتی — الوند مارکتینگ", 900, 506, "Austin Distel", "1556761175-5973dc0f32e7"),
    asset("images/services/services-website/related-3-1522071820081-0.webp", "تصویر مرتبط 3 برای طراحی سایت خدماتی — الوند مارکتینگ", 900, 600, "LinkedIn Sales Solutions", "1522071820081-009f0129c71c"),
  ],
};

const img_tourism_website: ServiceImageSet = {
  featured: asset("images/services/tourism-website/featured-1488646953014-8.webp", "تصویر شاخص طراحی سایت گردشگری — الوند مارکتینگ", 1200, 948, "Josh Hild", "1488646953014-85cb44e25828"),
  related: [
    asset("images/services/tourism-website/related-1-1566073771259-6.webp", "تصویر مرتبط 1 برای طراحی سایت گردشگری — الوند مارکتینگ", 900, 600, "Roberto Nickson", "1566073771259-6a8506099945"),
    asset("images/services/tourism-website/related-2-1488085061387-4.webp", "تصویر مرتبط 2 برای طراحی سایت گردشگری — الوند مارکتینگ", 900, 507, "Josh Hild", "1488085061387-422e29b40080"),
    asset("images/services/tourism-website/related-3-1451187580459-4.webp", "تصویر مرتبط 3 برای طراحی سایت گردشگری — الوند مارکتینگ", 900, 599, "NASA", "1451187580459-43490279c0fa"),
  ],
};

const img_wordpress_migration: ServiceImageSet = {
  featured: asset("images/services/wordpress-migration/featured-1558494949-ef01.webp", "تصویر شاخص مهاجرت سایت به وردپرس — الوند مارکتینگ", 1200, 673, "Taylor Vick", "1558494949-ef010cbdcc31"),
  related: [
    asset("images/services/wordpress-migration/related-1-1517694712202-1.webp", "تصویر مرتبط 1 برای مهاجرت سایت به وردپرس — الوند مارکتینگ", 900, 600, "Lee Campbell", "1517694712202-14dd9538aa97"),
    asset("images/services/wordpress-migration/related-2-1461749280684-d.webp", "تصویر مرتبط 2 برای مهاجرت سایت به وردپرس — الوند مارکتینگ", 900, 601, "Mohammad Rahmani", "1461749280684-dccba630e2f6"),
    asset("images/services/wordpress-migration/related-3-1516321318423-f.webp", "تصویر مرتبط 3 برای مهاجرت سایت به وردپرس — الوند مارکتینگ", 900, 600, "Christin Hume", "1516321318423-f06f85e504b3"),
  ],
};

const img_multilingual_website: ServiceImageSet = {
  featured: asset("images/services/multilingual-website/featured-1451187580459-4.webp", "تصویر شاخص طراحی سایت چندزبانه — الوند مارکتینگ", 1200, 798, "NASA", "1451187580459-43490279c0fa"),
  related: [
    asset("images/services/multilingual-website/related-1-1486312338219-c.webp", "تصویر مرتبط 1 برای طراحی سایت چندزبانه — الوند مارکتینگ", 900, 599, "Glenn Carstens-Peters", "1486312338219-ce68d2c6f44d"),
    asset("images/services/multilingual-website/related-2-1497366216548-3.webp", "تصویر مرتبط 2 برای طراحی سایت چندزبانه — الوند مارکتینگ", 900, 601, "Nastuh Abootalebi", "1497366216548-37526070297c"),
    asset("images/services/multilingual-website/related-3-1522071820081-0.webp", "تصویر مرتبط 3 برای طراحی سایت چندزبانه — الوند مارکتینگ", 900, 600, "LinkedIn Sales Solutions", "1522071820081-009f0129c71c"),
  ],
};

const img_booking_website: ServiceImageSet = {
  featured: asset("images/services/booking-website/featured-1666214280557-f.webp", "تصویر شاخص طراحی سایت نوبت‌دهی — الوند مارکتینگ", 1200, 800, "Julian Myles", "1666214280557-f1b5022eb634"),
  related: [
    asset("images/services/booking-website/related-1-1576091160399-1.webp", "تصویر مرتبط 1 برای طراحی سایت نوبت‌دهی — الوند مارکتینگ", 900, 600, "National Cancer Institute", "1576091160399-112ba8d25d1d"),
    asset("images/services/booking-website/related-2-1556761175-5973.webp", "تصویر مرتبط 2 برای طراحی سایت نوبت‌دهی — الوند مارکتینگ", 900, 506, "Austin Distel", "1556761175-5973dc0f32e7"),
    asset("images/services/booking-website/related-3-1511707171634-5.webp", "تصویر مرتبط 3 برای طراحی سایت نوبت‌دهی — الوند مارکتینگ", 900, 900, "William Iven", "1511707171634-5f897ff02aa9"),
  ],
};

const img_news_website: ServiceImageSet = {
  featured: asset("images/services/news-website/featured-1504711434969-e.webp", "تصویر شاخص طراحی سایت خبری — الوند مارکتینگ", 1200, 800, "AbsolutVision", "1504711434969-e33886168f5c"),
  related: [
    asset("images/services/news-website/related-1-1455390582262-0.webp", "تصویر مرتبط 1 برای طراحی سایت خبری — الوند مارکتینگ", 900, 676, "Aaron Burden", "1455390582262-044cdead277a"),
    asset("images/services/news-website/related-2-1478737270239-2.webp", "تصویر مرتبط 2 برای طراحی سایت خبری — الوند مارکتینگ", 900, 600, "Jonathan Velasquez", "1478737270239-2f02b77fc618"),
    asset("images/services/news-website/related-3-1497366216548-3.webp", "تصویر مرتبط 3 برای طراحی سایت خبری — الوند مارکتینگ", 900, 601, "Nastuh Abootalebi", "1497366216548-37526070297c"),
  ],
};

const img_legal_website: ServiceImageSet = {
  featured: asset("images/services/legal-website/featured-1589829085413-5.webp", "تصویر شاخص طراحی سایت حقوقی — الوند مارکتینگ", 1200, 764, "Tingey Injury Law Firm", "1589829085413-56de8ae18c73"),
  related: [
    asset("images/services/legal-website/related-1-1497366216548-3.webp", "تصویر مرتبط 1 برای طراحی سایت حقوقی — الوند مارکتینگ", 900, 601, "Nastuh Abootalebi", "1497366216548-37526070297c"),
    asset("images/services/legal-website/related-2-1455390582262-0.webp", "تصویر مرتبط 2 برای طراحی سایت حقوقی — الوند مارکتینگ", 900, 676, "Aaron Burden", "1455390582262-044cdead277a"),
    asset("images/services/legal-website/related-3-1552664730-d307.webp", "تصویر مرتبط 3 برای طراحی سایت حقوقی — الوند مارکتینگ", 900, 600, "Campaign Creators", "1552664730-d307ca884978"),
  ],
};

const img_seo: ServiceImageSet = {
  featured: asset("images/services/seo/featured-1460925895917-a.webp", "تصویر شاخص سئو — الوند مارکتینگ", 1200, 855, "Luke Chesser", "1460925895917-afdab827c52f"),
  related: [
    asset("images/services/seo/related-1-1551288049-bebd.webp", "تصویر مرتبط 1 برای سئو — الوند مارکتینگ", 900, 600, "Luke Chesser", "1551288049-bebda4e38f71"),
    asset("images/services/seo/related-2-1486312338219-c.webp", "تصویر مرتبط 2 برای سئو — الوند مارکتینگ", 900, 599, "Glenn Carstens-Peters", "1486312338219-ce68d2c6f44d"),
    asset("images/services/seo/related-3-1451187580459-4.webp", "تصویر مرتبط 3 برای سئو — الوند مارکتینگ", 900, 599, "NASA", "1451187580459-43490279c0fa"),
  ],
};

const img_ecommerce_seo: ServiceImageSet = {
  featured: asset("images/services/ecommerce-seo/featured-1556742049-0cfe.webp", "تصویر شاخص سئو سایت فروشگاهی — الوند مارکتینگ", 1200, 801, "CardMapr.nl", "1556742049-0cfed4f6a45d"),
  related: [
    asset("images/services/ecommerce-seo/related-1-1460925895917-a.webp", "تصویر مرتبط 1 برای سئو سایت فروشگاهی — الوند مارکتینگ", 900, 641, "Luke Chesser", "1460925895917-afdab827c52f"),
    asset("images/services/ecommerce-seo/related-2-1551288049-bebd.webp", "تصویر مرتبط 2 برای سئو سایت فروشگاهی — الوند مارکتینگ", 900, 600, "Luke Chesser", "1551288049-bebda4e38f71"),
    asset("images/services/ecommerce-seo/related-3-1511707171634-5.webp", "تصویر مرتبط 3 برای سئو سایت فروشگاهی — الوند مارکتینگ", 900, 900, "William Iven", "1511707171634-5f897ff02aa9"),
  ],
};

const img_medical_seo: ServiceImageSet = {
  featured: asset("images/services/medical-seo/featured-1576091160399-1.webp", "تصویر شاخص سئو پزشکی — الوند مارکتینگ", 1200, 800, "National Cancer Institute", "1576091160399-112ba8d25d1d"),
  related: [
    asset("images/services/medical-seo/related-1-1460925895917-a.webp", "تصویر مرتبط 1 برای سئو پزشکی — الوند مارکتینگ", 900, 641, "Luke Chesser", "1460925895917-afdab827c52f"),
    asset("images/services/medical-seo/related-2-1519494026892-8.webp", "تصویر مرتبط 2 برای سئو پزشکی — الوند مارکتینگ", 900, 613, "Martha Dominguez de Gouveia", "1519494026892-80bbd2d6fd0d"),
    asset("images/services/medical-seo/related-3-1551288049-bebd.webp", "تصویر مرتبط 3 برای سئو پزشکی — الوند مارکتینگ", 900, 600, "Luke Chesser", "1551288049-bebda4e38f71"),
  ],
};

const img_international_seo: ServiceImageSet = {
  featured: asset("images/services/international-seo/featured-1451187580459-4.webp", "تصویر شاخص سئو بین‌المللی — الوند مارکتینگ", 1200, 798, "NASA", "1451187580459-43490279c0fa"),
  related: [
    asset("images/services/international-seo/related-1-1460925895917-a.webp", "تصویر مرتبط 1 برای سئو بین‌المللی — الوند مارکتینگ", 900, 641, "Luke Chesser", "1460925895917-afdab827c52f"),
    asset("images/services/international-seo/related-2-1488646953014-8.webp", "تصویر مرتبط 2 برای سئو بین‌المللی — الوند مارکتینگ", 900, 711, "Josh Hild", "1488646953014-85cb44e25828"),
    asset("images/services/international-seo/related-3-1551288049-bebd.webp", "تصویر مرتبط 3 برای سئو بین‌المللی — الوند مارکتینگ", 900, 600, "Luke Chesser", "1551288049-bebda4e38f71"),
  ],
};

const img_content_marketing: ServiceImageSet = {
  featured: asset("images/services/content-marketing/featured-1455390582262-0.webp", "تصویر شاخص تولید محتوا — الوند مارکتینگ", 1200, 901, "Aaron Burden", "1455390582262-044cdead277a"),
  related: [
    asset("images/services/content-marketing/related-1-1486312338219-c.webp", "تصویر مرتبط 1 برای تولید محتوا — الوند مارکتینگ", 900, 599, "Glenn Carstens-Peters", "1486312338219-ce68d2c6f44d"),
    asset("images/services/content-marketing/related-2-1517245386807-b.webp", "تصویر مرتبط 2 برای تولید محتوا — الوند مارکتینگ", 900, 600, "Headway", "1517245386807-bb43f82c33c4"),
    asset("images/services/content-marketing/related-3-1478737270239-2.webp", "تصویر مرتبط 3 برای تولید محتوا — الوند مارکتینگ", 900, 600, "Jonathan Velasquez", "1478737270239-2f02b77fc618"),
  ],
};

const img_video_content: ServiceImageSet = {
  featured: asset("images/services/video-content/featured-1574717024653-6.webp", "تصویر شاخص تولید محتوا ویدیویی — الوند مارکتینگ", 1200, 800, "Jakob Owens", "1574717024653-61fd2cf4d44d"),
  related: [
    asset("images/services/video-content/related-1-1478737270239-2.webp", "تصویر مرتبط 1 برای تولید محتوا ویدیویی — الوند مارکتینگ", 900, 600, "Jonathan Velasquez", "1478737270239-2f02b77fc618"),
    asset("images/services/video-content/related-2-1611162616305-c.webp", "تصویر مرتبط 2 برای تولید محتوا ویدیویی — الوند مارکتینگ", 900, 675, "Souvik Banerjee", "1611162616305-c69b3fa7fbe0"),
    asset("images/services/video-content/related-3-1511707171634-5.webp", "تصویر مرتبط 3 برای تولید محتوا ویدیویی — الوند مارکتینگ", 900, 900, "William Iven", "1511707171634-5f897ff02aa9"),
  ],
};

const img_online_ads: ServiceImageSet = {
  featured: asset("images/services/online-ads/featured-1533750349088-c.webp", "تصویر شاخص تبلیغات اینترنتی — الوند مارکتینگ", 1200, 800, "Stephen Dawson", "1533750349088-cd871a92f312"),
  related: [
    asset("images/services/online-ads/related-1-1557804506-669a.webp", "تصویر مرتبط 1 برای تبلیغات اینترنتی — الوند مارکتینگ", 900, 675, "Austin Distel", "1557804506-669a67965ba0"),
    asset("images/services/online-ads/related-2-1551288049-bebd.webp", "تصویر مرتبط 2 برای تبلیغات اینترنتی — الوند مارکتینگ", 900, 600, "Luke Chesser", "1551288049-bebda4e38f71"),
    asset("images/services/online-ads/related-3-1460925895917-a.webp", "تصویر مرتبط 3 برای تبلیغات اینترنتی — الوند مارکتینگ", 900, 641, "Luke Chesser", "1460925895917-afdab827c52f"),
  ],
};

const img_banner_ads: ServiceImageSet = {
  featured: asset("images/services/banner-ads/featured-1533750349088-c.webp", "تصویر شاخص تبلیغات بنری — الوند مارکتینگ", 1200, 800, "Stephen Dawson", "1533750349088-cd871a92f312"),
  related: [
    asset("images/services/banner-ads/related-1-1557804506-669a.webp", "تصویر مرتبط 1 برای تبلیغات بنری — الوند مارکتینگ", 900, 675, "Austin Distel", "1557804506-669a67965ba0"),
    asset("images/services/banner-ads/related-2-1460925895917-a.webp", "تصویر مرتبط 2 برای تبلیغات بنری — الوند مارکتینگ", 900, 641, "Luke Chesser", "1460925895917-afdab827c52f"),
    asset("images/services/banner-ads/related-3-1551288049-bebd.webp", "تصویر مرتبط 3 برای تبلیغات بنری — الوند مارکتینگ", 900, 600, "Luke Chesser", "1551288049-bebda4e38f71"),
  ],
};

const img_sponsored_content: ServiceImageSet = {
  featured: asset("images/services/sponsored-content/featured-1504711434969-e.webp", "تصویر شاخص رپورتاژ آگهی — الوند مارکتینگ", 1200, 800, "AbsolutVision", "1504711434969-e33886168f5c"),
  related: [
    asset("images/services/sponsored-content/related-1-1455390582262-0.webp", "تصویر مرتبط 1 برای رپورتاژ آگهی — الوند مارکتینگ", 900, 676, "Aaron Burden", "1455390582262-044cdead277a"),
    asset("images/services/sponsored-content/related-2-1557804506-669a.webp", "تصویر مرتبط 2 برای رپورتاژ آگهی — الوند مارکتینگ", 900, 675, "Austin Distel", "1557804506-669a67965ba0"),
    asset("images/services/sponsored-content/related-3-1460925895917-a.webp", "تصویر مرتبط 3 برای رپورتاژ آگهی — الوند مارکتینگ", 900, 641, "Luke Chesser", "1460925895917-afdab827c52f"),
  ],
};

const img_push_notifications: ServiceImageSet = {
  featured: asset("images/services/push-notifications/featured-1511707171634-5.webp", "تصویر شاخص پوش نوتیفیکیشن — الوند مارکتینگ", 1200, 1200, "William Iven", "1511707171634-5f897ff02aa9"),
  related: [
    asset("images/services/push-notifications/related-1-1551650975-87de.webp", "تصویر مرتبط 1 برای پوش نوتیفیکیشن — الوند مارکتینگ", 900, 675, "Ashutosh Gawali", "1551650975-87deedd944c3"),
    asset("images/services/push-notifications/related-2-1611162616305-c.webp", "تصویر مرتبط 2 برای پوش نوتیفیکیشن — الوند مارکتینگ", 900, 675, "Souvik Banerjee", "1611162616305-c69b3fa7fbe0"),
    asset("images/services/push-notifications/related-3-1551288049-bebd.webp", "تصویر مرتبط 3 برای پوش نوتیفیکیشن — الوند مارکتینگ", 900, 600, "Luke Chesser", "1551288049-bebda4e38f71"),
  ],
};

const img_social_ads: ServiceImageSet = {
  featured: asset("images/services/social-ads/featured-1611162616305-c.webp", "تصویر شاخص تبلیغات شبکه‌های اجتماعی — الوند مارکتینگ", 1200, 900, "Souvik Banerjee", "1611162616305-c69b3fa7fbe0"),
  related: [
    asset("images/services/social-ads/related-1-1557804506-669a.webp", "تصویر مرتبط 1 برای تبلیغات شبکه‌های اجتماعی — الوند مارکتینگ", 900, 675, "Austin Distel", "1557804506-669a67965ba0"),
    asset("images/services/social-ads/related-2-1511707171634-5.webp", "تصویر مرتبط 2 برای تبلیغات شبکه‌های اجتماعی — الوند مارکتینگ", 900, 900, "William Iven", "1511707171634-5f897ff02aa9"),
    asset("images/services/social-ads/related-3-1522071820081-0.webp", "تصویر مرتبط 3 برای تبلیغات شبکه‌های اجتماعی — الوند مارکتینگ", 900, 600, "LinkedIn Sales Solutions", "1522071820081-009f0129c71c"),
  ],
};

const img_social_media: ServiceImageSet = {
  featured: asset("images/services/social-media/featured-1611162616305-c.webp", "تصویر شاخص شبکه‌های اجتماعی — الوند مارکتینگ", 1200, 900, "Souvik Banerjee", "1611162616305-c69b3fa7fbe0"),
  related: [
    asset("images/services/social-media/related-1-1522071820081-0.webp", "تصویر مرتبط 1 برای شبکه‌های اجتماعی — الوند مارکتینگ", 900, 600, "LinkedIn Sales Solutions", "1522071820081-009f0129c71c"),
    asset("images/services/social-media/related-2-1511707171634-5.webp", "تصویر مرتبط 2 برای شبکه‌های اجتماعی — الوند مارکتینگ", 900, 900, "William Iven", "1511707171634-5f897ff02aa9"),
    asset("images/services/social-media/related-3-1517245386807-b.webp", "تصویر مرتبط 3 برای شبکه‌های اجتماعی — الوند مارکتینگ", 900, 600, "Headway", "1517245386807-bb43f82c33c4"),
  ],
};

const img_artificial_intelligence: ServiceImageSet = {
  featured: asset("images/services/artificial-intelligence/featured-1677442136019-2.webp", "تصویر شاخص هوش مصنوعی — الوند مارکتینگ", 1200, 675, "Growtika", "1677442136019-21780ecad995"),
  related: [
    asset("images/services/artificial-intelligence/related-1-1620712943543-b.webp", "تصویر مرتبط 1 برای هوش مصنوعی — الوند مارکتینگ", 900, 1125, "Possessed Photography", "1620712943543-bcc4688e7485"),
    asset("images/services/artificial-intelligence/related-2-1461749280684-d.webp", "تصویر مرتبط 2 برای هوش مصنوعی — الوند مارکتینگ", 900, 601, "Mohammad Rahmani", "1461749280684-dccba630e2f6"),
    asset("images/services/artificial-intelligence/related-3-1555949963-aa79.webp", "تصویر مرتبط 3 برای هوش مصنوعی — الوند مارکتینگ", 900, 600, "Fotis Fotopoulos", "1555949963-aa79dcee981c"),
  ],
};

const img_email_marketing: ServiceImageSet = {
  featured: asset("images/services/email-marketing/featured-1556761175-b413.webp", "تصویر شاخص ایمیل مارکتینگ — الوند مارکتینگ", 1200, 900, "Austin Distel", "1556761175-b413da4baf72"),
  related: [
    asset("images/services/email-marketing/related-1-1551288049-bebd.webp", "تصویر مرتبط 1 برای ایمیل مارکتینگ — الوند مارکتینگ", 900, 600, "Luke Chesser", "1551288049-bebda4e38f71"),
    asset("images/services/email-marketing/related-2-1486312338219-c.webp", "تصویر مرتبط 2 برای ایمیل مارکتینگ — الوند مارکتینگ", 900, 599, "Glenn Carstens-Peters", "1486312338219-ce68d2c6f44d"),
    asset("images/services/email-marketing/related-3-1460925895917-a.webp", "تصویر مرتبط 3 برای ایمیل مارکتینگ — الوند مارکتینگ", 900, 641, "Luke Chesser", "1460925895917-afdab827c52f"),
  ],
};

const img_analytics: ServiceImageSet = {
  featured: asset("images/services/analytics/featured-1460925895917-a.webp", "تصویر شاخص ابزارهای آنالیتیکس — الوند مارکتینگ", 1200, 855, "Luke Chesser", "1460925895917-afdab827c52f"),
  related: [
    asset("images/services/analytics/related-1-1551288049-bebd.webp", "تصویر مرتبط 1 برای ابزارهای آنالیتیکس — الوند مارکتینگ", 900, 600, "Luke Chesser", "1551288049-bebda4e38f71"),
    asset("images/services/analytics/related-2-1555949963-aa79.webp", "تصویر مرتبط 2 برای ابزارهای آنالیتیکس — الوند مارکتینگ", 900, 600, "Fotis Fotopoulos", "1555949963-aa79dcee981c"),
    asset("images/services/analytics/related-3-1454165804606-c.webp", "تصویر مرتبط 3 برای ابزارهای آنالیتیکس — الوند مارکتینگ", 900, 600, "Scott Graham", "1454165804606-c3d57bc86b40"),
  ],
};

const img_google_analytics: ServiceImageSet = {
  featured: asset("images/services/google-analytics/featured-1460925895917-a.webp", "تصویر شاخص گوگل آنالیتیکس — الوند مارکتینگ", 1200, 855, "Luke Chesser", "1460925895917-afdab827c52f"),
  related: [
    asset("images/services/google-analytics/related-1-1551288049-bebd.webp", "تصویر مرتبط 1 برای گوگل آنالیتیکس — الوند مارکتینگ", 900, 600, "Luke Chesser", "1551288049-bebda4e38f71"),
    asset("images/services/google-analytics/related-2-1486312338219-c.webp", "تصویر مرتبط 2 برای گوگل آنالیتیکس — الوند مارکتینگ", 900, 599, "Glenn Carstens-Peters", "1486312338219-ce68d2c6f44d"),
    asset("images/services/google-analytics/related-3-1555949963-aa79.webp", "تصویر مرتبط 3 برای گوگل آنالیتیکس — الوند مارکتینگ", 900, 600, "Fotis Fotopoulos", "1555949963-aa79dcee981c"),
  ],
};

const img_google_tag_manager: ServiceImageSet = {
  featured: asset("images/services/google-tag-manager/featured-1461749280684-d.webp", "تصویر شاخص گوگل تگ منیجر — الوند مارکتینگ", 1200, 801, "Mohammad Rahmani", "1461749280684-dccba630e2f6"),
  related: [
    asset("images/services/google-tag-manager/related-1-1555066931-4365.webp", "تصویر مرتبط 1 برای گوگل تگ منیجر — الوند مارکتینگ", 900, 600, "Fotis Fotopoulos", "1555066931-4365d14bab8c"),
    asset("images/services/google-tag-manager/related-2-1460925895917-a.webp", "تصویر مرتبط 2 برای گوگل تگ منیجر — الوند مارکتینگ", 900, 641, "Luke Chesser", "1460925895917-afdab827c52f"),
    asset("images/services/google-tag-manager/related-3-1517694712202-1.webp", "تصویر مرتبط 3 برای گوگل تگ منیجر — الوند مارکتینگ", 900, 600, "Lee Campbell", "1517694712202-14dd9538aa97"),
  ],
};

const img_search_console: ServiceImageSet = {
  featured: asset("images/services/search-console/featured-1460925895917-a.webp", "تصویر شاخص سرچ کنسول — الوند مارکتینگ", 1200, 855, "Luke Chesser", "1460925895917-afdab827c52f"),
  related: [
    asset("images/services/search-console/related-1-1486312338219-c.webp", "تصویر مرتبط 1 برای سرچ کنسول — الوند مارکتینگ", 900, 599, "Glenn Carstens-Peters", "1486312338219-ce68d2c6f44d"),
    asset("images/services/search-console/related-2-1451187580459-4.webp", "تصویر مرتبط 2 برای سرچ کنسول — الوند مارکتینگ", 900, 599, "NASA", "1451187580459-43490279c0fa"),
    asset("images/services/search-console/related-3-1551288049-bebd.webp", "تصویر مرتبط 3 برای سرچ کنسول — الوند مارکتینگ", 900, 600, "Luke Chesser", "1551288049-bebda4e38f71"),
  ],
};

const img_website_support: ServiceImageSet = {
  featured: asset("images/services/website-support/featured-1558494949-ef01.webp", "تصویر شاخص پشتیبانی سایت — الوند مارکتینگ", 1200, 673, "Taylor Vick", "1558494949-ef010cbdcc31"),
  related: [
    asset("images/services/website-support/related-1-1581092160562-4.webp", "تصویر مرتبط 1 برای پشتیبانی سایت — الوند مارکتینگ", 900, 600, "ThisisEngineering", "1581092160562-40aa08e78837"),
    asset("images/services/website-support/related-2-1555949963-aa79.webp", "تصویر مرتبط 2 برای پشتیبانی سایت — الوند مارکتینگ", 900, 600, "Fotis Fotopoulos", "1555949963-aa79dcee981c"),
    asset("images/services/website-support/related-3-1497366216548-3.webp", "تصویر مرتبط 3 برای پشتیبانی سایت — الوند مارکتینگ", 900, 601, "Nastuh Abootalebi", "1497366216548-37526070297c"),
  ],
};

const img_site_speed: ServiceImageSet = {
  featured: asset("images/services/site-speed/featured-1558494949-ef01.webp", "تصویر شاخص افزایش سرعت سایت — الوند مارکتینگ", 1200, 673, "Taylor Vick", "1558494949-ef010cbdcc31"),
  related: [
    asset("images/services/site-speed/related-1-1555949963-aa79.webp", "تصویر مرتبط 1 برای افزایش سرعت سایت — الوند مارکتینگ", 900, 600, "Fotis Fotopoulos", "1555949963-aa79dcee981c"),
    asset("images/services/site-speed/related-2-1461749280684-d.webp", "تصویر مرتبط 2 برای افزایش سرعت سایت — الوند مارکتینگ", 900, 601, "Mohammad Rahmani", "1461749280684-dccba630e2f6"),
    asset("images/services/site-speed/related-3-1551288049-bebd.webp", "تصویر مرتبط 3 برای افزایش سرعت سایت — الوند مارکتینگ", 900, 600, "Luke Chesser", "1551288049-bebda4e38f71"),
  ],
};

const img_site_security: ServiceImageSet = {
  featured: asset("images/services/site-security/featured-1563986768609-3.webp", "تصویر شاخص امنیت سایت — الوند مارکتینگ", 1200, 800, "FlyD", "1563986768609-322da13575f3"),
  related: [
    asset("images/services/site-security/related-1-1558494949-ef01.webp", "تصویر مرتبط 1 برای امنیت سایت — الوند مارکتینگ", 900, 505, "Taylor Vick", "1558494949-ef010cbdcc31"),
    asset("images/services/site-security/related-2-1555949963-aa79.webp", "تصویر مرتبط 2 برای امنیت سایت — الوند مارکتینگ", 900, 600, "Fotis Fotopoulos", "1555949963-aa79dcee981c"),
    asset("images/services/site-security/related-3-1516321318423-f.webp", "تصویر مرتبط 3 برای امنیت سایت — الوند مارکتینگ", 900, 600, "Christin Hume", "1516321318423-f06f85e504b3"),
  ],
};

const img_site_monitoring: ServiceImageSet = {
  featured: asset("images/services/site-monitoring/featured-1555949963-aa79.webp", "تصویر شاخص مانیتورینگ سایت — الوند مارکتینگ", 1200, 800, "Fotis Fotopoulos", "1555949963-aa79dcee981c"),
  related: [
    asset("images/services/site-monitoring/related-1-1460925895917-a.webp", "تصویر مرتبط 1 برای مانیتورینگ سایت — الوند مارکتینگ", 900, 641, "Luke Chesser", "1460925895917-afdab827c52f"),
    asset("images/services/site-monitoring/related-2-1558494949-ef01.webp", "تصویر مرتبط 2 برای مانیتورینگ سایت — الوند مارکتینگ", 900, 505, "Taylor Vick", "1558494949-ef010cbdcc31"),
    asset("images/services/site-monitoring/related-3-1551288049-bebd.webp", "تصویر مرتبط 3 برای مانیتورینگ سایت — الوند مارکتینگ", 900, 600, "Luke Chesser", "1551288049-bebda4e38f71"),
  ],
};

const img_wordpress_plugins: ServiceImageSet = {
  featured: asset("images/services/wordpress-plugins/featured-1517694712202-1.webp", "تصویر شاخص نصب قالب و افزونه وردپرس — الوند مارکتینگ", 1200, 800, "Lee Campbell", "1517694712202-14dd9538aa97"),
  related: [
    asset("images/services/wordpress-plugins/related-1-1486312338219-c.webp", "تصویر مرتبط 1 برای نصب قالب و افزونه وردپرس — الوند مارکتینگ", 900, 599, "Glenn Carstens-Peters", "1486312338219-ce68d2c6f44d"),
    asset("images/services/wordpress-plugins/related-2-1461749280684-d.webp", "تصویر مرتبط 2 برای نصب قالب و افزونه وردپرس — الوند مارکتینگ", 900, 601, "Mohammad Rahmani", "1461749280684-dccba630e2f6"),
    asset("images/services/wordpress-plugins/related-3-1498050108023-c.webp", "تصویر مرتبط 3 برای نصب قالب و افزونه وردپرس — الوند مارکتینگ", 900, 599, "Christopher Gower", "1498050108023-c5249f4df085"),
  ],
};

const img_site_error_fix: ServiceImageSet = {
  featured: asset("images/services/site-error-fix/featured-1581092160562-4.webp", "تصویر شاخص رفع ارور سایت — الوند مارکتینگ", 1200, 800, "ThisisEngineering", "1581092160562-40aa08e78837"),
  related: [
    asset("images/services/site-error-fix/related-1-1461749280684-d.webp", "تصویر مرتبط 1 برای رفع ارور سایت — الوند مارکتینگ", 900, 601, "Mohammad Rahmani", "1461749280684-dccba630e2f6"),
    asset("images/services/site-error-fix/related-2-1558494949-ef01.webp", "تصویر مرتبط 2 برای رفع ارور سایت — الوند مارکتینگ", 900, 505, "Taylor Vick", "1558494949-ef010cbdcc31"),
    asset("images/services/site-error-fix/related-3-1555949963-aa79.webp", "تصویر مرتبط 3 برای رفع ارور سایت — الوند مارکتینگ", 900, 600, "Fotis Fotopoulos", "1555949963-aa79dcee981c"),
  ],
};

const img_malware_cleanup: ServiceImageSet = {
  featured: asset("images/services/malware-cleanup/featured-1563986768609-3.webp", "تصویر شاخص پاکسازی سایت هک‌شده — الوند مارکتینگ", 1200, 800, "FlyD", "1563986768609-322da13575f3"),
  related: [
    asset("images/services/malware-cleanup/related-1-1558494949-ef01.webp", "تصویر مرتبط 1 برای پاکسازی سایت هک‌شده — الوند مارکتینگ", 900, 505, "Taylor Vick", "1558494949-ef010cbdcc31"),
    asset("images/services/malware-cleanup/related-2-1581092160562-4.webp", "تصویر مرتبط 2 برای پاکسازی سایت هک‌شده — الوند مارکتینگ", 900, 600, "ThisisEngineering", "1581092160562-40aa08e78837"),
    asset("images/services/malware-cleanup/related-3-1555949963-aa79.webp", "تصویر مرتبط 3 برای پاکسازی سایت هک‌شده — الوند مارکتینگ", 900, 600, "Fotis Fotopoulos", "1555949963-aa79dcee981c"),
  ],
};

const img_ecommerce_support: ServiceImageSet = {
  featured: asset("images/services/ecommerce-support/featured-1556742049-0cfe.webp", "تصویر شاخص پشتیبانی سایت فروشگاهی — الوند مارکتینگ", 1200, 801, "CardMapr.nl", "1556742049-0cfed4f6a45d"),
  related: [
    asset("images/services/ecommerce-support/related-1-1558494949-ef01.webp", "تصویر مرتبط 1 برای پشتیبانی سایت فروشگاهی — الوند مارکتینگ", 900, 505, "Taylor Vick", "1558494949-ef010cbdcc31"),
    asset("images/services/ecommerce-support/related-2-1581092160562-4.webp", "تصویر مرتبط 2 برای پشتیبانی سایت فروشگاهی — الوند مارکتینگ", 900, 600, "ThisisEngineering", "1581092160562-40aa08e78837"),
    asset("images/services/ecommerce-support/related-3-1497366216548-3.webp", "تصویر مرتبط 3 برای پشتیبانی سایت فروشگاهی — الوند مارکتینگ", 900, 601, "Nastuh Abootalebi", "1497366216548-37526070297c"),
  ],
};

const img_mobile_app: ServiceImageSet = {
  featured: asset("images/services/mobile-app/featured-1511707171634-5.webp", "تصویر شاخص طراحی و ساخت اپلیکیشن — الوند مارکتینگ", 1200, 1200, "William Iven", "1511707171634-5f897ff02aa9"),
  related: [
    asset("images/services/mobile-app/related-1-1551650975-87de.webp", "تصویر مرتبط 1 برای طراحی و ساخت اپلیکیشن — الوند مارکتینگ", 900, 675, "Ashutosh Gawali", "1551650975-87deedd944c3"),
    asset("images/services/mobile-app/related-2-1559028012-481c.webp", "تصویر مرتبط 2 برای طراحی و ساخت اپلیکیشن — الوند مارکتینگ", 900, 710, "UX Indonesia", "1559028012-481c04fa702d"),
    asset("images/services/mobile-app/related-3-1581291518857-4.webp", "تصویر مرتبط 3 برای طراحی و ساخت اپلیکیشن — الوند مارکتینگ", 900, 600, "Sigmund", "1581291518857-4e27b48ff24e"),
  ],
};

const img_web_application: ServiceImageSet = {
  featured: asset("images/services/web-application/featured-1551650975-87de.webp", "تصویر شاخص وب اپلیکیشن — الوند مارکتینگ", 1200, 900, "Ashutosh Gawali", "1551650975-87deedd944c3"),
  related: [
    asset("images/services/web-application/related-1-1461749280684-d.webp", "تصویر مرتبط 1 برای وب اپلیکیشن — الوند مارکتینگ", 900, 601, "Mohammad Rahmani", "1461749280684-dccba630e2f6"),
    asset("images/services/web-application/related-2-1555066931-4365.webp", "تصویر مرتبط 2 برای وب اپلیکیشن — الوند مارکتینگ", 900, 600, "Fotis Fotopoulos", "1555066931-4365d14bab8c"),
    asset("images/services/web-application/related-3-1511707171634-5.webp", "تصویر مرتبط 3 برای وب اپلیکیشن — الوند مارکتینگ", 900, 900, "William Iven", "1511707171634-5f897ff02aa9"),
  ],
};

const img_ecommerce_app: ServiceImageSet = {
  featured: asset("images/services/ecommerce-app/featured-1556742049-0cfe.webp", "تصویر شاخص طراحی اپلیکیشن فروشگاهی — الوند مارکتینگ", 1200, 801, "CardMapr.nl", "1556742049-0cfed4f6a45d"),
  related: [
    asset("images/services/ecommerce-app/related-1-1511707171634-5.webp", "تصویر مرتبط 1 برای طراحی اپلیکیشن فروشگاهی — الوند مارکتینگ", 900, 900, "William Iven", "1511707171634-5f897ff02aa9"),
    asset("images/services/ecommerce-app/related-2-1551650975-87de.webp", "تصویر مرتبط 2 برای طراحی اپلیکیشن فروشگاهی — الوند مارکتینگ", 900, 675, "Ashutosh Gawali", "1551650975-87deedd944c3"),
    asset("images/services/ecommerce-app/related-3-1551288049-bebd.webp", "تصویر مرتبط 3 برای طراحی اپلیکیشن فروشگاهی — الوند مارکتینگ", 900, 600, "Luke Chesser", "1551288049-bebda4e38f71"),
  ],
};

const img_api_integration: ServiceImageSet = {
  featured: asset("images/services/api-integration/featured-1555066931-4365.webp", "تصویر شاخص API و یکپارچه‌سازی — الوند مارکتینگ", 1200, 800, "Fotis Fotopoulos", "1555066931-4365d14bab8c"),
  related: [
    asset("images/services/api-integration/related-1-1516321318423-f.webp", "تصویر مرتبط 1 برای API و یکپارچه‌سازی — الوند مارکتینگ", 900, 600, "Christin Hume", "1516321318423-f06f85e504b3"),
    asset("images/services/api-integration/related-2-1461749280684-d.webp", "تصویر مرتبط 2 برای API و یکپارچه‌سازی — الوند مارکتینگ", 900, 601, "Mohammad Rahmani", "1461749280684-dccba630e2f6"),
    asset("images/services/api-integration/related-3-1558494949-ef01.webp", "تصویر مرتبط 3 برای API و یکپارچه‌سازی — الوند مارکتینگ", 900, 505, "Taylor Vick", "1558494949-ef010cbdcc31"),
  ],
};

const img_digital_consulting: ServiceImageSet = {
  featured: asset("images/services/digital-consulting/featured-1552664730-d307.webp", "تصویر شاخص مشاوره دیجیتال مارکتینگ — الوند مارکتینگ", 1200, 800, "Campaign Creators", "1552664730-d307ca884978"),
  related: [
    asset("images/services/digital-consulting/related-1-1556761175-5973.webp", "تصویر مرتبط 1 برای مشاوره دیجیتال مارکتینگ — الوند مارکتینگ", 900, 506, "Austin Distel", "1556761175-5973dc0f32e7"),
    asset("images/services/digital-consulting/related-2-1454165804606-c.webp", "تصویر مرتبط 2 برای مشاوره دیجیتال مارکتینگ — الوند مارکتینگ", 900, 600, "Scott Graham", "1454165804606-c3d57bc86b40"),
    asset("images/services/digital-consulting/related-3-1517245386807-b.webp", "تصویر مرتبط 3 برای مشاوره دیجیتال مارکتینگ — الوند مارکتینگ", 900, 600, "Headway", "1517245386807-bb43f82c33c4"),
  ],
};

const img_branding: ServiceImageSet = {
  featured: asset("images/services/branding/featured-1600880292203-7.webp", "تصویر شاخص برندینگ و هویت بصری — الوند مارکتینگ", 1200, 800, "Austin Distel", "1600880292203-757bb62b4baf"),
  related: [
    asset("images/services/branding/related-1-1581291518857-4.webp", "تصویر مرتبط 1 برای برندینگ و هویت بصری — الوند مارکتینگ", 900, 600, "Sigmund", "1581291518857-4e27b48ff24e"),
    asset("images/services/branding/related-2-1559028012-481c.webp", "تصویر مرتبط 2 برای برندینگ و هویت بصری — الوند مارکتینگ", 900, 710, "UX Indonesia", "1559028012-481c04fa702d"),
    asset("images/services/branding/related-3-1517245386807-b.webp", "تصویر مرتبط 3 برای برندینگ و هویت بصری — الوند مارکتینگ", 900, 600, "Headway", "1517245386807-bb43f82c33c4"),
  ],
};

const img_instagram_management: ServiceImageSet = {
  featured: asset("images/services/instagram-management/featured-1611162616305-c.webp", "تصویر شاخص مدیریت اینستاگرام — الوند مارکتینگ", 1200, 900, "Souvik Banerjee", "1611162616305-c69b3fa7fbe0"),
  related: [
    asset("images/services/instagram-management/related-1-1511707171634-5.webp", "تصویر مرتبط 1 برای مدیریت اینستاگرام — الوند مارکتینگ", 900, 900, "William Iven", "1511707171634-5f897ff02aa9"),
    asset("images/services/instagram-management/related-2-1574717024653-6.webp", "تصویر مرتبط 2 برای مدیریت اینستاگرام — الوند مارکتینگ", 900, 600, "Jakob Owens", "1574717024653-61fd2cf4d44d"),
    asset("images/services/instagram-management/related-3-1522071820081-0.webp", "تصویر مرتبط 3 برای مدیریت اینستاگرام — الوند مارکتینگ", 900, 600, "LinkedIn Sales Solutions", "1522071820081-009f0129c71c"),
  ],
};

const img_linkedin_management: ServiceImageSet = {
  featured: asset("images/services/linkedin-management/featured-1521737711867-e.webp", "تصویر شاخص مدیریت لینکدین — الوند مارکتینگ", 1200, 1799, "LinkedIn Sales Solutions", "1521737711867-e3b97375f902"),
  related: [
    asset("images/services/linkedin-management/related-1-1522071820081-0.webp", "تصویر مرتبط 1 برای مدیریت لینکدین — الوند مارکتینگ", 900, 600, "LinkedIn Sales Solutions", "1522071820081-009f0129c71c"),
    asset("images/services/linkedin-management/related-2-1497366216548-3.webp", "تصویر مرتبط 2 برای مدیریت لینکدین — الوند مارکتینگ", 900, 601, "Nastuh Abootalebi", "1497366216548-37526070297c"),
    asset("images/services/linkedin-management/related-3-1552664730-d307.webp", "تصویر مرتبط 3 برای مدیریت لینکدین — الوند مارکتینگ", 900, 600, "Campaign Creators", "1552664730-d307ca884978"),
  ],
};

export const serviceImagesBySlug: Record<string, ServiceImageSet> = {
  "طراحی-سایت": img_website_design,
  "طراحی-سایت/وردپرس": img_wordpress_website,
  "طراحی-سایت/پزشکی": img_medical_website,
  "طراحی-سایت/لندینگ-پیج": img_landing_page,
  "طراحی-سایت/رستوران": img_restaurant_website,
  "طراحی-سایت/املاک": img_real_estate_website,
  "طراحی-سایت/آموزشی": img_education_website,
  "طراحی-سایت/صنعتی": img_industrial_website,
  "طراحی-سایت/دندانپزشکی": img_dental_website,
  "طراحی-سایت/کلینیک-زیبایی": img_beauty_clinic_website,
  "طراحی-سایت/خدماتی": img_services_website,
  "طراحی-سایت/گردشگری": img_tourism_website,
  "طراحی-سایت/وردپرس/مهاجرت": img_wordpress_migration,
  "طراحی-سایت/چندزبانه": img_multilingual_website,
  "طراحی-سایت/نوبت-دهی": img_booking_website,
  "طراحی-سایت/خبری": img_news_website,
  "طراحی-سایت/حقوقی": img_legal_website,
  "سئو": img_seo,
  "سئو/فروشگاهی": img_ecommerce_seo,
  "سئو/پزشکی": img_medical_seo,
  "سئو/بین-المللی": img_international_seo,
  "تولید-محتوا": img_content_marketing,
  "تولید-محتوا/ویدیویی": img_video_content,
  "تبلیغات-اینترنتی": img_online_ads,
  "تبلیغات-اینترنتی/بنری": img_banner_ads,
  "تبلیغات-اینترنتی/رپورتاژ-آگهی": img_sponsored_content,
  "تبلیغات-اینترنتی/پوش-نوتیفیکیشن": img_push_notifications,
  "تبلیغات-اینترنتی/شبکه‌های-اجتماعی": img_social_ads,
  "شبکه‌های-اجتماعی": img_social_media,
  "هوش-مصنوعی": img_artificial_intelligence,
  "ایمیل-مارکتینگ": img_email_marketing,
  "آنالیتیکس": img_analytics,
  "آنالیتیکس/گوگل-آنالیتیکس": img_google_analytics,
  "آنالیتیکس/تگ-منیجر": img_google_tag_manager,
  "آنالیتیکس/سرچ-کنسول": img_search_console,
  "پشتیبانی-سایت": img_website_support,
  "پشتیبانی-سایت/افزایش-سرعت": img_site_speed,
  "پشتیبانی-سایت/امنیت": img_site_security,
  "پشتیبانی-سایت/مانیتورینگ": img_site_monitoring,
  "پشتیبانی-سایت/نصب-قالب-و-افزونه": img_wordpress_plugins,
  "پشتیبانی-سایت/رفع-ارور": img_site_error_fix,
  "پشتیبانی-سایت/امنیت/پاکسازی-هک": img_malware_cleanup,
  "پشتیبانی-سایت/فروشگاهی": img_ecommerce_support,
  "اپلیکیشن-و-وب-اپ": img_mobile_app,
  "اپلیکیشن-و-وب-اپ/وب-اپلیکیشن": img_web_application,
  "اپلیکیشن-و-وب-اپ/فروشگاهی": img_ecommerce_app,
  "ای‌پی‌آی-و-یکپارچه‌سازی": img_api_integration,
  "مشاوره-دیجیتال-مارکتینگ": img_digital_consulting,
  "برندینگ": img_branding,
  "اینستاگرام": img_instagram_management,
  "لینکدین": img_linkedin_management,
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
