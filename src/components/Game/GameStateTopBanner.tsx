import useGame from "@/hooks/useGame";
import SettingsDialog from "../Settings/SettingsDialog";
import PlayButton from "./PlayButton";
import Question from "./Question";
import QuestionSetSelect from "./QuestionSetSelect";

export function GameStateTopBanner() {
  const { isPlaying } = useGame();

  return (
    <div className="absolute left-0 top-0 z-50 h-20 w-full bg-slate-950/50 px-4">
      <div className="v-center h-full w-full">
        <div className="flex gap-2">
          <QuestionSetSelect />
          <PlayButton />
        </div>

        <div className="fixed flex flex-1 items-center justify-center md:w-1/2">
          {isPlaying && <Question />}
        </div>

        <SettingsDialog />
      </div>
    </div>
  );
}
