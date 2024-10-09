import { useColorScheme } from 'react-native';
import { Colors } from '@/constants/Colors';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark,
  opposite: boolean = false
) {
  const theme = useColorScheme() ?? 'light';
  const selectedTheme = opposite ? (theme === 'light' ? 'dark' : 'light') : theme;
  const colorFromProps = props[selectedTheme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[selectedTheme][colorName];
  }
}
