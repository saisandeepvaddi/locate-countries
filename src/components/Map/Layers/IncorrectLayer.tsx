import useGame from "@/hooks/useGame";
import { layerThemes } from "@/lib/themes";
import { themeAtom } from "@/state/settings";
import { useAtomValue } from "jotai";
import { JSX } from "react";
import { Layer } from "react-map-gl";

function IncorrectLayer(): JSX.Element {
  const selectedTheme = useAtomValue(themeAtom);
  const { errorCountries } = useGame();
  const layerTheme = layerThemes[selectedTheme] ?? layerThemes.light;

  return (
    <Layer
      id="country-boundaries-incorrect"
      type="fill"
      source="country-boundaries"
      source-layer="country_boundaries"
      filter={["in", ["get", "iso_3166_1"], ["literal", errorCountries]]}
      paint={{
        "fill-color": layerTheme.error,
        "fill-outline-color": layerTheme.border,
      }}
    />
  );
}

export default IncorrectLayer;
