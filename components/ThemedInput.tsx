import { TextInput, type TextInputProps, StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedInputProps = TextInputProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'rounded' | 'underline' | 'outline';
  inputType?: 'text' | 'numeric' | 'password' | 'email';
};

export function ThemedInput({
  style,
  lightColor,
  darkColor,
  type = 'default',
  inputType = 'text',
  ...rest
}: ThemedInputProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  let keyboardType: TextInputProps['keyboardType'] = 'default';
  let secureTextEntry = false;

  switch (inputType) {
    case 'numeric':
      keyboardType = 'numeric';
      break;
    case 'password':
      secureTextEntry = true;
      break;
    case 'email':
      keyboardType = 'email-address';
      break;
    default:
      keyboardType = 'default';
  }

  return (
    <TextInput
      style={[
        { color, backgroundColor },
        type === 'default' ? styles.default : undefined,
        type === 'rounded' ? styles.rounded : undefined,
        type === 'underline' ? styles.underline : undefined,
        type === 'outline' ? styles.outline : undefined,
        style,
      ]}
      keyboardType={keyboardType}
      secureTextEntry={secureTextEntry}
      placeholderTextColor={color}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    padding: 8,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
  },
  rounded: {
    fontSize: 16,
    padding: 8,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 25,
  },
  underline: {
    fontSize: 16,
    padding: 8,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  outline: {
    fontSize: 16,
    padding: 8,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
  },
});
