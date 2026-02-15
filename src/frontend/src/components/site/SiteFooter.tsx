import { Heart } from 'lucide-react';
import { SiFacebook, SiInstagram, SiX, SiYoutube, SiWhatsapp } from 'react-icons/si';
import { CONTACT } from '../../constants/contact';

export default function SiteFooter() {
  const currentYear = new Date().getFullYear();
  const appIdentifier = encodeURIComponent(window.location.hostname || 'nath-cyber-cafe');

  return (
    <footer className="border-t bg-muted/30">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">Nath Cyber Cafe</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Professional Graphic Design, Academic Support & Government Job Updates
            </p>
            <div className="flex space-x-4">
              <a
                href={CONTACT.youtubeChannel}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="YouTube Channel"
              >
                <SiYoutube className="h-5 w-5" />
              </a>
              <a
                href={CONTACT.whatsappChannel}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="WhatsApp Channel"
              >
                <SiWhatsapp className="h-5 w-5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Facebook"
              >
                <SiFacebook className="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Instagram"
              >
                <SiInstagram className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="X (Twitter)"
              >
                <SiX className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Contact</h3>
            <div className="space-y-2">
              <div>
                <p className="text-sm font-medium mb-1">Phone:</p>
                {CONTACT.whatsappNumbers.map((item, index) => (
                  <p key={index} className="text-sm text-muted-foreground">
                    <a href={`tel:${item.number}`} className="hover:text-primary transition-colors">
                      {item.display}
                    </a>
                  </p>
                ))}
              </div>
              <div>
                <p className="text-sm font-medium mb-1">WhatsApp:</p>
                {CONTACT.whatsappNumbers.map((item, index) => (
                  <p key={index} className="text-sm text-muted-foreground">
                    <a
                      href={item.waLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-primary transition-colors"
                    >
                      {item.display}
                    </a>
                  </p>
                ))}
              </div>
              <div>
                <p className="text-sm font-medium mb-1">Email:</p>
                <p className="text-sm text-muted-foreground">
                  <a
                    href={`mailto:${CONTACT.email}`}
                    className="hover:text-primary transition-colors"
                  >
                    {CONTACT.email}
                  </a>
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Disclaimer</h3>
            <p className="text-sm text-muted-foreground">
              This website provides information and official links for government jobs. We are not a government organization.
            </p>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>
            © {currentYear} Nath Cyber Cafe. All rights reserved.
          </p>
          <p className="mt-2 flex items-center justify-center gap-1">
            Built with <Heart className="h-4 w-4 text-red-500 fill-red-500" /> using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appIdentifier}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
