import {
    containsKeyword,
    getFaqKeywords,
    containsQuestionPattern,
    isAskingForAssistance,
    isAskingForGirlModel,
    getLanguageByChannelId,
    getFaqReply,
} from '../src/Utils/botUtilities';
import { processTranslation } from '../src/Utils/generalUtilities';
import { EmbedData } from '../src/Interfaces/BotData';
import { initI18n } from '../src/i18n';
import { ColorThemes, createThemedEmbed, createThemedEmbeds } from '../src/Utils/discordUtilities';
import { APIEmbed, ColorResolvable, resolveColor } from 'discord.js';

beforeAll(async () => {
    await initI18n();
});

describe('Bot Utilities', () => {
    /* describe('Embed Formatting', () => {
        it('should process the resource and return a formatted output based on the fields available in the resource object', () => {
            expect(
                processResource({
                    id: 1,
                    category: 'kaggle',
                    url: 'https://www.kaggle.com/',
                    authors: 'John',
                    displayTitle: 'Kaggle Notebook',
                    emoji: '📘',
                })
            ).toBe('📘 **Kaggle Notebook**, by John [Kaggle](https://www.kaggle.com/)');

            expect(
                processResource({
                    id: 1,
                    category: 'kaggle',
                    url: 'https://www.kaggle.com/',
                    authors: 'John',
                    displayTitle: 'Kaggle Notebook',
                    emoji: '',
                })
            ).toBe('**Kaggle Notebook**, by John [Kaggle](https://www.kaggle.com/)');

            expect(
                processResource({
                    id: 1,
                    category: 'kaggle',
                    url: 'https://www.kaggle.com/',
                    authors: 'John',
                    displayTitle: 'Kaggle Notebook',
                    emoji: 'None',
                })
            ).toBe('**Kaggle Notebook**, by John [Kaggle](https://www.kaggle.com/)');

            expect(
                processResource({
                    id: 1,
                    category: 'kaggle',
                    url: 'https://www.kaggle.com/',
                    authors: 'John',
                })
            ).toBe('by John https://www.kaggle.com/');

            expect(
                processResource({
                    id: 1,
                    category: 'kaggle',
                    url: 'https://www.kaggle.com/',
                })
            ).toBe('https://www.kaggle.com/');

            expect(
                processResource({
                    id: 1,
                    category: 'colab',
                    url: 'https://colab.research.google.com/',
                    displayTitle: 'Colab Notebook',
                    authors: 'John',
                })
            ).toBe('**Colab Notebook**, by John [Google Colab](https://colab.research.google.com/)');

            expect(
                processResource({
                    id: 1,
                    category: 'hf',
                    url: 'https://huggingface.co/spaces',
                    displayTitle: 'Custom Space',
                    authors: 'John',
                })
            ).toBe('**Custom Space**, by John [Huggingface Spaces](https://huggingface.co/spaces)');

            expect(
                processResource({
                    id: 1,
                    category: 'Misc',
                    url: 'https://www.google.com.br/',
                    displayTitle: 'Something else',
                    authors: 'John',
                })
            ).toBe('**Something else**, by John [Link](https://www.google.com.br/)');
        });

        it('should process the resource and return a formatted output, alternative version', () => {
            expect(
                processResourceAlt({
                    id: 1,
                    category: 'kaggle',
                    url: 'https://www.kaggle.com/',
                    authors: 'John',
                    displayTitle: 'Kaggle Notebook',
                    emoji: '📘',
                })
            ).toBe('📘 [Kaggle Notebook](https://www.kaggle.com/), by **John**');

            expect(
                processResourceAlt({
                    id: 1,
                    category: 'kaggle',
                    url: 'https://www.kaggle.com/',
                    authors: 'John',
                    displayTitle: 'Kaggle Notebook',
                    emoji: '',
                })
            ).toBe('[Kaggle Notebook](https://www.kaggle.com/), by **John**');

            expect(
                processResourceAlt({
                    id: 1,
                    category: 'kaggle',
                    url: 'https://www.kaggle.com/',
                    authors: 'John',
                    displayTitle: 'Kaggle Notebook',
                    emoji: 'None',
                })
            ).toBe('[Kaggle Notebook](https://www.kaggle.com/), by **John**');

            expect(
                processResourceAlt({
                    id: 1,
                    category: 'kaggle',
                    url: 'https://www.kaggle.com/',
                    authors: 'John',
                })
            ).toBe('https://www.kaggle.com/, by **John**');

            expect(
                processResourceAlt({
                    id: 1,
                    category: 'kaggle',
                    url: 'https://www.kaggle.com/',
                })
            ).toBe('https://www.kaggle.com/');

            expect(
                processResourceAlt({
                    id: 1,
                    category: 'colab',
                    url: 'https://colab.research.google.com/',
                    displayTitle: 'Colab Notebook',
                    authors: 'John',
                })
            ).toBe('[Colab Notebook](https://colab.research.google.com/), by **John**');

            expect(
                processResourceAlt({
                    id: 1,
                    category: 'hf',
                    url: 'https://huggingface.co/spaces',
                    displayTitle: 'Custom Space',
                    authors: 'John',
                })
            ).toBe('[Custom Space](https://huggingface.co/spaces), by **John**');

            expect(
                processResourceAlt({
                    id: 1,
                    category: 'Misc',
                    url: 'https://www.google.com.br/',
                    displayTitle: 'Something else',
                })
            ).toBe('[Something else](https://www.google.com.br/)');
        });

        it('should return resources formatted as markdown unordered list', () => {
            const resourcesMock: IResource[] = [
                {
                    id: 1,
                    category: 'kaggle',
                    url: 'https://www.kaggle.com/',
                    authors: 'John',
                    displayTitle: 'Kaggle Notebook',
                    emoji: '📘',
                },
                {
                    id: 2,
                    category: 'kaggle',
                    url: 'https://www.kaggle.com/',
                    authors: 'Ulyssa',
                    emoji: 'none',
                },
            ];

            const resourcesUnorderedList = resourcesToUnorderedList(resourcesMock);
            expect(resourcesUnorderedList).toBe(
                '- 📘 **Kaggle Notebook**, by John [Kaggle](https://www.kaggle.com/)\n- by Ulyssa https://www.kaggle.com/'
            );
        });
    }); */

    describe('Keyword Checking', () => {
        it('should return the matched keyword if present', () => {
            const tokens1 = ['what', 'epochs', 'are', '?'];
            const tokens2 = ['learning', 'about', 'datasets'];
            const tokens3 = ['what', 'is', 'an', 'epoch'];
            const tokens4 = ['someone', 'explain', 'overtraining'];

            const keywords = getFaqKeywords();

            expect(containsKeyword(tokens1, keywords)).toBe('epochs');
            expect(containsKeyword(tokens2, keywords)).toBe('datasets');
            expect(containsKeyword(tokens3, keywords)).toBe('epoch');
            expect(containsKeyword(tokens4, keywords)).toBe('overtraining');
            expect(containsKeyword(['what', 'is', 'a', 'gradient'], keywords)).toBe('gradient');
            expect(containsKeyword(['what', 'is', 'cuda'], keywords)).toBe('cuda');
            expect(containsKeyword(['what', 'is', 'gradio'], keywords)).toBe('gradio');
            expect(containsKeyword(['what', 'is', 'hubert'], keywords)).toBe('hubert');
            expect(containsKeyword(['what', 'is', 'an', 'index', 'file'], keywords)).toBe('index');
        });

        it('should return null if no keywords are present', () => {
            const tokens1 = ['this', 'is', 'a', 'test'];
            const tokens2 = ['hello', 'world'];
            const keywords = getFaqKeywords();

            expect(containsKeyword(tokens1, keywords)).toBeNull();
            expect(containsKeyword(tokens2, keywords)).toBeNull();
        });

        it('should detect if the input is a question', () => {
            expect(containsQuestionPattern('what are epochs')).toBe(true);
            expect(containsQuestionPattern('what is inference')).toBe(true);
            expect(containsQuestionPattern('not sure what epochs are')).toBe(true);
            expect(containsQuestionPattern('can you explain to me what epochs are')).toBe(true);
            expect(containsQuestionPattern('Hey. can anyone explain what epochs are?')).toBe(true);
            expect(containsQuestionPattern('can you explain what epochs are?')).toBe(true);
            expect(containsQuestionPattern('can someone tell what epochs are?')).toBe(true);
            expect(containsQuestionPattern('can anyone tell me what epochs are')).toBe(true);
            expect(containsQuestionPattern('can someone explain to me what datasets are?')).toBe(true);
            expect(containsQuestionPattern('Hey there. Can someone explain what datasets are?')).toBe(true);
            expect(containsQuestionPattern('idk what inference is')).toBe(true);
            expect(containsQuestionPattern('idk what epochs are')).toBe(true);
            expect(containsQuestionPattern('idk what batch means')).toBe(true);
            expect(containsQuestionPattern('someone explain what inference means')).toBe(true);
            expect(containsQuestionPattern("i don't know what inference is")).toBe(true);
            expect(containsQuestionPattern("i don't know what epochs are")).toBe(true);
            expect(containsQuestionPattern('not sure what epochs are')).toBe(true);
            expect(containsQuestionPattern('not sure what inference is')).toBe(true);
            expect(containsQuestionPattern('is that what overtraining is')).toBe(true);

            expect(containsQuestionPattern('I know what epochs are')).toBe(false);
        });

        it('should detect if user is asking for assistance', () => {
            expect(isAskingForAssistance('can you help me?')).toBe(true);
            expect(isAskingForAssistance('can someone help me?')).toBe(true);
            expect(isAskingForAssistance('can anyone help me?')).toBe(true);
            expect(isAskingForAssistance('can someone help')).toBe(true);
            expect(isAskingForAssistance('someone help pls')).toBe(true);
            expect(isAskingForAssistance('please anyone help')).toBe(true);
            expect(isAskingForAssistance('i got an error')).toBe(true);
            expect(isAskingForAssistance('got an error')).toBe(true);
            expect(isAskingForAssistance('givin error')).toBe(true);
            expect(isAskingForAssistance("it's showing an error")).toBe(true);
            expect(isAskingForAssistance('its showing some errors')).toBe(true);
            expect(isAskingForAssistance('can i ask you somethin?')).toBe(true);
            expect(isAskingForAssistance('can i ask something?')).toBe(true);
        });

        it('should detect if is asking for girl voice model', () => {
            expect(isAskingForGirlModel('can anyone make a GIRL voice model?')).toBe(true);
            expect(isAskingForGirlModel('e-girl voice pls')).toBe(true);
            expect(isAskingForGirlModel('what is a good female model')).toBe(true);
            expect(isAskingForGirlModel('test')).toBe(false);
        });
    });

    describe('getLanguageByChannelId', () => {
        it('should return "es" for Spanish channel ID', () => {
            const result = getLanguageByChannelId('1159369117854347276');
            expect(result).toBe('es');
        });

        it('should return "it" for Italian channel ID', () => {
            const result = getLanguageByChannelId('1159291287430778933');
            expect(result).toBe('it');
        });

        it('should return "pt" for Portuguese channel ID', () => {
            const result = getLanguageByChannelId('1159572045043081247');
            expect(result).toBe('pt');
        });

        it('should return "en" for an unknown channel ID', () => {
            const result = getLanguageByChannelId('1159289354439626772');
            expect(result).toBe('en');
        });
    });

    describe('FAQ reply', () => {
        it('should return null for unknown keyword', () => {
            expect(getFaqReply('something_else')).toBeNull();
        });

        it('should return an object for cuda keyword', () => {
            expect(typeof getFaqReply('cuda')).toBe('object');
        });

        it('should return a string for epoch and epochs', () => {
            expect(typeof getFaqReply('epoch')).toBe('string');
            expect(typeof getFaqReply('epochs')).toBe('string');
        });

        it('should return an object for dataset and datasets', () => {
            expect(typeof getFaqReply('dataset')).toBe('object');
            expect(typeof getFaqReply('datasets')).toBe('object');
        });

        it('should return an object for gradio keyword', () => {
            expect(typeof getFaqReply('gradio')).toBe('object');
        });

        it('should return a string for hubert keyword', () => {
            expect(typeof getFaqReply('hubert')).toBe('string');
        });

        it('should return a string for index keyword', () => {
            expect(typeof getFaqReply('index')).toBe('string');
        });

        it('should return a string for inference keyword', () => {
            expect(typeof getFaqReply('inference')).toBe('string');
        });

        it('should return a string for overtraining keyword', () => {
            expect(typeof getFaqReply('overtraining')).toBe('string');
        });
    });
});

