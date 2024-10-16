import { mapboxApiKeyAtom } from "@/state/settings";
import { Label } from "@radix-ui/react-label";
import { useAtom } from "jotai";
import { InfoIcon } from "lucide-react";
import { Input } from "../ui/input";

interface MapboxKeyInputProps {
  onApiKeyChange?: (apiKey?: string) => void;
}
function MapboxKeyInput({ onApiKeyChange }: MapboxKeyInputProps): JSX.Element {
  const [apiKey, setApiKey] = useAtom(mapboxApiKeyAtom);

  const handleApiKeyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setApiKey(value);
    setTimeout(() => {
      onApiKeyChange?.(value);
    }, 0);
  };

  return (
    <>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="apiKey" className="text-right">
          Mapbox API Key
        </Label>
        <Input
          id="apiKey"
          value={apiKey}
          onChange={handleApiKeyChange}
          className="col-span-3"
          type="password"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-2">
        <div className="col-span-1"></div>
        <p className="col-span-3 flex items-center gap-2 text-xs text-slate-400">
          <InfoIcon className="h-4 w-4" />
          <a
            href="https://www.mapbox.com/account/access-tokens/"
            target="_blank"
            className="underline"
            rel="noreferrer noopener"
          >
            Get your Mapbox API key from here
          </a>
        </p>
      </div>
    </>
  );
}

export default MapboxKeyInput;
