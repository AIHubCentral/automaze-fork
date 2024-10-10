import { BayesClassifier } from 'natural';
import path from 'node:path';

export function trainClassifier(classifier: BayesClassifier, filePath: string): void {
    // epochs
    classifier.addDocument('what are epochs', 'epochs');
    classifier.addDocument('not sure what epochs are', 'epochs');
    classifier.addDocument('can you explain to me what epochs are', 'epochs');
    classifier.addDocument('can anyone tell me what epochs are', 'epochs');
    classifier.addDocument('can someone explain to me what epochs are', 'epochs');
    classifier.addDocument('what are the epochs in voice models', 'epochs');
    classifier.addDocument("i don't know what epochs are", 'epochs');

    // datasets
    classifier.addDocument('guys what is a dataset', 'dataset');
    classifier.addDocument('what is a dataset', 'dataset');
    classifier.addDocument('not sure what datasets are', 'dataset');
    classifier.addDocument('can anyone tell me what is a dataset', 'dataset');
    classifier.addDocument('anyone knows what datasets are', 'dataset');
    classifier.addDocument('what are the dataset in voice models', 'dataset');
    classifier.addDocument("i don't know what dataset mean", 'dataset');

    // models
    classifier.addDocument('what is a model', 'models');
    classifier.addDocument('what is a voice model', 'models');
    classifier.addDocument('idk what is a model', 'models');
    classifier.addDocument('can someone explain what is a model', 'models');

    // inference
    classifier.addDocument('could you tell me what is inference', 'inference');
    classifier.addDocument('what is inference', 'inference');
    classifier.addDocument('is that what inference is', 'inference');
    classifier.addDocument('what is inference for', 'inference');

    // overtraining
    classifier.addDocument('how can i avoid overtraining', 'overtraining');
    classifier.addDocument('why overtraining is bad', 'overtraining');
    classifier.addDocument('is it overtraining', 'overtraining');
    classifier.addDocument('explain what is overtraining', 'overtraining');

    classifier.train();

    classifier.save(filePath, (err) => {
        if (err) {
            console.error('Error saving classifier:', err);
        } else {
            console.log('Classifier saved successfully.');
        }
    });
}

export function loadClassifier(filePath: string, classifier: BayesClassifier): void {
    BayesClassifier.load(filePath, null, (err, loadedClassifier) => {
        if (err) {
            console.error('Error loading classifier:', err);
        } else {
            console.log('Classifier loaded successfully.');
            Object.assign(classifier, loadedClassifier);
        }
    });
}

export function getClassifier(): BayesClassifier {
    const classifier = new BayesClassifier();
    const classifierPath = path.join(process.cwd(), 'src', 'Database', 'classifier.json');
    loadClassifier(classifierPath, classifier);
    return classifier;
}