describe('General Utilities', () => {
    describe('Process translation', () => {
        const sample1 = 'Hello world!';
        const sample2 = '';
        const sample3 = ['One', 'Two', 'Three'];
        const sample4 = { description: ['Hello'] } as EmbedData;

        it('should return the translation as string or object', () => {
            expect(typeof processTranslation(sample1)).toBe('string');
            expect(typeof processTranslation(sample2)).toBe('string');
            expect(typeof processTranslation(sample3)).toBe('string');
            expect(typeof processTranslation(sample4)).toBe('object');
        });

        it('should return appropriate values', () => {
            expect(processTranslation(sample1)).toBe('Hello world!');
            expect(processTranslation(sample2)).toBe('');
            expect(processTranslation(sample3)).toBe('One\nTwo\nThree');
            expect(processTranslation(sample4)).toBe(sample4);
        });
    });
});

import themes from '../JSON/themes.json';

describe('Discord utilities', () => {
    describe('Create embeds', () => {
        it('should create an embed with color theme', () => {
            const embedData: APIEmbed = {};

            let embed = createThemedEmbed(embedData, ColorThemes.Default, 'primary');
            expect(embed.data.color).toBe(resolveColor(themes.default.primary as ColorResolvable));

            embed = createThemedEmbed(embedData, ColorThemes.Default, 'secondary');
            expect(embed.data.color).toBe(resolveColor(themes.default.secondary as ColorResolvable));

            embed = createThemedEmbed(embedData, ColorThemes.Default, 'tertiary');
            expect(embed.data.color).toBe(resolveColor(themes.default.tertiary as ColorResolvable));

            embed = createThemedEmbed(embedData, ColorThemes.Default, 'accent_1');
            expect(embed.data.color).toBe(resolveColor(themes.default.accent_1 as ColorResolvable));

            embed = createThemedEmbed(embedData, ColorThemes.Default, 'accent_2');
            expect(embed.data.color).toBe(resolveColor(themes.default.accent_2 as ColorResolvable));
        });

        it('should fill the embed data with values passed in data parameter', () => {
            const embedData: APIEmbed = {};

            let embed = createThemedEmbed(embedData, ColorThemes.Default, 'primary');
            expect(embed.data.title).toBeUndefined();
            expect(embed.data.description).toBeUndefined();
            expect(embed.data.fields).toBeUndefined();
            expect(embed.data.footer).toBeUndefined();

            // fill values
            embedData.title = 'Title';
            embedData.description = 'Description';
            embedData.fields = [{ name: 'Field 1', value: 'Value 1', inline: false }];
            embedData.footer = { text: 'Footer' };

            embed = createThemedEmbed(embedData, ColorThemes.Default, 'primary');
            expect(embed.data.title).toBe('Title');
            expect(embed.data.description).toBe('Description');
            expect(embed.data.fields).toEqual([{ name: 'Field 1', value: 'Value 1', inline: false }]);
            expect(embed.data.footer!.text).toBe('Footer');
        });

        it('should rotate colors when creating multiple embeds at once', () => {
            const data: APIEmbed[] = [
                { description: 'Test 1' },
                { description: 'Test 2' },
                { description: 'Test 3' },
                { description: 'Test 4' },
            ];

            const embeds = createThemedEmbeds(data, ColorThemes.Default);
            expect(embeds[0].data.color).toBe(resolveColor(themes.default.primary as ColorResolvable));
            expect(embeds[1].data.color).toBe(resolveColor(themes.default.secondary as ColorResolvable));
            expect(embeds[2].data.color).toBe(resolveColor(themes.default.tertiary as ColorResolvable));
            expect(embeds[3].data.color).toBe(resolveColor(themes.default.primary as ColorResolvable));
        });
    });
});
