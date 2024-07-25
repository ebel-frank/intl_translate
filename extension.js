// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');


const langCodes = {
    'Afrikaans': 'af',
    'Albanian': 'sq',
    'Arabic': 'ar',
    'Armenian': 'hy',
    'Azerbaijani': 'az',
    'Basque': 'eu',
    'Belarusian': 'be',
    'Bengali': 'bn',
    'Bosnian': 'bs',
    'Bulgarian': 'bg',
    'Burmese (Myanmar)': 'my',
    'Catalan': 'ca',
    'Cebuano': 'ceb',
    'Chichewa': 'ny',
    'Chinese (Simplified)': 'zh-cn',
    'Chinese (Traditional)': 'zh-tw',
    'Corsican': 'co',
    'Croatian': 'hr',
    'Czech': 'cs',
    'Danish': 'da',
    'Dutch': 'nl',
    // 'English': 'en',
    'Esperanto': 'eo',
    'Estonian': 'et',
    'Filipino': 'tl',
    'Finnish': 'fi',
    'French': 'fr',
    'Frisian': 'fy',
    'Galician': 'gl',
    'Georgian': 'ka',
    'German': 'de',
    'Greek': 'el',
    'Gujarati': 'gu',
    'Haitian Creole': 'ht',
    'Hausa': 'ha',
    'Hawaiian': 'haw',
    'Hebrew': 'iw',
    'Hindi': 'hi',
    'Hmong': 'hmn',
    'Hungarian': 'hu',
    'Icelandic': 'is',
    'Igbo': 'ig',
    'Indonesian': 'id',
    'Irish': 'ga',
    'Italian': 'it',
    'Japanese': 'ja',
    'Javanese': 'jw',
    'Kannada': 'kn',
    'Kazakh': 'kk',
    'Khmer': 'km',
    'Korean': 'ko',
    'Kurdish (Kurmanji)': 'ku',
    'Kyrgyz': 'ky',
    'Lao': 'lo',
    'Latin': 'la',
    'Latvian': 'lv',
    'Lithuanian': 'lt',
    'Luxembourgish': 'lb',
    'Macedonian': 'mk',
    'Malagasy': 'mg',
    'Malay': 'ms',
    'Malayalam': 'ml',
    'Maltese': 'mt',
    'Maori': 'mi',
    'Marathi': 'mr',
    'Mongolian': 'mn',
    // 'Myanmar (Burmese)': 'my',
    'Nepali': 'ne',
    'Norwegian': 'no',
    // 'Odia': 'or',
    'Pashto': 'ps',
    'Persian': 'fa',
    'Polish': 'pl',
    'Portuguese': 'pt',
    'Punjabi': 'pa',
    'Romanian': 'ro',
    'Russian': 'ru',
    'Samoan': 'sm',
    'Scots Gaelic': 'gd',
    'Serbian': 'sr',
    'Sesotho': 'st',
    'Shona': 'sn',
    'Sindhi': 'sd',
    'Sinhala': 'si',
    'Slovak': 'sk',
    'Slovenian': 'sl',
    'Somali': 'so',
    'Spanish': 'es',
    'Sudanese': 'su',
    'Swahili': 'sw',
    'Swedish': 'sv',
    'Tajik': 'tg',
    'Tamil': 'ta',
    'Telugu': 'te',
    'Thai': 'th',
    'Turkish': 'tr',
    'Ukrainian': 'uk',
    'Urdu': 'ur',
    'Uzbek': 'uz',
    'Vietnamese': 'vi',
    'Welsh': 'cy',
    'Xhosa': 'xh',
    'Yiddish': 'yi',
    'Yoruba': 'yo',
    'Zulu': 'zu',
};

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

    // Create a status bar item with a high priority and right alignment
    const statusBarItem = vscode.window.createStatusBarItem(
        vscode.StatusBarAlignment.Right,
        100
    );

    // Add to the subscriptions for cleanup on extension deactivation
    context.subscriptions.push(statusBarItem);

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    const disposable = vscode.commands.registerCommand('intl-translate.translate', async function () {
        // The code you place here will be executed every time your command is executed
        const input = await vscode.window.showInputBox({ prompt: 'Enter the path to your app_en.arb file' });
        if (!input) {
            vscode.window.showErrorMessage('No file path provided');
            return;
        }

        const options = ['Afrikaans', 'Albanian', 'Arabic', 'Armenian', 'Azerbaijani', 'Basque', 'Belarusian', 'Bengali', 'Bosnian', 'Bulgarian', 'Burmese (Myanmar)', 'Catalan', 'Cebuano', 'Chichewa', 'Chinese (Simplified)', 'Chinese (Traditional)', 'Corsican', 'Croatian',
            'Czech', 'Danish', 'Dutch', 'Esperanto', 'Estonian', 'Filipino', 'Finnish', 'French', 'Frisian', 'Galician', 'Georgian', 'German', 'Greek', 'Gujarati', 'Haitian Creole', 'Hausa', 'Hawaiian', 'Hebrew', 'Hindi', 'Hmong', 'Hungarian', 'Icelandic', 'Igbo', 'Indonesian',
            'Irish', 'Italian', 'Japanese', 'Javanese', 'Kannada', 'Kazakh', 'Khmer', 'Korean', 'Kurdish (Kurmanji)', 'Kyrgyz', 'Lao', 'Latin', 'Latvian', 'Lithuanian', 'Luxembourgish', 'Macedonian', 'Malagasy', 'Malay', 'Malayalam', 'Maltese', 'Maori', 'Marathi', 'Mongolian',
            'Nepali', 'Norwegian', 'Pashto', 'Persian', 'Polish', 'Portuguese', 'Punjabi', 'Romanian', 'Russian', 'Samoan', 'Scots Gaelic', 'Serbian', 'Sesotho', 'Shona', 'Sindhi', 'Sinhala', 'Slovak', 'Slovenian', 'Somali', 'Spanish', 'Sudanese', 'Swahili', 'Swedish', 'Tajik',
            'Tamil', 'Telugu', 'Thai', 'Turkish', 'Ukrainian', 'Urdu', 'Uzbek', 'Vietnamese', 'Welsh', 'Xhosa', 'Yiddish', "Yoruba", "Zulu"]

        const optionss = Object.keys(langCodes);
        const selection = await vscode.window.showQuickPick(optionss, {
            canPickMany: false,
            placeHolder: 'Select language to translate to'
        });

        if (!selection) {
            vscode.window.showErrorMessage('No language selected');
            return;
        }

        const data = await fs.readFileSync(input, 'utf8')
        const content = JSON.parse(data);
        try {
            // Show the status bar item and set an initial message
            statusBarItem.text = '$(sync~spin) Translating...';
            statusBarItem.show();

            const apiKey = process.env.TRANSLATE_API_KEY;

            // const response = await axios.post('https://intl-google-translate.vercel.app/translate?apiKey='+apiKey, formData, {
            //     headers: {
            //         ...formData.getHeaders()
            //     },
            //     maxContentLength: Infinity,
            //     maxBodyLength: Infinity
            // });

            const chunks = splitIntoChunks(content)

            const translatedChunks = [];
            for (const chunk of chunks) {
                try {
                    const translatedChunk = await axios.post('https://intl-google-translate.vercel.app/translator?apiKey=' + apiKey, {
                        langCode: langCodes[selection],
                        data: chunk
                    });
                    translatedChunks.push(translatedChunk.data);
                } catch (e) {
                    translatedChunks.push(chunk);
                }
            }
            const translatedData = Object.assign({}, ...translatedChunks);

            const outputFilePath = generateFilePath(input, langCodes[selection]);
            fs.writeFileSync(outputFilePath, JSON.stringify(translatedData, null, 2));

            // Update the status bar message to indicate completion
            statusBarItem.text = 'Translation Complete!';
        } catch (error) {
            if (error.name === 'TooManyRequestsError') {
                vscode.window.showErrorMessage('Too many requests');
            } else if (error.name === 'AxiosError') {
                vscode.window.showErrorMessage(error.response.data.message);
            } else {
                vscode.window.showErrorMessage('Error translating file: ' + error.message);
            }
        } finally {
            // Hide the status bar item after a short delay
            setTimeout(() => statusBarItem.hide(), 2000);
        }
    });

    context.subscriptions.push(disposable);
}


const splitIntoChunks = (data, chunkSize = 6) => {
    const entries = Object.entries(data);
    const chunks = [];
    for (let i = 0; i < entries.length; i += chunkSize) {
        const chunk = Object.fromEntries(entries.slice(i, i + chunkSize));
        console.log(chunk);
        chunks.push(chunk);
    }
    return chunks;
};

// Function to generate a new file path with the language code replaced
/**
 * @param {string} inputPath
 * @param {string} langCode
 */
function generateFilePath(inputPath, langCode) {
    // Extract the directory, filename, and extension
    const dir = path.dirname(inputPath);
    const ext = path.extname(inputPath);
    let filename = path.basename(inputPath, ext);

    // Replace the language code in the filename
    filename = filename.replace(/_en\b/, `_${langCode}`).replace(/\ben\b/, langCode);

    // Construct the new file path
    const outputPath = path.join(dir, `${filename}${ext}`);

    return outputPath;
}

// This method is called when your extension is deactivated
function deactivate() { }

module.exports = {
    activate,
    deactivate
}
