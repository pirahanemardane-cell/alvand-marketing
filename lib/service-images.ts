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
    asset("images/services/wordpress-website/related-3-1559136555-9303.webp", "تصویر مرتبط 3 برای طراحی سایت وردپرس — الوند مارکتینگ", 900, 600, "Unsplash", "1559136555-9303baea8ebd"),
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
    asset("images/services/landing-page/related-2-1531482615713-2.webp", "تصویر مرتبط 2 برای طراحی لندینگ پیج — الوند مارکتینگ", 900, 600, "Unsplash", "1531482615713-2afd69097998"),
    asset("images/services/landing-page/related-3-1542744173-8e7e.webp", "تصویر مرتبط 3 برای طراحی لندینگ پیج — الوند مارکتینگ", 900, 600, "Unsplash", "1542744173-8e7e53415bb0"),
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
    asset("images/services/education-website/related-3-1553877522-4326.webp", "تصویر مرتبط 3 برای طراحی سایت آموزشی — الوند مارکتینگ", 900, 600, "Unsplash", "1553877522-43269d4ea984"),
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
    asset("images/services/dental-website/related-1-1573164713714-d.webp", "تصویر مرتبط 1 برای طراحی سایت دندانپزشکی — الوند مارکتینگ", 900, 601, "Unsplash", "1573164713714-d95e436ab8d6"),
    asset("images/services/dental-website/related-2-1551836022-d5d8.webp", "تصویر مرتبط 2 برای طراحی سایت دندانپزشکی — الوند مارکتینگ", 900, 600, "Unsplash", "1551836022-d5d88e9218df"),
    asset("images/services/dental-website/related-3-1504384308090-c.webp", "تصویر مرتبط 3 برای طراحی سایت دندانپزشکی — الوند مارکتینگ", 900, 600, "Unsplash", "1504384308090-c894fdcc538d"),
  ],
};

const img_beauty_clinic_website: ServiceImageSet = {
  featured: asset("images/services/beauty-clinic-website/featured-1540555700478-4.webp", "تصویر شاخص طراحی سایت کلینیک زیبایی — الوند مارکتینگ", 1200, 800, "Toa Heftiba", "1540555700478-4be289fbecef"),
  related: [
    asset("images/services/beauty-clinic-website/related-1-1550751827-4bd3.webp", "تصویر مرتبط 1 برای طراحی سایت کلینیک زیبایی — الوند مارکتینگ", 900, 601, "Unsplash", "1550751827-4bd374c3f58b"),
    asset("images/services/beauty-clinic-website/related-2-1518770660439-4.webp", "تصویر مرتبط 2 برای طراحی سایت کلینیک زیبایی — الوند مارکتینگ", 900, 600, "Unsplash", "1518770660439-4636190af475"),
    asset("images/services/beauty-clinic-website/related-3-1600880292203-7.webp", "تصویر مرتبط 3 برای طراحی سایت کلینیک زیبایی — الوند مارکتینگ", 900, 600, "Austin Distel", "1600880292203-757bb62b4baf"),
  ],
};

const img_services_website: ServiceImageSet = {
  featured: asset("images/services/services-website/featured-1467232004584-a.webp", "تصویر شاخص طراحی سایت خدماتی — الوند مارکتینگ", 1200, 801, "Unsplash", "1467232004584-a241de8bcf5d"),
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
  featured: asset("images/services/wordpress-migration/featured-1483058712412-4.webp", "تصویر شاخص مهاجرت سایت به وردپرس — الوند مارکتینگ", 1200, 800, "Unsplash", "1483058712412-4245e9b90334"),
  related: [
    asset("images/services/wordpress-migration/related-1-1499750310107-5.webp", "تصویر مرتبط 1 برای مهاجرت سایت به وردپرس — الوند مارکتینگ", 900, 600, "Unsplash", "1499750310107-5fef28a66643"),
    asset("images/services/wordpress-migration/related-2-1488590528505-9.webp", "تصویر مرتبط 2 برای مهاجرت سایت به وردپرس — الوند مارکتینگ", 900, 600, "Unsplash", "1488590528505-98d2b5aba04b"),
    asset("images/services/wordpress-migration/related-3-1517430816045-d.webp", "تصویر مرتبط 3 برای مهاجرت سایت به وردپرس — الوند مارکتینگ", 900, 600, "Unsplash", "1517430816045-df4b7de11d1d"),
  ],
};

const img_multilingual_website: ServiceImageSet = {
  featured: asset("images/services/multilingual-website/featured-1504639725590-3.webp", "تصویر شاخص طراحی سایت چندزبانه — الوند مارکتینگ", 1200, 900, "Unsplash", "1504639725590-34d0984388bd"),
  related: [
    asset("images/services/multilingual-website/related-1-1555949963-ff9f.webp", "تصویر مرتبط 1 برای طراحی سایت چندزبانه — الوند مارکتینگ", 900, 600, "Unsplash", "1555949963-ff9fe0c870eb"),
    asset("images/services/multilingual-website/related-2-1563013544-824a.webp", "تصویر مرتبط 2 برای طراحی سایت چندزبانه — الوند مارکتینگ", 900, 600, "Unsplash", "1563013544-824ae1b704d3"),
    asset("images/services/multilingual-website/related-3-1556740758-90de.webp", "تصویر مرتبط 3 برای طراحی سایت چندزبانه — الوند مارکتینگ", 900, 600, "Unsplash", "1556740758-90de374c12ad"),
  ],
};

