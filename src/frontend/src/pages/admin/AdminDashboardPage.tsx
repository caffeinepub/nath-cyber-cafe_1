import AdminRouteGuard from '../../components/admin/AdminRouteGuard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from '@tanstack/react-router';
import { Briefcase, Tag, DollarSign, Star, Mail, FileText } from 'lucide-react';

export default function AdminDashboardPage() {
  const navigate = useNavigate();

  const adminSections = [
    {
      title: 'Job Posts',
      description: 'Manage government job listings',
      icon: Briefcase,
      path: '/admin/jobs',
    },
    {
      title: 'Categories',
      description: 'Enable/disable job categories',
      icon: Tag,
      path: '/admin/categories',
    },
    {
      title: 'Service Pricing',
      description: 'Update service prices',
      icon: DollarSign,
      path: '/admin/service-pricing',
    },
    {
      title: 'Testimonials',
      description: 'Manage customer testimonials',
      icon: Star,
      path: '/admin/testimonials',
    },
    {
      title: 'Contact Submissions',
      description: 'View contact form messages',
      icon: Mail,
      path: '/admin/contacts',
    },
    {
      title: 'Blog Posts',
      description: 'Create and manage blog content',
      icon: FileText,
      path: '/admin/blog',
    },
  ];

  return (
    <AdminRouteGuard>
      <div className="container py-12">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your website content and settings</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminSections.map((section) => {
            const Icon = section.icon;
            return (
              <Card key={section.path} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Icon className="h-8 w-8 text-primary mb-2" />
                  <CardTitle>{section.title}</CardTitle>
                  <CardDescription>{section.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button onClick={() => navigate({ to: section.path })} className="w-full">
                    Manage
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </AdminRouteGuard>
  );
}
