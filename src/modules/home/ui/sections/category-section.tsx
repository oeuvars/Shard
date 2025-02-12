'use client';

import FilterCarousel from '@/components/global/filter-carousel';
import { trpc } from '@/trpc/client';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { Suspense } from 'react';

type Props = {
  categoryId?: string;
};

export const CategorySection = ({ categoryId }: Props) => {
  return (
    <Suspense fallback={<CategorySkeleton />}>
      <CategorySectionSuspense categoryId={categoryId} />
    </Suspense>
  );
};

const CategorySkeleton = () => {
  return <FilterCarousel isLoading data={[]} onSelect={() => {}} />;
};

const CategorySectionSuspense = ({ categoryId }: Props) => {
  const [categories] = trpc.categorires.getMany.useSuspenseQuery();
  const router = useRouter();
  const data = categories.map(item => ({
    value: item.id,
    label: item.name,
  }));

  const onSelect = (value: string | null) => {
    const url = new URL(window.location.href);

    if (value) {
      url.searchParams.set('categoryId', value);
    } else {
      url.searchParams.delete('categoryId');
    }

    router.push(url.toString());
  };
  return <FilterCarousel onSelect={onSelect} value={categoryId} data={data} />;
};

export default CategorySection;
