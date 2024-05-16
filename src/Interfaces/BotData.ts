import { Collection } from "discord.js";

interface EmbedFields {
    name: string;
    value: string;
    inline?: boolean;
}

interface EmbedData {
    title: string,
    color?: string,
    description?: string[],
    image?: string,
    fields?: EmbedFields[];
    footer?: string
}

interface SelectMenuData {
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
    mentionMessage?: string;
    embeds?: EmbedData[];
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