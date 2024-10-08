module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/tests'],
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
    },
    testRegex: '((\\.|/)(test|spec))\\.tsx?$',
    moduleFileExtensions: ['ts', 'js', 'json', 'node'],
};