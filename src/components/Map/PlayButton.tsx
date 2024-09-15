import { useAtom } from 'jotai';
import { Button } from '../ui/button';
import { isPlayingAtom } from './state';

function PlayButton(): JSX.Element {
  const [isPlaying, setIsPlaying] = useAtom(isPlayingAtom);
  return (
    <>
      <Button onClick={() => setIsPlaying(!isPlaying)}>
        {isPlaying ? 'Pause' : 'Play'}
      </Button>
    </>
  );
}

export default PlayButton;
