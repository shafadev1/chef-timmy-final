import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { getSiteContent, whatsappLink } from "@/lib/content";

export const revalidate = 60;

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const c = await getSiteContent();
  const wa = whatsappLink(c);
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer instagram={c.instagram_url} linkedin={c.linkedin_url} whatsapp={wa} />
      <WhatsAppButton href={wa} />
    </>
  );
}