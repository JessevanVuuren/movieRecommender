const IS_DEV = process.env.APP_VARIANT === 'development';


export default {
  scheme: "movierecommender",
  name: IS_DEV ? "Movie App (Dev)" : "Movie App",
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
    bundleIdentifier: IS_DEV ? "com.jesse.movieRecommender.dev" : "com.jesse.movieRecommender",
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
    package: IS_DEV ? "com.jesse.movieRecommender.dev" : "com.jesse.movieRecommender",
    versionCode: 19,
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
  }
}