const img_booking_website: ServiceImageSet = {
  featured: asset("images/services/booking-website/featured-1600880292089-9.webp", "تصویر شاخص طراحی سایت نوبت‌دهی — الوند مارکتینگ", 1200, 1800, "Unsplash", "1600880292089-90a7e086ee0c"),
  related: [
    asset("images/services/booking-website/related-1-1573496359142-b.webp", "تصویر مرتبط 1 برای طراحی سایت نوبت‌دهی — الوند مارکتینگ", 900, 1348, "Unsplash", "1573496359142-b8d87734a5a2"),
    asset("images/services/booking-website/related-2-1453928582365-b.webp", "تصویر مرتبط 2 برای طراحی سایت نوبت‌دهی — الوند مارکتینگ", 900, 599, "Unsplash", "1453928582365-b6ad33cbcf64"),
    asset("images/services/booking-website/related-3-1511707171634-5.webp", "تصویر مرتبط 3 برای طراحی سایت نوبت‌دهی — الوند مارکتینگ", 900, 900, "William Iven", "1511707171634-5f897ff02aa9"),
  ],
};

const img_news_website: ServiceImageSet = {
  featured: asset("images/services/news-website/featured-1504711434969-e.webp", "تصویر شاخص طراحی سایت خبری — الوند مارکتینگ", 1200, 800, "AbsolutVision", "1504711434969-e33886168f5c"),
  related: [
    asset("images/services/news-website/related-1-1556761175-4b46.webp", "تصویر مرتبط 1 برای طراحی سایت خبری — الوند مارکتینگ", 900, 675, "Unsplash", "1556761175-4b46a572b786"),
    asset("images/services/news-website/related-2-1478737270239-2.webp", "تصویر مرتبط 2 برای طراحی سایت خبری — الوند مارکتینگ", 900, 600, "Jonathan Velasquez", "1478737270239-2f02b77fc618"),
    asset("images/services/news-website/related-3-1531297484001-8.webp", "تصویر مرتبط 3 برای طراحی سایت خبری — الوند مارکتینگ", 900, 637, "Unsplash", "1531297484001-80022131f5a1"),
  ],
};

const img_legal_website: ServiceImageSet = {
  featured: asset("images/services/legal-website/featured-1589829085413-5.webp", "تصویر شاخص طراحی سایت حقوقی — الوند مارکتینگ", 1200, 764, "Tingey Injury Law Firm", "1589829085413-56de8ae18c73"),
  related: [
    asset("images/services/legal-website/related-1-1542744173-0533.webp", "تصویر مرتبط 1 برای طراحی سایت حقوقی — الوند مارکتینگ", 900, 651, "Unsplash", "1542744173-05336fcc7ad4"),
    asset("images/services/legal-website/related-2-1485827404703-8.webp", "تصویر مرتبط 2 برای طراحی سایت حقوقی — الوند مارکتینگ", 900, 600, "Unsplash", "1485827404703-89b55fcc595e"),
    asset("images/services/legal-website/related-3-1484788984921-0.webp", "تصویر مرتبط 3 برای طراحی سایت حقوقی — الوند مارکتینگ", 900, 560, "Unsplash", "1484788984921-03950022c9ef"),
  ],
};

const img_seo: ServiceImageSet = {
  featured: asset("images/services/seo/featured-1460925895917-a.webp", "تصویر شاخص سئو — الوند مارکتینگ", 1200, 855, "Luke Chesser", "1460925895917-afdab827c52f"),
  related: [
    asset("images/services/seo/related-1-1507679799987-c.webp", "تصویر مرتبط 1 برای سئو — الوند مارکتینگ", 900, 600, "Unsplash", "1507679799987-c73779587ccf"),
    asset("images/services/seo/related-2-1515378791036-0.webp", "تصویر مرتبط 2 برای سئو — الوند مارکتینگ", 900, 600, "Unsplash", "1515378791036-0648a3ef77b2"),
    asset("images/services/seo/related-3-1496171367470-9.webp", "تصویر مرتبط 3 برای سئو — الوند مارکتینگ", 900, 600, "Unsplash", "1496171367470-9ed9a91ea931"),
  ],
};

const img_ecommerce_seo: ServiceImageSet = {
  featured: asset("images/services/ecommerce-seo/featured-1556742049-0cfe.webp", "تصویر شاخص سئو سایت فروشگاهی — الوند مارکتینگ", 1200, 801, "CardMapr.nl", "1556742049-0cfed4f6a45d"),
  related: [
    asset("images/services/ecommerce-seo/related-1-p0.webp", "تصویر مرتبط 1 برای سئو سایت فروشگاهی — الوند مارکتینگ", 900, 603, "Alejandro Escamilla", "picsum-0"),
    asset("images/services/ecommerce-seo/related-2-p1.webp", "تصویر مرتبط 2 برای سئو سایت فروشگاهی — الوند مارکتینگ", 900, 603, "Alejandro Escamilla", "picsum-1"),
    asset("images/services/ecommerce-seo/related-3-p2.webp", "تصویر مرتبط 3 برای سئو سایت فروشگاهی — الوند مارکتینگ", 900, 603, "Alejandro Escamilla", "picsum-2"),
  ],
};

