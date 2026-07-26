import { StyleSheet, View } from 'react-native';
import { tokens } from '@/shared/theme';
import { AppText, Button, Screen } from '@/shared/ui';
export default function HomeScreen() {
  return (
    <Screen>
      <View style={styles.header}>
        <AppText variant="title">Мандрівник</AppText>
        <AppText variant="caption" style={styles.caption}>Щоденник подорожей</AppText>
      </View>
      <Button label="Нова поїздка" onPress={() => console.log('TODO')} />
    </Screen>
  );
}
const styles = StyleSheet.create({
  header: { marginBottom: tokens.spacing.lg, gap: tokens.spacing.xs },
  caption: { marginTop: tokens.spacing.xs },
});
