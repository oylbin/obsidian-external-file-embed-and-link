module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^obsidian$': '<rootDir>/src/__mocks__/obsidian.ts'
  },
  setupFiles: ['<rootDir>/src/__mocks__/setup.ts']
};