const img_medical_seo: ServiceImageSet = {
  featured: asset("images/services/medical-seo/featured-p3.webp", "تصویر شاخص سئو پزشکی — الوند مارکتینگ", 1200, 804, "Alejandro Escamilla", "picsum-3"),
  related: [
    asset("images/services/medical-seo/related-1-p4.webp", "تصویر مرتبط 1 برای سئو پزشکی — الوند مارکتینگ", 900, 603, "Alejandro Escamilla", "picsum-4"),
    asset("images/services/medical-seo/related-2-p5.webp", "تصویر مرتبط 2 برای سئو پزشکی — الوند مارکتینگ", 900, 603, "Alejandro Escamilla", "picsum-5"),
    asset("images/services/medical-seo/related-3-p6.webp", "تصویر مرتبط 3 برای سئو پزشکی — الوند مارکتینگ", 900, 603, "Alejandro Escamilla", "picsum-6"),
  ],
};

const img_international_seo: ServiceImageSet = {
  featured: asset("images/services/international-seo/featured-p7.webp", "تصویر شاخص سئو بین‌المللی — الوند مارکتینگ", 1200, 804, "Alejandro Escamilla", "picsum-7"),
  related: [
    asset("images/services/international-seo/related-1-p8.webp", "تصویر مرتبط 1 برای سئو بین‌المللی — الوند مارکتینگ", 900, 603, "Alejandro Escamilla", "picsum-8"),
    asset("images/services/international-seo/related-2-p9.webp", "تصویر مرتبط 2 برای سئو بین‌المللی — الوند مارکتینگ", 900, 603, "Alejandro Escamilla", "picsum-9"),
    asset("images/services/international-seo/related-3-p10.webp", "تصویر مرتبط 3 برای سئو بین‌المللی — الوند مارکتینگ", 900, 603, "Paul Jarvis", "picsum-10"),
  ],
};

const img_content_marketing: ServiceImageSet = {
  featured: asset("images/services/content-marketing/featured-p11.webp", "تصویر شاخص تولید محتوا — الوند مارکتینگ", 1200, 804, "Paul Jarvis", "picsum-11"),
  related: [
    asset("images/services/content-marketing/related-1-p12.webp", "تصویر مرتبط 1 برای تولید محتوا — الوند مارکتینگ", 900, 603, "Paul Jarvis", "picsum-12"),
    asset("images/services/content-marketing/related-2-1517245386807-b.webp", "تصویر مرتبط 2 برای تولید محتوا — الوند مارکتینگ", 900, 600, "Headway", "1517245386807-bb43f82c33c4"),
    asset("images/services/content-marketing/related-3-p13.webp", "تصویر مرتبط 3 برای تولید محتوا — الوند مارکتینگ", 900, 603, "Paul Jarvis", "picsum-13"),
  ],
};

const img_video_content: ServiceImageSet = {
  featured: asset("images/services/video-content/featured-1574717024653-6.webp", "تصویر شاخص تولید محتوا ویدیویی — الوند مارکتینگ", 1200, 800, "Jakob Owens", "1574717024653-61fd2cf4d44d"),
  related: [
    asset("images/services/video-content/related-1-p14.webp", "تصویر مرتبط 1 برای تولید محتوا ویدیویی — الوند مارکتینگ", 900, 603, "Paul Jarvis", "picsum-14"),
    asset("images/services/video-content/related-2-1611162616305-c.webp", "تصویر مرتبط 2 برای تولید محتوا ویدیویی — الوند مارکتینگ", 900, 675, "Souvik Banerjee", "1611162616305-c69b3fa7fbe0"),
    asset("images/services/video-content/related-3-p15.webp", "تصویر مرتبط 3 برای تولید محتوا ویدیویی — الوند مارکتینگ", 900, 603, "Paul Jarvis", "picsum-15"),
  ],
};

const img_online_ads: ServiceImageSet = {
  featured: asset("images/services/online-ads/featured-p16.webp", "تصویر شاخص تبلیغات اینترنتی — الوند مارکتینگ", 1200, 804, "Paul Jarvis", "picsum-16"),
  related: [
    asset("images/services/online-ads/related-1-p17.webp", "تصویر مرتبط 1 برای تبلیغات اینترنتی — الوند مارکتینگ", 900, 603, "Paul Jarvis", "picsum-17"),
    asset("images/services/online-ads/related-2-p18.webp", "تصویر مرتبط 2 برای تبلیغات اینترنتی — الوند مارکتینگ", 900, 603, "Paul Jarvis", "picsum-18"),
    asset("images/services/online-ads/related-3-p19.webp", "تصویر مرتبط 3 برای تبلیغات اینترنتی — الوند مارکتینگ", 900, 603, "Paul Jarvis", "picsum-19"),
  ],
};

const img_banner_ads: ServiceImageSet = {
  featured: asset("images/services/banner-ads/featured-p20.webp", "تصویر شاخص تبلیغات بنری — الوند مارکتینگ", 1200, 804, "Aleks Dorohovich", "picsum-20"),
  related: [
    asset("images/services/banner-ads/related-1-p21.webp", "تصویر مرتبط 1 برای تبلیغات بنری — الوند مارکتینگ", 900, 603, "Alejandro Escamilla", "picsum-21"),
    asset("images/services/banner-ads/related-2-p22.webp", "تصویر مرتبط 2 برای تبلیغات بنری — الوند مارکتینگ", 900, 603, "Alejandro Escamilla", "picsum-22"),
    asset("images/services/banner-ads/related-3-p23.webp", "تصویر مرتبط 3 برای تبلیغات بنری — الوند مارکتینگ", 900, 603, "Alejandro Escamilla", "picsum-23"),
  ],
};

