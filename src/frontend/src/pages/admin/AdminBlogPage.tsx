import { useState } from 'react';
import AdminRouteGuard from '../../components/admin/AdminRouteGuard';
import { useGetAllBlogPosts, useCreateBlogPost, useUpdateBlogPost, useDeleteBlogPost, useSetBlogPostPublished } from '../../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader2, Plus, Pencil, Trash2, Eye, EyeOff } from 'lucide-react';
import { BlogPost } from '../../backend';
import { toast } from 'sonner';

export default function AdminBlogPage() {
  const { data: posts, isLoading } = useGetAllBlogPosts();
  const createMutation = useCreateBlogPost();
  const updateMutation = useUpdateBlogPost();
  const deleteMutation = useDeleteBlogPost();
  const publishMutation = useSetBlogPostPublished();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    isPublished: false,
  });

  const resetForm = () => {
    setFormData({ title: '', content: '', isPublished: false });
    setEditingPost(null);
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      content: post.content,
      isPublished: post.isPublished,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: bigint) => {
    if (confirm('Are you sure you want to delete this blog post?')) {
      try {
        await deleteMutation.mutateAsync(id);
        toast.success('Blog post deleted successfully');
      } catch (error) {
        toast.error('Failed to delete blog post');
      }
    }
  };

  const handleTogglePublish = async (id: bigint, isPublished: boolean) => {
    try {
      await publishMutation.mutateAsync({ id, isPublished: !isPublished });
      toast.success(`Blog post ${!isPublished ? 'published' : 'unpublished'} successfully`);
    } catch (error) {
      toast.error('Failed to update blog post');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingPost) {
        await updateMutation.mutateAsync({
          id: editingPost.id,
          title: formData.title,
          content: formData.content,
          isPublished: formData.isPublished,
        });
        toast.success('Blog post updated successfully');
      } else {
        await createMutation.mutateAsync({
          title: formData.title,
          content: formData.content,
          isPublished: formData.isPublished,
        });
        toast.success('Blog post created successfully');
      }

      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      toast.error('Failed to save blog post');
    }
  };

  return (
    <AdminRouteGuard>
      <div className="container py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Manage Blog Posts</h1>
            <p className="text-muted-foreground">Create and manage blog content</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Post
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingPost ? 'Edit Blog Post' : 'Create New Blog Post'}</DialogTitle>
                <DialogDescription>
                  Write your blog post content
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    rows={12}
                    required
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isPublished"
                    checked={formData.isPublished}
                    onCheckedChange={(checked) => setFormData({ ...formData, isPublished: checked })}
                  />
                  <Label htmlFor="isPublished">Publish immediately</Label>
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                    {(createMutation.isPending || updateMutation.isPending) ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Save Post'
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : !posts || posts.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No blog posts yet. Create your first one!</p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>All Blog Posts ({posts.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Updated</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {posts.map((post) => (
                    <TableRow key={Number(post.id)}>
                      <TableCell className="font-medium max-w-xs truncate">{post.title}</TableCell>
                      <TableCell>
                        <Badge variant={post.isPublished ? 'default' : 'secondary'}>
                          {post.isPublished ? 'Published' : 'Draft'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(Number(post.createdAt) / 1000000).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {new Date(Number(post.updatedAt) / 1000000).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleTogglePublish(post.id, post.isPublished)}
                            disabled={publishMutation.isPending}
                          >
                            {post.isPublished ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleEdit(post)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(post.id)}
                            disabled={deleteMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminRouteGuard>
  );
}
