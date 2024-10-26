import { layerThemes } from "@/lib/themes";
import { gameStateAtom } from "@/state/game";
import { themeAtom } from "@/state/settings";
import { useAtomValue } from "jotai";
import { JSX } from "react";
import { Layer } from "react-map-gl";

function CorrectLayer(): JSX.Element {
  const selectedTheme = useAtomValue(themeAtom);
  const correctCountries = useAtomValue(gameStateAtom).correctCountries;
  const layerTheme = layerThemes[selectedTheme] ?? layerThemes.light;
  return (
    <Layer
      id="country-boundaries-correct"
      type="fill"
      source="country-boundaries"
      source-layer="country_boundaries"
      filter={["in", ["get", "iso_3166_1"], ["literal", correctCountries]]}
      paint={{
        "fill-color": layerTheme.correct,
      }}
    />
  );
}

export default CorrectLayer;
