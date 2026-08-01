export const esPR = {
  navigation: {
    home: 'Inicio',
    communities: 'Comunidades',
    search: 'Buscar',
    profile: 'Perfil',
  },

  screens: {
    home: {
      description: 'Aquí encontrarás noticias, juegos y resultados deportivos.',
    },
    communities: {
      description: 'Explora y participa en comunidades deportivas.',
    },
    search: {
      description: 'Busca equipos, ligas, atletas, juegos y publicaciones.',
    },
    profile: {
      description: 'Administra tu perfil, favoritos y configuración.',
    },
  },

  actions: {
    addToFavorites: 'Añadir a Favoritos',
    removeFromFavorites: 'Quitar de Favoritos',
    save: 'Guardar',
    cancel: 'Cancelar',
    retry: 'Intentar de nuevo',
    close: 'Cerrar',
  },

  gameStatus: {
    scheduled: 'Programado',
    postponed: 'Pospuesto',
    canceled: 'Cancelado',
    final: 'Final',
  },

  examples: {
    greeting: 'Hola, {{name}}',
    gameCount_one: '{{count}} juego',
    gameCount_other: '{{count}} juegos',
  },
} as const;
