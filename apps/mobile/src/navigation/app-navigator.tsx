import { navigationLabels } from '@tda/localization';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, Search, UserRound, UsersRound } from 'lucide-react-native';

import { CommunitiesScreen } from '../screens/communities-screen';
import { HomeScreen } from '../screens/home-screen';
import { ProfileScreen } from '../screens/profile-screen';
import { SearchScreen } from '../screens/search-screen';
import { colors, typography } from '../theme/theme';
import type { RootTabParamList } from './types';

const Tab = createBottomTabNavigator<RootTabParamList>();

export function AppNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: {
          fontFamily: typography.semiBold,
          fontSize: 12,
        },
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: navigationLabels.home,
          tabBarAccessibilityLabel: navigationLabels.home,
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} strokeWidth={2} />,
        }}
      />
      <Tab.Screen
        name="Communities"
        component={CommunitiesScreen}
        options={{
          tabBarLabel: navigationLabels.communities,
          tabBarAccessibilityLabel: navigationLabels.communities,
          tabBarIcon: ({ color, size }) => <UsersRound color={color} size={size} strokeWidth={2} />,
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          tabBarLabel: navigationLabels.search,
          tabBarAccessibilityLabel: navigationLabels.search,
          tabBarIcon: ({ color, size }) => <Search color={color} size={size} strokeWidth={2} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: navigationLabels.profile,
          tabBarAccessibilityLabel: navigationLabels.profile,
          tabBarIcon: ({ color, size }) => <UserRound color={color} size={size} strokeWidth={2} />,
        }}
      />
    </Tab.Navigator>
  );
}
