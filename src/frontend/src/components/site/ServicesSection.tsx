import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useGetAllServicePricing } from '../../hooks/useQueries';
import { Palette, FileText, GraduationCap, Loader2 } from 'lucide-react';

const graphicDesignServices = [
  { name: 'Logo Design', icon: '🎨', description: 'Professional logo design for your brand identity' },
  { name: 'Resume / CV Design', icon: '📄', description: 'Stand out with professionally designed resumes' },
  { name: 'Visiting Card Design', icon: '💼', description: 'Make a lasting impression with custom business cards' },
  { name: 'Banner & Poster Design', icon: '🖼️', description: 'Eye-catching banners and posters for any occasion' },
  { name: 'Social Media Post Design', icon: '📱', description: 'Engaging social media graphics that get noticed' },
  { name: 'Invitation Card Design', icon: '💌', description: 'Beautiful invitations for your special events' },
  { name: 'Flex & Print Design', icon: '🖨️', description: 'Large format printing designs for maximum impact' },
  { name: 'Passport Photo Editing', icon: '📸', description: 'Professional passport photo editing services' },
];

export default function ServicesSection() {
  const { data: servicePricing, isLoading } = useGetAllServicePricing();

  const getPriceForService = (serviceName: string) => {
    if (!servicePricing) return 'Contact for pricing';
    const pricing = servicePricing.find(([_, p]) => p.serviceName === serviceName);
    return pricing ? pricing[1].price : 'Contact for pricing';
  };

  const handleOrderNow = (serviceName: string) => {
    const message = encodeURIComponent(`Hello! I would like to order: ${serviceName}`);
    window.open(`https://wa.me/919435212145?text=${message}`, '_blank');
  };

  return (
    <section id="services" className="py-20 bg-muted/30">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Services</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Comprehensive digital and documentation services tailored to your needs
          </p>
        </div>

        {/* Graphic Design Services */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <Palette className="h-8 w-8 text-primary" />
            <h3 className="text-2xl md:text-3xl font-bold">Graphic Design Services</h3>
          </div>
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {graphicDesignServices.map((service) => (
                <Card key={service.name} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="text-4xl mb-2">{service.icon}</div>
                    <CardTitle className="text-lg">{service.name}</CardTitle>
                    <CardDescription>{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-primary">
                      {getPriceForService(service.name)}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={() => handleOrderNow(service.name)} className="w-full">
                      Order Now
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* School Project Solutions */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <GraduationCap className="h-8 w-8 text-primary" />
            <h3 className="text-2xl md:text-3xl font-bold">School Project Solutions</h3>
          </div>
          <Card className="bg-gradient-to-br from-primary/5 to-accent/5">
            <CardHeader>
              <CardTitle>Complete Project Support for All Classes</CardTitle>
              <CardDescription className="text-lg">
                "Neat, well-structured and teacher-approved project files."
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <li className="flex items-start gap-2">
                  <span className="text-primary">✓</span>
                  <span>All-Class School Project Files</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">✓</span>
                  <span>Subject-wise Custom Projects</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">✓</span>
                  <span>Practical File Preparation</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">✓</span>
                  <span>Charts & Models Guidance</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">✓</span>
                  <span>Creative Cover Page Design</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">✓</span>
                  <span>Printed & Handwritten Options</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleOrderNow('School Project')} size="lg">
                Get Started
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* College Assignment Support */}
        <div>
          <div className="flex items-center gap-3 mb-8">
            <FileText className="h-8 w-8 text-primary" />
            <h3 className="text-2xl md:text-3xl font-bold">College Assignment Support</h3>
          </div>
          <Card className="bg-gradient-to-br from-accent/5 to-primary/5">
            <CardHeader>
              <CardTitle>Professional Assignment Services</CardTitle>
              <CardDescription className="text-lg">
                "Properly formatted, plagiarism-free and professionally structured assignments."
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <li className="flex items-start gap-2">
                  <span className="text-primary">✓</span>
                  <span>Assignments (All Streams)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">✓</span>
                  <span>PPT Presentation Design</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">✓</span>
                  <span>Research Formatting</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">✓</span>
                  <span>Practical Files</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">✓</span>
                  <span>Typing & Formatting Services</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">✓</span>
                  <span>Cover Page & Spiral Binding</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleOrderNow('College Assignment')} size="lg">
                Get Started
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  );
}
