  export interface User {
    id: number;
    fullname: string;
    email: string;
    accessToken: string;
  }
  export interface Room {
    id: string;
    name: string;
    index: number;
  }
  
  export  interface Home {
    id: string;
    apikey: string;
    name: string;
    index: number;
    roomList: Room[];
  }

  export interface DevicesResponse {
    thingList: ThingListItem[];
    total: number;
  }
  
  export interface ThingListItem {
    itemType: 1 | 2 | 3;
    itemData: DeviceData | DeviceGroupData;
    index: number;
  }
  
  export interface DeviceData {
    name: string;
    deviceid: string;
    apikey: string;
    extra: DeviceExtra;
    brandName: string;
    brandLogo: string;
    showBrand: boolean;
    productModel: string;
    devGroups: DeviceGroup[];
    tags?: Record<string, string>;
    devConfig?: DeviceConfig;
    settings: DeviceSettings;
    family: FamilyData;
    sharedBy?: SharedByData;
    shareTo?: ShareToData[];
    devicekey: string;
    online: boolean;
    params?: Record<string, any>;
    gsmInfoData?: GSMInfoData;
  }
  
  export interface DeviceGroupData {
    name: string;
    deviceid: string;
    apikey: string;
    extra: DeviceExtra;
    brandName: string;
    brandLogo: string;
    showBrand: boolean;
    productModel: string;
    devGroups: DeviceGroup[];
    tags?: Record<string, string>;
    devConfig?: DeviceConfig;
    settings: DeviceSettings;
    family: FamilyData;
    sharedBy?: SharedByData;
    shareTo?: ShareToData[];
    devicekey: string;
    online: boolean;
    params?: Record<string, any>;
    gsmInfoData?: GSMInfoData;
  }
  
  export interface DeviceExtra {
    model: string;
    ui: string;
    uiid: number;
    description: string;
    manufacturer: string;
    mac: string;
    apmac: string;
    modelInfo: string;
    brandId: string;
  }
  
  export interface DeviceGroup {
    type: number;
    groupId: string;
  }
  
  export interface DeviceConfig {
    p2pServerName: string;
    p2pAccout: string;
    p2pLicense: string;
  }
  
  export interface DeviceSettings {
    opsNotify: number;
    opsHistory: number;
    alarmNotify: number;
  }
  
  export interface FamilyData {
    familyid: string;
    index: number;
    roomid?: string;
  }
  
  export interface SharedByData {
    apikey: string;
    permit: number;
    phoneNumber?: string;
    email?: string;
    nickname?: string;
    comment?: string;
    shareTime?: number;
  }
  
  export interface ShareToData {
    permit: number;
    apikey: string;
    phoneNumber?: string;
    email?: string;
    nickname?: string;
    comment?: string;
    shareTime?: number;
  }
  
  export interface GSMInfoData {
    simStatus: string;
  }
  