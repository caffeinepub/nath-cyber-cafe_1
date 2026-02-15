interface ValidationResult {
  isValid: boolean;
  warning?: string;
}

const OFFICIAL_DOMAIN_PATTERNS = [
  /\.gov\.in$/i,
  /\.nic\.in$/i,
  /\.ac\.in$/i,
  /\.edu$/i,
  /\.gov$/i,
];

export function validateApplyUrl(url: string): ValidationResult {
  // Check if URL is HTTPS
  if (!url.startsWith('https://')) {
    return {
      isValid: false,
      warning: 'Apply link should use HTTPS for security.',
    };
  }

  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname;

    // Check if domain matches official patterns
    const isOfficialDomain = OFFICIAL_DOMAIN_PATTERNS.some((pattern) => pattern.test(hostname));

    if (!isOfficialDomain) {
      return {
        isValid: false,
        warning: `The domain "${hostname}" does not appear to be an official government website. Official sites typically end with .gov.in, .nic.in, .ac.in, .edu, or .gov.`,
      };
    }

    return { isValid: true };
  } catch (error) {
    return {
      isValid: false,
      warning: 'Invalid URL format.',
    };
  }
}
