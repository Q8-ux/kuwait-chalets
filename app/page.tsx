"use client";

import { useEffect, useMemo, useState } from "react";
import type { CSSProperties, FormEvent } from "react";

type Listing = {
  id: number;
  title: string;
  area: string;
  place: string;
  price: number | null;
  priceLabel: string;
  period: string;
  rooms: number;
  baths: number;
  guests: number;
  image: string;
  source: string;
  sourceUrl: string;
  checked: string;
  confidence: "موثّق المصدر" | "السعر يحتاج إلى تأكيد";
  category: "يومي" | "أسبوعي" | "شهري" | "حسب التوافر";
  description: string;
  amenities: string[];
  pool: boolean;
  sea: boolean;
  family: boolean;
  featured?: boolean;
};

type BookingForm = {
  arrival: string;
  departure: string;
  adults: number;
  children: number;
  fullName: string;
  phone: string;
  email: string;
  notes: string;
  agreed: boolean;
};

const emptyBookingForm: BookingForm = {
  arrival: "",
  departure: "",
  adults: 2,
  children: 0,
  fullName: "",
  phone: "",
  email: "",
  notes: "",
  agreed: false,
};

const listings: Listing[] = [
  {
    id: 1,
    title: "شاليه الكوخ الخشبي",
    area: "الخيران",
    place: "صباح الأحمد البحرية",
    price: 100,
    priceLabel: "100 د.ك",
    period: "لليلة",
    rooms: 2,
    baths: 2,
    guests: 11,
    image: "images/terrace-chalet.webp",
    source: "منصة سكن",
    sourceUrl:
      "https://sakan.co/ar/holiday/details/1384-%D8%B4%D8%A7%D9%84%D9%8A%D9%87-%D8%A7%D9%84%D8%A7%D9%8A%D8%AC%D8%A7%D8%B1-%D9%81%D9%8A-%D8%A7%D9%84%D8%AE%D9%8A%D8%B1%D8%A7%D9%86",
    checked: "11 أغسطس 2026",
    confidence: "موثّق المصدر",
    category: "يومي",
    description:
      "كوخ بحري مدمج بإطلالة على البحر، مطبخ صغير، سينما خارجية، جلسة سطح ومسبح دائري.",
    amenities: ["إطلالة بحرية", "مسبح خارجي", "سينما خارجية", "شواء", "واي فاي"],
    pool: true,
    sea: true,
    family: true,
    featured: true,
  },
  {
    id: 2,
    title: "شاليه 772",
    area: "الخيران",
    place: "المرحلة الثانية — طريق 278",
    price: 250,
    priceLabel: "250 د.ك",
    period: "24 ساعة",
    rooms: 6,
    baths: 7,
    guests: 16,
    image: "images/pool-chalet.webp",
    source: "شاليهات الخيران",
    sourceUrl: "https://www.khiranchalet.com/single",
    checked: "11 أغسطس 2026",
    confidence: "موثّق المصدر",
    category: "يومي",
    description:
      "ست غرف رئيسية، وصالتان، ومطبخ مجهز، ومسبح كبير، ومسبح للأطفال، وحديقة مع ألعاب.",
    amenities: ["6 غرف رئيسية", "مسبح أطفال", "حديقة", "ألعاب أطفال", "مطبخ مجهز"],
    pool: true,
    sea: false,
    family: true,
    featured: true,
  },
  {
    id: 3,
    title: "شاليه لؤلؤة الخيران الخاص",
    area: "الخيران",
    place: "لؤلؤة الخيران — صف ثانٍ",
    price: 60,
    priceLabel: "من 60 د.ك",
    period: "وسط الأسبوع",
    rooms: 7,
    baths: 8,
    guests: 18,
    image: "images/pool-chalet.webp",
    source: "إعلانات الكويت",
    sourceUrl: "https://q8rupee.com/info-17241.html",
    checked: "11 أغسطس 2026",
    confidence: "السعر يحتاج إلى تأكيد",
    category: "يومي",
    description:
      "شاليه مؤثث من دورين مع حديقة ومسبح داخلي مدفأ وديوانية وثلاث صالات.",
    amenities: ["مسبح داخلي", "حديقة", "ديوانية", "تكييف مركزي", "مواقف"],
    pool: true,
    sea: false,
    family: false,
  },
  {
    id: 4,
    title: "شاليه سرايا الخيران",
    area: "الخيران",
    place: "مدخل 278 — مقابل المهنا",
    price: 70,
    priceLabel: "من 70 د.ك",
    period: "وسط الأسبوع",
    rooms: 4,
    baths: 5,
    guests: 12,
    image: "images/terrace-chalet.webp",
    source: "إعلانات الكويت",
    sourceUrl: "https://q8rupee.com/info-40519.html",
    checked: "11 أغسطس 2026",
    confidence: "السعر يحتاج إلى تأكيد",
    category: "أسبوعي",
    description:
      "ثلاثة طوابق، وأربع غرف، وثلاث صالات، وشرفة مطلة على البحر، مع تكييف مركزي.",
    amenities: ["قرب البحر", "شرفة", "3 صالات", "مطبخ", "تكييف مركزي"],
    pool: false,
    sea: true,
    family: false,
  },
  {
    id: 5,
    title: "شاليه الزين",
    area: "الخيران",
    place: "المرحلة الثالثة — طريق 278",
    price: 600,
    priceLabel: "600 د.ك",
    period: "منتصف الأسبوع أو نهايته",
    rooms: 8,
    baths: 9,
    guests: 20,
    image: "images/hero-chalet.webp",
    source: "Dream Chalet",
    sourceUrl: "https://chalet-dream.com/chalet/33",
    checked: "11 أغسطس 2026",
    confidence: "موثّق المصدر",
    category: "أسبوعي",
    description:
      "واجهة بحرية عريضة، وسبع غرف رئيسية، وديوانية، ومسبح على البحر مزود بالتدفئة وشلال.",
    amenities: ["صف أول", "مسبح مدفأ", "7 غرف رئيسية", "ديوانية", "حراسة"],
    pool: true,
    sea: true,
    family: true,
    featured: true,
  },
  {
    id: 6,
    title: "كرفان الخيران للفعاليات",
    area: "الخيران",
    place: "مركز الخيران",
    price: 350,
    priceLabel: "من 350 د.ك",
    period: "للحجز",
    rooms: 2,
    baths: 3,
    guests: 60,
    image: "images/terrace-chalet.webp",
    source: "منصة سكن",
    sourceUrl:
      "https://sakan.co/ar/holiday/details/1150--%D9%83%D8%B1%D9%81%D8%A7%D9%86-%D9%81%D9%8A-%D8%A7%D9%84%D8%AE%D9%8A%D8%B1%D8%A7%D9%86-",
    checked: "11 أغسطس 2026",
    confidence: "موثّق المصدر",
    category: "حسب التوافر",
    description:
      "كرفان ومرافق ترفيهية للرحلات والفعاليات، وخيمة ملكية، وألعاب، وقوارب كاياك، ومسبح مغطى.",
    amenities: ["حتى 60 ضيفًا", "خيمة ملكية", "قوارب كاياك", "مسبح مغطى", "ألعاب"],
    pool: true,
    sea: true,
    family: false,
  },
  {
    id: 7,
    title: "شاليه صف أول على الخور",
    area: "صباح الأحمد",
    place: "مركز الخيران — المرحلة الخامسة",
    price: 500,
    priceLabel: "من 500 د.ك",
    period: "للحجز",
    rooms: 8,
    baths: 12,
    guests: 35,
    image: "images/hero-chalet.webp",
    source: "منصة سكن",
    sourceUrl:
      "https://sakan.co/ar/holiday/details/1816-%D8%B4%D8%A7%D9%84%D9%8A%D9%87-%D9%84%D9%84%D8%A7%D9%8A%D8%AC%D8%A7%D8%B1-%D9%81%D9%8A-%D8%B5%D8%A8%D8%A7%D8%AD-%D8%A7%D9%84%D8%A7%D8%AD%D9%85%D8%AF-%D8%A7%D9%84%D8%A8%D8%AD%D8%B1%D9%8A%D9%87",
    checked: "11 أغسطس 2026",
    confidence: "موثّق المصدر",
    category: "حسب التوافر",
    description:
      "شاليه في الصف الأول بمساحة 450 م²، يضم ثماني غرف واثني عشر حمامًا، ويتسع لمجموعة كبيرة.",
    amenities: ["صف أول", "450 م²", "8 غرف", "12 حمامًا", "للمجموعات"],
    pool: true,
    sea: true,
    family: true,
  },
  {
    id: 8,
    title: "شاليه بنيدر على البحر",
    area: "بنيدر",
    place: "بنيدر — واجهة بحرية",
    price: null,
    priceLabel: "تواصل لمعرفة السعر",
    period: "حسب التوافر",
    rooms: 6,
    baths: 8,
    guests: 18,
    image: "images/terrace-chalet.webp",
    source: "عقارات عواد",
    sourceUrl:
      "https://awwadrealestate.com/316965-%D8%B4%D8%A7%D9%84%D9%8A%D9%87-%D9%84%D9%84%D8%A7%D9%8A%D8%AC%D8%A7%D8%B1-%D9%81%D9%8A-%D8%A8%D9%86%D9%8A%D8%AF%D8%B1/",
    checked: "11 أغسطس 2026",
    confidence: "السعر يحتاج إلى تأكيد",
    category: "حسب التوافر",
    description:
      "شاليه حديث من طابقين ونصف، يضم ست غرف رئيسية، ومسبحين أحدهما داخلي والآخر خارجي، ومواقف خاصة.",
    amenities: ["على البحر", "6 غرف رئيسية", "مسبحان", "مطبخ مجهز", "مواقف"],
    pool: true,
    sea: true,
    family: false,
  },
  {
    id: 9,
    title: "شاليه الجهراء البحري",
    area: "الجهراء",
    place: "الجهراء — الكويت",
    price: 130,
    priceLabel: "130 د.ك",
    period: "لليلة",
    rooms: 4,
    baths: 4,
    guests: 12,
    image: "images/pool-chalet.webp",
    source: "زاهب",
    sourceUrl:
      "https://d-kw.zaahib.com/ar/view_listing/177949/%D8%B4%D8%A7%D9%84%D9%8A%D9%87-%D9%84%D9%84%D8%A5%D9%8A%D8%AC%D8%A7%D8%B1-%D9%81%D9%89-%D8%A7%D9%84%D8%AC%D9%87%D8%B1%D8%A7%D8%A1-%D8%A7%D9%84%D9%83%D9%88%D9%8A%D8%AA",
    checked: "11 أغسطس 2026",
    confidence: "موثّق المصدر",
    category: "يومي",
    description: "إعلان عن شاليه بواجهة بحرية، ومسبح خاص، ومطبخ مجهز.",
    amenities: ["واجهة بحرية", "مسبح خاص", "مطبخ مجهز", "حجز ليلي"],
    pool: true,
    sea: true,
    family: false,
  },
  {
    id: 10,
    title: "شاليه سنوي في الزور",
    area: "الزور",
    place: "الزور — قطعة 1",
    price: 123,
    priceLabel: "123 د.ك",
    period: "السعر المعلن",
    rooms: 6,
    baths: 8,
    guests: 16,
    image: "images/hero-chalet.webp",
    source: "4Sale",
    sourceUrl: "https://www.q84sale.com/ar/listing/chalet-for-rent-20600356",
    checked: "11 أغسطس 2026",
    confidence: "السعر يحتاج إلى تأكيد",
    category: "شهري",
    description:
      "شاليه على البحر مباشرة بمساحة 825 م²، مسبح، واي فاي وتكييف مركزي.",
    amenities: ["على البحر", "825 م²", "مسبح", "واي فاي", "تكييف مركزي"],
    pool: true,
    sea: true,
    family: false,
  },
  {
    id: 11,
    title: "Luxury A2 Chalet COMO",
    area: "الخيران",
    place: "الخيران — الكويت",
    price: null,
    priceLabel: "سعر ديناميكي",
    period: "حسب التاريخ",
    rooms: 4,
    baths: 4,
    guests: 12,
    image: "images/terrace-chalet.webp",
    source: "Booking.com",
    sourceUrl: "https://www.booking.com/hotel/kw/a2-chalet-como.html",
    checked: "11 أغسطس 2026",
    confidence: "موثّق المصدر",
    category: "حسب التوافر",
    description:
      "شاليه واسع يضم مطبخًا خاصًا، وشرفة مطلة على المسبح، وفناءً، ومنطقة شواء، وخدمة واي فاي.",
    amenities: ["4 غرف", "مطبخ خاص", "إطلالة على المسبح", "منطقة شواء", "واي فاي"],
    pool: true,
    sea: false,
    family: true,
  },
  {
    id: 12,
    title: "دار الحمادي — إيجار شهري",
    area: "الخيران",
    place: "الخيران — المرحلة الأولى",
    price: 2500,
    priceLabel: "2,500 د.ك",
    period: "شهريًا",
    rooms: 6,
    baths: 6,
    guests: 16,
    image: "images/pool-chalet.webp",
    source: "القلعة العقارية",
    sourceUrl: "https://alqalaa.com.kw/product/chalet4rentinkhayran/",
    checked: "11 أغسطس 2026",
    confidence: "السعر يحتاج إلى تأكيد",
    category: "شهري",
    description:
      "ثلاثة طوابق، وست غرف، منها ثلاث غرف رئيسية، مع خصوصية كاملة ومسبح على البحر.",
    amenities: ["إيجار شهري", "3 طوابق", "مسبح", "على البحر", "خصوصية"],
    pool: true,
    sea: true,
    family: true,
  },
];

