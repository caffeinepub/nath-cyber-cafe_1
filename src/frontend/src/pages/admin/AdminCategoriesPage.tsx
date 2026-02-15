import AdminRouteGuard from '../../components/admin/AdminRouteGuard';
import { useGetAllCategoryStates, useEnableCategory } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { JobCategory } from '../../backend';
import { toast } from 'sonner';

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

export default function AdminCategoriesPage() {
  const { data: categoryStates, isLoading } = useGetAllCategoryStates();
  const enableMutation = useEnableCategory();

  const handleToggle = async (category: JobCategory, enabled: boolean) => {
    try {
      await enableMutation.mutateAsync({ category, enabled });
      toast.success(`Category ${enabled ? 'enabled' : 'disabled'} successfully`);
    } catch (error) {
      toast.error('Failed to update category');
    }
  };

  const getCategoryState = (category: JobCategory): boolean => {
    if (!categoryStates) return true;
    const state = categoryStates.find(([cat]) => cat === category);
    return state ? state[1] : true;
  };

  return (
    <AdminRouteGuard>
      <div className="container py-12">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Manage Job Categories</h1>
          <p className="text-muted-foreground">Enable or disable job categories</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Job Categories</CardTitle>
              <CardDescription>
                Disabled categories will not appear in the public job portal
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(categoryLabels).map(([key, label]) => {
                const category = key as JobCategory;
                const isEnabled = getCategoryState(category);
                return (
                  <div key={key} className="flex items-center justify-between p-4 border rounded-lg">
                    <Label htmlFor={key} className="text-base font-medium cursor-pointer">
                      {label}
                    </Label>
                    <Switch
                      id={key}
                      checked={isEnabled}
                      onCheckedChange={(checked) => handleToggle(category, checked)}
                      disabled={enableMutation.isPending}
                    />
                  </div>
                );
              })}
            </CardContent>
          </Card>
        )}
      </div>
    </AdminRouteGuard>
  );
}
