// Libraries neccesaries
const fs = require('fs');

// Will give you all the files in a folder recursively
function getAllFiles(currentPath){
    let currentFiles = [];
    for(const thatFile of fs.readdirSync(currentPath)){
        let filePath = currentPath + '/' + thatFile;
        if(fs.lstatSync(filePath).isDirectory()){
            currentFiles = currentFiles.concat(currentFiles, getAllFiles(filePath));
        } else {
            currentFiles.push(filePath);
        }
    }
    return [...new Set(currentFiles)];
}
exports.getAllFiles = getAllFiles;

// Create delay async in the script
async function delay(ms) {
    return new Promise(resolve => {
      setTimeout(resolve, ms);
    });
}
exports.delay = delay;

function getRandomNumber(min, max) {
    /* gets a random number between min and max */
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

exports.getRandomNumber = getRandomNumber;