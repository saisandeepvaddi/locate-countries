import useGame from '@/hooks/useGame';
import { PauseIcon, PlayIcon } from 'lucide-react';
import { Button } from '../ui/button';

function PlayButton(): JSX.Element {
  const { isPlaying, toggleGamePlay } = useGame();

  return (
    <Button
      onClick={() => {
        toggleGamePlay();
      }}
      className='flex gap-2'
    >
      {isPlaying ? (
        <PauseIcon className='w-4 h-4' />
      ) : (
        <PlayIcon className='w-4 h-4' />
      )}
      {isPlaying ? 'Pause' : 'Play'}
    </Button>
  );
}

export default PlayButton;
