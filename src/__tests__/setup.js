// Mock any expo-specific modules if needed
jest.mock('expo-font', () => ({
  loadAsync: jest.fn(),
  isLoaded: jest.fn(() => true),
}));

jest.mock('expo-asset', () => ({
  Asset: {
    fromModule: jest.fn(() => Promise.resolve({ localUri: 'mock-uri' })),
  },
}));

// Add any other global test setup here