const areas = ["الكل", "الخيران", "صباح الأحمد", "بنيدر", "الجهراء", "الزور"];

const areaEnglish: Record<string, string> = {
  "الكل": "All",
  "الخيران": "Al Khiran",
  "صباح الأحمد": "Sabah Al Ahmad",
  "بنيدر": "Bnaider",
  "الجهراء": "Al Jahra",
  "الزور": "Al Zour",
};

const listingEnglish: Record<number, {
  title: string;
  place: string;
  priceLabel: string;
  period: string;
  description: string;
  amenities: string[];
}> = {
  1: {
    title: "Seaside Wooden Hut Chalet",
    place: "Sabah Al Ahmad Sea City",
    priceLabel: "KWD 100",
    period: "per night",
    description: "A compact seaside hut with a kitchenette, outdoor cinema, rooftop seating and a round pool.",
    amenities: ["Sea view", "Outdoor pool", "Outdoor cinema", "BBQ", "Wi-Fi"],
  },
  2: {
    title: "Chalet 772",
    place: "Phase 2 — Road 278",
    priceLabel: "KWD 250",
    period: "for 24 hours",
    description: "Six master bedrooms, two lounges, an equipped kitchen, a large pool, children’s pool and garden.",
    amenities: ["6 master rooms", "Kids’ pool", "Garden", "Kids’ games", "Equipped kitchen"],
  },
  3: {
    title: "Private Pearl Al Khiran Chalet",
    place: "Pearl Al Khiran — second row",
    priceLabel: "From KWD 60",
    period: "midweek",
    description: "A furnished two-floor chalet with a garden, heated indoor pool, diwaniya and three lounges.",
    amenities: ["Indoor pool", "Garden", "Diwaniya", "Central A/C", "Parking"],
  },
  4: {
    title: "Saraya Al Khiran Chalet",
    place: "Entrance 278 — opposite Al Muhanna",
    priceLabel: "From KWD 70",
    period: "midweek",
    description: "Three floors, four bedrooms, three lounges and a sea-facing balcony with central air conditioning.",
    amenities: ["Near the sea", "Balcony", "3 lounges", "Kitchen", "Central A/C"],
  },
  5: {
    title: "Al Zain Chalet",
    place: "Phase 3 — Road 278",
    priceLabel: "KWD 600",
    period: "midweek / weekend",
    description: "A wide seafront, seven master bedrooms, diwaniya and a heated sea-facing pool with a waterfall.",
    amenities: ["First row", "Heated pool", "7 master rooms", "Diwaniya", "Security"],
  },
  6: {
    title: "Al Khiran Events Caravan",
    place: "Central Al Khiran",
    priceLabel: "From KWD 350",
    period: "per booking",
    description: "A caravan and event setup with a royal tent, games, kayaks and a covered pool for larger groups.",
    amenities: ["Up to 60 guests", "Royal tent", "Kayaks", "Covered pool", "Games"],
  },
  7: {
    title: "First-row Creek Chalet",
    place: "Al Khiran Center — Phase 5",
    priceLabel: "From KWD 500",
    period: "per booking",
    description: "A first-row 450 m² chalet with eight bedrooms, twelve bathrooms and generous group capacity.",
    amenities: ["First row", "450 m²", "8 rooms", "12 bathrooms", "Group-friendly"],
  },
  8: {
    title: "Bnaider Seafront Chalet",
    place: "Bnaider — waterfront",
    priceLabel: "Contact for price",
    period: "subject to availability",
    description: "A modern two-and-a-half-floor chalet with six master rooms, indoor and outdoor pools and private parking.",
    amenities: ["Seafront", "6 master rooms", "Two pools", "Equipped kitchen", "Parking"],
  },
  9: {
    title: "Al Jahra Seaside Chalet",
    place: "Al Jahra — Kuwait",
    priceLabel: "KWD 130",
    period: "per night",
    description: "A public chalet listing with a seafront setting, private pool and equipped kitchen.",
    amenities: ["Seafront", "Private pool", "Equipped kitchen", "Nightly stay"],
  },
  10: {
    title: "Annual Chalet in Al Zour",
    place: "Al Zour — Block 1",
    priceLabel: "KWD 123",
    period: "displayed price",
    description: "A direct seafront chalet on 825 m² with a pool, Wi-Fi and central air conditioning.",
    amenities: ["Seafront", "825 m²", "Pool", "Wi-Fi", "Central A/C"],
  },
  11: {
    title: "Luxury A2 Chalet COMO",
    place: "Al Khiran — Kuwait",
    priceLabel: "Dynamic rate",
    period: "based on dates",
    description: "A spacious chalet with a private kitchen, balcony, pool view, patio, barbecue and Wi-Fi.",
    amenities: ["4 rooms", "Private kitchen", "Pool view", "BBQ", "Wi-Fi"],
  },
  12: {
    title: "Dar Al Hammadi — Monthly Rental",
    place: "Al Khiran — Phase 1",
    priceLabel: "KWD 2,500",
    period: "per month",
    description: "Three floors, six rooms including three master rooms, full privacy and a sea-facing pool.",
    amenities: ["Monthly rental", "3 floors", "Pool", "Seafront", "Privacy"],
  },
};

