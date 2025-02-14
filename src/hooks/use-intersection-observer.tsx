
import { useEffect, useRef, useState } from 'react';

export const useIntersectionObserver = ( options?: IntersectionObserverInit ) => {
   const [isIntersecting, setIsIntersecting] = useState(false);
   const elementRef = useRef<HTMLDivElement | null>(null);

   useEffect(() => {
      const observer = new IntersectionObserver((entries) => {
         const [entry] = entries;
         setIsIntersecting(entry.isIntersecting);
      }, options);

      if (elementRef.current) {
         observer.observe(elementRef.current);
      }

      return () => {
         if (elementRef.current) {
            observer.unobserve(elementRef.current);
         }
      };
   }, []);

   return [isIntersecting, elementRef] as const;
};
