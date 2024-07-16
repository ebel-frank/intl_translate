const path = require('path');
const fs = require('fs');
const translate = require('translate-google');
const { program } = require('commander');

const inputFile = 'app_en.arb'
const outputFile = 'app_es.arb'

program
  .version('1.0.0')
  .requiredOption('-i, --input <path>', 'Input ARB file path')
  .requiredOption('-l, --languages <languages>', 'Comma-separated list of target languages')
  .option('-o, --output <path>', 'Output directory', '');

program.parse(process.argv);

let { input, languages, output } = program.opts();
if (!output) {
  output = path.dirname(input);
}

// console.log(input)
// console.log(languages)
// console.log(output)

const translateFile = async (inputFilePath, outputDirectory, targetLanguages) => {
  fs.readFile(inputFilePath, 'utf8', async (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      return;
    }

    const content = JSON.parse(data);

    for (const lang of targetLanguages) {
      const translatedContent = {};
      for (const key in content) {
        if (content.hasOwnProperty(key)) {
          try {
            const translatedText = await translate(content[key], { from: 'en', to: lang });
            translatedContent[key] = translatedText;
          } catch (error) {
            // console.error(`Error translating key "${key}" to "${lang}":`, error);
            translatedContent[key] = content[key]; // Fallback to original text in case of error
          }
        }
      }

      const outputFilePath = `${outputDirectory}/app_${lang}.arb`;
      fs.writeFile(outputFilePath, JSON.stringify(translatedContent, null, 2), (err) => {
        if (err) {
          console.error('Error writing file:', err);
          return;
        }
        console.log(`Translation to ${lang} complete. File saved as ${outputFilePath}`);
      });
    }
  });
};

translateFile(input, output, languages.split(','));