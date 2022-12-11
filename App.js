import * as React from 'react';
import Reanimated, {runOnJS} from 'react-native-reanimated';

import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useCameraDevices, useFrameProcessor} from 'react-native-vision-camera';

import {Camera} from 'react-native-vision-camera';
import {scanFaces, Face} from 'vision-camera-face-detector';

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },

  captueContainer: {
    position: 'absolute',
    bottom: 0,
  },

  captureBtn: {
    backgroundColor: 'red',
  },
});

export default function App() {
  const [hasPermission, setHasPermission] = React.useState(false);
  const [faces, setFaces] = React.useState();

  const devices = useCameraDevices();
  const device = devices.front;

  React.useEffect(() => {
    console.log(faces);
  }, [faces]);

  React.useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      setHasPermission(status === 'authorized');
    })();
  }, []);

  const frameProcessor = useFrameProcessor(frame => {
    'worklet';
    const scannedFaces = scanFaces(frame);
    runOnJS(setFaces)(scannedFaces);
  }, []);

  return device != null && hasPermission ? (
    <View style={styles.container}>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        frameProcessor={frameProcessor}
        frameProcessorFps={1 / 2}
      />
      <TouchableOpacity style={styles.captureBtn} onPress={this.takePicture}>
          <Text>Take Photo</Text>
        </TouchableOpacity>
    </View>
  ) : null;
}