const img_sponsored_content: ServiceImageSet = {
  featured: asset("images/services/sponsored-content/featured-p24.webp", "تصویر شاخص رپورتاژ آگهی — الوند مارکتینگ", 1200, 804, "Alejandro Escamilla", "picsum-24"),
  related: [
    asset("images/services/sponsored-content/related-1-p25.webp", "تصویر مرتبط 1 برای رپورتاژ آگهی — الوند مارکتینگ", 900, 603, "Alejandro Escamilla", "picsum-25"),
    asset("images/services/sponsored-content/related-2-p26.webp", "تصویر مرتبط 2 برای رپورتاژ آگهی — الوند مارکتینگ", 900, 603, "Vadim Sherbakov", "picsum-26"),
    asset("images/services/sponsored-content/related-3-p27.webp", "تصویر مرتبط 3 برای رپورتاژ آگهی — الوند مارکتینگ", 900, 603, "Yoni Kaplan-Nadel", "picsum-27"),
  ],
};

const img_push_notifications: ServiceImageSet = {
  featured: asset("images/services/push-notifications/featured-p28.webp", "تصویر شاخص پوش نوتیفیکیشن — الوند مارکتینگ", 1200, 804, "Jerry Adney", "picsum-28"),
  related: [
    asset("images/services/push-notifications/related-1-1551650975-87de.webp", "تصویر مرتبط 1 برای پوش نوتیفیکیشن — الوند مارکتینگ", 900, 675, "Ashutosh Gawali", "1551650975-87deedd944c3"),
    asset("images/services/push-notifications/related-2-p29.webp", "تصویر مرتبط 2 برای پوش نوتیفیکیشن — الوند مارکتینگ", 900, 603, "Go Wild", "picsum-29"),
    asset("images/services/push-notifications/related-3-p30.webp", "تصویر مرتبط 3 برای پوش نوتیفیکیشن — الوند مارکتینگ", 900, 603, "Shyamanta Baruah", "picsum-30"),
  ],
};

const img_social_ads: ServiceImageSet = {
  featured: asset("images/services/social-ads/featured-p31.webp", "تصویر شاخص تبلیغات شبکه‌های اجتماعی — الوند مارکتینگ", 1200, 804, "How-Soon Ngu", "picsum-31"),
  related: [
    asset("images/services/social-ads/related-1-p32.webp", "تصویر مرتبط 1 برای تبلیغات شبکه‌های اجتماعی — الوند مارکتینگ", 900, 603, "Rodrigo Melo", "picsum-32"),
    asset("images/services/social-ads/related-2-p33.webp", "تصویر مرتبط 2 برای تبلیغات شبکه‌های اجتماعی — الوند مارکتینگ", 900, 603, "Alejandro Escamilla", "picsum-33"),
    asset("images/services/social-ads/related-3-p34.webp", "تصویر مرتبط 3 برای تبلیغات شبکه‌های اجتماعی — الوند مارکتینگ", 900, 603, "Aleks Dorohovich", "picsum-34"),
  ],
};

const img_social_media: ServiceImageSet = {
  featured: asset("images/services/social-media/featured-1529156069898-4.webp", "تصویر شاخص شبکه‌های اجتماعی — ارتباط و جامعه مخاطبان — الوند مارکتینگ", 1600, 900, "Perry Grone", "1529156069898-49953e39b3ac"),
  related: [
    asset("images/services/social-media/related-1-p35.webp", "تصویر مرتبط 1 برای شبکه‌های اجتماعی — الوند مارکتینگ", 900, 603, "Shane Colella", "picsum-35"),
    asset("images/services/social-media/related-2-p36.webp", "تصویر مرتبط 2 برای شبکه‌های اجتماعی — الوند مارکتینگ", 900, 603, "Vadim Sherbakov", "picsum-36"),
    asset("images/services/social-media/related-3-p37.webp", "تصویر مرتبط 3 برای شبکه‌های اجتماعی — الوند مارکتینگ", 900, 603, "Austin Neill", "picsum-37"),
  ],
};

const img_artificial_intelligence: ServiceImageSet = {
  featured: asset("images/services/artificial-intelligence/featured-1677442136019-2.webp", "تصویر شاخص هوش مصنوعی — الوند مارکتینگ", 1200, 675, "Growtika", "1677442136019-21780ecad995"),
  related: [
    asset("images/services/artificial-intelligence/related-1-1620712943543-b.webp", "تصویر مرتبط 1 برای هوش مصنوعی — الوند مارکتینگ", 900, 1125, "Possessed Photography", "1620712943543-bcc4688e7485"),
    asset("images/services/artificial-intelligence/related-2-p38.webp", "تصویر مرتبط 2 برای هوش مصنوعی — الوند مارکتینگ", 900, 603, "Allyson Souza", "picsum-38"),
    asset("images/services/artificial-intelligence/related-3-1555949963-aa79.webp", "تصویر مرتبط 3 برای هوش مصنوعی — الوند مارکتینگ", 900, 600, "Fotis Fotopoulos", "1555949963-aa79dcee981c"),
  ],
};

const img_email_marketing: ServiceImageSet = {
  featured: asset("images/services/email-marketing/featured-p39.webp", "تصویر شاخص ایمیل مارکتینگ — الوند مارکتینگ", 1200, 804, "Luke Chesser", "picsum-39"),
  related: [
    asset("images/services/email-marketing/related-1-p40.webp", "تصویر مرتبط 1 برای ایمیل مارکتینگ — الوند مارکتینگ", 900, 603, "Ryan Mcguire", "picsum-40"),
    asset("images/services/email-marketing/related-2-p41.webp", "تصویر مرتبط 2 برای ایمیل مارکتینگ — الوند مارکتینگ", 900, 603, "Nithya Ramanujam", "picsum-41"),
    asset("images/services/email-marketing/related-3-p42.webp", "تصویر مرتبط 3 برای ایمیل مارکتینگ — الوند مارکتینگ", 900, 603, "Luke Chesser", "picsum-42"),
  ],
};

