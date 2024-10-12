import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import useGame from '@/hooks/useGame';
import { getCountriesBySet } from '@/lib/utils';
import { RegionSet, questionSetAtom } from '@/state/game';

import { useAtom } from 'jotai';

function QuestionSetSelect() {
  const regions = Object.values(RegionSet);
  const { resetGame } = useGame();
  const [questionSet, setQuestionSet] = useAtom(questionSetAtom);

  return (
    <Select
      value={questionSet}
      onValueChange={(value) => {
        setQuestionSet(value as RegionSet);
        resetGame();
      }}
    >
      <SelectTrigger className='w-[280px] bg-slate-950 text-white'>
        <SelectValue placeholder='Set' />
      </SelectTrigger>
      <SelectContent className='bg-slate-950 text-white'>
        {regions.map((region) => (
          <SelectItem key={region} value={region}>
            {region.charAt(0).toUpperCase() + region.slice(1)} (
            {getCountriesBySet(region).length})
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export default QuestionSetSelect;