const ui = {
  ar: {
    brandSub: "شاليهات الكويت", explore: "استكشف", regions: "المناطق", safetyGuide: "دليل الحجز الآمن",
    favorites: "المفضلة", allListings: "كل الإعلانات", addChalet: "أضف شاليهك", language: "English",
    sourcePill: "إعلانات عامة جُمعت من مصادرها", heroOne: "عطلتك على البحر", heroTwo: "تبدأ من هنا",
    heroText: "قارن شاليهات الكويت، راجع السعر من مصدره، واحجز وأنت تعرف كل التفاصيل.", curated: "إعلانًا منسقًا", areas: "مناطق", sourceLinks: "روابط مصدر", expressive: "الصورة تعبيرية",
    destination: "الوجهة", arrival: "الوصول", departure: "المغادرة", guests: "الضيوف", upTo4: "حتى 4 ضيوف", upTo8: "حتى 8 ضيوف", upTo12: "حتى 12 ضيفًا", upTo20: "حتى 20 ضيفًا", search: "ابحث",
    popular: "الأكثر بحثًا", eyebrow: "اكتشف إقامتك القادمة", heading: "شاليهات مختارة في الكويت", priceCaveat: "الأسعار كما ظهرت في المصدر، وقد تتغير حسب التاريخ والمناسبة.", list: "القائمة", map: "الخريطة",
    searchPlaceholder: "ابحث باسم الشاليه أو الميزة", filters: "الفلاتر", sort: "الترتيب:", featured: "المميزة أولًا", low: "السعر: الأقل", high: "السعر: الأعلى", mostRooms: "الأكثر غرفًا",
    filterResults: "تصفية النتائج", clearAll: "مسح الكل", area: "المنطقة", maxPrice: "أعلى سعر معلن", includesUnknown: "يشمل الأسعار غير المحددة", amenities: "المزايا", privatePool: "مسبح خاص", onSea: "على البحر", families: "للعائلات",
    beforeDeposit: "قبل دفع العربون", depositAdvice: "طابق اسم المعلن، عقد الإيجار، وسياسة الاسترداد في المصدر الأصلي.", result: "نتيجة مطابقة", favoritesOnly: "المفضلة فقط", reviewed: "آخر مراجعة للمصادر: 11 أغسطس 2026",
    illustrativeFor: "صورة تعبيرية لفئة", verified: "موثّق المصدر", confirmPrice: "السعر يحتاج إلى تأكيد", removeFavorite: "إزالة من المفضلة", saveFavorite: "حفظ في المفضلة", room: "غرف", bath: "حمامات", upTo: "حتى", guest: "ضيفًا", compareAdd: "أضف للمقارنة", compareAdded: "مضاف للمقارنة", details: "عرض التفاصيل", arrow: "←",
    emptyTitle: "لا توجد نتائج مطابقة", emptyText: "جرّب رفع السعر أو إزالة بعض المرشحات.", approximateMap: "توزيع تقريبي للإعلانات حسب مناطق الكويت", open: "فتح", price: "سعر", mapDisclaimer: "مواقع تقريبية حسب المنطقة — راجع الموقع الدقيق في المصدر", mapListings: "الإعلانات على الخريطة",
    trust1: "مصدر واضح", trust1Text: "كل بطاقة تقود إلى الإعلان الأصلي.", trust2: "مؤشر ثقة للسعر", trust2Text: "نميّز السعر الموثّق من السعر الذي يحتاج إلى تأكيد.", trust3: "لا حجوزات وهمية", trust3Text: "لا نجمع عربونًا ولا ندّعي توافرًا لحظيًا.",
    owners: "لأصحاب الشاليهات", ownerHeading: "اجعل إعلانك أوضح… وحجوزاتك أسهل", ownerText: "واجهة احترافية، وتقويم للتوافر، وتسعير موسمي، وسياسة حجز واضحة.", ownerSteps: "اعرف خطوات الإضافة",
    independent: "دليل مستقل لاستكشاف شاليهات الكويت.", listings: "الإعلانات", advertisers: "للمعلنين", disclaimer: "شاليهنا لا يملك الإعلانات المعروضة ولا يضمن التوافر. الصور تعبيرية، والمعلومات مختصرة من صفحات عامة مع رابط المصدر. تحقق قبل الدفع.", madeFor: "صُمم للكويت 🇰🇼",
    modalImage: "صورة تعبيرية لشاليه ساحلي", modalImageNote: "صورة تعبيرية وليست صورة الإعلان", reviewedOn: "تاريخ المراجعة:", mentionedAmenities: "المزايا المذكورة", source: "المصدر", sourceCaveat: "قد تختلف الأسعار والتوافر والشروط عند فتح المصدر.", openOriginal: "فتح الإعلان الأصلي ↗", close: "إغلاق",
    compareList: "قائمة المقارنة", removeCompare: "إزالة من المقارنة", ofThree: "من 3", chooseAnother: "اختر شاليهًا آخر", readyCompare: "جاهزة للمقارنة", compareNow: "قارن الآن", clear: "مسح", compareEyebrow: "قرار أسرع وأوضح", compareHeading: "قارن الشاليهات جنبًا إلى جنب", compareIntro: "المعلومات أدناه مختصرة من الإعلانات العامة؛ افتح المصدر قبل اتخاذ قرار الحجز.", chalet: "الشاليه", displayedPrice: "السعر المعلن", roomsBaths: "الغرف / الحمامات", capacity: "الاستيعاب", poolSea: "مسبح / بحر",
    launch: "نسخة إطلاق تجريبية", ownerEyebrow: "إضافة إعلان موثوق", ownerModalHeading: "جهّز شاليهك للعرض على شاليهنا", ownerModalText: "نحتاج إلى بيانات واضحة تمنح المستأجر ثقة أكبر. لا تُستقبل الطلبات آليًا في هذه النسخة بعد.", ownership: "إثبات الملكية أو التفويض", ownershipText: "لحماية الضيوف ومنع الإعلانات المنسوخة.", photos: "صور أصلية ومواصفات دقيقة", photosText: "السعة، والغرف، والمرافق، وقواعد الاستخدام.", calendar: "أسعار وتقويم وسياسة إلغاء", calendarText: "لإظهار السعر الحقيقي قبل دفع العربون.", previewListing: "استعرض شكل الإعلان",
    bookNow: "احجز الآن", bookingEyebrow: "طلب حجز آمن", bookingHeading: "أكمل بيانات إقامتك", bookingIntro: "أنشئ طلبًا متكاملًا للتحقق من التوافر، ثم تابع التأكيد مع المصدر الأصلي. لا يتم تحصيل أي مبلغ هنا.", bookingSteps: "التواريخ · الضيوف · التواصل", stayDetails: "تفاصيل الإقامة", contactDetails: "بيانات التواصل", checkIn: "تاريخ الوصول", checkOut: "تاريخ المغادرة", adults: "البالغون", children: "الأطفال", maxCapacity: "الحد الأقصى", fullName: "الاسم الكامل", phone: "رقم الهاتف", emailOptional: "البريد الإلكتروني (اختياري)", specialRequests: "طلبات خاصة (اختياري)", specialPlaceholder: "مثال: سرير طفل، أو وقت وصول متأخر، أو مناسبة عائلية", bookingSummary: "ملخص الطلب", stayLength: "مدة الإقامة", nights: "ليالٍ", oneNight: "ليلة", listedPrice: "السعر المعلن", estimatedTotal: "تقدير الإقامة", finalPriceNote: "السعر النهائي والتوافر يؤكدهما المعلن قبل الدفع.", privacyNote: "بياناتك لا تُحفظ على الموقع ولا تُرسل إلى أي طرف في هذه الخطوة.", agreement: "أوافق على مراجعة السعر والتوافر وهوية المعلن والعقد وسياسة الإلغاء قبل دفع أي عربون.", createRequest: "إنشاء طلب الحجز", dateError: "اختر تاريخ مغادرة بعد تاريخ الوصول.", capacityError: "عدد الضيوف يتجاوز سعة هذا الشاليه.", requiredError: "أكمل الحقول المطلوبة ووافق على تعليمات الحجز.", bookingSuccess: "تم تجهيز طلبك", bookingSuccessText: "هذا الطلب غير مؤكد بعد. استخدم المرجع أدناه وتابع مع المصدر الأصلي للتحقق من التوافر والسعر.", bookingReference: "مرجع الطلب", copyRequest: "نسخ ملخص الطلب", copied: "تم نسخ ملخص الطلب", continueSource: "متابعة التأكيد مع المصدر ↗", closeRequest: "إغلاق الطلب", requestPrepared: "تم تجهيز طلب الحجز", noPayment: "لا دفع الآن", perStayEstimate: "تقدير حسب عدد الليالي", totalGuests: "إجمالي الضيوف",
    saved: "حُفظ في المفضلة", removed: "أزيل من المفضلة", compareLimit: "يمكنك مقارنة 3 شاليهات كحد أقصى", addAnother: "أضف شاليهًا آخر لبدء المقارنة", addedCompare: "أُضيف إلى المقارنة",
  },
  en: {
    brandSub: "Kuwait Chalets", explore: "Explore", regions: "Regions", safetyGuide: "Safe booking guide",
    favorites: "Favorites", allListings: "All listings", addChalet: "List your chalet", language: "العربية",
    sourcePill: "Public listings curated from their sources", heroOne: "Your seaside escape", heroTwo: "starts here",
    heroText: "Compare Kuwait chalets, verify the price at its source and book with the details in hand.", curated: "curated listings", areas: "regions", sourceLinks: "source links", expressive: "Illustrative image",
    destination: "Destination", arrival: "Check-in", departure: "Check-out", guests: "Guests", upTo4: "Up to 4 guests", upTo8: "Up to 8 guests", upTo12: "Up to 12 guests", upTo20: "Up to 20 guests", search: "Search",
    popular: "Popular searches", eyebrow: "Discover your next stay", heading: "Selected chalets across Kuwait", priceCaveat: "Prices are shown as found at the source and may change by date or occasion.", list: "List", map: "Map",
    searchPlaceholder: "Search by chalet or amenity", filters: "Filters", sort: "Sort:", featured: "Featured first", low: "Price: low to high", high: "Price: high to low", mostRooms: "Most rooms",
    filterResults: "Filter results", clearAll: "Clear all", area: "Region", maxPrice: "Maximum listed price", includesUnknown: "Includes unlisted prices", amenities: "Amenities", privatePool: "Private pool", onSea: "Seafront", families: "Family-friendly",
    beforeDeposit: "Before paying a deposit", depositAdvice: "Match the advertiser’s name, rental agreement and refund policy at the original source.", result: "matching results", favoritesOnly: "favorites only", reviewed: "Sources last reviewed: August 11, 2026",
    illustrativeFor: "Illustrative image for", verified: "Source verified", confirmPrice: "Confirm price", removeFavorite: "Remove from favorites", saveFavorite: "Save to favorites", room: "rooms", bath: "bathrooms", upTo: "Up to", guest: "guests", compareAdd: "Add to compare", compareAdded: "Added to compare", details: "View details", arrow: "→",
    emptyTitle: "No matching results", emptyText: "Try raising the price limit or removing some filters.", approximateMap: "Approximate listing distribution across Kuwait", open: "Open", price: "Price", mapDisclaimer: "Approximate region-level locations — confirm the exact location at the source", mapListings: "Listings on the map",
    trust1: "Clear source", trust1Text: "Every card links to the original listing.", trust2: "Price confidence", trust2Text: "We distinguish sourced prices from those needing confirmation.", trust3: "No fake bookings", trust3Text: "We do not collect deposits or claim live availability.",
    owners: "For chalet owners", ownerHeading: "Make your listing clearer — and booking easier", ownerText: "A professional page, availability calendar, seasonal pricing and transparent booking terms.", ownerSteps: "See listing steps",
    independent: "An independent guide to discovering Kuwait chalets.", listings: "Listings", advertisers: "For advertisers", disclaimer: "Shalehna does not own these listings or guarantee availability. Images are illustrative and details are summarized from public pages with source links. Verify before paying.", madeFor: "Made for Kuwait 🇰🇼",
    modalImage: "Illustrative coastal chalet", modalImageNote: "Illustrative image — not the listing’s photo", reviewedOn: "reviewed", mentionedAmenities: "Listed amenities", source: "Source", sourceCaveat: "Prices, availability and conditions may differ when you open the source.", openOriginal: "Open original listing ↗", close: "Close",
    compareList: "Comparison list", removeCompare: "Remove from comparison", ofThree: "of 3", chooseAnother: "Choose another chalet", readyCompare: "Ready to compare", compareNow: "Compare now", clear: "Clear", compareEyebrow: "A faster, clearer decision", compareHeading: "Compare chalets side by side", compareIntro: "The information below is summarized from public listings; open the source before booking.", chalet: "Chalet", displayedPrice: "Listed price", roomsBaths: "Rooms / baths", capacity: "Capacity", poolSea: "Pool / sea",
    launch: "Launch preview", ownerEyebrow: "Add a trusted listing", ownerModalHeading: "Prepare your chalet for Shalehna", ownerModalText: "Clear details build guest confidence. Automated listing submissions are not enabled in this preview yet.", ownership: "Ownership or authorization proof", ownershipText: "Protects guests and prevents copied listings.", photos: "Original photos and accurate details", photosText: "Capacity, rooms, amenities and house rules.", calendar: "Pricing, calendar and cancellation", calendarText: "Shows the real price before any deposit is paid.", previewListing: "Preview a listing",
    bookNow: "Book now", bookingEyebrow: "Safe booking request", bookingHeading: "Complete your stay details", bookingIntro: "Create a complete availability request, then confirm it with the original source. No payment is collected here.", bookingSteps: "Dates · guests · contact", stayDetails: "Stay details", contactDetails: "Contact details", checkIn: "Check-in date", checkOut: "Check-out date", adults: "Adults", children: "Children", maxCapacity: "Maximum capacity", fullName: "Full name", phone: "Phone number", emailOptional: "Email (optional)", specialRequests: "Special requests (optional)", specialPlaceholder: "Example: baby cot, late arrival or family occasion", bookingSummary: "Request summary", stayLength: "Stay length", nights: "nights", oneNight: "night", listedPrice: "Listed price", estimatedTotal: "Stay estimate", finalPriceNote: "The advertiser confirms final price and availability before payment.", privacyNote: "Your details are not stored on this site or sent to any party at this step.", agreement: "I agree to verify the price, availability, advertiser identity, contract and cancellation policy before paying any deposit.", createRequest: "Create booking request", dateError: "Choose a check-out date after check-in.", capacityError: "The guest count exceeds this chalet’s capacity.", requiredError: "Complete the required fields and accept the booking guidance.", bookingSuccess: "Your request is ready", bookingSuccessText: "This booking is not confirmed yet. Use the reference below and continue with the original source to verify availability and price.", bookingReference: "Request reference", copyRequest: "Copy request summary", copied: "Request summary copied", continueSource: "Continue with source ↗", closeRequest: "Close request", requestPrepared: "Booking request prepared", noPayment: "No payment now", perStayEstimate: "Estimated by number of nights", totalGuests: "Total guests",
    saved: "Saved to favorites", removed: "Removed from favorites", compareLimit: "You can compare up to 3 chalets", addAnother: "Add another chalet to start comparing", addedCompare: "Added to comparison",
  },
} as const;

