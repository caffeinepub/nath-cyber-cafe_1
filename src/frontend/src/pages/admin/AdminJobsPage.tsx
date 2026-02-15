import { useState } from 'react';
import AdminRouteGuard from '../../components/admin/AdminRouteGuard';
import { useGetAllJobPosts, useAddJobPost, useUpdateJobPost, useDeleteJobPost } from '../../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, Plus, Pencil, Trash2, Upload } from 'lucide-react';
import { JobCategory, JobPost } from '../../backend';
import { ExternalBlob } from '../../backend';
import { toast } from 'sonner';
import { validateApplyUrl } from '../../utils/officialDomainValidation';

const categoryLabels: Record<JobCategory, string> = {
  [JobCategory.centralGovernment]: 'Central Government',
  [JobCategory.stateGovernment]: 'State Government',
  [JobCategory.ssc]: 'SSC',
  [JobCategory.railway]: 'Railway',
  [JobCategory.banking]: 'Banking',
  [JobCategory.defence]: 'Defence',
  [JobCategory.teaching]: 'Teaching',
  [JobCategory.upsc]: 'UPSC',
};

export default function AdminJobsPage() {
  const { data: jobs, isLoading } = useGetAllJobPosts();
  const addMutation = useAddJobPost();
  const updateMutation = useUpdateJobPost();
  const deleteMutation = useDeleteJobPost();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<JobPost | null>(null);
  const [formData, setFormData] = useState({
    jobTitle: '',
    orgName: '',
    totalVacancies: '',
    qualification: '',
    lastDate: '',
    location: '',
    applyLink: '',
    jobCategory: JobCategory.centralGovernment,
  });
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const resetForm = () => {
    setFormData({
      jobTitle: '',
      orgName: '',
      totalVacancies: '',
      qualification: '',
      lastDate: '',
      location: '',
      applyLink: '',
      jobCategory: JobCategory.centralGovernment,
    });
    setPdfFile(null);
    setUploadProgress(0);
    setEditingJob(null);
  };

  const handleEdit = (job: JobPost) => {
    setEditingJob(job);
    setFormData({
      jobTitle: job.jobTitle,
      orgName: job.orgName,
      totalVacancies: String(job.totalVacancies),
      qualification: job.qualification,
      lastDate: job.lastDate,
      location: job.location,
      applyLink: job.applyLink,
      jobCategory: job.jobCategory,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: bigint) => {
    if (confirm('Are you sure you want to delete this job post?')) {
      try {
        await deleteMutation.mutateAsync(id);
        toast.success('Job post deleted successfully');
      } catch (error) {
        toast.error('Failed to delete job post');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateApplyUrl(formData.applyLink);
    if (!validation.isValid) {
      const proceed = confirm(`Warning: ${validation.warning}\n\nDo you want to proceed anyway?`);
      if (!proceed) return;
    }

    try {
      let pdfBlob: ExternalBlob | null = null;
      if (pdfFile) {
        const arrayBuffer = await pdfFile.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        pdfBlob = ExternalBlob.fromBytes(uint8Array).withUploadProgress((percentage) => {
          setUploadProgress(percentage);
        });
      }

      if (editingJob) {
        await updateMutation.mutateAsync({
          id: editingJob.id,
          jobTitle: formData.jobTitle,
          orgName: formData.orgName,
          totalVacancies: BigInt(formData.totalVacancies),
          qualification: formData.qualification,
          lastDate: formData.lastDate,
          location: formData.location,
          applyLink: formData.applyLink,
          notificationPdf: pdfBlob || editingJob.notificationPdf || null,
          jobCategory: formData.jobCategory,
        });
        toast.success('Job post updated successfully');
      } else {
        await addMutation.mutateAsync({
          jobTitle: formData.jobTitle,
          orgName: formData.orgName,
          totalVacancies: BigInt(formData.totalVacancies),
          qualification: formData.qualification,
          lastDate: formData.lastDate,
          location: formData.location,
          applyLink: formData.applyLink,
          notificationPdf: pdfBlob,
          jobCategory: formData.jobCategory,
        });
        toast.success('Job post added successfully');
      }

      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      toast.error('Failed to save job post');
    }
  };

  return (
    <AdminRouteGuard>
      <div className="container py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Manage Job Posts</h1>
            <p className="text-muted-foreground">Add, edit, or delete government job listings</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Job
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingJob ? 'Edit Job Post' : 'Add New Job Post'}</DialogTitle>
                <DialogDescription>
                  Fill in the job details below
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="jobTitle">Job Title</Label>
                  <Input
                    id="jobTitle"
                    value={formData.jobTitle}
                    onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="orgName">Organization Name</Label>
                  <Input
                    id="orgName"
                    value={formData.orgName}
                    onChange={(e) => setFormData({ ...formData, orgName: e.target.value })}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="totalVacancies">Total Vacancies</Label>
                    <Input
                      id="totalVacancies"
                      type="number"
                      value={formData.totalVacancies}
                      onChange={(e) => setFormData({ ...formData, totalVacancies: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastDate">Last Date</Label>
                    <Input
                      id="lastDate"
                      value={formData.lastDate}
                      onChange={(e) => setFormData({ ...formData, lastDate: e.target.value })}
                      placeholder="e.g., 31 Dec 2026"
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="qualification">Qualification</Label>
                  <Input
                    id="qualification"
                    value={formData.qualification}
                    onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="applyLink">Apply Link (Official URL)</Label>
                  <Input
                    id="applyLink"
                    type="url"
                    value={formData.applyLink}
                    onChange={(e) => setFormData({ ...formData, applyLink: e.target.value })}
                    placeholder="https://..."
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="jobCategory">Category</Label>
                  <Select
                    value={formData.jobCategory}
                    onValueChange={(value) => setFormData({ ...formData, jobCategory: value as JobCategory })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(categoryLabels).map(([key, label]) => (
                        <SelectItem key={key} value={key}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="pdf">Notification PDF (Optional)</Label>
                  <Input
                    id="pdf"
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                  />
                  {uploadProgress > 0 && uploadProgress < 100 && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Upload progress: {uploadProgress}%
                    </p>
                  )}
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={addMutation.isPending || updateMutation.isPending}>
                    {(addMutation.isPending || updateMutation.isPending) ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Save Job Post'
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
        ) : !jobs || jobs.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No job posts yet. Add your first job!</p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>All Job Posts ({jobs.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Job Title</TableHead>
                    <TableHead>Organization</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Vacancies</TableHead>
                    <TableHead>Last Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {jobs.map((job) => (
                    <TableRow key={Number(job.id)}>
                      <TableCell className="font-medium">{job.jobTitle}</TableCell>
                      <TableCell>{job.orgName}</TableCell>
                      <TableCell>{categoryLabels[job.jobCategory]}</TableCell>
                      <TableCell>{Number(job.totalVacancies)}</TableCell>
                      <TableCell>{job.lastDate}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleEdit(job)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(job.id)}
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
