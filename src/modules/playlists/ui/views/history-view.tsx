import React from 'react';
import HistorySection from '../sections/history-section';

type Props = {};

const HistoryView = (props: Props) => {
  return (
    <div className="max-w-screen-2xl mx-auto mb-10 px-4 pt-2.5 flex flex-col gap-y-6 ">
      <div className="">
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-800">History</h1>
        <p className="text-sm text-neutral-400">Videos you have watched</p>
      </div>
      <HistorySection />
    </div>
  );
};

export default HistoryView;
