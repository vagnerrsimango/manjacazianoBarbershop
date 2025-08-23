const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Add SVG support
config.transformer.babelTransformerPath = require.resolve(
  "react-native-svg-transformer"
);

// Add SVG to asset extensions
config.resolver.assetExts = config.resolver.assetExts.filter(
  (ext) => ext !== "svg"
);
config.resolver.sourceExts = [...config.resolver.sourceExts, "svg"];

// NativeWind v4 configuration - now compatible with Node.js 22
const { withNativeWind } = require("nativewind/metro");
module.exports = withNativeWind(config, { input: "./global.css" });
