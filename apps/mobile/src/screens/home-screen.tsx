import { navigationLabels } from '@tda/localization';

import { ScreenLayout } from '../components/screen-layout';

export function HomeScreen() {
  return (
    <ScreenLayout
      title={navigationLabels.home}
      description="Aquí encontrarás noticias, partidos y resultados deportivos."
    />
  );
}
