export default {
    expo: {
      name: "Safar",
      slug: "safar",
      scheme: "safar",
      newArchEnabled: false,
      plugins: ["expo-location"],
  
      android: {
        permissions: [
          "ACCESS_FINE_LOCATION",
          "ACCESS_COARSE_LOCATION",
        ],
      },
  
      ios: {
        infoPlist: {
          NSLocationWhenInUseUsageDescription:
            "This app needs access to your location to track your journey on the map.",
        },
      },
  
      doctor: {
        reactNativeDirectoryCheck: {
          exclude: ["react-redux"],
        },
      },
    },
  };
  