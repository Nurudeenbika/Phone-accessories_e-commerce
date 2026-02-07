// Performance monitoring utilities

export function measurePerformance(name: string, fn: () => void) {
  if (typeof window !== "undefined" && "performance" in window) {
    const start = performance.now();
    fn();
    const end = performance.now();
    console.log(`${name} took ${end - start} milliseconds`);
  } else {
    fn();
  }
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number,
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Image optimization helper
export function getOptimizedImageUrl(
  src: string,
  width: number,
  height: number,
  quality: number = 75,
): string {
  // For Cloudinary images
  if (src.includes("cloudinary.com")) {
    return src.replace(
      "/upload/",
      `/upload/w_${width},h_${height},c_fill,q_${quality}/`,
    );
  }
  return src;
}
