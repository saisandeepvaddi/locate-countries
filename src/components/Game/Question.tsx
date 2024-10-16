import useGame from "@/hooks/useGame";

function Question() {
  const { questionLocation, playedLocations, availableLocations } = useGame();
  return (
    <div className="text-md">
      <div className="inline-flex flex-col justify-center items-center gap-2">
        <span className="font-bold text-white">{questionLocation?.name}</span>
        <div className="text-white">
          {playedLocations.length} / {availableLocations.length}
        </div>
      </div>
    </div>
  );
}

export default Question;
