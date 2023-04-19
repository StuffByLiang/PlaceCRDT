module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    testMatch: ['**/__tests__/**/*.test.ts?(x)'],
    moduleNameMapper: {
      '^@/(.*)$': '<rootDir>/src/$1', // Useful for aliasing your imports (optional)
    },
    // transform: {
    //     '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
    // },
    transform: {
      "^.+\\.(ts|tsx)$": "babel-jest",
    },
  };