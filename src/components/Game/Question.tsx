import useGame from '@/hooks/useGame';

function Question() {
  const { questionLocation, playedLocations, availableLocations } = useGame();
  return (
    <div className='flex-1'>
      <div className='inline-flex flex-col justify-center items-center gap-2'>
        <span className='text-2xl font-bold text-white'>
          {questionLocation?.name}
        </span>
        <div className='text-white text-xl'>
          {playedLocations.length} / {availableLocations.length}
        </div>
      </div>
    </div>
  );
}

export default Question;
