import { useTranslation } from 'react-i18next';

import { ScreenLayout } from '../components/screen-layout';

export function HomeScreen() {
  const { t } = useTranslation();

  return <ScreenLayout title={t('navigation.home')} description={t('screens.home.description')} />;
}
