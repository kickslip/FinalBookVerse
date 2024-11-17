import React from 'react';
import { Card } from '@/components/ui/card';

interface CollectionSkeletonProps {
  title?: string;
  description?: string;
  itemsPerPage?: number;
  gridCols?: 2 | 3 | 4;
  showHeader?: boolean;
  cardHeight?: string;
  imageHeight?: string;
}

const SkeletonCard = ({ cardHeight = "h-[400px]", imageHeight = "h-64" }: { cardHeight?: string; imageHeight?: string }) => (
  <Card className={`w-full ${cardHeight} animate-pulse`}>
    <div className={`w-full ${imageHeight} bg-muted rounded-t-lg`} />
    <div className="p-4 space-y-3">
      <div className="h-4 bg-muted rounded w-3/4" />
      <div className="h-4 bg-muted rounded w-1/2" />
      <div className="h-8 bg-muted rounded w-1/3 mt-4" />
    </div>
  </Card>
);

const CollectionSkeleton: React.FC<CollectionSkeletonProps> = ({
  title = "Collection",
  description = "Loading collection items...",
  itemsPerPage = 12,
  gridCols = 4,
  showHeader = true,
  cardHeight = "h-[400px]",
  imageHeight = "h-64"
}) => {
  // Grid columns configuration
  const gridColsClass = {
    2: 'lg:grid-cols-2',
    3: 'lg:grid-cols-3',
    4: 'lg:grid-cols-4'
  }[gridCols];

  return (
    <>
      {/* Configurable Header Skeleton */}
      {showHeader && (
        <div className="bg-muted border-b border-border mb-6 animate-pulse">
          <div className="container mx-auto px-4 py-6">
            <div className="h-8 bg-muted-foreground/15 rounded w-1/3 mb-2" 
                 aria-label={`Loading ${title}`} />
            <div className="h-4 bg-muted-foreground/15 rounded w-1/2" 
                 aria-label={`Loading ${description}`} />
          </div>
        </div>
      )}

      {/* Products Grid Skeleton */}
      <div className="container mx-auto px-4">
        <div className={`grid grid-cols-1 ${gridColsClass} gap-6 mb-8`}>
          {Array.from({ length: itemsPerPage }).map((_, index) => (
            <div key={index} className="w-full">
              <SkeletonCard cardHeight={cardHeight} imageHeight={imageHeight} />
            </div>
          ))}
        </div>

        {/* Pagination Skeleton */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="p-2 rounded-lg border border-border bg-muted w-10 h-10" 
               aria-label="Previous page placeholder" />
          <div className="flex gap-2">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="w-10 h-10 rounded-lg bg-muted"
                aria-label={`Page ${index + 1} placeholder`}
              />
            ))}
          </div>
          <div className="p-2 rounded-lg border border-border bg-muted w-10 h-10" 
               aria-label="Next page placeholder" />
        </div>

        {/* Results Count Skeleton */}
        <div className="flex justify-center">
          <div className="h-4 bg-muted rounded w-48 mb-6" 
               aria-label="Results count placeholder" />
        </div>
      </div>
    </>
  );
};

export default CollectionSkeleton;