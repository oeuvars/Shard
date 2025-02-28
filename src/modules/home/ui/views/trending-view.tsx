import TrendingSection from '../sections/trending-section';

type Props = {};

const TrendingView = () => {
  return (
    <div className="max-w-[2400px] mx-auto mb-10 px-4 pt-2.5 flex flex-col gap-y-6 ">
      <div className="">
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-800">Trending Videos</h1>
        <p className="text-sm text-neutral-400">Most popular videos at the moment</p>
      </div>
      <TrendingSection />
    </div>
  );
};

export default TrendingView;
