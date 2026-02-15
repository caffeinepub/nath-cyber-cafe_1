import { useState } from 'react';
import AdminRouteGuard from '../../components/admin/AdminRouteGuard';
import { useGetAllTestimonials, useAddTestimonial, useUpdateTestimonial, useDeleteTestimonial } from '../../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, Plus, Pencil, Trash2, Star } from 'lucide-react';
import { Testimonial } from '../../backend';
import { toast } from 'sonner';

export default function AdminTestimonialsPage() {
  const { data: testimonials, isLoading } = useGetAllTestimonials();
  const addMutation = useAddTestimonial();
  const updateMutation = useUpdateTestimonial();
  const deleteMutation = useDeleteTestimonial();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    content: '',
    rating: 5,
    isVisible: true,
  });

  const resetForm = () => {
    setFormData({ name: '', content: '', rating: 5, isVisible: true });
    setEditingTestimonial(null);
  };

  const handleEdit = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    setFormData({
      name: testimonial.name,
      content: testimonial.content,
      rating: Number(testimonial.rating),
      isVisible: testimonial.isVisible,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: bigint) => {
    if (confirm('Are you sure you want to delete this testimonial?')) {
      try {
        await deleteMutation.mutateAsync(id);
        toast.success('Testimonial deleted successfully');
      } catch (error) {
        toast.error('Failed to delete testimonial');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingTestimonial) {
        await updateMutation.mutateAsync({
          id: editingTestimonial.id,
          name: formData.name,
          content: formData.content,
          rating: BigInt(formData.rating),
          isVisible: formData.isVisible,
        });
        toast.success('Testimonial updated successfully');
      } else {
        await addMutation.mutateAsync({
          name: formData.name,
          content: formData.content,
          rating: BigInt(formData.rating),
          isVisible: formData.isVisible,
        });
        toast.success('Testimonial added successfully');
      }

      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      toast.error('Failed to save testimonial');
    }
  };

  return (
    <AdminRouteGuard>
      <div className="container py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Manage Testimonials</h1>
            <p className="text-muted-foreground">Add and manage customer testimonials</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Testimonial
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingTestimonial ? 'Edit Testimonial' : 'Add New Testimonial'}</DialogTitle>
                <DialogDescription>
                  Add a customer review
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Customer Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="content">Testimonial</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    rows={4}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="rating">Rating (1-5)</Label>
                  <Input
                    id="rating"
                    type="number"
                    min="1"
                    max="5"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                    required
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isVisible"
                    checked={formData.isVisible}
                    onCheckedChange={(checked) => setFormData({ ...formData, isVisible: checked })}
                  />
                  <Label htmlFor="isVisible">Visible on website</Label>
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={addMutation.isPending || updateMutation.isPending}>
                    {(addMutation.isPending || updateMutation.isPending) ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Save Testimonial'
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
        ) : !testimonials || testimonials.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No testimonials yet. Add your first one!</p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>All Testimonials ({testimonials.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Content</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Visible</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {testimonials.map((testimonial) => (
                    <TableRow key={Number(testimonial.id)}>
                      <TableCell className="font-medium">{testimonial.name}</TableCell>
                      <TableCell className="max-w-xs truncate">{testimonial.content}</TableCell>
                      <TableCell>
                        <div className="flex">
                          {Array.from({ length: Number(testimonial.rating) }).map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>{testimonial.isVisible ? 'Yes' : 'No'}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleEdit(testimonial)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(testimonial.id)}
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
