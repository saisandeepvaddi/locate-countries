import useGame from '@/hooks/useGame';
import PlayButton from './PlayButton';
import Question from './Question';
import QuestionSetSelect from './QuestionSetSelect';

export function GameStateTopBanner(): JSX.Element {
  const { isPlaying } = useGame();

  return (
    <div className='absolute top-0 left-0 w-full h-20 bg-slate-950/70 z-50'>
      <div className='w-full h-full v-center px-2'>
        <div className='flex gap-2 flex-1'>
          <QuestionSetSelect />
          <PlayButton />
        </div>
        <div className='flex-1 h-center'>{isPlaying && <Question />}</div>
        {/* Keep it to balance center */}
        <div className='flex-1' />
      </div>
    </div>
  );
}