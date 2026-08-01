import { useTranslation } from 'react-i18next';

import { ScreenLayout } from '../components/screen-layout';

export function ProfileScreen() {
  const { t } = useTranslation();

  return (
    <ScreenLayout title={t('navigation.profile')} description={t('screens.profile.description')} />
  );
}
