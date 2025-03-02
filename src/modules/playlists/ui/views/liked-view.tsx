import LikedSection from '../sections/liked-section';

type Props = {};

const LikedView = (props: Props) => {
  return (
    <div className="max-w-screen-2xl mx-auto mb-10 px-4 pt-2.5 flex flex-col gap-y-6 ">
      <div className="">
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-800">Liked</h1>
        <p className="text-sm text-neutral-400">Videos you have liked</p>
      </div>
      <LikedSection />
    </div>
  );
};

export default LikedView;
