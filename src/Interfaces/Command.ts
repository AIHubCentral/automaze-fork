/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    AutocompleteInteraction,
    ChatInputCommandInteraction,
    ContextMenuCommandBuilder,
    Message,
    UserContextMenuCommandInteraction,
} from 'discord.js';
import ExtendedClient from '../Core/extendedClient';

export interface SlashCommand {
    category: string;
    data: any;
    cooldown?: number;
    execute: (interaction: ChatInputCommandInteraction) => Promise<unknown>;
    autocomplete?: (interaction: AutocompleteInteraction) => Promise<unknown>;
}

export interface ContextCommand {
    category: string;
    data: ContextMenuCommandBuilder;
    execute: (interaction: UserContextMenuCommandInteraction) => Promise<unknown>;
}

export interface PrefixCommand {
    name: string;
    category?: string;
    description: string;
    aliases: string[];
    syntax?: string;
    run: (client: ExtendedClient, message: Message, args?: string[], prefix?: string) => Promise<unknown>;
}
