# Specification

## Summary
**Goal:** Update site contact information and social/channel links (WhatsApp numbers, Gmail, WhatsApp Channel, YouTube Channel) across the homepage Contact section, footer, floating WhatsApp button, and LocalBusiness JSON-LD.

**Planned changes:**
- Update the homepage Contact section to show both WhatsApp numbers (9435212145, 91260 26463) and Gmail address (nathcybercafe9@gmail.com) with proper `tel:`/`mailto:` links, and add clickable WhatsApp Channel and YouTube Channel links that open in a new tab with `rel="noopener noreferrer"`.
- Update the site footer social links area to include the provided YouTube and WhatsApp Channel URLs, and update the footer Contact subsection to include both WhatsApp numbers and the Gmail address with correct link schemes and safe external-link attributes.
- Update the floating WhatsApp button to open a `wa.me` chat to a listed WhatsApp number (default to 9435212145 unless explicitly configured otherwise) and ensure it opens in a new tab with `rel="noopener noreferrer"` while preserving any prefilled message text.
- Update the LocalBusiness JSON-LD schema to include both phone numbers and add the YouTube + WhatsApp Channel URLs in appropriate social profile fields (e.g., `sameAs`), ensuring valid JSON-LD output and no console errors.

**User-visible outcome:** Users can find and click updated WhatsApp, email, WhatsApp Channel, and YouTube Channel links in the Contact section and footer, and the floating WhatsApp button chats to the correct number; SEO schema reflects the updated contact/social details.
