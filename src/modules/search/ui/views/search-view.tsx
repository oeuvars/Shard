import CategorySection from '../sections/category-section';
import ResultSection from '../sections/result-section';

type Props = {
  query: string | undefined;
  categoryId: string | undefined;
};

const SearchView = ({ query, categoryId }: Props) => {
  return (
    <div className="mx-auto mb-10 flex flex-col gap-y-6 px-4 pt-2.5">
      <CategorySection categoryId={categoryId} />
      <ResultSection query={query} categoryId={categoryId} />
    </div>
  );
};

export default SearchView;
