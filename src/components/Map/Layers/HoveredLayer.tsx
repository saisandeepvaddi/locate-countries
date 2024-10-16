import { layerThemes } from "@/lib/themes";
import { themeAtom } from "@/state/settings";
import { useAtomValue } from "jotai";
import { memo } from "react";
import { Layer } from "react-map-gl";

function HoveredLayer({
  hoveredCountryId,
}: {
  hoveredCountryId: string | null;
}): JSX.Element {
  const selectedTheme = useAtomValue(themeAtom);
  const layerTheme = layerThemes[selectedTheme] ?? layerThemes.light;
  return (
    <Layer
      id="country-boundaries-hover"
      type="fill"
      source="country-boundaries"
      source-layer="country_boundaries"
      filter={["==", "iso_3166_1", hoveredCountryId ?? ""]}
      paint={{
        "fill-color": layerTheme.hovered,
        "fill-opacity": 0.25,
      }}
    />
  );
}

export default memo(HoveredLayer, (prevProps, nextProps) => {
  return prevProps.hoveredCountryId === nextProps.hoveredCountryId;
});