const img_analytics: ServiceImageSet = {
  featured: asset("images/services/analytics/featured-p43.webp", "تصویر شاخص ابزارهای آنالیتیکس — الوند مارکتینگ", 1200, 804, "Oleg Chursin", "picsum-43"),
  related: [
    asset("images/services/analytics/related-1-p44.webp", "تصویر مرتبط 1 برای ابزارهای آنالیتیکس — الوند مارکتینگ", 900, 603, "Christopher Sardegna", "picsum-44"),
    asset("images/services/analytics/related-2-p45.webp", "تصویر مرتبط 2 برای ابزارهای آنالیتیکس — الوند مارکتینگ", 900, 603, "Alan Haverty", "picsum-45"),
    asset("images/services/analytics/related-3-p46.webp", "تصویر مرتبط 3 برای ابزارهای آنالیتیکس — الوند مارکتینگ", 900, 603, "Jeffrey Kam", "picsum-46"),
  ],
};

const img_google_analytics: ServiceImageSet = {
  featured: asset("images/services/google-analytics/featured-p47.webp", "تصویر شاخص گوگل آنالیتیکس — الوند مارکتینگ", 1200, 804, "Christopher Sardegna", "picsum-47"),
  related: [
    asset("images/services/google-analytics/related-1-p48.webp", "تصویر مرتبط 1 برای گوگل آنالیتیکس — الوند مارکتینگ", 900, 603, "Luke Chesser", "picsum-48"),
    asset("images/services/google-analytics/related-2-p49.webp", "تصویر مرتبط 2 برای گوگل آنالیتیکس — الوند مارکتینگ", 900, 603, "Margaret Barley", "picsum-49"),
    asset("images/services/google-analytics/related-3-p50.webp", "تصویر مرتبط 3 برای گوگل آنالیتیکس — الوند مارکتینگ", 900, 603, "Tyler Wanlass", "picsum-50"),
  ],
};

const img_google_tag_manager: ServiceImageSet = {
  featured: asset("images/services/google-tag-manager/featured-p51.webp", "تصویر شاخص گوگل تگ منیجر — الوند مارکتینگ", 1200, 804, "Ireneuilia", "picsum-51"),
  related: [
    asset("images/services/google-tag-manager/related-1-1555066931-4365.webp", "تصویر مرتبط 1 برای گوگل تگ منیجر — الوند مارکتینگ", 900, 600, "Fotis Fotopoulos", "1555066931-4365d14bab8c"),
    asset("images/services/google-tag-manager/related-2-p52.webp", "تصویر مرتبط 2 برای گوگل تگ منیجر — الوند مارکتینگ", 900, 603, "Cierra", "picsum-52"),
    asset("images/services/google-tag-manager/related-3-p53.webp", "تصویر مرتبط 3 برای گوگل تگ منیجر — الوند مارکتینگ", 900, 603, "J Duclos", "picsum-53"),
  ],
};

const img_search_console: ServiceImageSet = {
  featured: asset("images/services/search-console/featured-p54.webp", "تصویر شاخص سرچ کنسول — الوند مارکتینگ", 1200, 804, "Nicholas Swanson", "picsum-54"),
  related: [
    asset("images/services/search-console/related-1-p55.webp", "تصویر مرتبط 1 برای سرچ کنسول — الوند مارکتینگ", 900, 603, "Tyler Wanlass", "picsum-55"),
    asset("images/services/search-console/related-2-p56.webp", "تصویر مرتبط 2 برای سرچ کنسول — الوند مارکتینگ", 900, 603, "Sebastian Muller", "picsum-56"),
    asset("images/services/search-console/related-3-p57.webp", "تصویر مرتبط 3 برای سرچ کنسول — الوند مارکتینگ", 900, 603, "Nicholas Swanson", "picsum-57"),
  ],
};

const img_website_support: ServiceImageSet = {
  featured: asset("images/services/website-support/featured-p58.webp", "تصویر شاخص پشتیبانی سایت — الوند مارکتینگ", 1200, 804, "Tony Naccarato", "picsum-58"),
  related: [
    asset("images/services/website-support/related-1-p59.webp", "تصویر مرتبط 1 برای پشتیبانی سایت — الوند مارکتینگ", 900, 603, "Art Wave", "picsum-59"),
    asset("images/services/website-support/related-2-p60.webp", "تصویر مرتبط 2 برای پشتیبانی سایت — الوند مارکتینگ", 900, 603, "Vadim Sherbakov", "picsum-60"),
    asset("images/services/website-support/related-3-p61.webp", "تصویر مرتبط 3 برای پشتیبانی سایت — الوند مارکتینگ", 900, 603, "Alex", "picsum-61"),
  ],
};

const img_site_speed: ServiceImageSet = {
  featured: asset("images/services/site-speed/featured-p62.webp", "تصویر شاخص افزایش سرعت سایت — الوند مارکتینگ", 1200, 804, "Daniel Genser", "picsum-62"),
  related: [
    asset("images/services/site-speed/related-1-p63.webp", "تصویر مرتبط 1 برای افزایش سرعت سایت — الوند مارکتینگ", 900, 603, "Justin Leibow", "picsum-63"),
    asset("images/services/site-speed/related-2-p64.webp", "تصویر مرتبط 2 برای افزایش سرعت سایت — الوند مارکتینگ", 900, 603, "Alexander Shustov", "picsum-64"),
    asset("images/services/site-speed/related-3-p65.webp", "تصویر مرتبط 3 برای افزایش سرعت سایت — الوند مارکتینگ", 900, 603, "Alexander Shustov", "picsum-65"),
  ],
};

