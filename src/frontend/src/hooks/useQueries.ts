import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { JobCategory, JobPost, BlogPost, Testimonial, ContactFormSubmission, ServicePricing, UserRole } from '../backend';
import { ExternalBlob } from '../backend';

// User Role
export function useGetCallerUserRole() {
  const { actor, isFetching } = useActor();

  return useQuery<UserRole>({
    queryKey: ['callerUserRole'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserRole();
    },
    enabled: !!actor && !isFetching,
    retry: false,
  });
}

// Job Posts
export function useGetAllJobPosts() {
  const { actor, isFetching } = useActor();

  return useQuery<JobPost[]>({
    queryKey: ['jobPosts'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllJobPosts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetJobPost(id: bigint) {
  const { actor, isFetching } = useActor();

  return useQuery<JobPost | null>({
    queryKey: ['jobPost', id.toString()],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getJobPost(id);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddJobPost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      jobTitle: string;
      orgName: string;
      totalVacancies: bigint;
      qualification: string;
      lastDate: string;
      location: string;
      applyLink: string;
      notificationPdf: ExternalBlob | null;
      jobCategory: JobCategory;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addJobPost(
        data.jobTitle,
        data.orgName,
        data.totalVacancies,
        data.qualification,
        data.lastDate,
        data.location,
        data.applyLink,
        data.notificationPdf,
        data.jobCategory
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobPosts'] });
    },
  });
}

export function useUpdateJobPost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      id: bigint;
      jobTitle: string;
      orgName: string;
      totalVacancies: bigint;
      qualification: string;
      lastDate: string;
      location: string;
      applyLink: string;
      notificationPdf: ExternalBlob | null;
      jobCategory: JobCategory;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateJobPost(
        data.id,
        data.jobTitle,
        data.orgName,
        data.totalVacancies,
        data.qualification,
        data.lastDate,
        data.location,
        data.applyLink,
        data.notificationPdf,
        data.jobCategory
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobPosts'] });
    },
  });
}

export function useDeleteJobPost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteJobPost(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobPosts'] });
    },
  });
}

// Categories
export function useGetAllCategoryStates() {
  const { actor, isFetching } = useActor();

  return useQuery<Array<[JobCategory, boolean]>>({
    queryKey: ['categoryStates'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllCategoryStates();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useEnableCategory() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { category: JobCategory; enabled: boolean }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.enableCategory(data.category, data.enabled);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categoryStates'] });
    },
  });
}

// Service Pricing
export function useGetAllServicePricing() {
  const { actor, isFetching } = useActor();

  return useQuery<Array<[bigint, ServicePricing]>>({
    queryKey: ['servicePricing'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllServicePricing();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddServicePricing() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { serviceName: string; price: string; description: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addServicePricing(data.serviceName, data.price, data.description);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['servicePricing'] });
    },
  });
}

export function useUpdateServicePricing() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: bigint; serviceName: string; price: string; description: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateServicePricing(data.id, data.serviceName, data.price, data.description);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['servicePricing'] });
    },
  });
}

export function useDeleteServicePricing() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteServicePricing(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['servicePricing'] });
    },
  });
}

// Testimonials
export function useGetVisibleTestimonials() {
  const { actor, isFetching } = useActor();

  return useQuery<Testimonial[]>({
    queryKey: ['visibleTestimonials'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getVisibleTestimonials();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllTestimonials() {
  const { actor, isFetching } = useActor();

  return useQuery<Testimonial[]>({
    queryKey: ['allTestimonials'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllTestimonials();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddTestimonial() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { name: string; content: string; rating: bigint; isVisible: boolean }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addTestimonial(data.name, data.content, data.rating, data.isVisible);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allTestimonials'] });
      queryClient.invalidateQueries({ queryKey: ['visibleTestimonials'] });
    },
  });
}

export function useUpdateTestimonial() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: bigint; name: string; content: string; rating: bigint; isVisible: boolean }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateTestimonial(data.id, data.name, data.content, data.rating, data.isVisible);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allTestimonials'] });
      queryClient.invalidateQueries({ queryKey: ['visibleTestimonials'] });
    },
  });
}

export function useDeleteTestimonial() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteTestimonial(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allTestimonials'] });
      queryClient.invalidateQueries({ queryKey: ['visibleTestimonials'] });
    },
  });
}

// Contact Form
export function useSubmitContactForm() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (data: { name: string; phone: string; message: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.submitContactForm(data.name, data.phone, data.message);
    },
  });
}

export function useGetAllContactSubmissions() {
  const { actor, isFetching } = useActor();

  return useQuery<ContactFormSubmission[]>({
    queryKey: ['contactSubmissions'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllContactSubmissions();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useDeleteContactSubmission() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteContactSubmission(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contactSubmissions'] });
    },
  });
}

// Blog Posts
export function useGetPublishedBlogPosts() {
  const { actor, isFetching } = useActor();

  return useQuery<BlogPost[]>({
    queryKey: ['publishedBlogPosts'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPublishedBlogPosts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllBlogPosts() {
  const { actor, isFetching } = useActor();

  return useQuery<BlogPost[]>({
    queryKey: ['allBlogPosts'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllBlogPosts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetBlogPost(id: bigint) {
  const { actor, isFetching } = useActor();

  return useQuery<BlogPost | null>({
    queryKey: ['blogPost', id.toString()],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getBlogPost(id);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateBlogPost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { title: string; content: string; isPublished: boolean }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createBlogPost(data.title, data.content, data.isPublished);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allBlogPosts'] });
      queryClient.invalidateQueries({ queryKey: ['publishedBlogPosts'] });
    },
  });
}

export function useUpdateBlogPost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: bigint; title: string; content: string; isPublished: boolean }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateBlogPost(data.id, data.title, data.content, data.isPublished);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allBlogPosts'] });
      queryClient.invalidateQueries({ queryKey: ['publishedBlogPosts'] });
    },
  });
}

export function useSetBlogPostPublished() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: bigint; isPublished: boolean }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.setBlogPostPublished(data.id, data.isPublished);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allBlogPosts'] });
      queryClient.invalidateQueries({ queryKey: ['publishedBlogPosts'] });
    },
  });
}

export function useDeleteBlogPost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteBlogPost(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allBlogPosts'] });
      queryClient.invalidateQueries({ queryKey: ['publishedBlogPosts'] });
    },
  });
}
