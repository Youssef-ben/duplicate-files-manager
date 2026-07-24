import { LoadingDots } from '@components/loadingDots';

export const StepLoader = (): React.JSX.Element => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full text-outline-dim">
      <div className="flex flex-row items-end justify-center gap-2">
        Preparing
        <LoadingDots dotClassName="bg-outline-dim" />
      </div>
    </div>
  );
};
