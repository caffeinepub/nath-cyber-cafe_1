import HeroSection from '../components/site/HeroSection';
import ServicesSection from '../components/site/ServicesSection';
import PortfolioSection from '../components/site/PortfolioSection';
import TestimonialsSection from '../components/site/TestimonialsSection';
import ContactSection from '../components/site/ContactSection';
import Seo from '../components/seo/Seo';

export default function HomePage() {
  return (
    <>
      <Seo
        title="Nath Cyber Cafe - Professional Graphic Design & Government Job Updates"
        description="Complete Digital & Documentation Services Under One Roof. Graphic Design, Academic Support, and Latest Government Job Updates in one place."
      />
      <HeroSection />
      <ServicesSection />
      <PortfolioSection />
      <TestimonialsSection />
      <ContactSection />
    </>
  );
}
