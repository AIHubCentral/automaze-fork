import { IResource } from '../src/Services/resourcesService';
import {
    processResource,
    processResourceAlt,
    resourcesToUnorderedList,
    containsKeyword,
    getFaqKeywords,
    containsQuestionPattern,
} from '../src/Utils/botUtilities';
import { processTranslation } from '../src/Utils/generalUtilities';
import { EmbedData } from '../src/Interfaces/BotData';

describe('Bot Utilities', () => {
    describe('Embed Formatting', () => {
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
    });

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
