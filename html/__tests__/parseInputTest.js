const fs = require('fs');
const path = require('path');
const findDataInText = require('../inputParser.js'); 

describe('findDataInText', () => {
    const testFiles = fs.readdirSync(path.join(__dirname, 'test-inputs'));

    testFiles.forEach(testFile => {
        it(`should correctly extract data from ${testFile}`, () => {
            const inputText = fs.readFileSync(path.join(__dirname, 'test-inputs', testFile), 'utf8');
            const expectedOutput = JSON.parse(fs.readFileSync(path.join(__dirname, 'test-results', testFile), 'utf8'));

            const result = findDataInText(inputText);
            fs.writeFile('/tmp/' + testFile, JSON.stringify(result, null, 2), err => {
              if (err) {
                console.error(err);
              }
            });

            expect(result).toEqual(expectedOutput);
        });
    });
});
