import useGame from "@/hooks/useGame";
import { PauseIcon, PlayIcon } from "lucide-react";
import { Button } from "../ui/button";

function PlayButton() {
  const { isPlaying, toggleGamePlay } = useGame();

  return (
    <Button
      onClick={() => {
        toggleGamePlay();
      }}
      className="flex gap-2"
    >
      {isPlaying ? (
        <PauseIcon className="h-4 w-4" />
      ) : (
        <PlayIcon className="h-4 w-4" />
      )}
      {isPlaying ? "Pause" : "Play"}
    </Button>
  );
}

export default PlayButton;
