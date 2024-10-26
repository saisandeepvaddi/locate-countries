import { layerThemes } from "@/lib/themes";
import { hoveredCountryIdAtom } from "@/state/game";
import { themeAtom } from "@/state/settings";
import { useAtomValue } from "jotai";
import { Layer, Source } from "react-map-gl";
import CorrectLayer from "./Layers/CorrectLayer";
import HoveredLayer from "./Layers/HoveredLayer";
import IncorrectLayer from "./Layers/IncorrectLayer";

function CountryBoundariesLayer() {
  const selectedTheme = useAtomValue(themeAtom);
  const layerTheme = layerThemes[selectedTheme] ?? layerThemes.light;
  const hoveredCountryId = useAtomValue(hoveredCountryIdAtom);
  return (
    <Source
      id="country-boundaries"
      type="vector"
      url="mapbox://mapbox.country-boundaries-v1"
    >
      <Layer
        id="background"
        type="background"
        paint={{
          "background-color": layerTheme.ocean,
        }}
      />
      <Layer
        id="country-boundaries"
        type="fill"
        source-layer="country_boundaries"
        paint={{
          "fill-color": layerTheme.default,
          "fill-outline-color": layerTheme.border,
        }}
      />
      <HoveredLayer hoveredCountryId={hoveredCountryId} />
      <CorrectLayer />
      <IncorrectLayer />
    </Source>
  );
}

export default CountryBoundariesLayer;
