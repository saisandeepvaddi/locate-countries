import { layerThemes } from "@/lib/themes";
import { gameStateAtom } from "@/state/game";
import { themeAtom } from "@/state/settings";
import { useAtomValue } from "jotai";
import { JSX } from "react";
import { Layer } from "react-map-gl";

function IncorrectLayer(): JSX.Element {
  const selectedTheme = useAtomValue(themeAtom);
  const errorCountries = useAtomValue(gameStateAtom).errorCountries;
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
      }}
    />
  );
}

export default IncorrectLayer;
