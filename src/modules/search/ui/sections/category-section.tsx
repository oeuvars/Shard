'use client';

import FilterCarousel from '@/components/global/filter-carousel';
import { trpc } from '@/trpc/client/client';
import { useRouter } from 'next/navigation';
import { Suspense } from 'react';
import { CategorySkeleton } from '../skeletons/category-skeleton';

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

const CategorySectionSuspense = ({ categoryId }: Props) => {
  const [categories] = trpc.categories.getMany.useSuspenseQuery();
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
