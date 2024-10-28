import useGame from "@/hooks/useGame";
import { getMaxZoomForCountry } from "@/lib/utils";

function Question() {
  const { countryInQuestion, questionBank, playedCountries } = useGame();
  const needsMaxZoom = countryInQuestion
    ? getMaxZoomForCountry(countryInQuestion?.iso_3166_1) !== undefined
    : false;
  return (
    <div className="text-md h-center my-12 min-w-36 rounded-lg border-2 bg-neutral-950/50 px-2 py-2 sm:my-4 sm:border-none">
      <div className="inline-flex flex-col items-center justify-center gap-2">
        <span className="font-bold text-white">{countryInQuestion?.name}</span>
        <div className="text-white">
          {playedCountries.length} / {questionBank.length}
        </div>
        {needsMaxZoom && (
          <div className="mb-2 flex items-center gap-1">
            <span className="text-xs text-slate-400">
              (May need to zoom to max to see this country)
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default Question;