const img_site_security: ServiceImageSet = {
  featured: asset("images/services/site-security/featured-1563986768609-3.webp", "تصویر شاخص امنیت سایت — الوند مارکتینگ", 1200, 800, "FlyD", "1563986768609-322da13575f3"),
  related: [
    asset("images/services/site-security/related-1-p66.webp", "تصویر مرتبط 1 برای امنیت سایت — الوند مارکتینگ", 900, 603, "Nicholas Swanson", "picsum-66"),
    asset("images/services/site-security/related-2-p67.webp", "تصویر مرتبط 2 برای امنیت سایت — الوند مارکتینگ", 900, 603, "Rula Sibai", "picsum-67"),
    asset("images/services/site-security/related-3-p68.webp", "تصویر مرتبط 3 برای امنیت سایت — الوند مارکتینگ", 900, 603, "Cristian Moscoso", "picsum-68"),
  ],
};

const img_site_monitoring: ServiceImageSet = {
  featured: asset("images/services/site-monitoring/featured-p69.webp", "تصویر شاخص مانیتورینگ سایت — الوند مارکتینگ", 1200, 804, "Alexander Shustov", "picsum-69"),
  related: [
    asset("images/services/site-monitoring/related-1-p70.webp", "تصویر مرتبط 1 برای مانیتورینگ سایت — الوند مارکتینگ", 900, 603, "Dorothy Lin", "picsum-70"),
    asset("images/services/site-monitoring/related-2-p71.webp", "تصویر مرتبط 2 برای مانیتورینگ سایت — الوند مارکتینگ", 900, 603, "Jon Eckert", "picsum-71"),
    asset("images/services/site-monitoring/related-3-p72.webp", "تصویر مرتبط 3 برای مانیتورینگ سایت — الوند مارکتینگ", 900, 603, "Tyler Finck", "picsum-72"),
  ],
};

const img_wordpress_plugins: ServiceImageSet = {
  featured: asset("images/services/wordpress-plugins/featured-p73.webp", "تصویر شاخص نصب قالب و افزونه وردپرس — الوند مارکتینگ", 1200, 804, "Jon Eckert", "picsum-73"),
  related: [
    asset("images/services/wordpress-plugins/related-1-p74.webp", "تصویر مرتبط 1 برای نصب قالب و افزونه وردپرس — الوند مارکتینگ", 900, 603, "Isaak Dury", "picsum-74"),
    asset("images/services/wordpress-plugins/related-2-p75.webp", "تصویر مرتبط 2 برای نصب قالب و افزونه وردپرس — الوند مارکتینگ", 900, 603, "Jassy Onyae", "picsum-75"),
    asset("images/services/wordpress-plugins/related-3-p76.webp", "تصویر مرتبط 3 برای نصب قالب و افزونه وردپرس — الوند مارکتینگ", 900, 603, "Alexander Shustov", "picsum-76"),
  ],
};

const img_site_error_fix: ServiceImageSet = {
  featured: asset("images/services/site-error-fix/featured-p77.webp", "تصویر شاخص رفع ارور سایت — الوند مارکتینگ", 1200, 804, "May Pamintuan", "picsum-77"),
  related: [
    asset("images/services/site-error-fix/related-1-p78.webp", "تصویر مرتبط 1 برای رفع ارور سایت — الوند مارکتینگ", 900, 603, "Paul Evans", "picsum-78"),
    asset("images/services/site-error-fix/related-2-p79.webp", "تصویر مرتبط 2 برای رفع ارور سایت — الوند مارکتینگ", 900, 603, "Dorothy Lin", "picsum-79"),
    asset("images/services/site-error-fix/related-3-p80.webp", "تصویر مرتبط 3 برای رفع ارور سایت — الوند مارکتینگ", 900, 603, "Sonja Langford", "picsum-80"),
  ],
};

const img_malware_cleanup: ServiceImageSet = {
  featured: asset("images/services/malware-cleanup/featured-p81.webp", "تصویر شاخص پاکسازی سایت هک‌شده — الوند مارکتینگ", 1200, 804, "Sander Weeteling", "picsum-81"),
  related: [
    asset("images/services/malware-cleanup/related-1-p82.webp", "تصویر مرتبط 1 برای پاکسازی سایت هک‌شده — الوند مارکتینگ", 900, 603, "Rula Sibai", "picsum-82"),
    asset("images/services/malware-cleanup/related-2-p83.webp", "تصویر مرتبط 2 برای پاکسازی سایت هک‌شده — الوند مارکتینگ", 900, 603, "Julie Geiger", "picsum-83"),
    asset("images/services/malware-cleanup/related-3-p84.webp", "تصویر مرتبط 3 برای پاکسازی سایت هک‌شده — الوند مارکتینگ", 900, 603, "Johnny Lam", "picsum-84"),
  ],
};

