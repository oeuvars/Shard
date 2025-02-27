import { Skeleton } from '@/components/ui/skeleton';

export const FormSectionSkeleton = () => {
  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="flex items-center gap-x-2">
          <Skeleton className="h-9 w-16" />
          <Skeleton className="h-9 w-9" />
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left Column */}
        <div className="space-y-8 lg:col-span-3">
          {/* Title Field */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Description Field */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-[250px] w-full" />
          </div>

          {/* Thumbnail Field */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-[84px] w-[153px] rounded-lg" />
          </div>

          {/* Category Field */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-y-8 lg:col-span-2">
          {/* Video Preview Card */}
          <div className="flex flex-col gap-4 bg-[#F9F9F9] rounded-xl overflow-hidden">
            <Skeleton className="aspect-video" />
            <div className="p-4 flex flex-col gap-y-6">
              {/* Video Link */}
              <div className="flex justify-between items-center gap-x-2">
                <div className="space-y-2">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-4 w-48" />
                </div>
                <Skeleton className="h-8 w-8" />
              </div>

              {/* Video Status */}
              <div className="flex justify-between items-center gap-x-2">
                <div className="space-y-2">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>

              {/* Track Status */}
              <div className="flex justify-between items-center gap-x-2">
                <div className="space-y-2">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
            </div>
          </div>

          {/* Visibility Field */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
};
