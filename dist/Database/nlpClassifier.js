"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trainClassifier = trainClassifier;
exports.loadClassifier = loadClassifier;
const natural_1 = require("natural");
function trainClassifier(classifier, filePath) {
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
        }
        else {
            console.log('Classifier saved successfully.');
        }
    });
}
function loadClassifier(filePath, classifier) {
    natural_1.BayesClassifier.load(filePath, null, (err, loadedClassifier) => {
        if (err) {
            console.error('Error loading classifier:', err);
        }
        else {
            console.log('Classifier loaded successfully.');
            Object.assign(classifier, loadedClassifier);
        }
    });
}
