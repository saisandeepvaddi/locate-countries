import useGame from '@/hooks/useGame';
import { ThemeSelect } from '../ThemeSelect';
import PlayButton from './PlayButton';
import Question from './Question';
import QuestionSetSelect from './QuestionSetSelect';

export function GameStateTopBanner() {
  const { isPlaying } = useGame();

  return (
    <div className='absolute top-0 left-0 w-full h-20 bg-slate-950/70 z-50'>
      <div className='w-full h-full v-center px-2'>
        <div className='flex gap-2 flex-1'>
          <QuestionSetSelect />
          <PlayButton />
        </div>

        <div className='flex-1'>{isPlaying && <Question />}</div>
        <ThemeSelect />
      </div>
    </div>
  );
}
