import { createClient } from "@/lib/supabase/server";
import Hero from "@/components/public/Hero";
import About from "@/components/public/About";
import Services from "@/components/public/Services";
import Portfolio from "@/components/public/Portfolio";
import Testimonials from "@/components/public/Testimonials";
import Contact from "@/components/public/Contact";
import {
  HeroSection,
  AboutSection,
  Service,
  PortfolioItem,
  Testimonial,
} from "@/lib/types";

export const revalidate = 60;

async function getData() {
  const supabase = await createClient();

  const [hero, about, services, portfolio, testimonials] = await Promise.all([
    supabase.from("hero_section").select("*").single(),
    supabase.from("about_section").select("*").single(),
    supabase
      .from("services")
      .select("*")
      .order("order_index", { ascending: true }),
    supabase
      .from("portfolio_items")
      .select("*")
      .order("order_index", { ascending: true }),
    supabase
      .from("testimonials")
      .select("*")
      .order("order_index", { ascending: true }),
  ]);

  return {
    hero: hero.data as HeroSection,
    about: about.data as AboutSection,
    services: (services.data ?? []) as Service[],
    portfolio: (portfolio.data ?? []) as PortfolioItem[],
    testimonials: (testimonials.data ?? []) as Testimonial[],
  };
}

export default async function HomePage() {
  const { hero, about, services, portfolio, testimonials } = await getData();

  return (
    <>
      {hero && <Hero data={hero} />}
      {about && <About data={about} />}
      {services.length > 0 && <Services data={services} />}
      <Portfolio data={portfolio} />
      {testimonials.length > 0 && <Testimonials data={testimonials} />}
      <Contact />
    </>
  );
}
