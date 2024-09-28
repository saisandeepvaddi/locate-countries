import useGame from '@/hooks/useGame';
import { cn } from '@/lib/utils';
import PlayButton from './PlayButton';
import Question from './Question';

function GameStateTopBanner(): JSX.Element {
  const { isPlaying } = useGame();

  return (
    <div className='absolute top-0 left-0 w-full h-20 bg-slate-500/30 z-50 v-center'>
      {isPlaying && (
        <div className='h-center'>
          <Question />
        </div>
      )}
      <div className={cn(isPlaying ? 'right-0' : 'left-0', 'absolute', 'mr-2')}>
        <PlayButton />
      </div>
    </div>
  );
}

export default GameStateTopBanner;
