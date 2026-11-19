module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/tests"],
  setupFilesAfterEnv: ["<rootDir>/tests/setup.ts"],
  moduleNameMapper: {
    "\\.svg\\?react$": "<rootDir>/tests/__mocks__/svgComponentMock.js",
    "\\.css$": "<rootDir>/tests/__mocks__/styleMock.js",
    "\\.(svg|png|jpe?g|webp|woff2?)$": "<rootDir>/tests/__mocks__/fileMock.js",
  },
};
