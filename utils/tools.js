// ./utils/tools.ts
import * as Battery from 'expo-battery';
import * as Brightness from 'expo-brightness';
import { Linking, Platform, Alert } from 'react-native';

export const get_battery_level = async () => {
  const batteryLevel = await Battery.getBatteryLevelAsync();
  console.log('batteryLevel', batteryLevel);
  if (batteryLevel === -1) {
    return 'Error: Device does not support retrieving the battery level.';
  }
  return batteryLevel;
};

export const change_brightness = ({ brightness }) => {
  console.log('change_brightness', brightness);
  Brightness.setSystemBrightnessAsync(brightness);
  return brightness;
};

export const flash_screen = () => {
  Brightness.setSystemBrightnessAsync(1);
  setTimeout(() => {
    Brightness.setSystemBrightnessAsync(0);
  }, 200);
  return 'Successfully flashed the screen.';
};

export const makeCall = (phoneNumber) => {
  let number = phoneNumber;
  if (Platform.OS !== 'android') {
    number = `telprompt:${phoneNumber}`;
  } else {
    number = `tel:${phoneNumber}`;
  }
  Linking.canOpenURL(number)
    .then((supported) => {
      if (!supported) {
        Alert.alert('Phone number is not available');
      } else {
        return Linking.openURL(number);
      }
    })
    .catch((err) => console.error('Error making call:', err));
};

const tools = {
  get_battery_level,
  change_brightness,
  flash_screen,
  makeCall, // <-- include the new function
};

export default tools;
