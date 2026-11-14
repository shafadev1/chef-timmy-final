import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = url && key ? createClient(url, key) : null;

// Isi bawaan: dipakai kalau Supabase belum diatur atau datanya kosong.
export const defaults: Record<string, string> = {
  hero_title: "Timmy Pramudyo",
  hero_role: "Executive Chef  |  Corporate Chef  |  F&B Business Consultant",
  hero_tagline: "A Personal Journey Through Food, Passion & Purpose",
  hero_image: "/images/hero.png",
  profile_text:
    "A culinary and food & beverage professional with experience across hotels, restaurants, catering, corporate culinary operations, and independent F&B ventures since 2011.",
  story_title: "Beyond the Kitchen",
  story_body:
    "My journey began with a simple desire to cook. And to this day, it is that same desire to keep learning that keeps me in the kitchen.",
  story_quote: "Being a chef means always having a reason to keep learning.",
  story_image: "",
  btp_title: "Beyond the Plate",
  btp_body: "Before the kitchen, there was basketball. Away from the pass, you will still find him on the court, with his dogs close by.",
  btp_image: "",
  consulting_hero_title: "From concept to a kitchen that runs itself.",
  consulting_hero_text: "Food and beverage consulting for cafes, restaurants, caterers and hotels. From the first idea to the first service and beyond.",
  consulting_duration_note: "Projects usually run three to six months, depending on the concept.",
  consulting_why_title: "Built from the inside.",
  consulting_why_text: "Chef Timmy has worked every side of the industry: hotel and restaurant kitchens since 2011, five ventures of his own, and a corporate role leading more than 200 team members across Indonesia. Consulting is where that experience goes to work for your business.",
  whatsapp_number: "",
  whatsapp_message: "Hello Chef Timmy, I am interested in your private chef service.",
  instagram_url: "",
  linkedin_url: "",
  autobiography_url: "",
  cv_url: "",
  autobiography_button_label: "Download Autobiography",
  core_expertise:
    "Culinary Leadership|Menu Development & R&D|Kitchen Operations|Food Cost & COGS|SOP & Quality Control|Procurement & Inventory|F&B Consulting|Restaurant Concept Development|Team Training|Business Operations",
};

export type Stat = { value: string; label: string };
export type GalleryItem = {
  id: string; title: string | null; category: string; image_url: string;
  story: string | null; is_signature: boolean;
};

const GALLERY_COLS = "id,title,category,image_url,story,is_signature";

export const defaultStats: Stat[] = [
  { value: "15", label: "Years in professional kitchens" },
  { value: "200+", label: "Team members led across Indonesia" },
  { value: "5", label: "F&B ventures founded" },
  { value: "9", label: "Consulting clients" },
];

export async function getSiteContent(): Promise<Record<string, string>> {
  const out = { ...defaults };
  if (!supabase) return out;
  try {
    const { data } = await supabase.from("site_content").select("key,value");
    data?.forEach((r) => { if (r.value) out[r.key] = r.value; });
  } catch {}
  return out;
}

export async function getStats(): Promise<Stat[]> {
  if (!supabase) return defaultStats;
  try {
    const { data } = await supabase
      .from("stats").select("value,label").eq("is_published", true).order("sort_order");
    if (data && data.length) return data;
  } catch {}
  return defaultStats;
}

// Foto untuk Home: yang ditandai bintang di admin. Kalau belum ada yang ditandai, ambil yang pertama.
export async function getGallery(limit = 6): Promise<GalleryItem[]> {
  if (!supabase) return [];
  try {
    const feat = await supabase
      .from("gallery_items").select(GALLERY_COLS)
      .eq("is_published", true).eq("is_featured", true)
      .order("sort_order").limit(limit);
    if (!feat.error && feat.data && feat.data.length) return feat.data as GalleryItem[];
    const all = await supabase
      .from("gallery_items").select(GALLERY_COLS)
      .eq("is_published", true).order("sort_order").limit(limit);
    return (all.data as GalleryItem[]) ?? [];
  } catch {
    return [];
  }
}

// Semua foto untuk halaman Gallery.
export async function getAllGallery(): Promise<GalleryItem[]> {
  if (!supabase) return [];
  try {
    const { data } = await supabase
      .from("gallery_items").select(GALLERY_COLS)
      .eq("is_published", true).order("sort_order");
    return (data as GalleryItem[]) ?? [];
  } catch {
    return [];
  }
}

// Tautan unduh PDF: Supabase memaksa unduh kalau ada parameter ?download=
export function downloadUrl(url: string, filename: string): string {
  return `${url}${url.includes("?") ? "&" : "?"}download=${encodeURIComponent(filename)}`;
}

export function whatsappLink(c: Record<string, string>): string {
  const num = (c.whatsapp_number || "").replace(/\D/g, "");
  if (!num) return "#contact";
  return `https://wa.me/${num}?text=${encodeURIComponent(c.whatsapp_message)}`;
}

/* ---------- Private chef ---------- */
export type Pkg = {
  id: string; name: string; description: string;
  price_from: number | null; price_unit: string | null;
  min_guests: number | null; max_guests: number | null;
  includes: string[]; excludes: string[];
};
export type MenuCourse = { label: string; dish: string; note?: string };
export type SampleMenu = { id: string; name: string; description: string | null; courses: MenuCourse[] };
export type Faq = { id: string; question: string; answer: string };