const img_ecommerce_support: ServiceImageSet = {
  featured: asset("images/services/ecommerce-support/featured-p85.webp", "تصویر شاخص پشتیبانی سایت فروشگاهی — الوند مارکتینگ", 1200, 804, "Gozha Net", "picsum-85"),
  related: [
    asset("images/services/ecommerce-support/related-1-p87.webp", "تصویر مرتبط 1 برای پشتیبانی سایت فروشگاهی — الوند مارکتینگ", 900, 603, "Barcelona", "picsum-87"),
    asset("images/services/ecommerce-support/related-2-p88.webp", "تصویر مرتبط 2 برای پشتیبانی سایت فروشگاهی — الوند مارکتینگ", 900, 603, "Barcelona", "picsum-88"),
    asset("images/services/ecommerce-support/related-3-p89.webp", "تصویر مرتبط 3 برای پشتیبانی سایت فروشگاهی — الوند مارکتینگ", 900, 603, "Vectorbeast", "picsum-89"),
  ],
};

const img_mobile_app: ServiceImageSet = {
  featured: asset("images/services/mobile-app/featured-p90.webp", "تصویر شاخص طراحی و ساخت اپلیکیشن — الوند مارکتینگ", 1200, 804, "Rula Sibai", "picsum-90"),
  related: [
    asset("images/services/mobile-app/related-1-p91.webp", "تصویر مرتبط 1 برای طراحی و ساخت اپلیکیشن — الوند مارکتینگ", 900, 603, "Jennifer Trovato", "picsum-91"),
    asset("images/services/mobile-app/related-2-p92.webp", "تصویر مرتبط 2 برای طراحی و ساخت اپلیکیشن — الوند مارکتینگ", 900, 603, "Rafael Souza", "picsum-92"),
    asset("images/services/mobile-app/related-3-p93.webp", "تصویر مرتبط 3 برای طراحی و ساخت اپلیکیشن — الوند مارکتینگ", 900, 603, "Caroline Sada", "picsum-93"),
  ],
};

const img_web_application: ServiceImageSet = {
  featured: asset("images/services/web-application/featured-p94.webp", "تصویر شاخص وب اپلیکیشن — الوند مارکتینگ", 1200, 804, "Jean Kleisz", "picsum-94"),
  related: [
    asset("images/services/web-application/related-1-p95.webp", "تصویر مرتبط 1 برای وب اپلیکیشن — الوند مارکتینگ", 900, 603, "Kundan Ramisetti", "picsum-95"),
    asset("images/services/web-application/related-2-p96.webp", "تصویر مرتبط 2 برای وب اپلیکیشن — الوند مارکتینگ", 900, 603, "Pawel Kadysz", "picsum-96"),
    asset("images/services/web-application/related-3-p98.webp", "تصویر مرتبط 3 برای وب اپلیکیشن — الوند مارکتینگ", 900, 603, "Laurice Solomon", "picsum-98"),
  ],
};

const img_ecommerce_app: ServiceImageSet = {
  featured: asset("images/services/ecommerce-app/featured-p99.webp", "تصویر شاخص طراحی اپلیکیشن فروشگاهی — الوند مارکتینگ", 1200, 804, "Jon Toney", "picsum-99"),
  related: [
    asset("images/services/ecommerce-app/related-1-p100.webp", "تصویر مرتبط 1 برای طراحی اپلیکیشن فروشگاهی — الوند مارکتینگ", 900, 603, "Tina Rataj", "picsum-100"),
    asset("images/services/ecommerce-app/related-2-p101.webp", "تصویر مرتبط 2 برای طراحی اپلیکیشن فروشگاهی — الوند مارکتینگ", 900, 603, "Christian Bardenhorst", "picsum-101"),
    asset("images/services/ecommerce-app/related-3-p102.webp", "تصویر مرتبط 3 برای طراحی اپلیکیشن فروشگاهی — الوند مارکتینگ", 900, 603, "Ben Moore", "picsum-102"),
  ],
};

const img_api_integration: ServiceImageSet = {
  featured: asset("images/services/api-integration/featured-p103.webp", "تصویر شاخص API و یکپارچه‌سازی — الوند مارکتینگ", 1200, 804, "Ilham Rahmansyah", "picsum-103"),
  related: [
    asset("images/services/api-integration/related-1-p104.webp", "تصویر مرتبط 1 برای API و یکپارچه‌سازی — الوند مارکتینگ", 900, 603, "Dyaa Eldin", "picsum-104"),
    asset("images/services/api-integration/related-2-p106.webp", "تصویر مرتبط 2 برای API و یکپارچه‌سازی — الوند مارکتینگ", 900, 603, "Arvee Marie", "picsum-106"),
    asset("images/services/api-integration/related-3-p107.webp", "تصویر مرتبط 3 برای API و یکپارچه‌سازی — الوند مارکتینگ", 900, 603, "Lukas Schweizer", "picsum-107"),
  ],
};

const img_digital_consulting: ServiceImageSet = {
  featured: asset("images/services/digital-consulting/featured-p108.webp", "تصویر شاخص مشاوره دیجیتال مارکتینگ — الوند مارکتینگ", 1200, 804, "Florian Klauer", "picsum-108"),
  related: [
    asset("images/services/digital-consulting/related-1-p109.webp", "تصویر مرتبط 1 برای مشاوره دیجیتال مارکتینگ — الوند مارکتینگ", 900, 603, "Zwaddi", "picsum-109"),
    asset("images/services/digital-consulting/related-2-p110.webp", "تصویر مرتبط 2 برای مشاوره دیجیتال مارکتینگ — الوند مارکتینگ", 900, 603, "Kenneth Thewissen", "picsum-110"),
    asset("images/services/digital-consulting/related-3-p111.webp", "تصویر مرتبط 3 برای مشاوره دیجیتال مارکتینگ — الوند مارکتینگ", 900, 603, "Gabe Rodriguez", "picsum-111"),
  ],
};

