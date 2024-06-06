import { Collection, ColorResolvable } from "discord.js";

interface EmbedFields {
    name: string;
    value: string;
    inline?: boolean;
}

export interface EmbedData {
    title?: string,
    color?: ColorResolvable,
    description?: string[],
    image?: string,
    fields?: EmbedFields[];
    footer?: string;
    timestamp?: boolean;
    thumbnail?: string;
}

export interface ButtonData {
    label: string;
    url: string;
}

export interface SelectMenuData {
    content: string;
    embeds: EmbedData[];
}

export interface SelectMenuOption {
    label: string;
    description: string;
    value: string,
    emoji?: string;
}

interface LanguageData {
    embeds?: EmbedData[];
    buttons?: ButtonData[];
    mentionMessage?: string;
    local?: SelectMenuData;
    online?: SelectMenuData;
    faq?: SelectMenuData;
    menuOptions?: SelectMenuOption[];
}

interface LanguageDataSubmenu {
    [country_code: string]: LanguageData;
}

interface EmbedsData {
    [key: string]: LanguageDataSubmenu;
}

type KeywordType = 'text' | 'sticker';
type ResponseFrequency = 'often' | 'sometimes' | 'rare';

interface ReactionKeywordsData {
    keywords: string[];
    emojis?: string[];
    responses?: string[];
    stickerId?: string;
    exact?: boolean;
    kind?: KeywordType;
    frequency?: ResponseFrequency;
}

export default interface BotData {
    embeds: EmbedsData;
    reactionKeywords: ReactionKeywordsData[];
    cooldownImmuneUsers: Collection<string, any>;
}