"use strict";
/* eslint-disable */
// @ts-nocheck
Object.defineProperty(exports, "__esModule", { value: true });
exports.delay = delay;
exports.getRandomNumber = getRandomNumber;
exports.getRandomFromArray = getRandomFromArray;
const promises_1 = require("node:timers/promises");
async function delay(durationMs) {
    await (0, promises_1.setTimeout)(durationMs);
}
function getRandomNumber(min, max) {
    /* gets a random number between min and max */
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function getRandomFromArray(arr) {
    /* gets a random value from an array */
    if (arr.length === 0)
        throw new Error('empty array');
    if (arr.length === 1)
        return arr[0];
    const randomIndex = getRandomNumber(0, arr.length - 1);
    return arr[randomIndex];
}
