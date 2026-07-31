import { navigationLabels } from '@tda/localization';

import { ScreenLayout } from '../components/screen-layout';

export function ProfileScreen() {
  return (
    <ScreenLayout
      title={navigationLabels.profile}
      description="Administra tu perfil, favoritos y configuración."
    />
  );
}