export default function Home() {
  const [language, setLanguage] = useState<"ar" | "en">("ar");
  const [query, setQuery] = useState("");
  const [area, setArea] = useState("الكل");
  const [maxPrice, setMaxPrice] = useState(3000);
  const [poolOnly, setPoolOnly] = useState(false);
  const [seaOnly, setSeaOnly] = useState(false);
  const [familyOnly, setFamilyOnly] = useState(false);
  const [sort, setSort] = useState("featured");
  const [view, setView] = useState<"grid" | "map">("grid");
  const [favorites, setFavorites] = useState<number[]>([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [compare, setCompare] = useState<number[]>([]);
  const [compareOpen, setCompareOpen] = useState(false);
  const [selected, setSelected] = useState<Listing | null>(null);
  const [ownerOpen, setOwnerOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [searchArrival, setSearchArrival] = useState("");
  const [searchDeparture, setSearchDeparture] = useState("");
  const [searchGuests, setSearchGuests] = useState(8);
  const [bookingListing, setBookingListing] = useState<Listing | null>(null);
  const [bookingForm, setBookingForm] = useState<BookingForm>(emptyBookingForm);
  const [bookingError, setBookingError] = useState("");
  const [bookingReference, setBookingReference] = useState("");
  const isArabic = language === "ar";
  const t = ui[language];
  const minDate = new Date(Date.now() - new Date().getTimezoneOffset() * 60_000).toISOString().slice(0, 10);
  const localized = (listing: Listing) => isArabic ? {
    title: listing.title,
    place: listing.place,
    priceLabel: listing.priceLabel,
    period: listing.period,
    description: listing.description,
    amenities: listing.amenities,
  } : listingEnglish[listing.id];

  useEffect(() => {
    const saved = window.localStorage.getItem("shalehna-favorites");
    if (saved) setFavorites(JSON.parse(saved));
    const savedLanguage = window.localStorage.getItem("shalehna-language");
    if (savedLanguage === "en") setLanguage("en");
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = isArabic ? "rtl" : "ltr";
    document.title = isArabic ? "شاليهنا | شاليهات الكويت" : "Shalehna | Kuwait Chalets";
    window.localStorage.setItem("shalehna-language", language);
  }, [language, isArabic]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelected(null);
        setCompareOpen(false);
        setOwnerOpen(false);
        setBookingListing(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(""), 2400);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const next = listings.filter((listing) => {
      const matchesSearch =
        !normalized ||
        `${listing.title} ${listing.area} ${listing.place} ${listing.amenities.join(" ")} ${listingEnglish[listing.id].title} ${listingEnglish[listing.id].place} ${listingEnglish[listing.id].amenities.join(" ")}`
          .toLowerCase()
          .includes(normalized);
      const matchesArea = area === "الكل" || listing.area === area;
      const matchesPrice = listing.price === null || listing.price <= maxPrice;
      return (
        matchesSearch &&
        matchesArea &&
        matchesPrice &&
        (!showFavorites || favorites.includes(listing.id)) &&
        (!poolOnly || listing.pool) &&
        (!seaOnly || listing.sea) &&
        (!familyOnly || listing.family)
      );
    });

    return [...next].sort((a, b) => {
      if (sort === "low") return (a.price ?? 99999) - (b.price ?? 99999);
      if (sort === "high") return (b.price ?? -1) - (a.price ?? -1);
      if (sort === "rooms") return b.rooms - a.rooms;
      return Number(Boolean(b.featured)) - Number(Boolean(a.featured));
    });
  }, [query, area, maxPrice, poolOnly, seaOnly, familyOnly, sort, showFavorites, favorites]);

  const compareListings = useMemo(
    () => compare.map((id) => listings.find((listing) => listing.id === id)).filter(Boolean) as Listing[],
    [compare],
  );

  const bookingNights = useMemo(() => {
    if (!bookingForm.arrival || !bookingForm.departure) return 0;
    const arrival = new Date(`${bookingForm.arrival}T00:00:00`).getTime();
    const departure = new Date(`${bookingForm.departure}T00:00:00`).getTime();
    return Math.max(0, Math.round((departure - arrival) / 86_400_000));
  }, [bookingForm.arrival, bookingForm.departure]);

  const bookingEstimate = bookingListing?.price && bookingListing.category === "يومي" && bookingNights > 0
    ? bookingListing.price * bookingNights
    : null;

  const toggleFavorite = (id: number) => {
    setFavorites((current) => {
      const next = current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id];
      window.localStorage.setItem("shalehna-favorites", JSON.stringify(next));
      setToast(current.includes(id) ? t.removed : t.saved);
      return next;
    });
  };

  const toggleCompare = (id: number) => {
    setCompare((current) => {
      if (current.includes(id)) return current.filter((item) => item !== id);
      if (current.length === 3) {
        setToast(t.compareLimit);
        return current;
      }
      setToast(current.length === 0 ? t.addAnother : t.addedCompare);
      return [...current, id];
    });
  };

  const openBooking = (listing: Listing) => {
    setSelected(null);
    setBookingListing(listing);
    setBookingReference("");
    setBookingError("");
    setBookingForm({
      ...emptyBookingForm,
      arrival: searchArrival,
      departure: searchDeparture,
      adults: searchArrival || searchDeparture ? Math.min(searchGuests, listing.guests) : 2,
    });
  };

  const submitBooking = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!bookingListing) return;
    if (!bookingForm.arrival || !bookingForm.departure || !bookingForm.fullName.trim() || bookingForm.phone.trim().length < 8 || !bookingForm.agreed) {
      setBookingError(t.requiredError);
      return;
    }
    if (bookingNights < 1) {
      setBookingError(t.dateError);
      return;
    }
    if (bookingForm.adults + bookingForm.children > bookingListing.guests) {
      setBookingError(t.capacityError);
      return;
    }
    setBookingError("");
    setBookingReference(`SHL-${bookingListing.id}-${Date.now().toString(36).slice(-6).toUpperCase()}`);
  };

  const bookingSummaryText = bookingListing ? [
    `${t.bookingReference}: ${bookingReference}`,
    `${t.chalet}: ${localized(bookingListing).title}`,
    `${t.checkIn}: ${bookingForm.arrival}`,
    `${t.checkOut}: ${bookingForm.departure}`,
    `${t.totalGuests}: ${bookingForm.adults + bookingForm.children}`,
    `${t.fullName}: ${bookingForm.fullName}`,
    `${t.phone}: ${bookingForm.phone}`,
    `${t.listedPrice}: ${localized(bookingListing).priceLabel} — ${localized(bookingListing).period}`,
  ].join("\n") : "";

  const copyBookingSummary = async () => {
    if (!bookingSummaryText) return;
    await navigator.clipboard.writeText(bookingSummaryText);
    setToast(t.copied);
  };

  const submitSearch = (event: FormEvent) => {
    event.preventDefault();
    document.getElementById("results")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main lang={language}>
      <header className="site-header">
        <a className="brand" href="#top" aria-label={isArabic ? "شاليهنا — الرئيسية" : "Shalehna — Home"}>
          <span className="brand-mark" aria-hidden="true">ش</span>
          <span>
            <strong>{isArabic ? "شاليهنا" : "Shalehna"}</strong>
            <small>{t.brandSub}</small>
          </span>
        </a>
        <nav aria-label={isArabic ? "التنقل الرئيسي" : "Main navigation"}>
          <a href="#results">{t.explore}</a>
          <a href="#regions">{t.regions}</a>
          <a href="#trust">{t.safetyGuide}</a>
        </nav>
        <div className="header-actions">
          <button className="language-toggle" onClick={() => setLanguage(isArabic ? "en" : "ar")} aria-label={isArabic ? "Switch to English" : "التبديل إلى العربية"}>{t.language}</button>
          <button className={`favorites-link ${showFavorites ? "active" : ""}`} onClick={() => {
            setQuery("");
            setArea("الكل");
            setShowFavorites((current) => !current);
            document.getElementById("results")?.scrollIntoView({ behavior: "smooth" });
          }} aria-pressed={showFavorites} aria-label={`${t.favorites}، ${favorites.length}`}>
            <span aria-hidden="true">♡</span>
            <span>{showFavorites ? t.allListings : t.favorites}</span>
            {favorites.length > 0 && <b>{favorites.length}</b>}
          </button>
          <a className="owner-button" href="#owners">{t.addChalet}</a>
        </div>
      </header>

      <section className="hero" id="top">
        <img src="images/hero-chalet.webp" alt={isArabic ? "مشهد تعبيري لشاليه ساحلي حديث في الكويت" : "Illustrative modern coastal chalet in Kuwait"} />
        <div className="hero-shade" />
        <div className="hero-content">
          <div className="research-pill"><span>✓</span> {t.sourcePill}</div>
          <h1>{t.heroOne}<br />{t.heroTwo}</h1>
          <p>{t.heroText}</p>
          <div className="hero-proof">
            <span><b>12</b> {t.curated}</span>
            <i />
            <span><b>6</b> {t.areas}</span>
            <i />
            <span><b>100%</b> {t.sourceLinks}</span>
          </div>
        </div>
        <span className="illustrative-note">{t.expressive}</span>
      </section>

      <form className="search-panel" onSubmit={submitSearch} aria-label={isArabic ? "البحث عن شاليه" : "Search for a chalet"}>
        <label className="search-field location-field">
          <span>{t.destination}</span>
          <select value={area} onChange={(event) => setArea(event.target.value)}>
            {areas.map((item) => <option key={item} value={item}>{isArabic ? item : areaEnglish[item]}</option>)}
          </select>
        </label>
        <label className="search-field">
          <span>{t.arrival}</span>
          <input type="date" min={minDate} value={searchArrival} onChange={(event) => {
            const value = event.target.value;
            setSearchArrival(value);
            if (searchDeparture && searchDeparture <= value) setSearchDeparture("");
          }} aria-label={t.arrival} />
        </label>
        <label className="search-field">
          <span>{t.departure}</span>
          <input type="date" min={searchArrival || minDate} value={searchDeparture} onChange={(event) => setSearchDeparture(event.target.value)} aria-label={t.departure} />
        </label>
        <label className="search-field guests-field">
          <span>{t.guests}</span>
          <select aria-label={t.guests} value={searchGuests} onChange={(event) => setSearchGuests(Number(event.target.value))}>
            <option value="4">{t.upTo4}</option>
            <option value="8">{t.upTo8}</option>
            <option value="12">{t.upTo12}</option>
            <option value="20">{t.upTo20}</option>
          </select>
        </label>
        <button className="search-button" type="submit"><span aria-hidden="true">⌕</span> {t.search}</button>
      </form>

      <section className="quick-regions" id="regions" aria-label={t.popular}>
        <span>{t.popular}</span>
        {areas.slice(1).map((item) => (
          <button key={item} onClick={() => {
            setArea(item);
            document.getElementById("results")?.scrollIntoView({ behavior: "smooth" });
          }}>{isArabic ? item : areaEnglish[item]}</button>
        ))}
      </section>

      <section className="catalog" id="results">
        <div className="catalog-heading">
          <div>
            <p className="eyebrow">{t.eyebrow}</p>
            <h2>{t.heading}</h2>
            <p>{t.priceCaveat}</p>
          </div>
          <div className="view-actions">
            <button className={`view-button ${view === "grid" ? "active" : ""}`} onClick={() => setView("grid")}>▦ {t.list}</button>
            <button className={`view-button ${view === "map" ? "active" : ""}`} onClick={() => setView("map")}>⌖ {t.map}</button>
          </div>
        </div>

        <div className="catalog-toolbar">
          <div className="search-inline">
            <span aria-hidden="true">⌕</span>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t.searchPlaceholder} aria-label={t.searchPlaceholder} />
          </div>
          <button className="mobile-filter-button" onClick={() => setFiltersOpen(!filtersOpen)}>☷ {t.filters}</button>
          <label className="sort-select">
            <span>{t.sort}</span>
            <select value={sort} onChange={(event) => setSort(event.target.value)}>
              <option value="featured">{t.featured}</option>
              <option value="low">{t.low}</option>
              <option value="high">{t.high}</option>
              <option value="rooms">{t.mostRooms}</option>
            </select>
          </label>
        </div>

        <div className="catalog-layout">
          <aside className={`filters ${filtersOpen ? "open" : ""}`} aria-label={t.filterResults}>
            <div className="filter-head">
              <h3>{t.filterResults}</h3>
              <button onClick={() => {
                setArea("الكل"); setMaxPrice(3000); setPoolOnly(false); setSeaOnly(false); setFamilyOnly(false); setQuery(""); setShowFavorites(false);
              }}>{t.clearAll}</button>
            </div>
            <fieldset>
              <legend>{t.area}</legend>
              <div className="area-options">
                {areas.map((item) => (
                  <button className={area === item ? "selected" : ""} onClick={() => setArea(item)} key={item}>{isArabic ? item : areaEnglish[item]}</button>
                ))}
              </div>
            </fieldset>
            <fieldset>
              <legend>{t.maxPrice}</legend>
              <div className="price-readout"><b>{isArabic ? `${maxPrice.toLocaleString("ar-KW")} د.ك` : `KWD ${maxPrice.toLocaleString("en-US")}`}</b><span>{t.includesUnknown}</span></div>
              <input className="price-range" type="range" min="50" max="3000" step="50" value={maxPrice} onChange={(event) => setMaxPrice(Number(event.target.value))} aria-label={t.maxPrice} />
              <div className="range-labels"><span>50</span><span>3,000+</span></div>
            </fieldset>
            <fieldset>
              <legend>{t.amenities}</legend>
              <label className="check-row"><input type="checkbox" checked={poolOnly} onChange={(event) => setPoolOnly(event.target.checked)} /><span>{t.privatePool}</span><small>{listings.filter((x) => x.pool).length}</small></label>
              <label className="check-row"><input type="checkbox" checked={seaOnly} onChange={(event) => setSeaOnly(event.target.checked)} /><span>{t.onSea}</span><small>{listings.filter((x) => x.sea).length}</small></label>
              <label className="check-row"><input type="checkbox" checked={familyOnly} onChange={(event) => setFamilyOnly(event.target.checked)} /><span>{t.families}</span><small>{listings.filter((x) => x.family).length}</small></label>
            </fieldset>
            <div className="safety-note">
              <span aria-hidden="true">⌁</span>
              <div><b>{t.beforeDeposit}</b><p>{t.depositAdvice}</p></div>
            </div>
          </aside>

          <div className="results-column">
            <div className="results-meta"><span><b>{results.length}</b> {t.result} {showFavorites && <em>· {t.favoritesOnly}</em>}</span><span>{t.reviewed}</span></div>
            {view === "grid" ? (
              results.length > 0 ? <div className="listing-grid">
                {results.map((listing) => {
                  const item = localized(listing);
                  return <article className="listing-card" key={listing.id}>
                    <div className="card-image">
                      <img src={listing.image} alt={`${t.illustrativeFor} ${item.title}`} />
                      <div className="image-topline">
                        <span className={`confidence ${listing.confidence.includes("موثّق") ? "verified" : "confirm"}`}>{listing.confidence === "موثّق المصدر" ? "✓ " : "! "}{listing.confidence === "موثّق المصدر" ? t.verified : t.confirmPrice}</span>
                        <button className={`heart ${favorites.includes(listing.id) ? "saved" : ""}`} onClick={() => toggleFavorite(listing.id)} aria-label={favorites.includes(listing.id) ? t.removeFavorite : t.saveFavorite}>{favorites.includes(listing.id) ? "♥" : "♡"}</button>
                      </div>
                      <span className="photo-note">{t.expressive}</span>
                    </div>
                    <div className="card-body">
                      <div className="card-location"><span>⌖</span> {item.place}</div>
                      <h3 lang={isArabic ? "ar" : "en"}>{item.title}</h3>
                      <p className="card-description">{item.description}</p>
                      <div className="facts">
                        <span><b>{listing.rooms}</b> {t.room}</span>
                        <i />
                        <span><b>{listing.baths}</b> {t.bath}</span>
                        <i />
                        <span>{t.upTo} <b>{listing.guests}</b> {t.guest}</span>
                      </div>
                      <div className="amenity-row">
                        {item.amenities.slice(0, 3).map((amenity) => <span key={amenity}>{amenity}</span>)}
                      </div>
                      <button className={`compare-toggle ${compare.includes(listing.id) ? "selected" : ""}`} onClick={() => toggleCompare(listing.id)} aria-pressed={compare.includes(listing.id)}>
                        <span aria-hidden="true">{compare.includes(listing.id) ? "✓" : "+"}</span>
                        {compare.includes(listing.id) ? t.compareAdded : t.compareAdd}
                      </button>
                      <div className="card-footer">
                        <div className="price"><b>{item.priceLabel}</b><span>{item.period}</span></div>
                        <div className="card-actions">
                          <button className="card-details-button" onClick={() => setSelected(listing)}>{t.details}</button>
                          <button className="card-book-button" onClick={() => openBooking(listing)}>{t.bookNow} <span aria-hidden="true">{t.arrow}</span></button>
                        </div>
                      </div>
                    </div>
                  </article>;
                })}
              </div> : <div className="empty-state"><span>⌕</span><h3>{t.emptyTitle}</h3><p>{t.emptyText}</p></div>
            ) : (
              <div className="map-experience">
                <div className="map-board" role="img" aria-label={t.approximateMap}>
                  <div className="coast coast-one" /><div className="coast coast-two" />
                  {results.slice(0, 8).map((listing, index) => (
                    <button key={listing.id} className="map-pin" style={{ right: `${12 + (index % 4) * 19}%`, top: `${18 + Math.floor(index / 4) * 42 + (index % 2) * 8}%` }} onClick={() => setSelected(listing)} aria-label={`${t.open} ${localized(listing).title}`}>
                      <b>{listing.price ? (isArabic ? `${listing.price} د.ك` : `KWD ${listing.price}`) : t.price}</b><span>{isArabic ? listing.area : areaEnglish[listing.area]}</span>
                    </button>
                  ))}
                  <span className="map-disclaimer">{t.mapDisclaimer}</span>
                </div>
                <div className="map-list">
                  <h3>{t.mapListings}</h3>
                  {results.slice(0, 6).map((listing) => (
                    <button key={listing.id} onClick={() => setSelected(listing)}>
                      <img src={listing.image} alt="" />
                      <span><b>{localized(listing).title}</b><small>{isArabic ? listing.area : areaEnglish[listing.area]} · {localized(listing).priceLabel}</small></span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="trust-strip" id="trust">
        <div><span>01</span><b>{t.trust1}</b><p>{t.trust1Text}</p></div>
        <div><span>02</span><b>{t.trust2}</b><p>{t.trust2Text}</p></div>
        <div><span>03</span><b>{t.trust3}</b><p>{t.trust3Text}</p></div>
      </section>

      <section className="owner-cta" id="owners">
        <div><p className="eyebrow">{t.owners}</p><h2>{t.ownerHeading}</h2><p>{t.ownerText}</p></div>
        <button onClick={() => setOwnerOpen(true)}>{t.ownerSteps} <span>{t.arrow}</span></button>
      </section>

      <footer>
        <div className="footer-brand"><span className="brand-mark">ش</span><div><b>{isArabic ? "شاليهنا" : "Shalehna"}</b><p>{t.independent}</p></div></div>
        <div className="footer-links"><a href="#results">{t.listings}</a><a href="#trust">{t.safetyGuide}</a><a href="#owners">{t.advertisers}</a></div>
        <p className="disclaimer">{t.disclaimer}</p>
        <div className="footer-bottom"><span>© 2026 {isArabic ? "شاليهنا" : "Shalehna"}</span><span>{t.madeFor}</span></div>
      </footer>

      {selected && (
        <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.currentTarget === event.target) setSelected(null); }}>
          <section className="listing-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
            <button className="modal-close" onClick={() => setSelected(null)} aria-label={t.close}>×</button>
            <div className="modal-image"><img src={selected.image} alt={t.modalImage} /><span>{t.modalImageNote}</span></div>
            <div className="modal-content">
              <p className="modal-place">⌖ {localized(selected).place}</p>
              <h2 id="modal-title" lang={isArabic ? "ar" : "en"}>{localized(selected).title}</h2>
              <div className={`modal-confidence ${selected.confidence === "موثّق المصدر" ? "verified" : "confirm"}`}>{selected.confidence === "موثّق المصدر" ? "✓" : "!"} {selected.confidence === "موثّق المصدر" ? t.verified : t.confirmPrice} · {t.reviewedOn} {isArabic ? selected.checked : "August 11, 2026"}</div>
              <p className="modal-description">{localized(selected).description}</p>
              <div className="modal-facts"><span><b>{selected.rooms}</b> {t.room}</span><span><b>{selected.baths}</b> {t.bath}</span><span>{t.upTo} <b>{selected.guests}</b> {t.guest}</span></div>
              <h3>{t.mentionedAmenities}</h3>
              <div className="modal-amenities">{localized(selected).amenities.map((item) => <span key={item}>✓ {item}</span>)}</div>
              <div className="source-box"><span>{t.source}</span><b>{selected.source}</b><p>{t.sourceCaveat}</p></div>
              <div className="modal-price-row">
                <div><b>{localized(selected).priceLabel}</b><span>{localized(selected).period}</span></div>
                <div className="modal-price-actions">
                  <button onClick={() => openBooking(selected)}>{t.bookNow}</button>
                  <a href={selected.sourceUrl} target="_blank" rel="noreferrer">{t.openOriginal}</a>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}

      {bookingListing && (
        <div className="modal-backdrop booking-backdrop" role="presentation" onMouseDown={(event) => { if (event.currentTarget === event.target) setBookingListing(null); }}>
          <section className="booking-modal" role="dialog" aria-modal="true" aria-labelledby="booking-title">
            <button className="modal-close" onClick={() => setBookingListing(null)} aria-label={t.close}>×</button>
            {!bookingReference ? (
              <>
                <header className="booking-header">
                  <div>
                    <p className="eyebrow">{t.bookingEyebrow}</p>
                    <h2 id="booking-title">{t.bookingHeading}</h2>
                    <p>{t.bookingIntro}</p>
                  </div>
                  <span><b>✓</b>{t.noPayment}</span>
                </header>

                <div className="booking-property">
                  <img src={bookingListing.image} alt="" />
                  <div><b>{localized(bookingListing).title}</b><span>⌖ {localized(bookingListing).place}</span></div>
                  <small>{t.maxCapacity}: {bookingListing.guests} {t.guest}</small>
                </div>

                <form className="booking-layout" onSubmit={submitBooking} noValidate>
                  <div className="booking-form-pane">
                    <div className="booking-progress" aria-label={t.bookingSteps}>
                      <span><b>1</b>{t.checkIn}</span><i /><span><b>2</b>{t.guests}</span><i /><span><b>3</b>{t.contactDetails}</span>
                    </div>

                    <fieldset>
                      <legend>{t.stayDetails}</legend>
                      <div className="booking-field-grid">
                        <label><span>{t.checkIn} *</span><input type="date" min={minDate} value={bookingForm.arrival} onChange={(event) => {
                          const value = event.target.value;
                          setBookingForm((current) => ({ ...current, arrival: value, departure: current.departure && current.departure <= value ? "" : current.departure }));
                          setBookingError("");
                        }} required /></label>
                        <label><span>{t.checkOut} *</span><input type="date" min={bookingForm.arrival || minDate} value={bookingForm.departure} onChange={(event) => { setBookingForm((current) => ({ ...current, departure: event.target.value })); setBookingError(""); }} required /></label>
                        <label><span>{t.adults} *</span><input type="number" min="1" max={bookingListing.guests} value={bookingForm.adults} onChange={(event) => { setBookingForm((current) => ({ ...current, adults: Number(event.target.value) })); setBookingError(""); }} required /></label>
                        <label><span>{t.children}</span><input type="number" min="0" max={bookingListing.guests} value={bookingForm.children} onChange={(event) => { setBookingForm((current) => ({ ...current, children: Number(event.target.value) })); setBookingError(""); }} /></label>
                      </div>
                    </fieldset>

                    <fieldset>
                      <legend>{t.contactDetails}</legend>
                      <div className="booking-field-grid">
                        <label><span>{t.fullName} *</span><input type="text" autoComplete="name" value={bookingForm.fullName} onChange={(event) => { setBookingForm((current) => ({ ...current, fullName: event.target.value })); setBookingError(""); }} required /></label>
                        <label><span>{t.phone} *</span><input type="tel" inputMode="tel" autoComplete="tel" dir="ltr" placeholder="+965 5000 0000" value={bookingForm.phone} onChange={(event) => { setBookingForm((current) => ({ ...current, phone: event.target.value })); setBookingError(""); }} required /></label>
                        <label className="booking-wide-field"><span>{t.emailOptional}</span><input type="email" inputMode="email" autoComplete="email" dir="ltr" placeholder="name@example.com" value={bookingForm.email} onChange={(event) => setBookingForm((current) => ({ ...current, email: event.target.value }))} /></label>
                        <label className="booking-wide-field"><span>{t.specialRequests}</span><textarea rows={3} placeholder={t.specialPlaceholder} value={bookingForm.notes} onChange={(event) => setBookingForm((current) => ({ ...current, notes: event.target.value }))} /></label>
                      </div>
                    </fieldset>
                  </div>

                  <aside className="booking-summary">
                    <h3>{t.bookingSummary}</h3>
                    <dl>
                      <div><dt>{t.stayLength}</dt><dd>{bookingNights || "—"} {bookingNights === 1 ? t.oneNight : t.nights}</dd></div>
                      <div><dt>{t.totalGuests}</dt><dd>{bookingForm.adults + bookingForm.children} / {bookingListing.guests}</dd></div>
                      <div><dt>{t.listedPrice}</dt><dd><b>{localized(bookingListing).priceLabel}</b><small>{localized(bookingListing).period}</small></dd></div>
                      {bookingEstimate !== null && <div className="booking-estimate"><dt>{t.estimatedTotal}</dt><dd><b>{isArabic ? `${bookingEstimate.toLocaleString("ar-KW")} د.ك` : `KWD ${bookingEstimate.toLocaleString("en-US")}`}</b><small>{t.perStayEstimate}</small></dd></div>}
                    </dl>
                    <p className="booking-price-note">ⓘ {t.finalPriceNote}</p>
                    <label className="booking-agreement"><input type="checkbox" checked={bookingForm.agreed} onChange={(event) => { setBookingForm((current) => ({ ...current, agreed: event.target.checked })); setBookingError(""); }} /><span>{t.agreement}</span></label>
                    <p className="booking-privacy">⌁ {t.privacyNote}</p>
                    {bookingError && <p className="booking-error" role="alert">! {bookingError}</p>}
                    <button className="booking-submit" type="submit">{t.createRequest} <span aria-hidden="true">{t.arrow}</span></button>
                  </aside>
                </form>
              </>
            ) : (
              <div className="booking-success" role="status">
                <span className="booking-success-icon">✓</span>
                <p className="eyebrow">{t.requestPrepared}</p>
                <h2 id="booking-title">{t.bookingSuccess}</h2>
                <p>{t.bookingSuccessText}</p>
                <div className="booking-reference"><span>{t.bookingReference}</span><b dir="ltr">{bookingReference}</b></div>
                <div className="booking-success-summary">
                  <b>{localized(bookingListing).title}</b>
                  <span>{bookingForm.arrival} — {bookingForm.departure}</span>
                  <span>{t.totalGuests}: {bookingForm.adults + bookingForm.children}</span>
                </div>
                <div className="booking-success-actions">
                  <button onClick={copyBookingSummary}>{t.copyRequest}</button>
                  <a href={bookingListing.sourceUrl} target="_blank" rel="noreferrer">{t.continueSource}</a>
                  <button className="quiet" onClick={() => setBookingListing(null)}>{t.closeRequest}</button>
                </div>
              </div>
            )}
          </section>
        </div>
      )}

      {compare.length > 0 && (
        <div className="compare-tray" aria-label={t.compareList}>
          <div className="compare-previews">
            {compareListings.map((listing) => (
              <span key={listing.id} title={listing.title}>
                <img src={listing.image} alt="" />
                <button onClick={() => toggleCompare(listing.id)} aria-label={`${t.removeCompare} ${localized(listing).title}`}>×</button>
              </span>
            ))}
            {Array.from({ length: 3 - compare.length }).map((_, index) => <i key={index}>+</i>)}
          </div>
          <div className="compare-copy"><b>{compare.length} {t.ofThree}</b><span>{compare.length < 2 ? t.chooseAnother : t.readyCompare}</span></div>
          <button className="compare-now" disabled={compare.length < 2} onClick={() => setCompareOpen(true)}>{t.compareNow}</button>
          <button className="compare-clear" onClick={() => setCompare([])} aria-label={t.clear}>{t.clear}</button>
        </div>
      )}

      {compareOpen && (
        <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.currentTarget === event.target) setCompareOpen(false); }}>
          <section className="compare-modal" role="dialog" aria-modal="true" aria-labelledby="compare-title">
            <button className="modal-close" onClick={() => setCompareOpen(false)} aria-label={t.close}>×</button>
            <p className="eyebrow">{t.compareEyebrow}</p>
            <h2 id="compare-title">{t.compareHeading}</h2>
            <p className="compare-intro">{t.compareIntro}</p>
            <div className="compare-grid" style={{ "--compare-count": compareListings.length } as CSSProperties}>
              <div className="compare-labels" aria-hidden="true"><b>{t.chalet}</b><span>{t.displayedPrice}</span><span>{t.area}</span><span>{t.roomsBaths}</span><span>{t.capacity}</span><span>{t.poolSea}</span><span>{t.source}</span></div>
              {compareListings.map((listing) => (
                <article key={listing.id}>
                  <div className="compare-property"><img src={listing.image} alt="" /><b>{localized(listing).title}</b></div>
                  <span><b>{localized(listing).priceLabel}</b><small>{localized(listing).period}</small></span>
                  <span>{isArabic ? listing.area : areaEnglish[listing.area]}</span>
                  <span>{listing.rooms} / {listing.baths}</span>
                  <span>{t.upTo} {listing.guests} {t.guest}</span>
                  <span>{listing.pool ? "✓" : "—"} / {listing.sea ? "✓" : "—"}</span>
                  <a href={listing.sourceUrl} target="_blank" rel="noreferrer">{listing.source} ↗</a>
                </article>
              ))}
            </div>
          </section>
        </div>
      )}

      {ownerOpen && (
        <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.currentTarget === event.target) setOwnerOpen(false); }}>
          <section className="owner-modal" role="dialog" aria-modal="true" aria-labelledby="owner-title">
            <button className="modal-close" onClick={() => setOwnerOpen(false)} aria-label={t.close}>×</button>
            <span className="launch-badge">{t.launch}</span>
            <p className="eyebrow">{t.ownerEyebrow}</p>
            <h2 id="owner-title">{t.ownerModalHeading}</h2>
            <p>{t.ownerModalText}</p>
            <div className="owner-steps">
              <div><span>01</span><b>{t.ownership}</b><small>{t.ownershipText}</small></div>
              <div><span>02</span><b>{t.photos}</b><small>{t.photosText}</small></div>
              <div><span>03</span><b>{t.calendar}</b><small>{t.calendarText}</small></div>
            </div>
            <button className="owner-modal-action" onClick={() => { setOwnerOpen(false); document.getElementById("results")?.scrollIntoView({ behavior: "smooth" }); }}>{t.previewListing}</button>
          </section>
        </div>
      )}

      {toast && <div className="toast" role="status">✓ {toast}</div>}
    </main>
  );
}
