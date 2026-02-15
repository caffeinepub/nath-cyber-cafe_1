import { Outlet } from '@tanstack/react-router';
import SiteHeader from './SiteHeader';
import SiteFooter from './SiteFooter';
import WhatsAppFloatingButton from './WhatsAppFloatingButton';

export default function SiteLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <SiteFooter />
      <WhatsAppFloatingButton />
    </div>
  );
}
