import { BayesClassifier } from 'natural';

export function trainClassifier(classifier: BayesClassifier, filePath: string): void {
    classifier.addDocument('I am happy', 'positive');
    classifier.addDocument('I am sad', 'negative');
    classifier.addDocument('What is your return policy?', 'returns');
    classifier.addDocument('How can I track my order?', 'shipping');
    classifier.addDocument('What payment methods do you accept?', 'payment');
    classifier.addDocument('How do I reset my password?', 'account');
    classifier.addDocument('What are your business hours?', 'general');
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
