import { Button } from '@/components/ui/button';
import { useNavigate } from '@tanstack/react-router';
import { ArrowRight, Briefcase, MessageCircle } from 'lucide-react';

export default function HeroSection() {
  const navigate = useNavigate();

  const handleExploreServices = () => {
    const element = document.getElementById('services');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleJobsClick = () => {
    navigate({ to: '/jobs' });
  };

  const handleWhatsAppClick = () => {
    window.open('https://wa.me/919435212145?text=Hello!%20I%20would%20like%20to%20know%20more%20about%20your%20services.', '_blank');
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-accent/5 to-background">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="container relative py-20 md:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Professional Graphic Design, Academic Support & Government Job Updates
            </h1>
            <p className="text-xl text-muted-foreground">
              Complete Digital & Documentation Services Under One Roof
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" onClick={handleExploreServices} className="group">
                Explore Services
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button size="lg" variant="outline" onClick={handleJobsClick} className="group">
                <Briefcase className="mr-2 h-4 w-4" />
                Latest Government Jobs
              </Button>
              <Button size="lg" variant="secondary" onClick={handleWhatsAppClick} className="group">
                <MessageCircle className="mr-2 h-4 w-4" />
                Contact via WhatsApp
              </Button>
            </div>
          </div>
          <div className="relative">
            <img
              src="/assets/generated/hero-bg.dim_1920x800.png"
              alt="Nath Cyber Cafe Services"
              className="w-full h-auto rounded-lg shadow-soft"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
