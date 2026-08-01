import { useTranslation } from 'react-i18next';

import { ScreenLayout } from '../components/screen-layout';

export function CommunitiesScreen() {
  const { t } = useTranslation();

  return (
    <ScreenLayout
      title={t('navigation.communities')}
      description={t('screens.communities.description')}
    />
  );
}
