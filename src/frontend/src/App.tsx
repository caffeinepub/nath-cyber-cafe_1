import { lazy, Suspense } from 'react';
import { RouterProvider, createRouter, createRoute, createRootRoute } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import SiteLayout from './components/site/SiteLayout';
import HomePage from './pages/HomePage';
import { Loader2 } from 'lucide-react';

const JobsPage = lazy(() => import('./pages/JobsPage'));
const BlogListPage = lazy(() => import('./pages/BlogListPage'));
const BlogPostPage = lazy(() => import('./pages/BlogPostPage'));
const AdminDashboardPage = lazy(() => import('./pages/admin/AdminDashboardPage'));
const AdminJobsPage = lazy(() => import('./pages/admin/AdminJobsPage'));
const AdminCategoriesPage = lazy(() => import('./pages/admin/AdminCategoriesPage'));
const AdminServicePricingPage = lazy(() => import('./pages/admin/AdminServicePricingPage'));
const AdminTestimonialsPage = lazy(() => import('./pages/admin/AdminTestimonialsPage'));
const AdminContactsPage = lazy(() => import('./pages/admin/AdminContactsPage'));
const AdminBlogPage = lazy(() => import('./pages/admin/AdminBlogPage'));

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <Loader2 className="w-8 h-8 animate-spin text-primary" />
  </div>
);

const rootRoute = createRootRoute({
  component: SiteLayout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const jobsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/jobs',
  component: () => (
    <Suspense fallback={<LoadingFallback />}>
      <JobsPage />
    </Suspense>
  ),
});

const blogListRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/blog',
  component: () => (
    <Suspense fallback={<LoadingFallback />}>
      <BlogListPage />
    </Suspense>
  ),
});

const blogPostRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/blog/$postId',
  component: () => (
    <Suspense fallback={<LoadingFallback />}>
      <BlogPostPage />
    </Suspense>
  ),
});

const adminDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: () => (
    <Suspense fallback={<LoadingFallback />}>
      <AdminDashboardPage />
    </Suspense>
  ),
});

const adminJobsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/jobs',
  component: () => (
    <Suspense fallback={<LoadingFallback />}>
      <AdminJobsPage />
    </Suspense>
  ),
});

const adminCategoriesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/categories',
  component: () => (
    <Suspense fallback={<LoadingFallback />}>
      <AdminCategoriesPage />
    </Suspense>
  ),
});

const adminServicePricingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/service-pricing',
  component: () => (
    <Suspense fallback={<LoadingFallback />}>
      <AdminServicePricingPage />
    </Suspense>
  ),
});

const adminTestimonialsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/testimonials',
  component: () => (
    <Suspense fallback={<LoadingFallback />}>
      <AdminTestimonialsPage />
    </Suspense>
  ),
});

const adminContactsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/contacts',
  component: () => (
    <Suspense fallback={<LoadingFallback />}>
      <AdminContactsPage />
    </Suspense>
  ),
});

const adminBlogRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/blog',
  component: () => (
    <Suspense fallback={<LoadingFallback />}>
      <AdminBlogPage />
    </Suspense>
  ),
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  jobsRoute,
  blogListRoute,
  blogPostRoute,
  adminDashboardRoute,
  adminJobsRoute,
  adminCategoriesRoute,
  adminServicePricingRoute,
  adminTestimonialsRoute,
  adminContactsRoute,
  adminBlogRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  );
}
