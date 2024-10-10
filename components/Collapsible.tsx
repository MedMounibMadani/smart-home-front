import Ionicons from '@expo/vector-icons/Ionicons';
import { PropsWithChildren, ReactElement, useState } from 'react';
import { StyleSheet, TouchableOpacity, View, useColorScheme, Switch } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';

export function Collapsible({ children, title, status }: PropsWithChildren & { title: string, status: ReactElement }) {
  const [isOpen, setIsOpen] = useState(false);
  const theme = useColorScheme() ?? 'light';

  return (
    <ThemedView>
      <View
        style={[styles.deviceContainer, { backgroundColor: theme === 'light' ? Colors.dark.background : Colors.light.background }]}
        >
         <View style={styles.heading}>
          <ThemedText type="defaultSemiBold" style={{ color: theme === 'light' ? Colors.dark.text : Colors.light.text, width: '70%' }}>{title}</ThemedText>
          <>
            {status}
            <TouchableOpacity
              onPress={() => setIsOpen((value) => !value)}
              activeOpacity={0.8}>
                <Ionicons
                  name={isOpen ? 'chevron-up' : 'chevron-down-outline'}
                  size={28}
                  color={theme === 'light' ? Colors.dark.icon : Colors.light.icon}
                />
            </TouchableOpacity>
          </>
         </View>
          {isOpen && <View style={styles.content}>{children}</View>}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  deviceContainer: {
    padding: 20,
    marginVertical: 10,
    borderRadius: 25
  },
  heading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
  },
  content: {
   marginTop: 12
  },
});
