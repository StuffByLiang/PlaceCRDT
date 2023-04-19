module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.ts?(x)'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1', // Useful for aliasing your imports (optional)
  },
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json', // Specify your tsconfig file (optional)
    },
  },
};