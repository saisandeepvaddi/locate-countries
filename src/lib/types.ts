import { LayerSpecification } from 'maplibre-gl';

export interface Metadata {
  name?: string;
  type?: string;
  tilestats?: unknown;
  vector_layers: LayerSpecification[];
}
