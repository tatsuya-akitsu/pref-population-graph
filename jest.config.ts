import type { Config } from 'jest'
import nextJest from 'next/jest.js'

const createJsonConfig = nextJest({
  dir: './'
})

const config: Config = {
  coverageProvider: 'v8',
  preset: 'ts-jest',
  moduleDirectories: ['node_modules', '<rootDir>/'],
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
    '^.+\\.(js|jsx)$': ['babel-jest', { presets: ['next/babel'] }],
  },
  globals: {
    'ts-jest': {
      tsconfig: {
        jsx: 'react-jsx',
      },
    },
  },
};

export default createJsonConfig(config)


// module.exports = {
//   preset: 'ts-jest',
//   moduleDirectories: ['node_modules', '<rootDir>/'],
//   testEnvironment: 'jest-environment-jsdom',
//   setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
//   moduleNameMapper: {
//     '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
//     '^@/(.*)$': '<rootDir>/src/$1',
//   },
//   transform: {
//     '^.+\\.(ts|tsx)$': 'esbuild-jest',
//     '^.+\\.(js|jsx)$': ['babel-jest', { presets: ['next/babel'] }],
//   },
//   globals: {
//     'ts-jest': {
//       tsconfig: {
//         jsx: 'react-jsx',
//       },
//     },
//   },
// };
