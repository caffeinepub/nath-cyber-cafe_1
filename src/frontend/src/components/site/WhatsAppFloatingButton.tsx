import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CONTACT } from '../../constants/contact';

export default function WhatsAppFloatingButton() {
  const message = encodeURIComponent('Hello! I would like to know more about your services.');

  return (
    <a
      href={`https://wa.me/${CONTACT.primaryWhatsApp}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50"
      aria-label="Contact us on WhatsApp"
    >
      <Button
        size="lg"
        className="rounded-full h-14 w-14 shadow-lg hover:shadow-xl transition-all bg-[#25D366] hover:bg-[#20BA5A] text-white"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    </a>
  );
}
