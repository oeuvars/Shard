'use client';

import { IconSearch, IconX } from '@tabler/icons-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, useState } from 'react';

type Props = {};

export const SearchInput = (props: Props) => {
  const searchParams = useSearchParams();
  const searchedQuery = searchParams.get('query') || '';
  const searchedCategory = searchParams.get('categoryId') || '';

  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState<string>(searchedQuery);

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const url = new URL('/search', process.env.NEXT_PUBLIC_APP_URL);
    const newQuery = searchQuery.trim();

    url.searchParams.set('query', encodeURIComponent(newQuery));

    if (searchedCategory) {
      url.searchParams.set('categoryId', searchedCategory);
    }
    if (newQuery === '') {
      url.searchParams.delete('query');
    }

    setSearchQuery(newQuery);

    router.push(url.toString());
  };

  return (
    <form className="flex w-full max-w-[600px]" onSubmit={handleSearch}>
      <div className="relative w-full">
        <input
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          type="text"
          placeholder="Search"
          className="w-full h-full pl-4 pr-12 text-sm text-zinc-900 border focus:outline-none rounded-l-full"
        />
        {searchQuery.length > 0 && (
          <IconX
            onClick={() => setSearchQuery('')}
            className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full text-neutral-500 size-5 hover:text-neutral-600 animate"
          />
        )}
      </div>
      <button
        disabled={!searchQuery.trim()}
        type="submit"
        className="px-5 py-2.5 bg-gray-100 border-l-0 rounded-r-full hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <IconSearch className="size-5 my-auto" />
      </button>
    </form>
  );
};
