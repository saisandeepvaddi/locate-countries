import useGame from "@/hooks/useGame";
import SettingsDialog from "../Settings/SettingsDialog";
import PlayButton from "./PlayButton";
import Question from "./Question";
import QuestionSetSelect from "./QuestionSetSelect";

export function GameStateTopBanner() {
  const { isPlaying } = useGame();

  return (
    <div className="absolute left-0 top-0 z-50 h-20 w-full bg-slate-950/50 px-4">
      <div className="v-center h-full w-full columns-3">
        <div className="v-center flex gap-2 sm:w-full">
          <QuestionSetSelect />
          <PlayButton />
        </div>

        <div className="h-center fixed bottom-0 w-full sm:relative">
          {isPlaying && <Question />}
        </div>
        <div className="flex w-full justify-end">
          <SettingsDialog />
        </div>
      </div>
    </div>
  );
}
