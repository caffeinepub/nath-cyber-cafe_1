import { useGetVisibleTestimonials } from '../../hooks/useQueries';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Star, Loader2 } from 'lucide-react';

export default function TestimonialsSection() {
  const { data: testimonials, isLoading } = useGetVisibleTestimonials();

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`h-5 w-5 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  if (isLoading) {
    return (
      <section id="testimonials" className="py-20 bg-muted/30">
        <div className="container">
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </section>
    );
  }

  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  return (
    <section id="testimonials" className="py-20 bg-muted/30">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Clients Say</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Trusted by students and professionals across the region
          </p>
        </div>

        <Carousel className="max-w-4xl mx-auto">
          <CarouselContent>
            {testimonials.map((testimonial) => (
              <CarouselItem key={Number(testimonial.id)}>
                <Card className="border-2">
                  <CardContent className="p-8">
                    <div className="flex justify-center mb-4">
                      {renderStars(Number(testimonial.rating))}
                    </div>
                    <p className="text-lg text-center mb-6 italic">"{testimonial.content}"</p>
                    <p className="text-center font-semibold text-primary">— {testimonial.name}</p>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </section>
  );
}
