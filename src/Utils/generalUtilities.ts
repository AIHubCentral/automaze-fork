/* eslint-disable */
// @ts-nocheck

import { setTimeout } from 'node:timers/promises';
import { EmbedData } from '../Interfaces/BotData';
import { APIEmbed } from 'discord.js';

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

export type TranslationResult = EmbedData | Array<string> | string;

/**
 * Returns a string or object
 * @param translation - Result from i18next.t()
 */
export function processTranslation(translation: TranslationResult): string | EmbedData {
    if (typeof translation === 'string') {
        return translation;
    } else if (typeof translation === 'object' && translation !== null) {
        if (Array.isArray(translation)) {
            return translation.join('\n');
        }
        return translation;
    }
    throw new Error('translation should be of type TranslationResult');
}

export function generateRandomId(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters[randomIndex];
    }
    return result;
}