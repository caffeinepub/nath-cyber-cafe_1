import AdminRouteGuard from '../../components/admin/AdminRouteGuard';
import { useGetAllContactSubmissions, useDeleteContactSubmission } from '../../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminContactsPage() {
  const { data: contacts, isLoading } = useGetAllContactSubmissions();
  const deleteMutation = useDeleteContactSubmission();

  const handleDelete = async (id: bigint) => {
    if (confirm('Are you sure you want to delete this contact submission?')) {
      try {
        await deleteMutation.mutateAsync(id);
        toast.success('Contact submission deleted successfully');
      } catch (error) {
        toast.error('Failed to delete contact submission');
      }
    }
  };

  return (
    <AdminRouteGuard>
      <div className="container py-12">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Contact Submissions</h1>
          <p className="text-muted-foreground">View messages from the contact form</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : !contacts || contacts.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No contact submissions yet.</p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>All Submissions ({contacts.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>Submitted At</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contacts.map((contact) => (
                    <TableRow key={Number(contact.id)}>
                      <TableCell className="font-medium">{contact.name}</TableCell>
                      <TableCell>
                        <a href={`tel:${contact.phone}`} className="hover:text-primary">
                          {contact.phone}
                        </a>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">{contact.message}</TableCell>
                      <TableCell>
                        {new Date(Number(contact.submittedAt) / 1000000).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(contact.id)}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
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
