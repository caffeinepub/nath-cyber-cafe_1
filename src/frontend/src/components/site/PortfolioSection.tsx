import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function PortfolioSection() {
  return (
    <section id="portfolio" className="py-20">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Portfolio</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore our work and see the quality we deliver
          </p>
        </div>

        <Tabs defaultValue="designs" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
            <TabsTrigger value="designs">Designs</TabsTrigger>
            <TabsTrigger value="resumes">Resumes</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
          </TabsList>

          <TabsContent value="designs" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Logo Design</CardTitle>
                  <CardDescription>Modern brand identity designs</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center">
                    <span className="text-4xl">🎨</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Social Media Posts</CardTitle>
                  <CardDescription>Engaging visual content</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-gradient-to-br from-accent/20 to-primary/20 rounded-lg flex items-center justify-center">
                    <span className="text-4xl">📱</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Banner Design</CardTitle>
                  <CardDescription>Eye-catching promotional materials</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center">
                    <span className="text-4xl">🖼️</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="resumes" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Before</CardTitle>
                  <CardDescription>Standard resume format</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="aspect-[3/4] bg-muted rounded-lg flex items-center justify-center">
                    <span className="text-6xl">📄</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>After</CardTitle>
                  <CardDescription>Professional, ATS-friendly design</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="aspect-[3/4] bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg flex items-center justify-center border-2 border-primary/20">
                    <span className="text-6xl">✨</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="projects" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Science Projects</CardTitle>
                  <CardDescription>Well-researched and formatted</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center">
                    <span className="text-4xl">🔬</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Practical Files</CardTitle>
                  <CardDescription>Neat and organized documentation</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-gradient-to-br from-accent/20 to-primary/20 rounded-lg flex items-center justify-center">
                    <span className="text-4xl">📚</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Presentations</CardTitle>
                  <CardDescription>Professional PPT designs</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center">
                    <span className="text-4xl">📊</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
