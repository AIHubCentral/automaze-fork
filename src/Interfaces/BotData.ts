import { ColorResolvable } from 'discord.js';

interface EmbedFields {
    name: string;
    value: string;
    inline?: boolean;
}

export interface EmbedData {
    title?: string;
    color?: ColorResolvable;
    description?: string[];
    image?: string;
    fields?: EmbedFields[];
    footer?: string;
    timestamp?: boolean;
    thumbnail?: string;
    buttons?: ButtonData[];
}

export interface ButtonData {
    label: string;
    url: string;
    emoji?: string;
}

export interface SelectMenuData {
    content: string;
    embeds: EmbedData[];
}

export interface SelectMenuOption {
    label: string;
    description: string;
    value: string;
    emoji?: string;
}

export interface LanguageData {
    embeds?: EmbedData[];
    buttons?: ButtonData[];
    mentionMessage?: string;
    local?: SelectMenuData;
    online?: SelectMenuData;
    faq?: SelectMenuData;
    menuOptions?: SelectMenuOption[];
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
    reactionKeywords: ReactionKeywordsData[];
}
