import { navigationLabels } from '@tda/localization';

import { ScreenLayout } from '../components/screen-layout';

export function SearchScreen() {
  return (
    <ScreenLayout
      title={navigationLabels.search}
      description="Busca equipos, ligas, atletas, partidos y publicaciones."
    />
  );
}
