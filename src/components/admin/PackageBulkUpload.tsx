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
    // Create Excel template with proper columns
    const templateData = [
      {
        title: 'Sample Package Title',
        country: 'Japan',
        country_slug: 'japan',
        region: 'Asia',
        duration: '7 days',
        price: '$2,999',
        original_price: '$3,499',
        image: 'https://example.com/image.jpg',
        category: 'Adventure',
        best_time: 'Spring (March-May)',
        group_size: '2-8 people',
        highlights: 'Tokyo skyline|Mount Fuji|Cherry blossoms',
        inclusions: 'Hotel accommodation|Daily breakfast|Airport transfers',
        exclusions: 'International flights|Personal expenses|Travel insurance',
        rating: '4.5',
        reviews: '128',
        featured: 'FALSE',
        overview_section_title: 'Japan Discovery',
        overview_description: 'Experience the best of Japan...',
        overview_highlights_label: 'Trip Highlights',
        overview_badge_variant: 'default',
        overview_badge_style: 'bg-blue-100 text-blue-800',
        itinerary: JSON.stringify([
          {
            day: 1,
            title: "Arrival in Tokyo",
            activities: ["Airport transfer", "Hotel check-in", "Welcome dinner"],
            meals: ["Dinner"],
            accommodation: "Tokyo Hotel"
          }
        ])
      }
    ];

    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Packages Template");
    
    // Set column widths
    const colWidths = [
      { wch: 30 }, // title
      { wch: 15 }, // country
      { wch: 15 }, // country_slug
      { wch: 12 }, // region
      { wch: 10 }, // duration
      { wch: 10 }, // price
      { wch: 12 }, // original_price
      { wch: 40 }, // image
      { wch: 12 }, // category
      { wch: 20 }, // best_time
      { wch: 15 }, // group_size
      { wch: 50 }, // highlights
      { wch: 50 }, // inclusions
      { wch: 50 }, // exclusions
      { wch: 8 },  // rating
      { wch: 8 },  // reviews
      { wch: 10 }, // featured
      { wch: 25 }, // overview_section_title
      { wch: 50 }, // overview_description
      { wch: 20 }, // overview_highlights_label
      { wch: 15 }, // overview_badge_variant
      { wch: 25 }, // overview_badge_style
      { wch: 100 } // itinerary
    ];
    ws['!cols'] = colWidths;

    XLSX.writeFile(wb, 'packages-template.xlsx');
    toast({
      title: "Template downloaded",
      description: "Excel template has been downloaded successfully.",
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

    // Validate rating if provided
    if (packageData.rating && (isNaN(packageData.rating) || packageData.rating < 0 || packageData.rating > 5)) {
      errors.push('Rating must be a number between 0 and 5');
    }

    // Validate reviews if provided
    if (packageData.reviews && (isNaN(packageData.reviews) || packageData.reviews < 0)) {
      errors.push('Reviews must be a positive number');
    }

    return errors;
  };

  const transformPackageData = (rawData: any) => {
    const transformedData: any = {
      title: rawData.title?.toString().trim(),
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
      transformedData.highlights = rawData.highlights.toString().split('|').map((item: string) => item.trim());
    }
    if (rawData.inclusions) {
      transformedData.inclusions = rawData.inclusions.toString().split('|').map((item: string) => item.trim());
    }
    if (rawData.exclusions) {
      transformedData.exclusions = rawData.exclusions.toString().split('|').map((item: string) => item.trim());
    }

    // Transform itinerary (JSON string)
    if (rawData.itinerary) {
      try {
        transformedData.itinerary = JSON.parse(rawData.itinerary);
      } catch (error) {
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
          <h4 className="text-sm font-medium">Instructions:</h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Use pipe (|) to separate multiple values for highlights, inclusions, and exclusions</li>
            <li>• Set featured as TRUE or FALSE</li>
            <li>• Rating should be between 0 and 5</li>
            <li>• Itinerary should be valid JSON format</li>
            <li>• All image URLs should be valid and accessible</li>
            <li>• Required fields: title, country, region, duration, price, image, category</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};