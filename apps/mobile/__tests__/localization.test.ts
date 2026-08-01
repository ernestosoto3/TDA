import {
  defaultLocale,
  esPR,
  findMissingTranslationKeys,
  requiredTranslationKeys,
} from '@tda/localization';

import i18n from '../src/localization/i18n';

describe('localization', () => {
  it('uses Puerto Rico Spanish as the default locale', () => {
    expect(defaultLocale).toBe('es-PR');
    expect(i18n.language).toBe('es-PR');
  });

  it('contains every required translation', () => {
    expect(findMissingTranslationKeys(esPR, requiredTranslationKeys)).toEqual([]);
  });

  it('uses the approved navigation terminology', () => {
    expect(esPR.navigation).toEqual({
      home: 'Inicio',
      communities: 'Comunidades',
      search: 'Buscar',
      profile: 'Perfil',
    });
  });

  it('uses the approved game-status terminology', () => {
    expect(esPR.gameStatus).toEqual({
      scheduled: 'Programado',
      postponed: 'Pospuesto',
      canceled: 'Cancelado',
      final: 'Final',
    });
  });

  it('supports interpolation', () => {
    expect(i18n.t('examples.greeting', { name: 'Ernesto' })).toBe('Hola, Ernesto');
  });

  it('supports singular and plural values', () => {
    expect(i18n.t('examples.gameCount', { count: 1 })).toBe('1 juego');
    expect(i18n.t('examples.gameCount', { count: 2 })).toBe('2 juegos');
  });

  it('returns the key when a translation is missing', () => {
    expect(i18n.t('missing.example')).toBe('missing.example');
  });
});
