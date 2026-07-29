import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { applicationConfig } from '@tda/config';
import { navigationLabels } from '@tda/localization';
import type { ApplicationName } from '@tda/types';

export default function App() {
  const applicationName: ApplicationName = 'mobile';

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{applicationConfig.mobile.displayName}</Text>
      <Text>{navigationLabels.home}</Text>
      <Text style={styles.environment}>Application: {applicationName}</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    marginBottom: 8,
    fontSize: 28,
    fontWeight: 'bold',
  },
  environment: {
    marginTop: 8,
    color: '#666',
  },
});
