import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useGame from "@/hooks/useGame";
import { getCountriesBySet } from "@/lib/utils";
import { gameStateAtom, RegionSet } from "@/state/game";

import { useAtom } from "jotai";

function QuestionSetSelect() {
  const regions = Object.values(RegionSet);
  const { resetGame } = useGame();
  const [gameState, setGameState] = useAtom(gameStateAtom);
  const questionSet = gameState.questionSet;

  return (
    <Select
      value={questionSet}
      onValueChange={(value) => {
        setGameState({ ...gameState, questionSet: value as RegionSet });
        resetGame();
      }}
    >
      <SelectTrigger className="bg-slate-950 text-white sm:w-[280px]">
        <SelectValue placeholder="Set" />
      </SelectTrigger>
      <SelectContent className="bg-slate-950 text-white">
        {regions.map((region) => (
          <SelectItem key={region} value={region}>
            {region.charAt(0).toUpperCase() + region.slice(1)} (
            {getCountriesBySet(region).length})
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export default QuestionSetSelect;
