const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const { wrapWithAudioAPIMetroConfig } = require("react-native-audio-api/metro-config");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

config.resolver.sourceExts.push("sql");

module.exports = wrapWithAudioAPIMetroConfig(withNativeWind(config, { input: "./global.css" }));
