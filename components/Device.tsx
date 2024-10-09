import { View, Text, StyleSheet, useColorScheme, Switch } from "react-native";
import { Colors } from '@/constants/Colors';
import { Collapsible } from "./Collapsible";
import { ThingListItem } from "@/types/types";
import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';
import { useState, useRef } from "react";
import Slider from '@react-native-community/slider';

type Props = {
    device: ThingListItem
    isOn: boolean
    accessToken: String|null
  };

export function Device( {device, isOn, accessToken}: Props ) {
    const theme = useColorScheme() ?? 'light';
    const debounceTimer = useRef<NodeJS.Timeout | null>(null);
    const [isEnabled, setIsEnabled] = useState(isOn);
    const [brightness, setBrightness] = useState(device.itemData.params?.brightness ?? 0)

  const toggleSwitch = async () => {
    setIsEnabled((previousState) => !previousState);
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/api/devices/toggle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + accessToken,
        },
        body: JSON.stringify({ id: device.itemData.deviceid, status: !isEnabled }),
      });

      if (!response.ok) {
        throw new Error('Failed to update device status'); 
      }
      
      const result = await response.json();
      console.log('response:', result);
    } catch (error) {
      console.error('Error toggling device status:', error);
      // Revert the switch state if the API call fails
      setIsEnabled((previousState) => !previousState);
    }
  };

  const handleBrightness = async (value: number) => {
    setBrightness(Math.round(value));
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/api/devices/brightness`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + accessToken,

        },
        body: JSON.stringify({ id: device.itemData.deviceid, brightness: Math.round(value) }),
      });

      if (!response.ok) {
        throw new Error('Failed to update device brightness'); 
      }
      
      const result = await response.json();
      console.log('response:', result);
    } catch (error) {
      console.error('Error updating device brightness:', error);
    }
  }

  const handleDebouncedBrightnessChange = (value: number) => {
    setBrightness(Math.round(value)); 

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      handleBrightness(Math.round(value));  
    }, 1000);
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
                {device.itemData.params?.brightness ?
                <>
                  <View style={styles.brightness}>
                    <Entypo name="light-down" size={24} color={theme === 'light' ? Colors.dark.text : Colors.light.text} /> 
                    <Text style={[styles.brightnessInd, { color: theme === 'light' ? Colors.dark.text : Colors.light.text }]}>{brightness}%</Text>                 
                    <Entypo name="light-up" size={24} color={theme === 'light' ? Colors.dark.text : Colors.light.text} /> 
                  </View>
                  <Slider
                    style={styles.slider}
                    minimumValue={0}
                    maximumValue={100}
                    value={brightness}
                    onValueChange={handleDebouncedBrightnessChange} 
                  />
                </> : null
                }
                {device.itemData.online ? (
                    <View style={styles.onlineStatus}>
                        <AntDesign name="checkcircle" size={20} color="green" />
                        <Text style={[styles.onlineText, { color: theme === 'light' ? Colors.dark.text : Colors.light.text }]}>
                            Online
                        </Text>
                    </View>
                ) : (
                    <View style={styles.onlineStatus}>
                        <AntDesign name="closecircle" size={20} color="red" />
                        <Text style={[styles.onlineText, { color: theme === 'light' ? Colors.dark.text : Colors.light.text }]}>
                            Offline
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
    },
    slider: {
      marginTop: 0,
      marginBottom: 10,
      marginHorizontal: 35
    },
    brightness: {
     display: 'flex',
     flexDirection: 'row',
     justifyContent: 'space-between',
     transform: 'translateY(32px)',
    },
    brightnessInd: {
      fontSize: 18,
      fontWeight: 700,
      transform: 'translateY(-25px)',
    }
  });
  