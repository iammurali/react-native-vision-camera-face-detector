module.exports = {
  plugins: [
    [
      'react-native-reanimated/plugin',
      {
        globals: ['__scanFaces'],
      },
    ],
  ],
  presets: ['module:metro-react-native-babel-preset'],
};
