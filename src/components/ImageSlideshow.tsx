import { useState, useEffect, useRef } from "react";
import { OptimizedImage } from "@/components/ui/optimized-image";

interface ImageSlideshowProps {
  images: string[];
  alt: string;
  className?: string;
  width?: string;
  height?: string;
  hoverToPlay?: boolean;
}

const ImageSlideshow = ({ images, alt, className = "", width, height, hoverToPlay = true }: ImageSlideshowProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

  // Start new interval only when hovering (if allowed) and has multiple images
  if (hoverToPlay && isHovered && images.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentImageIndex((prevIndex) => 
          (prevIndex + 1) % images.length
        );
      }, 2000); // Change image every 2 seconds
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isHovered, images.length]);

  // Reset to first image when not hovering (only relevant if hoverToPlay enabled)
  useEffect(() => {
    if (hoverToPlay && !isHovered) {
      setCurrentImageIndex(0);
    }
  }, [isHovered, hoverToPlay]);

  return (
    <div 
      className={`relative overflow-hidden ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {images.map((image, index) => (
        <OptimizedImage
          key={index}
          src={image}
          alt={`${alt} - View ${index + 1}`}
          priority={index === 0}
          width={width}
          height={height}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
            index === currentImageIndex ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}
      
      {/* Slideshow indicator dots */}
  {hoverToPlay && isHovered && images.length > 1 && (
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
          {images.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                index === currentImageIndex 
                  ? 'bg-white' 
                  : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageSlideshow;