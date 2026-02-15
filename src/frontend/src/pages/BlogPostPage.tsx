import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetBlogPost } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Calendar, Loader2 } from 'lucide-react';
import Seo from '../components/seo/Seo';

export default function BlogPostPage() {
  const { postId } = useParams({ from: '/blog/$postId' });
  const navigate = useNavigate();
  const { data: post, isLoading } = useGetBlogPost(BigInt(postId));

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container py-12">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">Blog post not found or not published.</p>
            <Button onClick={() => navigate({ to: '/blog' })}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <Seo title={`${post.title} | Nath Cyber Cafe`} description={post.content.substring(0, 160)} />
      <article className="container py-12">
        <Button onClick={() => navigate({ to: '/blog' })} variant="ghost" className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Blog
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="text-3xl md:text-4xl">{post.title}</CardTitle>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              {new Date(Number(post.createdAt) / 1000000).toLocaleDateString()}
            </div>
          </CardHeader>
          <CardContent className="prose prose-lg max-w-none">
            <div className="whitespace-pre-wrap">{post.content}</div>
          </CardContent>
        </Card>
      </article>
    </>
  );
}
