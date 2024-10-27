import useGame from "@/hooks/useGame";

function Question() {
  const { countryInQuestion, questionBank, playedCountries } = useGame();
  return (
    <div className="text-md h-center my-4 min-w-36 rounded-lg border-2 bg-neutral-950/50 px-2 sm:border-none">
      <div className="inline-flex flex-col items-center justify-center gap-2">
        <span className="font-bold text-white">{countryInQuestion?.name}</span>
        <div className="text-white">
          {playedCountries.length} / {questionBank.length}
        </div>
      </div>
    </div>
  );
}

export default Question;
