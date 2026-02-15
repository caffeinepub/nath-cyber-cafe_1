import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, FileText, MapPin, Calendar, Users, GraduationCap } from 'lucide-react';
import { JobPost, JobCategory } from '../../backend';

const categoryLabels: Record<JobCategory, string> = {
  [JobCategory.centralGovernment]: 'Central Govt',
  [JobCategory.stateGovernment]: 'State Govt',
  [JobCategory.ssc]: 'SSC',
  [JobCategory.railway]: 'Railway',
  [JobCategory.banking]: 'Banking',
  [JobCategory.defence]: 'Defence',
  [JobCategory.teaching]: 'Teaching',
  [JobCategory.upsc]: 'UPSC',
};

interface JobCardProps {
  job: JobPost;
}

export default function JobCard({ job }: JobCardProps) {
  const handleApply = () => {
    window.open(job.applyLink, '_blank', 'noopener,noreferrer');
  };

  const handleDownloadPdf = () => {
    if (job.notificationPdf) {
      const url = job.notificationPdf.getDirectURL();
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow h-full flex flex-col">
      <CardHeader>
        <div className="flex items-start justify-between gap-2 mb-2">
          <Badge variant="secondary">{categoryLabels[job.jobCategory]}</Badge>
        </div>
        <CardTitle className="text-lg line-clamp-2">{job.jobTitle}</CardTitle>
        <CardDescription className="font-semibold">{job.orgName}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span>Vacancies: {Number(job.totalVacancies)}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <GraduationCap className="h-4 w-4 text-muted-foreground" />
          <span className="line-clamp-1">{job.qualification}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span className="line-clamp-1">{job.location}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-destructive">
          <Calendar className="h-4 w-4" />
          <span>Last Date: {job.lastDate}</span>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <Button onClick={handleApply} className="w-full group">
          Apply Now
          <ExternalLink className="ml-2 h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </Button>
        {job.notificationPdf && (
          <Button onClick={handleDownloadPdf} variant="outline" className="w-full">
            <FileText className="mr-2 h-4 w-4" />
            Download Notification
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
