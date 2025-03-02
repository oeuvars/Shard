import SubscriptionSection from '../sections/subscription-section';

type Props = {};

const SubscriptionView = () => {
  return (
    <div className="max-w-[2400px] mx-auto mb-10 px-4 pt-2.5 flex flex-col gap-y-6 ">
      <div className="">
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-800">Subscriptions</h1>
        <p className="text-sm text-neutral-400">Videos from your favorite creator</p>
      </div>
      <SubscriptionSection />
    </div>
  );
};

export default SubscriptionView;
