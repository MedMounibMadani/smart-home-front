import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { getUser, storeUser } from '@/hooks/useCheckUser';
import { setUser } from '../../store/userSlice';
import { useThemeColor } from '@/hooks/useThemeColor';
import { FontAwesome5 } from '@expo/vector-icons';
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Home, Room, DevicesResponse } from '../../types/types';
import SelectDropdown from 'react-native-select-dropdown';
import Entypo from '@expo/vector-icons/Entypo';
import { Device } from '@/components/Device';




export default function HomeScreen() {
  const user = useSelector((state: RootState) => state.user);
  const backgroundColor = useThemeColor({}, 'background');
  const oppositeBackgroundColor = useThemeColor({}, 'background', true);
  const textColor = useThemeColor({}, 'text');
  const oppositeTextColor = useThemeColor({}, 'text', true);
  const dispatch = useDispatch();
  const [tokenRefreshed, setTokenRefreshed] = useState(false);
  const [homes, setHomes] = useState<Home[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [currentHome, setCurrentHome] = useState<string | null>(null);
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
  const [devices, setdevices] = useState<DevicesResponse | null>(null);


  const handleRoomChanges = (room: Room) => {
    setCurrentRoom(room);
  }

  useEffect(() => {
    const loadUser = async () => {
      if (!user.email) {
        const loaded = await getUser();
        if (loaded) {
          const userData = {
            id: 1,
            email: loaded.email,
            fullname: loaded.fullname,
            accessToken: loaded.accessToken,
          };
          dispatch(setUser(userData));
        }
      }
    };
    loadUser();
  }, [user.email, dispatch]);

  useEffect(() => {
    const fetchHomes = async () => {
      const url = `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/homes`;
      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + user.accessToken,
          },
        });

        const data = await response.json();

        if (response.status === 201) {
          const updatedUser = { ...user, accessToken: data.token };
          dispatch(setUser(updatedUser));
          await storeUser({
            email: user.email,
            fullname: user.fullname,
            accessToken: data.token,
          });
          setTokenRefreshed(true);
        } else {
          setHomes(data.homes.familyList);          
          setCurrentHome(data.homes.currentFamilyId);
          const currentHomeRooms = data.homes.familyList.find(( f : Home ) => f.id === data.homes.currentFamilyId)?.roomList || [];
          setRooms(currentHomeRooms);
          setCurrentRoom(currentHomeRooms[0]);
        }
      } catch (error) {
        console.log('Error fetching homes:', error);
      }
    };

    if (user.accessToken) {
      fetchHomes();
    }
  }, [user.accessToken, tokenRefreshed, dispatch]);

  useEffect(() => {
    if (tokenRefreshed) {
      const fetchHomesWithNewToken = async () => {
        const url = `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/homes`;
        try {
          const response = await fetch(url, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + user.accessToken,
            },
          });
          const data = await response.json();
          setHomes(data.homes.familyList);
          setCurrentHome(data.homes.currentFamilyId);
          const currentHomeRooms = data.homes.familyList.find(( f : Home ) => f.id === data.homes.currentFamilyId)?.roomList || [];
          setRooms(currentHomeRooms);
          setCurrentRoom(currentHomeRooms[0]);
        } catch (error) {
          console.log('Error fetching homes with new token:', error);
        }
      };
      fetchHomesWithNewToken();
    }
  }, [tokenRefreshed, user.accessToken]);

  useEffect( () => {
    const fetchDevices = async () => {      
      const url = `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/devices`;
        try {
          const response = await fetch(url, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + user.accessToken,
            },
          });
          const data = await response.json();
          setdevices(data.devices);
        } catch (error) {
          console.log('Error fetching devices :', error);
        }
    };
    fetchDevices();
  }, [currentHome, user.accessToken])

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      selection={ 
      <>
        <SelectDropdown
          data={homes}
          onSelect={(selectedItem, index) => {
            setCurrentHome(selectedItem.id);
            setRooms(selectedItem.roomList);
            setCurrentRoom(selectedItem.roomList[0]);
          }}
          renderButton={(selectedItem, isOpened) => {
            return (
              <ThemedView  style={styles.dropdownButtonStyle}>
                <FontAwesome5 name="home" size={24} color={textColor} />
                <ThemedText style={{ paddingLeft: 5, fontWeight: 'bold' }}>
                  { homes.find(( f : Home ) => f.id === currentHome )?.name }
                </ThemedText>
                <Entypo name="chevron-down" size={24} color={textColor} style={{ paddingLeft: 5 }} />
              </ThemedView>
            );
          }}
          renderItem={(item, index, isSelected) => {
            return (
              <ThemedView style={{...styles.dropdownItemStyle, ...(isSelected && {backgroundColor: '#D2D9DF'})}}>
                <ThemedText style={styles.dropdownItemTxtStyle}>{item.name}</ThemedText>
              </ThemedView>
            );
          }}
          showsVerticalScrollIndicator={false}
          dropdownStyle={styles.dropdownMenuStyle}
        />
      </>
      }
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="subtitle">Welcome {user.fullname.split(' ', 1)}</ThemedText>
        <HelloWave />
        <ThemedText type="subtitle">!</ThemedText>
      </ThemedView>
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={styles.horizontalScrollView}>
        {rooms.map(room => (
          <TouchableOpacity
            key={room.id}
            style={[styles.horizontalItem, {  borderColor: textColor, backgroundColor: (room === currentRoom ? oppositeBackgroundColor : backgroundColor )  }]}
            onPress={() => handleRoomChanges(room)}>
            <ThemedText style={{ color: (room === currentRoom ? oppositeTextColor : textColor ) }} >{room.name}</ThemedText>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <ScrollView style={styles.devicesList} showsVerticalScrollIndicator={false}>
        {devices ? (
          devices.thingList
          .filter(item => item.itemData.family.roomid === currentRoom?.id)
          .map((item, index) => (
            <Device key={index} device={item} isOn={item.itemData.params?.switch == "on"} />
          ))
        ) : (
          <ActivityIndicator size={"large"} />
        )}
      </ScrollView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  horizontalScrollView: {
    marginHorizontal: 0,
    marginVertical: 10,
  },
  horizontalItem: {
    width: 'auto',
    height: 40,
    borderRadius: 21,
    paddingVertical: 5,
    paddingHorizontal: 20,
    marginHorizontal: 5,
    marginBottom: 15,
    borderWidth: 2,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  devicesList: {
  
  },
  dropdownButtonStyle: {
    width: 'auto',
    height: 50,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
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
});
