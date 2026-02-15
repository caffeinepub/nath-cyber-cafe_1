import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface ContactFormSubmission {
    id: bigint;
    name: string;
    submittedAt: Time;
    message: string;
    phone: string;
}
export interface BlogPost {
    id: bigint;
    title: string;
    content: string;
    isPublished: boolean;
    createdAt: Time;
    updatedAt: Time;
}
export type Time = bigint;
export interface JobPost {
    id: bigint;
    jobCategory: JobCategory;
    orgName: string;
    applyLink: string;
    totalVacancies: bigint;
    notificationPdf?: ExternalBlob;
    jobTitle: string;
    lastDate: string;
    qualification: string;
    location: string;
}
export interface ServicePricing {
    serviceName: string;
    description: string;
    price: string;
}
export interface UserProfile {
    name: string;
    email?: string;
}
export interface Testimonial {
    id: bigint;
    content: string;
    name: string;
    isVisible: boolean;
    rating: bigint;
}
export enum JobCategory {
    ssc = "ssc",
    railway = "railway",
    upsc = "upsc",
    banking = "banking",
    teaching = "teaching",
    centralGovernment = "centralGovernment",
    defence = "defence",
    stateGovernment = "stateGovernment"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addJobPost(jobTitle: string, orgName: string, totalVacancies: bigint, qualification: string, lastDate: string, location: string, applyLink: string, notificationPdf: ExternalBlob | null, jobCategory: JobCategory): Promise<bigint>;
    addServicePricing(serviceName: string, price: string, description: string): Promise<bigint>;
    addTestimonial(name: string, content: string, rating: bigint, isVisible: boolean): Promise<bigint>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createBlogPost(title: string, content: string, isPublished: boolean): Promise<bigint>;
    deleteBlogPost(id: bigint): Promise<void>;
    deleteContactSubmission(id: bigint): Promise<void>;
    deleteJobPost(id: bigint): Promise<void>;
    deleteServicePricing(id: bigint): Promise<void>;
    deleteTestimonial(id: bigint): Promise<void>;
    enableCategory(category: JobCategory, enabled: boolean): Promise<void>;
    getAllBlogPosts(): Promise<Array<BlogPost>>;
    getAllCategoryStates(): Promise<Array<[JobCategory, boolean]>>;
    getAllContactSubmissions(): Promise<Array<ContactFormSubmission>>;
    getAllJobPosts(): Promise<Array<JobPost>>;
    getAllServicePricing(): Promise<Array<[bigint, ServicePricing]>>;
    getAllTestimonials(): Promise<Array<Testimonial>>;
    getBlogPost(id: bigint): Promise<BlogPost | null>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCategoryState(category: JobCategory): Promise<boolean>;
    getJobPost(id: bigint): Promise<JobPost | null>;
    getJobsByCategory(category: JobCategory): Promise<Array<JobPost>>;
    getPublishedBlogPosts(): Promise<Array<BlogPost>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getVisibleTestimonials(): Promise<Array<Testimonial>>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    searchJobs(searchTerm: string): Promise<Array<JobPost>>;
    setBlogPostPublished(id: bigint, isPublished: boolean): Promise<void>;
    submitContactForm(name: string, phone: string, message: string): Promise<bigint>;
    updateBlogPost(id: bigint, title: string, content: string, isPublished: boolean): Promise<void>;
    updateJobPost(id: bigint, jobTitle: string, orgName: string, totalVacancies: bigint, qualification: string, lastDate: string, location: string, applyLink: string, notificationPdf: ExternalBlob | null, jobCategory: JobCategory): Promise<void>;
    updateServicePricing(id: bigint, serviceName: string, price: string, description: string): Promise<void>;
    updateTestimonial(id: bigint, name: string, content: string, rating: bigint, isVisible: boolean): Promise<void>;
}
