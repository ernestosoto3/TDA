import { render, screen, userEvent, waitFor } from '@testing-library/react-native';

import App from '../App';

jest.mock('@expo-google-fonts/inter/400Regular', () => ({
  Inter_400Regular: 'Inter_400Regular',
}));

jest.mock('@expo-google-fonts/inter/600SemiBold', () => ({
  Inter_600SemiBold: 'Inter_600SemiBold',
}));

jest.mock('@expo-google-fonts/inter/700Bold', () => ({
  Inter_700Bold: 'Inter_700Bold',
}));

jest.mock('expo-font', () => ({
  useFonts: () => [true, null],
}));

jest.mock('lucide-react-native', () => ({
  Home: () => null,
  Search: () => null,
  UserRound: () => null,
  UsersRound: () => null,
}));

jest.mock('react-native-safe-area-context', () => {
  const safeAreaMock = jest.requireActual('react-native-safe-area-context/jest/mock');

  return safeAreaMock.default;
});

describe('mobile navigation shell', () => {
  it('renders the four approved tabs in order', async () => {
    await render(<App />);

    const labels = screen.getAllByRole('button').map((tab) => tab.props.accessibilityLabel);

    expect(labels).toEqual(['Inicio', 'Comunidades', 'Buscar', 'Perfil']);
  });

  it.each([
    ['Comunidades', 'Explora y participa en comunidades deportivas.'],
    ['Buscar', 'Busca equipos, ligas, atletas, partidos y publicaciones.'],
    ['Perfil', 'Administra tu perfil, favoritos y configuración.'],
    ['Inicio', 'Aquí encontrarás noticias, partidos y resultados deportivos.'],
  ])('navigates to %s', async (tabLabel, screenDescription) => {
    await render(<App />);
    const user = userEvent.setup();

    await user.press(screen.getByRole('button', { name: tabLabel }));

    await waitFor(() => {
      expect(screen.getByText(screenDescription)).toBeOnTheScreen();
    });
  });
});
