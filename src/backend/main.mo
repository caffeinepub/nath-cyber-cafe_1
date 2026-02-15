import Iter "mo:core/Iter";
import Time "mo:core/Time";
import Array "mo:core/Array";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Order "mo:core/Order";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  include MixinStorage();

  // Category Types
  public type JobCategory = {
    #centralGovernment;
    #stateGovernment;
    #ssc;
    #railway;
    #banking;
    #defence;
    #teaching;
    #upsc;
  };

  module JobCategory {
    public func compare(category1 : JobCategory, category2 : JobCategory) : Order.Order {
      func categoryToNat(category : JobCategory) : Nat {
        switch (category) {
          case (#centralGovernment) { 0 };
          case (#stateGovernment) { 1 };
          case (#ssc) { 2 };
          case (#railway) { 3 };
          case (#banking) { 4 };
          case (#defence) { 5 };
          case (#teaching) { 6 };
          case (#upsc) { 7 };
        };
      };
      Nat.compare(categoryToNat(category1), categoryToNat(category2));
    };
  };

  // Job Post Type
  public type JobPost = {
    id : Nat;
    jobTitle : Text;
    orgName : Text;
    totalVacancies : Nat;
    qualification : Text;
    lastDate : Text;
    location : Text;
    applyLink : Text;
    notificationPdf : ?Storage.ExternalBlob;
    jobCategory : JobCategory;
  };

  // Contact Form Submission Type
  public type ContactFormSubmission = {
    id : Nat;
    name : Text;
    phone : Text;
    message : Text;
    submittedAt : Time.Time;
  };

  // Blog Post Type
  public type BlogPost = {
    id : Nat;
    title : Text;
    content : Text;
    isPublished : Bool;
    createdAt : Time.Time;
    updatedAt : Time.Time;
  };

  // Testimonial Type
  public type Testimonial = {
    id : Nat;
    name : Text;
    content : Text;
    rating : Nat;
    isVisible : Bool;
  };

  // User Profile Type
  public type UserProfile = {
    name : Text;
    email : ?Text;
  };

  // Service Pricing Type
  public type ServicePricing = {
    serviceName : Text;
    price : Text;
    description : Text;
  };

  // Category State
  let categoryState = Map.empty<JobCategory, Bool>();
  // Job Posts State
  let jobPosts = Map.empty<Nat, JobPost>();
  var nextJobId : Nat = 1;

  // Contact Form State
  let contactForms = Map.empty<Nat, ContactFormSubmission>();
  var nextContactId : Nat = 1;

  // Blog State
  let blogPosts = Map.empty<Nat, BlogPost>();
  var nextBlogId : Nat = 1;

  // Testimonials State
  let testimonials = Map.empty<Nat, Testimonial>();
  var nextTestimonialId : Nat = 1;

  // User Profiles State
  let userProfiles = Map.empty<Principal, UserProfile>();

  // Service Pricing State
  let servicePricing = Map.empty<Nat, ServicePricing>();
  var nextPricingId : Nat = 1;

  // Initialize the user system state
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // ============================================
  // USER PROFILE FUNCTIONS
  // ============================================

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // ============================================
  // CATEGORY MANAGEMENT (Admin Only)
  // ============================================

  public shared ({ caller }) func enableCategory(category : JobCategory, enabled : Bool) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can enable or disable categories");
    };
    categoryState.add(category, enabled);
  };

  public query func getCategoryState(category : JobCategory) : async Bool {
    switch (categoryState.get(category)) {
      case (?enabled) { enabled };
      case null { true }; // Default to enabled
    };
  };

  public query func getAllCategoryStates() : async [(JobCategory, Bool)] {
    categoryState.entries().toArray();
  };

  // ============================================
  // JOB POST MANAGEMENT
  // ============================================

  // Add Job Post (Admin Only)
  public shared ({ caller }) func addJobPost(
    jobTitle : Text,
    orgName : Text,
    totalVacancies : Nat,
    qualification : Text,
    lastDate : Text,
    location : Text,
    applyLink : Text,
    notificationPdf : ?Storage.ExternalBlob,
    jobCategory : JobCategory,
  ) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add job posts");
    };
    let jobId = nextJobId;
    nextJobId += 1;
    let jobPost : JobPost = {
      id = jobId;
      jobTitle;
      orgName;
      totalVacancies;
      qualification;
      lastDate;
      location;
      applyLink;
      notificationPdf;
      jobCategory;
    };
    jobPosts.add(jobId, jobPost);
    jobId;
  };

  // Update Job Post (Admin Only)
  public shared ({ caller }) func updateJobPost(
    id : Nat,
    jobTitle : Text,
    orgName : Text,
    totalVacancies : Nat,
    qualification : Text,
    lastDate : Text,
    location : Text,
    applyLink : Text,
    notificationPdf : ?Storage.ExternalBlob,
    jobCategory : JobCategory,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update job posts");
    };
    let jobPost : JobPost = {
      id;
      jobTitle;
      orgName;
      totalVacancies;
      qualification;
      lastDate;
      location;
      applyLink;
      notificationPdf;
      jobCategory;
    };
    jobPosts.add(id, jobPost);
  };

  // Delete Job Post (Admin Only)
  public shared ({ caller }) func deleteJobPost(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete job posts");
    };
    jobPosts.remove(id);
  };

  // Get Job Post by ID (Public)
  public query func getJobPost(id : Nat) : async ?JobPost {
    jobPosts.get(id);
  };

  // Get All Job Posts (Public)
  public query func getAllJobPosts() : async [JobPost] {
    jobPosts.values().toArray();
  };

  // Search Jobs by Title or Qualification (Public)
  public query func searchJobs(searchTerm : Text) : async [JobPost] {
    let lowerSearchTerm = searchTerm.toLower();
    let filtered = jobPosts.values().toArray().filter(
      func(job) {
        let lowerTitle = job.jobTitle.toLower();
        let lowerQual = job.qualification.toLower();
        lowerTitle.contains(#text lowerSearchTerm) or lowerQual.contains(#text lowerSearchTerm);
      }
    );
    filtered;
  };

  // Filter Jobs by Category (Public)
  public query func getJobsByCategory(category : JobCategory) : async [JobPost] {
    let filtered = jobPosts.values().toArray().filter(
      func(job) { jobCategoryEqual(job.jobCategory, category) }
    );
    filtered;
  };

  // ============================================
  // CONTACT FORM MANAGEMENT
  // ============================================

  // Submit Contact Form (Public - No Auth Required)
  public shared func submitContactForm(name : Text, phone : Text, message : Text) : async Nat {
    let contactId = nextContactId;
    nextContactId += 1;
    let submission : ContactFormSubmission = {
      id = contactId;
      name;
      phone;
      message;
      submittedAt = Time.now();
    };
    contactForms.add(contactId, submission);
    contactId;
  };

  // Get All Contact Form Submissions (Admin Only)
  public query ({ caller }) func getAllContactSubmissions() : async [ContactFormSubmission] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view contact submissions");
    };
    contactForms.values().toArray();
  };

  // Delete Contact Submission (Admin Only)
  public shared ({ caller }) func deleteContactSubmission(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete contact submissions");
    };
    contactForms.remove(id);
  };

  // ============================================
  // BLOG POST MANAGEMENT
  // ============================================

  // Create Blog Post (Admin Only)
  public shared ({ caller }) func createBlogPost(title : Text, content : Text, isPublished : Bool) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create blog posts");
    };
    let blogId = nextBlogId;
    nextBlogId += 1;
    let now = Time.now();
    let blogPost : BlogPost = {
      id = blogId;
      title;
      content;
      isPublished;
      createdAt = now;
      updatedAt = now;
    };
    blogPosts.add(blogId, blogPost);
    blogId;
  };

  // Update Blog Post (Admin Only)
  public shared ({ caller }) func updateBlogPost(id : Nat, title : Text, content : Text, isPublished : Bool) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update blog posts");
    };
    switch (blogPosts.get(id)) {
      case (?existingPost) {
        let updatedPost : BlogPost = {
          id;
          title;
          content;
          isPublished;
          createdAt = existingPost.createdAt;
          updatedAt = Time.now();
        };
        blogPosts.add(id, updatedPost);
      };
      case null {
        Runtime.trap("Blog post not found");
      };
    };
  };

  // Publish/Unpublish Blog Post (Admin Only)
  public shared ({ caller }) func setBlogPostPublished(id : Nat, isPublished : Bool) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can publish/unpublish blog posts");
    };
    switch (blogPosts.get(id)) {
      case (?existingPost) {
        let updatedPost : BlogPost = {
          id = existingPost.id;
          title = existingPost.title;
          content = existingPost.content;
          isPublished;
          createdAt = existingPost.createdAt;
          updatedAt = Time.now();
        };
        blogPosts.add(id, updatedPost);
      };
      case null {
        Runtime.trap("Blog post not found");
      };
    };
  };

  // Delete Blog Post (Admin Only)
  public shared ({ caller }) func deleteBlogPost(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete blog posts");
    };
    blogPosts.remove(id);
  };

  // Get Published Blog Posts (Public)
  public query func getPublishedBlogPosts() : async [BlogPost] {
    let filtered = blogPosts.values().toArray().filter(
      func(post) { post.isPublished }
    );
    filtered;
  };

  // Get All Blog Posts (Admin Only)
  public query ({ caller }) func getAllBlogPosts() : async [BlogPost] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all blog posts");
    };
    blogPosts.values().toArray();
  };

  // Get Blog Post by ID (Public - only if published, Admin can see all)
  public query ({ caller }) func getBlogPost(id : Nat) : async ?BlogPost {
    switch (blogPosts.get(id)) {
      case (?post) {
        if (post.isPublished or AccessControl.isAdmin(accessControlState, caller)) {
          ?post;
        } else {
          null;
        };
      };
      case null { null };
    };
  };

  // ============================================
  // TESTIMONIAL MANAGEMENT
  // ============================================

  // Add Testimonial (Admin Only)
  public shared ({ caller }) func addTestimonial(name : Text, content : Text, rating : Nat, isVisible : Bool) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add testimonials");
    };
    let testimonialId = nextTestimonialId;
    nextTestimonialId += 1;
    let testimonial : Testimonial = {
      id = testimonialId;
      name;
      content;
      rating;
      isVisible;
    };
    testimonials.add(testimonialId, testimonial);
    testimonialId;
  };

  // Update Testimonial (Admin Only)
  public shared ({ caller }) func updateTestimonial(id : Nat, name : Text, content : Text, rating : Nat, isVisible : Bool) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update testimonials");
    };
    let testimonial : Testimonial = {
      id;
      name;
      content;
      rating;
      isVisible;
    };
    testimonials.add(id, testimonial);
  };

  // Delete Testimonial (Admin Only)
  public shared ({ caller }) func deleteTestimonial(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete testimonials");
    };
    testimonials.remove(id);
  };

  // Get Visible Testimonials (Public)
  public query func getVisibleTestimonials() : async [Testimonial] {
    let filtered = testimonials.values().toArray().filter(
      func(testimonial) { testimonial.isVisible }
    );
    filtered;
  };

  // Get All Testimonials (Admin Only)
  public query ({ caller }) func getAllTestimonials() : async [Testimonial] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all testimonials");
    };
    testimonials.values().toArray();
  };

  // ============================================
  // SERVICE PRICING MANAGEMENT
  // ============================================

  // Add Service Pricing (Admin Only)
  public shared ({ caller }) func addServicePricing(serviceName : Text, price : Text, description : Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add service pricing");
    };
    let pricingId = nextPricingId;
    nextPricingId += 1;
    let pricing : ServicePricing = {
      serviceName;
      price;
      description;
    };
    servicePricing.add(pricingId, pricing);
    pricingId;
  };

  // Update Service Pricing (Admin Only)
  public shared ({ caller }) func updateServicePricing(id : Nat, serviceName : Text, price : Text, description : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update service pricing");
    };
    let pricing : ServicePricing = {
      serviceName;
      price;
      description;
    };
    servicePricing.add(id, pricing);
  };

  // Delete Service Pricing (Admin Only)
  public shared ({ caller }) func deleteServicePricing(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete service pricing");
    };
    servicePricing.remove(id);
  };

  // Get All Service Pricing (Public)
  public query func getAllServicePricing() : async [(Nat, ServicePricing)] {
    servicePricing.entries().toArray();
  };

  // ============================================
  // HELPER FUNCTIONS
  // ============================================

  func jobCategoryHash(category : JobCategory) : Nat32 {
    switch (category) {
      case (#centralGovernment) { 0 };
      case (#stateGovernment) { 1 };
      case (#ssc) { 2 };
      case (#railway) { 3 };
      case (#banking) { 4 };
      case (#defence) { 5 };
      case (#teaching) { 6 };
      case (#upsc) { 7 };
    };
  };

  func jobCategoryEqual(a : JobCategory, b : JobCategory) : Bool {
    jobCategoryHash(a) == jobCategoryHash(b);
  };
};
