import { View, Text, StyleSheet, useColorScheme, Switch } from "react-native";
import { Colors } from '@/constants/Colors';
import { Collapsible } from "./Collapsible";
import { ThingListItem } from "@/types/types";
import AntDesign from '@expo/vector-icons/AntDesign';
import { useState } from "react";


type Props = {
    device: ThingListItem
    isOn: boolean
  };

export function Device( {device, isOn}: Props ) {
    const theme = useColorScheme() ?? 'light';
    const [isEnabled, setIsEnabled] = useState(isOn);

  const toggleSwitch = async () => {
    setIsEnabled((previousState) => !previousState);
    try {
      // Here you can call an API to update the device status
      const response = await fetch(`/api/devices/${device.itemData.apikey}/toggle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: !isEnabled ? 'on' : 'off' }),
      });

      if (!response.ok) {
        throw new Error('Failed to update device status');
      }

      const result = await response.json();
      console.log('Device status updated:', result);
    } catch (error) {
      console.error('Error toggling device status:', error);
      // Revert the switch state if the API call fails
      setIsEnabled((previousState) => !previousState);
    }
  };

    return (
        <Collapsible 
        title={device.itemData.name} 
        status={  device.itemData.online ?
            <Switch
                trackColor={{ false: '#767577', true: 'green' }}
                thumbColor={ isEnabled ? '#f4f3f4' : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleSwitch}
                value={isEnabled}
            /> : <></> }
        >
            <View>
                <Text style={[styles.content, { color: theme === 'light' ? Colors.dark.text : Colors.light.text }]}>Brand : {device.itemData.brandName}</Text>
                <Text style={[styles.content, { color: theme === 'light' ? Colors.dark.text : Colors.light.text }]}>Model : {device.itemData.productModel}</Text>
                <Text style={[styles.content, { color: theme === 'light' ? Colors.dark.text : Colors.light.text }]}>Manufacturer : {device.itemData.extra.manufacturer}</Text>
                {device.itemData.online ? (
                    <View style={styles.onlineStatus}>
                        <AntDesign name="checkcircle" size={20} color="green" />
                        <Text style={[styles.onlineText, { color: theme === 'light' ? Colors.dark.text : Colors.light.text }]}>
                            En ligne 
                        </Text>
                    </View>
                ) : (
                    <View style={styles.onlineStatus}>
                        <AntDesign name="closecircle" size={20} color="red" />
                        <Text style={[styles.onlineText, { color: theme === 'light' ? Colors.dark.text : Colors.light.text }]}>
                            Hors ligne
                        </Text>
                    </View>
                )}
                
            </View>
        </Collapsible>
    );
}


const styles = StyleSheet.create({
    content: {
     margin: 4,
    },
    onlineText: {
        marginLeft: 5
    },
    onlineStatus: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end'
    }
  });
  