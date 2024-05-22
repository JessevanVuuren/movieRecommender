
let app_name
let build_name

switch (process.env.APP_VARIANT) {
  case "development":
    app_name = "Movie App (Dev)"
    build_name = "com.jesse.movieRecommender.dev"
    break
  case "preview":
    app_name = "Movie App (Preview)"
    build_name = "com.jesse.movieRecommender.preview"
    break
  default:
    app_name = "Movie App"
    build_name = "com.jesse.movieRecommender"
    break
}



export default {
  scheme: "movierecommender",
  name: app_name,
  slug: "MovieRecommender",
  version: "3.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  splash: {
    image: "./assets/splash.png",
    resizeMode: "contain",
    backgroundColor: "#03071E"
  },
  updates: {
    fallbackToCacheTimeout: 0
  },
  assetBundlePatterns: [
    "**/*"
  ],
  ios: {
    associatedDomains: [
      "applinks:movierecommender.ga"
    ],
    supportsTablet: true,
    bundleIdentifier: build_name,
    buildNumber: "17"
  },
  android: {
    intentFilters: [
      {
        action: "VIEW",
        autoVerify: true,
        data: [
          {
            scheme: "http",
            host: "*.movieapp.42web.io"
          },
          {
            scheme: "http",
            host: "movieapp.42web.io"
          },
          {
            scheme: "https",
            host: "*movierecommender.ga"
          },
          {
            scheme: "https",
            host: "*.movierecommender.ga"
          }
        ],
        category: [
          "BROWSABLE",
          "DEFAULT"
        ]
      }
    ],
    adaptiveIcon: {
      foregroundImage: "./assets/icon.png",
      backgroundColor: "#FFFFFF"
    },
    package: build_name,
    versionCode: 23,
    permissions: [],
    AsyncStorage_db_size_in_MB: 10
  },
  web: {
    favicon: "./assets/favicon.png"
  },
  extra: {
    eas: {
      projectId: "b1b04025-da10-418a-b3b8-151f2e590adc"
    }
  },
  plugins: [
    "expo-localization", "expo-font"
  ]
}