"use client";

import SkeletonBase from "./SkeletonBase";

export function ProductSkeleton() {
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <SkeletonBase className="h-48">
        <></>
      </SkeletonBase>
      <div className="p-4 space-y-3">
        <SkeletonBase className="h-4">
          <></>
        </SkeletonBase>
        <SkeletonBase className="h-3 w-3/4">
          <></>
        </SkeletonBase>
        <SkeletonBase className="h-3 w-1/2">
          <></>
        </SkeletonBase>
        <div className="flex justify-between items-center">
          <SkeletonBase className="h-5 w-20">
            <></>
          </SkeletonBase>
          <SkeletonBase className="h-8 w-24">
            <></>
          </SkeletonBase>
        </div>
      </div>
    </div>
  );
}
