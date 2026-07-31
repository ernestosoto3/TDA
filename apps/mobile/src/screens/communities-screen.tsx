import { navigationLabels } from '@tda/localization';

import { ScreenLayout } from '../components/screen-layout';

export function CommunitiesScreen() {
  return (
    <ScreenLayout
      title={navigationLabels.communities}
      description="Explora y participa en comunidades deportivas."
    />
  );
}