const img_branding: ServiceImageSet = {
  featured: asset("images/services/branding/featured-p112.webp", "تصویر شاخص برندینگ و هویت بصری — الوند مارکتینگ", 1200, 804, "Zugr", "picsum-112"),
  related: [
    asset("images/services/branding/related-1-p113.webp", "تصویر مرتبط 1 برای برندینگ و هویت بصری — الوند مارکتینگ", 900, 603, "Zugr", "picsum-113"),
    asset("images/services/branding/related-2-p114.webp", "تصویر مرتبط 2 برای برندینگ و هویت بصری — الوند مارکتینگ", 900, 603, "Brian Gonzalez", "picsum-114"),
    asset("images/services/branding/related-3-p115.webp", "تصویر مرتبط 3 برای برندینگ و هویت بصری — الوند مارکتینگ", 900, 603, "Christian Hebell", "picsum-115"),
  ],
};

const img_instagram_management: ServiceImageSet = {
  featured: asset("images/services/instagram-management/featured-p116.webp", "تصویر شاخص مدیریت اینستاگرام — الوند مارکتینگ", 1200, 804, "Anton Sulsky", "picsum-116"),
  related: [
    asset("images/services/instagram-management/related-1-p117.webp", "تصویر مرتبط 1 برای مدیریت اینستاگرام — الوند مارکتینگ", 900, 603, "Daniel Ebersole", "picsum-117"),
    asset("images/services/instagram-management/related-2-p118.webp", "تصویر مرتبط 2 برای مدیریت اینستاگرام — الوند مارکتینگ", 900, 603, "Rick Waalders", "picsum-118"),
    asset("images/services/instagram-management/related-3-p119.webp", "تصویر مرتبط 3 برای مدیریت اینستاگرام — الوند مارکتینگ", 900, 603, "Nadir Balcikli", "picsum-119"),
  ],
};

const img_linkedin_management: ServiceImageSet = {
  featured: asset("images/services/linkedin-management/featured-1521737711867-e.webp", "تصویر شاخص مدیریت لینکدین — الوند مارکتینگ", 1200, 1799, "LinkedIn Sales Solutions", "1521737711867-e3b97375f902"),
  related: [
    asset("images/services/linkedin-management/related-1-p120.webp", "تصویر مرتبط 1 برای مدیریت لینکدین — الوند مارکتینگ", 900, 603, "Guillaume", "picsum-120"),
    asset("images/services/linkedin-management/related-2-p121.webp", "تصویر مرتبط 2 برای مدیریت لینکدین — الوند مارکتینگ", 900, 603, "Radio Pink", "picsum-121"),
    asset("images/services/linkedin-management/related-3-p122.webp", "تصویر مرتبط 3 برای مدیریت لینکدین — الوند مارکتینگ", 900, 603, "Vadim Sherbakov", "picsum-122"),
  ],
};

const img_custom_coding_website: ServiceImageSet = {
  featured: asset("images/services/custom-coding-website/featured-1461749280684.webp", "تصویر شاخص طراحی سایت کدنویسی — الوند مارکتینگ", 1400, 935, "Mohammad Rahmani", "1461749280684-dccba630e2f6"),
  related: [
    asset("images/services/custom-coding-website/related-1-1498050108023.webp", "تصویر مرتبط 1 برای طراحی سایت کدنویسی — الوند مارکتینگ", 1000, 666, "Christopher Gower", "1498050108023-c5249f4df085"),
    asset("images/services/custom-coding-website/related-2-1586717791821.webp", "تصویر مرتبط 2 برای طراحی سایت کدنویسی — الوند مارکتینگ", 1000, 667, "Hal Gatewood", "1586717791821-3f44a563fa4c"),
    asset("images/services/custom-coding-website/related-3-1555066931-43.webp", "تصویر مرتبط 3 برای طراحی سایت کدنویسی — الوند مارکتینگ", 1000, 667, "Fotis Fotopoulos", "1555066931-4365d14bab8c"),
  ],
};
const img_google_ads: ServiceImageSet = {
  featured: asset("images/services/google-ads/featured-1557804506-66.webp", "تصویر شاخص گوگل ادز — الوند مارکتینگ", 1400, 1050, "Austin Distel", "1557804506-669a67965ba0"),
  related: [
    asset("images/services/google-ads/related-1-1533750349088.webp", "تصویر مرتبط 1 برای گوگل ادز — الوند مارکتینگ", 1000, 667, "Stephen Dawson", "1533750349088-cd871a92f312"),
    asset("images/services/google-ads/related-2-1460925895917.webp", "تصویر مرتبط 2 برای گوگل ادز — الوند مارکتینگ", 1000, 712, "Luke Chesser", "1460925895917-afdab827c52f"),
    asset("images/services/google-ads/related-3-1432888622747.webp", "تصویر مرتبط 3 برای گوگل ادز — الوند مارکتینگ", 1000, 667, "Stephen Dawson", "1454165804606-c3d57bc86b40"),
  ],
};
export const serviceImagesBySlug: Record<string, ServiceImageSet> = {
  "تبلیغات-اینترنتی/گوگل-ادز": img_google_ads,
  "طراحی-سایت/کدنویسی": img_custom_coding_website,
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
  "شبکه‌های-اجتماعی/اینستاگرام": img_instagram_management,
  "شبکه‌های-اجتماعی/لینکدین": img_linkedin_management,
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
