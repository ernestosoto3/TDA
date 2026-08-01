import { useTranslation } from 'react-i18next';

import { ScreenLayout } from '../components/screen-layout';

export function SearchScreen() {
  const { t } = useTranslation();

  return (
    <ScreenLayout title={t('navigation.search')} description={t('screens.search.description')} />
  );
}
