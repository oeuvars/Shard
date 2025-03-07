import VideoSection from '../sections/video-section';

type Props = {};

const StudioView = (props: Props) => {
  return (
    <div className="flex flex-col gap-y-6 pt-2.5">
      <div className="px-4">
        <h1 className="text-2xl font-bold tracking-tight">Channel Content</h1>
        <p className="text-xs text-zinc-400">Manage your channel content and videos</p>
      </div>
      <VideoSection />
    </div>
  );
};

export default StudioView;
