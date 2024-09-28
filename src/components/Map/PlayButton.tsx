import { useAtom } from 'jotai';
import { isPlayingAtom } from '../../state';
import { Button } from '../ui/button';

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
