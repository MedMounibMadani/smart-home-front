import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, TextInput, Button, View, ScrollView, TouchableOpacity, useColorScheme, Platform, Switch, Pressable } from 'react-native';
import { Colors } from '@/constants/Colors';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { useRouter,useSegments } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import SelectDropdown from 'react-native-select-dropdown';
import { FontAwesome5 } from '@expo/vector-icons';
import Entypo from '@expo/vector-icons/Entypo';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Action } from '../../types/types';
import { Collapsible } from "../../components/Collapsible";
import { Swipeable } from 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function Explore() {
  const router = useRouter();
  const segments = useSegments();
  const devices = useSelector((state: RootState) => state.devices);
  const user = useSelector((state: RootState) => state.user);
  const [formVisibility, setFormVisibility] = useState(false);
  const theme = useColorScheme() ?? 'light';
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');

  const [actions, setActions] = useState<Action[]>([]);
  
  const [actionName, setActionName] = useState('');
  const [actionType, setActionType] = useState('');
  const [selectedDevices, setSelectedDevices] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  
  const fetchActions = async () => {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/api/actions`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + user.accessToken,
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch actions'); 
      }

      const result = await response.json();
      if (response.status === 200) {                
        setActions(result.actions);        
      }
    } catch (error) {
      console.error('Error saving new action :', error);
    }
  };

  const toggleSwitch = async (status:boolean, id: string) => {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/api/action/toggle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + user.accessToken,
        },
        body: JSON.stringify({
          actionId: id,
          status: !status
        })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch actions'); 
      }

      const result = await response.json();
      if (response.status === 200) {                
        setActions(prevActions => 
          prevActions.map(action => 
            action._id === id ? { ...action, enabled: !status } : action
          )
        );
      }
    } catch (error) {
      console.error('Error updating action status:', error);
    }
  }

  useEffect( () => {
    fetchActions();
  },[])

  const displayForm = () => {
    setFormVisibility(!formVisibility);
  }

  const selectDevice = ( id: string ) => {
    const isDeviceSelected = selectedDevices.some(selectedDeviceId => selectedDeviceId === id);
    if (isDeviceSelected) {
      setSelectedDevices(prevSelectedDevices => 
        prevSelectedDevices.filter(selectedDeviceId => selectedDeviceId !== id)
      );
    } else {
      setSelectedDevices(prevSelectedDevices => 
        [...prevSelectedDevices, id]
      );
    }
  }

  const handleDateChange = (event: any, selected: Date | undefined) => {
    setShowDatePicker(false);
    if (selected) {
      setSelectedDate(selected);
    }
  };

  const handleTimeChange = (event: any, selected: Date | undefined) => {
    setShowTimePicker(false);
    if (selected) {
      const updatedDate = new Date(selectedDate);
      updatedDate.setHours(selected.getHours());
      updatedDate.setMinutes(selected.getMinutes());
      setSelectedDate(updatedDate);
    }
  };
  
  const submit = async () => {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/api/action/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + user.accessToken,
        },
        body: JSON.stringify({ 
          actionName: actionName, 
          actionDate: selectedDate,
          actionType: actionType,
          devices: selectedDevices
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save the new action'); 
      }

      const result = await response.json();
      if (response.status === 200) {
        setActionName('');
        setActionType('');
        setSelectedDate(new Date());
        setSelectedDevices([]);
        setFormVisibility(false);
        fetchActions();
      }
    } catch (error) {
      console.error('Error saving new action :', error);
    }
  }
  const handleActionDelete = async (id:string) => {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/api/action/delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + user.accessToken,
        },
        body: JSON.stringify({ 
          actionId: id
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete the action'); 
      }

      if (response.status === 200) {
        fetchActions();
      }
    } catch (error) {
      console.error('Error deleteing the action :', error);
    }
  }
  const renderRightActions = (id: string) => {
    return ( 
      <Pressable 
        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'red', borderRadius: 15, marginVertical: 10, width: 50, marginHorizontal: 5}}
        onPress={ () => handleActionDelete(id)}  
      >
        <MaterialIcons name="delete" size={35} color="white" />
      </Pressable> )
  }

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={<Ionicons size={310} name="code-slash" style={styles.headerImage} />}
      selection={<ThemedText type="subtitle" style={{ padding: 15 }}>Explore</ThemedText>}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <ThemedView style={styles.titleContainer}>
          <ThemedView style={styles.feature}>
            <ThemedView style={styles.textContainer}>
              <TouchableOpacity style={[styles.exploreButton, { backgroundColor }]} onPress={displayForm}>
                <>
                  <Ionicons name="calendar" size={24} color="#007bff" style={styles.icon} />
                  <ThemedText type="subtitle">Planification des Tâches</ThemedText>
                </>
                {
                  formVisibility ?
                  <Ionicons name="remove-circle" size={32} color={theme === 'light' ? Colors.light.text : Colors.dark.text} />
                  : <Ionicons name="add-circle" size={32} color={theme === 'light' ? Colors.light.text : Colors.dark.text} />
                }
              </TouchableOpacity>
              { formVisibility ? null : <ThemedText style={{ padding: 25 }}>Programmez des actions spécifiques pour les appareils, comme allumer les lumières à des moments précis.</ThemedText> }
            </ThemedView>
          </ThemedView>
          {
            formVisibility &&
            <ThemedView style={{ marginVertical : 15 }}>
              <ThemedText style={{ fontWeight: 700, fontSize: 22, textAlign: 'center' }}> Nouvelle action { actionName.length > 0 ? '¨'+actionName+'¨' : '' }</ThemedText> 
              <TextInput
                      style={[styles.input, {textAlign: 'center', color: textColor, borderColor: textColor}]}
                      placeholder="Nom de l'action"
                      onChangeText={(value) => setActionName(value)}
                      value={actionName}
                />
              <SelectDropdown
                data={['Ouverture', 'Fermeture']}
                onSelect={(selectedItem, index) => {
                  setActionType(selectedItem)
                }}
                renderButton={(selectedItem, isOpened) => {
                  return (
                    <ThemedView  style={ [ styles.dropdownButtonStyle, {borderColor: textColor} ]}>
                      <FontAwesome5 name="tasks" size={24} color={textColor} />
                      <ThemedText style={{ paddingLeft: 5, fontWeight: 'bold' }}>
                        { actionType.length > 0 ? actionType : 'Action' }
                      </ThemedText>
                      <Entypo name="chevron-down" size={24} color={textColor} style={{ paddingLeft: 5 }} />
                    </ThemedView>
                  );
                }}
                renderItem={(item, index, isSelected) => {
                  return (
                    <ThemedView style={{...styles.dropdownItemStyle, ...(isSelected && {backgroundColor: '#D2D9DF'})}}>
                      <ThemedText style={styles.dropdownItemTxtStyle}>{item}</ThemedText>
                    </ThemedView>
                  );
                }}
                showsVerticalScrollIndicator={false}
                dropdownStyle={styles.dropdownMenuStyle}
              />
              <TouchableOpacity style={ [ styles.datePicker, { borderColor: textColor, marginVertical: 15 } ] } onPress={() => setShowDatePicker(!showDatePicker)}>
                <ThemedText style={{ fontWeight: 700 }} >{selectedDate.toLocaleDateString()}</ThemedText>
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={selectedDate}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={handleDateChange}
                />
              )}
              <TouchableOpacity style={ [ styles.datePicker, { borderColor: textColor } ] } onPress={() => setShowTimePicker(!showTimePicker) }>
                <ThemedText style={{ fontWeight: 700 }} >{selectedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' } )}</ThemedText>
              </TouchableOpacity>
              { showTimePicker && (
                <DateTimePicker
                  value={selectedDate}
                  mode="time"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={handleTimeChange}
                />
              )}
              <ThemedView style={styles.devices}>
                {
                  devices.devices?.map( (device, index) => (
                      <TouchableOpacity key={index} style={[styles.device, { backgroundColor : selectedDevices.some(selectedDeviceId => selectedDeviceId === device.id) ? 'grey' : backgroundColor } ]} onPress={() => selectDevice(device.id)}>
                        <ThemedText>{device.name}</ThemedText>
                      </TouchableOpacity>
                  ))
                }
              </ThemedView>
              <TouchableOpacity style={ [ styles.saveButton, { backgroundColor: textColor } ] } onPress={submit}>
                <ThemedText style={{ color: backgroundColor }}> Enregistrer </ThemedText>
              </TouchableOpacity>
            </ThemedView> 
          }
          <ThemedView style={{ marginVertical: 25 }}>
            <GestureHandlerRootView>
              {
                actions.map( (item) => (
                  <Swipeable key={item._id} renderRightActions={() => renderRightActions(item._id)}>
                    <Collapsible 
                      title={item.actionName} 
                      status={ 
                          <Switch
                              trackColor={{ false: '#767577', true: 'green' }}
                              thumbColor={ item.enabled ? '#f4f3f4' : '#f4f3f4'}
                              ios_backgroundColor="#3e3e3e"
                              onValueChange={() => toggleSwitch(item.enabled, item._id)}
                              value={item.enabled}
                          /> }
                    >
                      <ThemedText style={{ color: backgroundColor, marginTop: 15 }} > { item.actionType + " le " + new Date(item.actionDate).toLocaleString('fr-FR', {  
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false, }) } 
                      </ThemedText>
                      <View style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginTop: 15 }}>
                        {
                          devices.devices?.filter( device => item.devices.includes(device.id) ).map( (device, index) => (
                              <TouchableOpacity key={index} style={[styles.actionDevices, { backgroundColor : backgroundColor } ]} onPress={() => selectDevice(device.id)}>
                                <ThemedText>{device.name}</ThemedText>
                              </TouchableOpacity>
                          ))
                        }
                      </View>
                    </Collapsible>
                  </Swipeable>
                ))
              }
            </GestureHandlerRootView>
          </ThemedView>
        </ThemedView>
      </ScrollView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  exploreButton: {
    width: 'auto',
    alignItems: 'center',
    marginTop: 20,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  titleContainer: {
    padding: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  icon: {
    marginRight: -40,
  },
  textContainer: {
    flex: 1,
  },
  input: {
    height: 40,
    borderWidth: 2,
    marginVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 15,
  },
  error: {
    marginBottom: 10,
    marginLeft: 15
  },
  dropdownButtonStyle: {
    width: 'auto',
    height: 40,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderWidth: 2,
    borderRadius: 15
  },
  dropdownButtonTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
  },
  dropdownButtonArrowStyle: {
    fontSize: 28,
  },
  dropdownButtonIconStyle: {
    fontSize: 28,
    marginRight: 8,
  },
  dropdownMenuStyle: {
    backgroundColor: '#E9ECEF',
    borderRadius: 8,
  },
  dropdownItemStyle: {
    width: '100%',
    flexDirection: 'row',
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  dropdownItemTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '500',
    color: '#151E26',
  },
  dropdownItemIconStyle: {
    fontSize: 28,
    marginRight: 8,
  },
  devices: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: 'center',
    marginVertical: 15
  },
  device: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    margin: 5,
    borderRadius: 15,
    borderColor: "grey",
    borderWidth: 2
  },
  actionDevices: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    margin: 2,
    borderRadius: 15,
  },
  datePicker: {
    height: 40,
    borderWidth: 2,
    paddingHorizontal: 10,
    borderRadius: 15,
    display: "flex",
    justifyContent: 'center',
    alignItems: 'center'
  },
  saveButton: {
    height: 40,
    paddingHorizontal: 10,
    borderRadius: 15,
    display: "flex",
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 15
  }
});
