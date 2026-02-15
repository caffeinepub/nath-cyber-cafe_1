import { useState } from 'react';
import AdminRouteGuard from '../../components/admin/AdminRouteGuard';
import { useGetAllServicePricing, useAddServicePricing, useUpdateServicePricing, useDeleteServicePricing } from '../../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, Plus, Pencil, Trash2 } from 'lucide-react';
import { ServicePricing } from '../../backend';
import { toast } from 'sonner';

export default function AdminServicePricingPage() {
  const { data: pricingData, isLoading } = useGetAllServicePricing();
  const addMutation = useAddServicePricing();
  const updateMutation = useUpdateServicePricing();
  const deleteMutation = useDeleteServicePricing();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<bigint | null>(null);
  const [formData, setFormData] = useState({
    serviceName: '',
    price: '',
    description: '',
  });

  const resetForm = () => {
    setFormData({ serviceName: '', price: '', description: '' });
    setEditingId(null);
  };

  const handleEdit = (id: bigint, pricing: ServicePricing) => {
    setEditingId(id);
    setFormData({
      serviceName: pricing.serviceName,
      price: pricing.price,
      description: pricing.description,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: bigint) => {
    if (confirm('Are you sure you want to delete this pricing entry?')) {
      try {
        await deleteMutation.mutateAsync(id);
        toast.success('Pricing deleted successfully');
      } catch (error) {
        toast.error('Failed to delete pricing');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingId !== null) {
        await updateMutation.mutateAsync({
          id: editingId,
          serviceName: formData.serviceName,
          price: formData.price,
          description: formData.description,
        });
        toast.success('Pricing updated successfully');
      } else {
        await addMutation.mutateAsync({
          serviceName: formData.serviceName,
          price: formData.price,
          description: formData.description,
        });
        toast.success('Pricing added successfully');
      }

      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      toast.error('Failed to save pricing');
    }
  };

  return (
    <AdminRouteGuard>
      <div className="container py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Manage Service Pricing</h1>
            <p className="text-muted-foreground">Update pricing for your services</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Pricing
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingId !== null ? 'Edit Pricing' : 'Add New Pricing'}</DialogTitle>
                <DialogDescription>
                  Set the price for a service
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="serviceName">Service Name</Label>
                  <Input
                    id="serviceName"
                    value={formData.serviceName}
                    onChange={(e) => setFormData({ ...formData, serviceName: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="e.g., ₹500 onwards"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    required
                  />
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={addMutation.isPending || updateMutation.isPending}>
                    {(addMutation.isPending || updateMutation.isPending) ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Save Pricing'
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
        ) : !pricingData || pricingData.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No pricing entries yet. Add your first one!</p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Service Pricing ({pricingData.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Service Name</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pricingData.map(([id, pricing]) => (
                    <TableRow key={Number(id)}>
                      <TableCell className="font-medium">{pricing.serviceName}</TableCell>
                      <TableCell>{pricing.price}</TableCell>
                      <TableCell className="max-w-xs truncate">{pricing.description}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleEdit(id, pricing)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(id)}
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
