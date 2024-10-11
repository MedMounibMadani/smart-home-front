import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Device {
  id: string;
  name: string;
  group: string;
  room: string;
}

interface DeviceState {
  devices: Device[];
}

const initialState: DeviceState = {
  devices: []
};

const deviceSlice = createSlice({
  name: 'devices',
  initialState,
  reducers: {
    // Sets the devices in the state
    setDevices(state, action: PayloadAction<Device[]>) {
      state.devices = action.payload;
    },
    
    // Clears all devices from the state
    clearDevices(state) {
      state.devices = [];
    },
  },
});

export const { setDevices, clearDevices } = deviceSlice.actions;

export default deviceSlice.reducer;
