import { useState, useMemo } from 'react';
import { useGetAllJobPosts, useGetAllCategoryStates } from '../hooks/useQueries';
import JobCard from '../components/jobs/JobCard';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, Loader2 } from 'lucide-react';
import { JobCategory } from '../backend';
import Seo from '../components/seo/Seo';

const JOBS_PER_PAGE = 12;

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

export default function JobsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [visibleCount, setVisibleCount] = useState(JOBS_PER_PAGE);

  const { data: jobs, isLoading, error } = useGetAllJobPosts();
  const { data: categoryStates } = useGetAllCategoryStates();

  const enabledCategories = useMemo(() => {
    if (!categoryStates) return Object.values(JobCategory);
    return categoryStates
      .filter(([_, enabled]) => enabled)
      .map(([category]) => category);
  }, [categoryStates]);

  const filteredJobs = useMemo(() => {
    if (!jobs) return [];

    let filtered = jobs;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((job) => job.jobCategory === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (job) =>
          job.jobTitle.toLowerCase().includes(lowerSearch) ||
          job.qualification.toLowerCase().includes(lowerSearch) ||
          job.orgName.toLowerCase().includes(lowerSearch)
      );
    }

    return filtered;
  }, [jobs, selectedCategory, searchTerm]);

  const visibleJobs = filteredJobs.slice(0, visibleCount);
  const hasMore = visibleCount < filteredJobs.length;

  const lastUpdated = jobs && jobs.length > 0 ? new Date().toLocaleDateString() : 'N/A';

  return (
    <>
      <Seo
        title="Latest Government Jobs – Apply Online | Nath Cyber Cafe"
        description="Find the latest government job openings across Central Government, State Government, SSC, Railway, Banking, Defence, Teaching, and UPSC. Apply online today!"
      />
      <div className="container py-12">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Latest Government Jobs – Apply Online</h1>
          <p className="text-muted-foreground">Last Updated: {lastUpdated}</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by job title, qualification, or organization..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-[250px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {enabledCategories.map((category) => (
                <SelectItem key={category} value={category}>
                  {categoryLabels[category]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-destructive">Failed to load jobs. Please try again later.</p>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">
              {searchTerm || selectedCategory !== 'all'
                ? 'No jobs found matching your criteria.'
                : 'No jobs available at the moment. Check back soon!'}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {visibleJobs.map((job) => (
                <JobCard key={Number(job.id)} job={job} />
              ))}
            </div>

            {hasMore && (
              <div className="text-center">
                <Button onClick={() => setVisibleCount((prev) => prev + JOBS_PER_PAGE)} size="lg">
                  Load More Jobs
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
