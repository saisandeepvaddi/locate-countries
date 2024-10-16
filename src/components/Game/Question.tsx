import useGame from "@/hooks/useGame";

function Question() {
  const { questionLocation, playedLocations, availableLocations } = useGame();
  return (
    <div className="text-md h-center my-4 min-w-36 rounded-lg border-2 bg-neutral-950/50 px-2 sm:border-none">
      <div className="inline-flex flex-col items-center justify-center gap-2">
        <span className="font-bold text-white">{questionLocation?.name}</span>
        <div className="text-white">
          {playedLocations.length} / {availableLocations.length}
        </div>
      </div>
    </div>
  );
}

export default Question;
