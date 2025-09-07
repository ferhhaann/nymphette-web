interface SEOValidationResult {
  field: string;
  status: 'success' | 'warning' | 'error';
  message: string;
}

export const validateSEOSettings = (formData: any): SEOValidationResult[] => {
  const results: SEOValidationResult[] = [];

  // Title validation
  if (formData.meta_title) {
    if (formData.meta_title.length < 30) {
      results.push({
        field: 'meta_title',
        status: 'warning',
        message: 'Title is a bit short. Recommended length is 30-60 characters.'
      });
    } else if (formData.meta_title.length > 60) {
      results.push({
        field: 'meta_title',
        status: 'warning',
        message: 'Title might be truncated in search results. Keep it under 60 characters.'
      });
    } else {
      results.push({
        field: 'meta_title',
        status: 'success',
        message: 'Title length is optimal.'
      });
    }
  }

  // Description validation
  if (formData.meta_description) {
    if (formData.meta_description.length < 120) {
      results.push({
        field: 'meta_description',
        status: 'warning',
        message: 'Description is a bit short. Aim for 120-160 characters.'
      });
    } else if (formData.meta_description.length > 160) {
      results.push({
        field: 'meta_description',
        status: 'warning',
        message: 'Description might be truncated in search results. Keep it under 160 characters.'
      });
    } else {
      results.push({
        field: 'meta_description',
        status: 'success',
        message: 'Description length is optimal.'
      });
    }
  }

  // Keywords validation
  if (formData.meta_keywords) {
    const keywords = formData.meta_keywords.split(',').map((k: string) => k.trim());
    if (keywords.length < 3) {
      results.push({
        field: 'meta_keywords',
        status: 'warning',
        message: 'Consider adding more relevant keywords (aim for 5-8).'
      });
    } else if (keywords.length > 10) {
      results.push({
        field: 'meta_keywords',
        status: 'warning',
        message: 'Too many keywords might be considered spam. Keep it focused.'
      });
    } else {
      results.push({
        field: 'meta_keywords',
        status: 'success',
        message: 'Good number of keywords.'
      });
    }
  }

  // URL validation
  if (formData.page_url) {
    if (!formData.page_url.startsWith('/')) {
      results.push({
        field: 'page_url',
        status: 'error',
        message: 'URL must start with a forward slash (/).'
      });
    } else if (formData.page_url.endsWith('/') && formData.page_url !== '/') {
      results.push({
        field: 'page_url',
        status: 'warning',
        message: 'Consider removing trailing slash for consistency.'
      });
    } else {
      results.push({
        field: 'page_url',
        status: 'success',
        message: 'URL format is correct.'
      });
    }
  }

  // Image validation
  if (formData.og_image) {
    try {
      const url = new URL(formData.og_image);
      if (!url.protocol.startsWith('http')) {
        results.push({
          field: 'og_image',
          status: 'error',
          message: 'Image URL must use HTTP/HTTPS protocol.'
        });
      } else {
        results.push({
          field: 'og_image',
          status: 'success',
          message: 'Image URL is valid.'
        });
      }
    } catch {
      results.push({
        field: 'og_image',
        status: 'error',
        message: 'Invalid image URL format.'
      });
    }
  }

  return results;
};
