import { useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, X } from 'lucide-react';
import LoginButton from '../auth/LoginButton';

export default function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const navLinks = [
    { label: 'Home', href: '/', anchor: null },
    { label: 'Services', href: '/', anchor: 'services' },
    { label: 'Jobs', href: '/jobs', anchor: null },
    { label: 'Portfolio', href: '/', anchor: 'portfolio' },
    { label: 'Testimonials', href: '/', anchor: 'testimonials' },
    { label: 'Blog', href: '/blog', anchor: null },
    { label: 'Contact', href: '/', anchor: 'contact' },
    { label: 'Admin', href: '/admin', anchor: null },
  ];

  const handleNavClick = (href: string, anchor: string | null) => {
    setIsOpen(false);
    if (anchor) {
      navigate({ to: href });
      setTimeout(() => {
        const element = document.getElementById(anchor);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      navigate({ to: href });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <img src="/assets/generated/logo-nath-cyber-cafe.dim_512x512.png" alt="Nath Cyber Cafe" className="h-10 w-10" />
          <span className="font-bold text-xl text-primary">Nath Cyber Cafe</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => handleNavClick(link.href, link.anchor)}
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              {link.label}
            </button>
          ))}
          <LoginButton />
        </nav>

        {/* Mobile Navigation */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <nav className="flex flex-col space-y-4 mt-8">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => handleNavClick(link.href, link.anchor)}
                  className="text-left text-lg font-medium transition-colors hover:text-primary"
                >
                  {link.label}
                </button>
              ))}
              <div className="pt-4">
                <LoginButton />
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
