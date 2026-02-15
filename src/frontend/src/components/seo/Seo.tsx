import { useEffect } from 'react';
import { CONTACT } from '../../constants/contact';

interface SeoProps {
  title: string;
  description: string;
}

export default function Seo({ title, description }: SeoProps) {
  useEffect(() => {
    document.title = title;
    
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', description);

    // Add JSON-LD schema
    let script = document.querySelector('script[type="application/ld+json"]');
    if (!script) {
      script = document.createElement('script');
      script.setAttribute('type', 'application/ld+json');
      document.head.appendChild(script);
    }

    const schema = {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: 'Nath Cyber Cafe',
      telephone: CONTACT.whatsappNumbers.map(item => item.number),
      email: CONTACT.email,
      description: 'Professional Graphic Design, Academic Support & Government Job Updates',
      priceRange: '$$',
      sameAs: [
        CONTACT.youtubeChannel,
        CONTACT.whatsappChannel,
      ],
    };

    script.textContent = JSON.stringify(schema);
  }, [title, description]);

  return null;
}
