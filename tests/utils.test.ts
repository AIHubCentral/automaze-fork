import { IResource } from '../src/Services/resourcesService';
import { processResource, processResourceAlt, resourcesToUnorderedList } from '../src/Utils/botUtilities';

describe('Bot Utilities', () => {
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
