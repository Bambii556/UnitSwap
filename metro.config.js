const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const config = getDefaultConfig(__dirname);

// Add the project root to the watch folders
config.watchFolders = [__dirname, path.resolve(__dirname, "./src")];

// Ensure asset and source extensions are correctly configured
config.resolver.assetExts.push("cjs");
config.resolver.sourceExts.push("mjs"); // Add mjs if not already present

// Add additional `node_modules` paths for better resolution
config.resolver.nodeModulesPaths = [path.resolve(__dirname, "./node_modules")];

module.exports = config;
