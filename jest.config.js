const testModulePath = [
  '**/auth/*',
  // Add something
];

const addExtname = ext => testModulePath.map(path => `${path}${ext}`);

module.exports = {
  globals: {
    'ts-jest': {
      tsConfigFile: 'tsconfig.json',
    },
  },
  collectCoverage: true,
  coveragePathIgnorePatterns: ['node_modules', 'migrations'],
  testEnvironment: 'node',
  modulePaths: ['./src'], // NODE_PATH=.
  setupFiles: ['./jest.setup.js'],
  collectCoverageFrom: addExtname('.ctrl.ts'), // coverage는 ts 파일 기준
  testMatch: addExtname('.spec.ts'), // testMatch는 test 파일 기준
  moduleFileExtensions: ['ts', 'js', 'json'],
};
