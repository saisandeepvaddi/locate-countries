import useGame from '@/hooks/useGame';

function Question(): JSX.Element {
  const { questionLocation } = useGame();
  return (
    <p className='text-2xl font-bold text-blue-800'>{questionLocation?.name}</p>
  );
}

export default Question;
