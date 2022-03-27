/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */

const testModulePath = [
  '**/auth/*',
  '**/posts/*',
  '**/users/*',
  // Add something
];

const addExtname = ext => testModulePath.map(path => `${path}${ext}`);

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
    },
  },
  collectCoverage: true,
  coveragePathIgnorePatterns: ['node_modules', 'migrations'],
  modulePaths: ['./src'], // NODE_PATH=.
  setupFiles: ['./jest.setup.js'],
  collectCoverageFrom: addExtname('.ctrl.ts'), // coverage는 ts 파일 기준
  testMatch: addExtname('.spec.ts'), // testMatch는 test 파일 기준
  moduleFileExtensions: ['ts', 'js', 'json'],
};
