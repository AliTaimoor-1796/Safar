export default {
  expo: {
    name: "Safar",
    slug: "safar",
    scheme: "safar",
    icon: "./assets/logo/SAFAR.png",

    extra: {
      eas: {
        projectId: "c6ab1f67-53b0-4206-bd0b-c0ccf46b22ac"
      }
    },
    newArchEnabled: false,
    plugins: ["expo-location"],

    android: {
      package: "com.huzaifah.safar",
      permissions: [
        "ACCESS_FINE_LOCATION",
        "ACCESS_COARSE_LOCATION",
      ],
      config: {
        googleMaps: {
          apiKey: "AIzaSyBS1PgbKbNGBRS4GeX6BDXnshXv46NTDyM" 
        }
      }
    },

    ios: {
      config: {
        googleMapsApiKey: "AIzaSyBS1PgbKbNGBRS4GeX6BDXnshXv46NTDyM" 
      },
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
