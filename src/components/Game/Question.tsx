import useGame from '@/hooks/useGame';

function Question() {
  const { questionLocation } = useGame();
  return (
    <span className='text-2xl font-bold text-white'>
      {questionLocation?.name}
    </span>
  );
}

export default Question;
