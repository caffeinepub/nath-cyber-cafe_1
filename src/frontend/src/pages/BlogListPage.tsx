import { useGetPublishedBlogPosts } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from '@tanstack/react-router';
import { Loader2, Calendar } from 'lucide-react';
import Seo from '../components/seo/Seo';

export default function BlogListPage() {
  const { data: posts, isLoading } = useGetPublishedBlogPosts();
  const navigate = useNavigate();

  return (
    <>
      <Seo
        title="Blog - Latest Updates | Nath Cyber Cafe"
        description="Stay updated with the latest news, tips, and insights from Nath Cyber Cafe."
      />
      <div className="container py-12">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Blog</h1>
          <p className="text-muted-foreground">Latest updates and insights</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : !posts || posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">No blog posts available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Card key={Number(post.id)} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {new Date(Number(post.createdAt) / 1000000).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground line-clamp-3 mb-4">
                    {post.content.substring(0, 150)}...
                  </p>
                  <Button
                    onClick={() => navigate({ to: `/blog/${post.id}` })}
                    variant="outline"
                    className="w-full"
                  >
                    Read More
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