// Dipakai hanya kalau tabel packages masih kosong. Tanpa harga: harga diisi Chef lewat admin.
export const defaultPackages: Pkg[] = [
  { id: "d1", name: "Intimate Dinner", description: "A multi-course dinner for a small table, cooked and plated at your home or villa.", price_from: null, price_unit: "per guest", min_guests: null, max_guests: null, includes: [], excludes: [] },
  { id: "d2", name: "Tasting Menu", description: "A longer, chef-led tasting experience built around seasonal ingredients.", price_from: null, price_unit: "per guest", min_guests: null, max_guests: null, includes: [], excludes: [] },
  { id: "d3", name: "Private Event", description: "Menus and service for celebrations and gatherings, shaped around your guest list.", price_from: null, price_unit: "per guest", min_guests: null, max_guests: null, includes: [], excludes: [] },
];

export async function getPackages(): Promise<Pkg[]> {
  if (!supabase) return defaultPackages;
  try {
    const { data } = await supabase
      .from("packages")
      .select("id,name,description,price_from,price_unit,min_guests,max_guests,includes,excludes")
      .eq("is_published", true).order("sort_order");
    if (data && data.length) return data as Pkg[];
  } catch {}
  return defaultPackages;
}

export async function getMenus(): Promise<SampleMenu[]> {
  if (!supabase) return [];
  try {
    const { data } = await supabase
      .from("sample_menus").select("id,name,description,courses")
      .eq("is_published", true).order("sort_order");
    return (data as SampleMenu[]) ?? [];
  } catch {
    return [];
  }
}

export async function getFaqs(): Promise<Faq[]> {
  if (!supabase) return [];
  try {
    const { data } = await supabase
      .from("faqs").select("id,question,answer")
      .eq("is_published", true).order("sort_order");
    // sembunyikan jawaban placeholder dari skema awal
    return ((data as Faq[]) ?? []).filter((f) => f.answer && !f.answer.startsWith("Edit this answer"));
  } catch {
    return [];
  }
}

export function formatPrice(p: Pkg): string {
  if (!p.price_from) return "Price on request";
  return `From Rp ${Number(p.price_from).toLocaleString("id-ID")}${p.price_unit ? ` ${p.price_unit}` : ""}`;
}

/* ---------- Experience ---------- */
export type Experience = {
  id: string; organization: string; role: string; location: string | null;
  period: string | null; category: "employment" | "venture" | "consulting" | "partnership";
};

export async function getExperiences(): Promise<Experience[]> {
  if (!supabase) return [];
  try {
    const { data } = await supabase
      .from("experiences").select("id,organization,role,location,period,category")
      .eq("is_published", true).order("sort_order");
    return (data as Experience[]) ?? [];
  } catch {
    return [];
  }
}

/* ---------- Consulting ---------- */
export type ConsultingItem = { id: string; title: string; description: string };

export const defaultConsultingServices: ConsultingItem[] = [
  { id: "s1", title: "Menu Development", description: "Menus built around your concept, your guests and your costs, with standardized recipes and food costing." },
  { id: "s2", title: "Concept", description: "A clear identity and direction for your venue, from positioning and offer to how it feels to walk in." },
  { id: "s3", title: "Training", description: "Hands-on training for kitchen, bar and service teams, so standards hold on a busy night." },
  { id: "s4", title: "Kitchen Management", description: "Workflow, SOPs, purchasing and inventory that keep quality steady and waste low." },
  { id: "s5", title: "Bar Management", description: "Drinks programs, bar operations and cost control that fit the concept." },
  { id: "s6", title: "Service", description: "Service standards and floor routines that turn good food into a good experience." },
  { id: "s7", title: "Business", description: "Financial planning, pricing and operating systems so the venture is commercially sound." },
];

export const defaultConsultingSteps: ConsultingItem[] = [
  { id: "p1", title: "Discovery", description: "We learn your business, your market, your location and your budget." },
  { id: "p2", title: "Concept & Menu", description: "We shape the concept and identity, then develop the menu with full costing." },
  { id: "p3", title: "Systems & Team", description: "We write the standards and SOPs, set up kitchen and bar, and help build the team." },
  { id: "p4", title: "Training & Launch", description: "We train the kitchen, bar and service teams, then support the opening." },
  { id: "p5", title: "Handover & Review", description: "After opening we review results together and hand the operation over to your team." },
];

async function getConsultingList(table: string, fallback: ConsultingItem[]): Promise<ConsultingItem[]> {
  if (!supabase) return fallback;
  try {
    const { data } = await supabase
      .from(table).select("id,title,description").eq("is_published", true).order("sort_order");
    if (data && data.length) return data as ConsultingItem[];
  } catch {}
  return fallback;
}

export const getConsultingServices = () => getConsultingList("consulting_services", defaultConsultingServices);
export const getConsultingSteps = () => getConsultingList("consulting_steps", defaultConsultingSteps);

export async function getConsultingClients(): Promise<{ id: string; organization: string; location: string | null }[]> {
  if (!supabase) return [];
  try {
    const { data } = await supabase
      .from("experiences").select("id,organization,location")
      .eq("category", "consulting").eq("is_published", true).order("sort_order");
    return data ?? [];
  } catch {
    return [];
  }
}
