import { Text, StyleSheet } from 'react-native';
import { Link, type Href } from 'expo-router';
import { colors } from '@/constants/theme';

interface LinkingProps {
  to: Href;
  innerText: string;
}

export default function Linking({ to, innerText }: LinkingProps) {
  return (
    <Link href={to} style={styles.link}>
      <Text style={styles.linkText}>{innerText}</Text>
    </Link>
  );
}

const styles = StyleSheet.create({
  link: {
    alignSelf: 'center',
  },
  linkText: {
    color: colors.primary,
    textAlign: 'center',
    fontSize: 15,
  },
});
