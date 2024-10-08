import { setTimeout } from 'node:timers/promises';
import path from 'node:path';
import * as fs from 'fs/promises';

export async function delay(durationMs: number): Promise<void> {
    await setTimeout(durationMs);
}

export function getRandomNumber(min: number, max: number): number {
    /* gets a random number between min and max */
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getRandomFromArray(arr: Array<any>): any {
    /* gets a random value from an array */
    if (arr.length === 0) throw new Error('empty array');
    if (arr.length === 1) return arr[0];
    const randomIndex = getRandomNumber(0, arr.length - 1);
    return arr[randomIndex];
}
