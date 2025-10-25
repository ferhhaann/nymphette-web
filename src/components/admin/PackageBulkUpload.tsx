import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Download, Upload, FileSpreadsheet, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import * as XLSX from 'xlsx';

interface BulkUploadResult {
  success: number;
  failed: number;
  errors: string[];
}

export const PackageBulkUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<BulkUploadResult | null>(null);
  const { toast } = useToast();

  const downloadTemplate = () => {
    const wb = XLSX.utils.book_new();

    // Sheet 1: Sample Packages
    const samplePackages = [
      {
        title: 'Magical Japan Explorer',
        slug: 'magical-japan-explorer',
        country: 'Japan',
        country_slug: 'japan',
        region: 'Asia',
        duration: '7 Days, 6 Nights',
        price: '$2,999',
        original_price: '$3,499',
        image: 'https://example.com/japan-tour.jpg',
        category: 'Cultural',
        best_time: 'Spring (March-May) & Fall (September-November)',
        group_size: '2-8 people',
        rating: '4.8',
        reviews: '156',
        featured: 'TRUE',
        highlights: 'Visit Tokyo Skytree|Explore Mount Fuji|Cherry blossom viewing|Traditional tea ceremony|Bullet train experience',
        inclusions: '6 nights hotel accommodation|Daily breakfast|Airport transfers|English-speaking guide|All entrance fees|Bullet train tickets',
        exclusions: 'International flights|Lunch & dinner|Personal expenses|Travel insurance|Visa fees',
        overview_section_title: 'Discover the Land of the Rising Sun',
        overview_description: 'Embark on an unforgettable journey through Japan, where ancient traditions blend seamlessly with cutting-edge technology. Experience the serene beauty of Mount Fuji, explore bustling Tokyo, and immerse yourself in centuries-old culture.',
        overview_highlights_label: 'What Makes This Trip Special',
        overview_badge_variant: 'default',
        overview_badge_style: '',
        itinerary: JSON.stringify([
          {
            day: 1,
            title: "Arrival in Tokyo",
            description: "Welcome to Japan! Your adventure begins in the vibrant capital city of Tokyo.",
            activities: ["Airport transfer to hotel", "Hotel check-in", "Welcome dinner at traditional restaurant", "Evening walk in Shibuya"],
            meals: ["Dinner"],
            accommodation: "Tokyo Grand Hotel or similar"
          },
          {
            day: 2,
            title: "Tokyo City Tour",
            description: "Explore the modern and traditional sides of Tokyo.",
            activities: ["Visit Senso-ji Temple", "Explore Asakusa district", "Tokyo Skytree observation deck", "Shopping in Harajuku", "Shibuya Crossing experience"],
            meals: ["Breakfast", "Lunch"],
            accommodation: "Tokyo Grand Hotel or similar"
          },
          {
            day: 3,
            title: "Mount Fuji Excursion",
            description: "Day trip to iconic Mount Fuji and surrounding lakes.",
            activities: ["Scenic drive to Mount Fuji", "Lake Kawaguchi boat ride", "5th Station visit", "Lunch with Fuji views", "Traditional onsen experience"],
            meals: ["Breakfast", "Lunch"],
            accommodation: "Tokyo Grand Hotel or similar"
          }
        ])
      },
      {
        title: 'Bali Paradise Retreat',
        slug: 'bali-paradise-retreat',
        country: 'Indonesia',
        country_slug: 'indonesia',
        region: 'Asia',
        duration: '5 Days, 4 Nights',
        price: '$1,499',
        original_price: '$1,899',
        image: 'https://example.com/bali-tour.jpg',
        category: 'Beach',
        best_time: 'April-October (Dry Season)',
        group_size: '2-12 people',
        rating: '4.6',
        reviews: '89',
        featured: 'FALSE',
        highlights: 'Beach relaxation|Temple tours|Rice terrace visit|Water sports|Balinese massage',
        inclusions: '4 nights beach resort|Daily breakfast|Airport transfers|Temple entrance fees|Cultural dance show',
        exclusions: 'International flights|Lunch & dinner|Water sports|Travel insurance|Personal expenses',
        overview_section_title: 'Tropical Paradise Awaits',
        overview_description: 'Escape to the enchanting island of Bali, where pristine beaches meet lush jungles and ancient temples. Experience the perfect blend of relaxation and adventure.',
        overview_highlights_label: 'Package Highlights',
        overview_badge_variant: 'secondary',
        overview_badge_style: '',
        itinerary: JSON.stringify([
          {
            day: 1,
            title: "Arrival & Beach Time",
            description: "Arrive in Bali and settle into your beachfront resort.",
            activities: ["Airport transfer", "Hotel check-in", "Beach sunset viewing", "Welcome cocktail"],
            meals: ["Dinner"],
            accommodation: "Beachfront Resort"
          }
        ])
      }
    ];

    const ws1 = XLSX.utils.json_to_sheet(samplePackages);
    ws1['!cols'] = [
      { wch: 30 }, { wch: 25 }, { wch: 15 }, { wch: 15 }, { wch: 12 }, 
      { wch: 15 }, { wch: 12 }, { wch: 12 }, { wch: 45 }, { wch: 15 }, 
      { wch: 30 }, { wch: 15 }, { wch: 8 }, { wch: 8 }, { wch: 10 },
      { wch: 60 }, { wch: 70 }, { wch: 70 }, { wch: 35 }, { wch: 60 },
      { wch: 30 }, { wch: 20 }, { wch: 25 }, { wch: 100 }
    ];
    XLSX.utils.book_append_sheet(wb, ws1, "Sample Packages");

    // Sheet 2: Instructions
    const instructions = [
      { Field: 'REQUIRED FIELDS', Description: '', Example: '', Notes: 'These fields are mandatory' },
      { Field: 'title', Description: 'Package name/title', Example: 'Magical Japan Explorer', Notes: 'Clear, descriptive title' },
      { Field: 'slug', Description: 'URL-friendly identifier', Example: 'magical-japan-explorer', Notes: 'Lowercase, hyphens, no spaces. Auto-generated from title if empty' },
      { Field: 'country', Description: 'Country name', Example: 'Japan', Notes: 'Full country name' },
      { Field: 'region', Description: 'Geographic region', Example: 'Asia', Notes: 'Options: Asia, Europe, Africa, Americas, Middle East, Pacific Islands' },
      { Field: 'duration', Description: 'Trip length', Example: '7 Days, 6 Nights', Notes: 'Include days and nights' },
      { Field: 'price', Description: 'Display price', Example: '$2,999 or ₹199,000', Notes: 'Include currency symbol' },
      { Field: 'image', Description: 'Main package image URL', Example: 'https://example.com/image.jpg', Notes: 'Valid, accessible image URL' },
      { Field: 'category', Description: 'Package category', Example: 'Adventure, Cultural, Beach, Luxury', Notes: 'Single category' },
      { Field: '', Description: '', Example: '', Notes: '' },
      { Field: 'OPTIONAL FIELDS', Description: '', Example: '', Notes: 'These fields enhance the package' },
      { Field: 'country_slug', Description: 'Country URL slug', Example: 'japan', Notes: 'Auto-generated from country if empty' },
      { Field: 'original_price', Description: 'Price before discount', Example: '$3,499', Notes: 'Shows savings to customers' },
      { Field: 'best_time', Description: 'Best travel season', Example: 'Spring (March-May)', Notes: 'When to visit' },
      { Field: 'group_size', Description: 'Group capacity', Example: '2-8 people', Notes: 'Min-max or "Private tour"' },
      { Field: 'rating', Description: 'Package rating', Example: '4.5', Notes: 'Number between 0-5. Default: 4.5' },
      { Field: 'reviews', Description: 'Number of reviews', Example: '128', Notes: 'Positive integer. Default: 0' },
      { Field: 'featured', Description: 'Featured on homepage', Example: 'TRUE or FALSE', Notes: 'Case-insensitive. Default: FALSE' },
      { Field: '', Description: '', Example: '', Notes: '' },
      { Field: 'ARRAY FIELDS', Description: '', Example: '', Notes: 'Use pipe (|) to separate items' },
      { Field: 'highlights', Description: 'Key features', Example: 'Tokyo skyline|Mount Fuji|Cherry blossoms', Notes: 'Separate with | character' },
      { Field: 'inclusions', Description: "What's included", Example: 'Hotel|Breakfast|Airport transfers', Notes: 'Separate with | character' },
      { Field: 'exclusions', Description: "What's not included", Example: 'Flights|Lunch|Insurance', Notes: 'Separate with | character' },
      { Field: '', Description: '', Example: '', Notes: '' },
      { Field: 'OVERVIEW FIELDS', Description: '', Example: '', Notes: 'Customize package overview section' },
      { Field: 'overview_section_title', Description: 'Overview heading', Example: 'Discover Japan', Notes: 'Optional custom title' },
      { Field: 'overview_description', Description: 'Overview text', Example: 'Experience the best of Japan...', Notes: 'Detailed description' },
      { Field: 'overview_highlights_label', Description: 'Highlights section label', Example: 'Trip Highlights', Notes: 'Custom label for highlights' },
      { Field: 'overview_badge_variant', Description: 'Badge style variant', Example: 'default, secondary, outline', Notes: 'Visual style option' },
      { Field: 'overview_badge_style', Description: 'Custom badge CSS', Example: 'bg-blue-100 text-blue-800', Notes: 'Advanced styling (optional)' },
      { Field: '', Description: '', Example: '', Notes: '' },
      { Field: 'ITINERARY', Description: '', Example: '', Notes: 'Day-by-day schedule in JSON format' },
      { Field: 'itinerary', Description: 'Daily schedule JSON', Example: 'See Itinerary Examples sheet', Notes: 'Valid JSON array of day objects' }
    ];

    const ws2 = XLSX.utils.json_to_sheet(instructions);
    ws2['!cols'] = [{ wch: 25 }, { wch: 30 }, { wch: 45 }, { wch: 40 }];
    XLSX.utils.book_append_sheet(wb, ws2, "Instructions");

    // Sheet 3: Itinerary Examples
    const itineraryExamples = [
      { 
        Example: 'Single Day Itinerary',
        JSON_Format: JSON.stringify([
          {
            day: 1,
            title: "Arrival in Tokyo",
            description: "Welcome to Japan! Your adventure begins in the vibrant capital.",
            activities: ["Airport transfer to hotel", "Hotel check-in", "Welcome dinner", "Evening walk"],
            meals: ["Dinner"],
            accommodation: "Tokyo Grand Hotel or similar"
          }
        ], null, 2)
      },
      { 
        Example: 'Multi-Day Itinerary',
        JSON_Format: JSON.stringify([
          {
            day: 1,
            title: "Arrival Day",
            description: "Arrive and settle in",
            activities: ["Airport pickup", "Hotel check-in", "Orientation tour"],
            meals: ["Dinner"],
            accommodation: "City Hotel"
          },
          {
            day: 2,
            title: "City Exploration",
            description: "Discover the city highlights",
            activities: ["Museum visit", "Temple tour", "Local market", "Cultural show"],
            meals: ["Breakfast", "Lunch"],
            accommodation: "City Hotel"
          },
          {
            day: 3,
            title: "Departure",
            description: "Final day and departure",
            activities: ["Breakfast", "Free time", "Airport transfer"],
            meals: ["Breakfast"],
            accommodation: "N/A"
          }
        ], null, 2)
      },
      {
        Example: 'Required Fields',
        JSON_Format: 'day (number), title (text), description (text), activities (array), meals (array)'
      },
      {
        Example: 'Optional Fields',
        JSON_Format: 'accommodation (text)'
      },
      {
        Example: 'Important Notes',
        JSON_Format: 'Must be valid JSON. Copy examples and modify. Test JSON validity before upload.'
      }
    ];

    const ws3 = XLSX.utils.json_to_sheet(itineraryExamples);
    ws3['!cols'] = [{ wch: 25 }, { wch: 120 }];
    XLSX.utils.book_append_sheet(wb, ws3, "Itinerary Examples");

    // Sheet 4: Field Reference
    const fieldReference = [
      { Category: 'Regions', Valid_Values: 'Asia, Europe, Africa, Americas, Middle East, Pacific Islands', Notes: 'Case-sensitive' },
      { Category: 'Categories', Valid_Values: 'Adventure, Cultural, Beach, Luxury, Family, Honeymoon, Group, Wildlife, Pilgrimage', Notes: 'Choose most relevant' },
      { Category: 'Badge Variants', Valid_Values: 'default, secondary, destructive, outline', Notes: 'For overview_badge_variant' },
      { Category: 'Boolean Fields', Valid_Values: 'TRUE, FALSE', Notes: 'Case-insensitive' },
      { Category: 'Rating Range', Valid_Values: '0.0 to 5.0', Notes: 'Decimal numbers allowed' },
      { Category: 'Array Separator', Valid_Values: '| (pipe character)', Notes: 'For highlights, inclusions, exclusions' },
      { Category: 'Slug Format', Valid_Values: 'lowercase-with-hyphens', Notes: 'No spaces, special chars, or uppercase' },
      { Category: 'Image URLs', Valid_Values: 'https://example.com/image.jpg', Notes: 'Must be accessible, preferably HTTPS' },
      { Category: 'Currency', Valid_Values: '$, ₹, €, £, etc.', Notes: 'Include in price field' },
      { Category: 'Duration Format', Valid_Values: '7 Days, 6 Nights', Notes: 'Include both days and nights' }
    ];

    const ws4 = XLSX.utils.json_to_sheet(fieldReference);
    ws4['!cols'] = [{ wch: 20 }, { wch: 80 }, { wch: 40 }];
    XLSX.utils.book_append_sheet(wb, ws4, "Field Reference");

    // Write file
    XLSX.writeFile(wb, 'packages-template.xlsx');
    toast({
      title: "Template downloaded",
      description: "Comprehensive Excel template with 4 sheets downloaded successfully.",
    });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
          selectedFile.type === 'application/vnd.ms-excel') {
        setFile(selectedFile);
        setResult(null);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please select an Excel file (.xlsx or .xls).",
          variant: "destructive",
        });
      }
    }
  };

  const processExcelFile = async (file: File): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          resolve(jsonData);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsArrayBuffer(file);
    });
  };

  const validatePackageData = (packageData: any): string[] => {
    const errors: string[] = [];
    const requiredFields = ['title', 'country', 'region', 'duration', 'price', 'image', 'category'];
    
    requiredFields.forEach(field => {
      if (!packageData[field] || packageData[field].toString().trim() === '') {
        errors.push(`Missing required field: ${field}`);
      }
    });

    // Validate slug format if provided
    if (packageData.slug) {
      const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
      if (!slugPattern.test(packageData.slug.toString().trim())) {
        errors.push('Slug must be lowercase with hyphens only (e.g., magical-japan-explorer)');
      }
    }

    // Validate rating if provided
    if (packageData.rating && (isNaN(packageData.rating) || packageData.rating < 0 || packageData.rating > 5)) {
      errors.push('Rating must be a number between 0 and 5');
    }

    // Validate reviews if provided
    if (packageData.reviews && (isNaN(packageData.reviews) || packageData.reviews < 0)) {
      errors.push('Reviews must be a positive number');
    }

    // Validate region
    const validRegions = ['Asia', 'Europe', 'Africa', 'Americas', 'Middle East', 'Pacific Islands'];
    if (packageData.region && !validRegions.includes(packageData.region.toString().trim())) {
      errors.push(`Invalid region. Must be one of: ${validRegions.join(', ')}`);
    }

    return errors;
  };

  const transformPackageData = (rawData: any) => {
    // Generate slug from title if not provided
    const generateSlug = (title: string) => {
      return title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
    };

    const transformedData: any = {
      title: rawData.title?.toString().trim(),
      slug: rawData.slug?.toString().trim() || generateSlug(rawData.title?.toString() || ''),
      country: rawData.country?.toString().trim(),
      country_slug: rawData.country_slug?.toString().trim() || rawData.country?.toString().toLowerCase().replace(/\s+/g, '-'),
      region: rawData.region?.toString().trim(),
      duration: rawData.duration?.toString().trim(),
      price: rawData.price?.toString().trim(),
      image: rawData.image?.toString().trim(),
      category: rawData.category?.toString().trim(),
      rating: rawData.rating ? parseFloat(rawData.rating) : 4.5,
      reviews: rawData.reviews ? parseInt(rawData.reviews) : 0,
      featured: rawData.featured?.toString().toLowerCase() === 'true',
    };

    // Optional fields
    if (rawData.original_price) transformedData.original_price = rawData.original_price.toString().trim();
    if (rawData.best_time) transformedData.best_time = rawData.best_time.toString().trim();
    if (rawData.group_size) transformedData.group_size = rawData.group_size.toString().trim();
    if (rawData.overview_section_title) transformedData.overview_section_title = rawData.overview_section_title.toString().trim();
    if (rawData.overview_description) transformedData.overview_description = rawData.overview_description.toString().trim();
    if (rawData.overview_highlights_label) transformedData.overview_highlights_label = rawData.overview_highlights_label.toString().trim();
    if (rawData.overview_badge_variant) transformedData.overview_badge_variant = rawData.overview_badge_variant.toString().trim();
    if (rawData.overview_badge_style) transformedData.overview_badge_style = rawData.overview_badge_style.toString().trim();

    // Transform arrays (pipe-separated values)
    if (rawData.highlights) {
      transformedData.highlights = rawData.highlights.toString().split('|').map((item: string) => item.trim()).filter(Boolean);
    }
    if (rawData.inclusions) {
      transformedData.inclusions = rawData.inclusions.toString().split('|').map((item: string) => item.trim()).filter(Boolean);
    }
    if (rawData.exclusions) {
      transformedData.exclusions = rawData.exclusions.toString().split('|').map((item: string) => item.trim()).filter(Boolean);
    }

    // Transform itinerary (JSON string)
    if (rawData.itinerary) {
      try {
        const parsed = JSON.parse(rawData.itinerary);
        transformedData.itinerary = Array.isArray(parsed) ? parsed : [];
      } catch (error) {
        console.error('Invalid itinerary JSON:', error);
        transformedData.itinerary = [];
      }
    }

    return transformedData;
  };

  const uploadPackages = async () => {
    if (!file) return;

    setUploading(true);
    setProgress(0);
    setResult(null);

    try {
      const rawData = await processExcelFile(file);
      const totalPackages = rawData.length;
      let successCount = 0;
      let failedCount = 0;
      const errors: string[] = [];

      for (let i = 0; i < rawData.length; i++) {
        const packageData = rawData[i];
        setProgress(((i + 1) / totalPackages) * 100);

        try {
          // Validate data
          const validationErrors = validatePackageData(packageData);
          if (validationErrors.length > 0) {
            errors.push(`Row ${i + 2}: ${validationErrors.join(', ')}`);
            failedCount++;
            continue;
          }

          // Transform data
          const transformedData = transformPackageData(packageData);

          // Insert into database
          const { error } = await supabase
            .from('packages')
            .insert(transformedData);

          if (error) {
            errors.push(`Row ${i + 2}: ${error.message}`);
            failedCount++;
          } else {
            successCount++;
          }
        } catch (error) {
          errors.push(`Row ${i + 2}: ${error instanceof Error ? error.message : 'Unknown error'}`);
          failedCount++;
        }
      }

      setResult({
        success: successCount,
        failed: failedCount,
        errors: errors.slice(0, 10) // Show only first 10 errors
      });

      if (successCount > 0) {
        toast({
          title: "Upload completed",
          description: `Successfully uploaded ${successCount} packages.`,
        });
      }

      if (failedCount > 0) {
        toast({
          title: "Some packages failed to upload",
          description: `${failedCount} packages failed. Check the results below.`,
          variant: "destructive",
        });
      }

    } catch (error) {
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileSpreadsheet className="h-5 w-5" />
          Bulk Upload Packages
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Download Template */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Step 1: Download Template</h3>
          <Button
            onClick={downloadTemplate}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Download Excel Template
          </Button>
          <p className="text-xs text-muted-foreground">
            Download the template with sample data and required columns. Fill in your package data following the format.
          </p>
        </div>

        {/* File Upload */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Step 2: Upload Your File</h3>
          <Input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileChange}
            disabled={uploading}
          />
          {file && (
            <p className="text-sm text-muted-foreground">
              Selected: {file.name}
            </p>
          )}
        </div>

        {/* Upload Button */}
        <Button
          onClick={uploadPackages}
          disabled={!file || uploading}
          className="w-full flex items-center gap-2"
        >
          <Upload className="h-4 w-4" />
          {uploading ? 'Uploading...' : 'Upload Packages'}
        </Button>

        {/* Progress */}
        {uploading && (
          <div className="space-y-2">
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-center text-muted-foreground">
              Processing... {Math.round(progress)}%
            </p>
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Successful:</strong> {result.success} packages
                </AlertDescription>
              </Alert>
              {result.failed > 0 && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Failed:</strong> {result.failed} packages
                  </AlertDescription>
                </Alert>
              )}
            </div>

            {result.errors.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-destructive">Errors:</h4>
                <div className="bg-destructive/10 p-3 rounded-lg max-h-48 overflow-y-auto">
                  {result.errors.map((error, index) => (
                    <p key={index} className="text-xs text-destructive font-mono">
                      {error}
                    </p>
                  ))}
                  {result.failed > 10 && (
                    <p className="text-xs text-muted-foreground mt-2">
                      ... and {result.failed - 10} more errors
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Instructions */}
        <div className="space-y-2 p-4 bg-muted rounded-lg">
          <h4 className="text-sm font-medium">Template Information:</h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• <strong>4 sheets included:</strong> Sample Packages, Instructions, Itinerary Examples, Field Reference</li>
            <li>• <strong>Required fields:</strong> title, country, region, duration, price, image, category</li>
            <li>• <strong>Slug:</strong> Auto-generated from title if not provided (lowercase-with-hyphens)</li>
            <li>• <strong>Arrays:</strong> Use pipe (|) to separate highlights, inclusions, and exclusions</li>
            <li>• <strong>Itinerary:</strong> Copy examples from "Itinerary Examples" sheet and modify</li>
            <li>• <strong>Featured:</strong> Set as TRUE or FALSE (case-insensitive)</li>
            <li>• <strong>Rating:</strong> Number between 0 and 5 (default: 4.5)</li>
            <li>• <strong>Regions:</strong> Asia, Europe, Africa, Americas, Middle East, Pacific Islands</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};