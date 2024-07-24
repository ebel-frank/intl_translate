// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const path = require('path');
const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const { HttpProxyAgent } = require('http-proxy-agent');


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

        const options = ["Afrikaans", "Amharic", "Arabic", "Assamese", "Azerbaijani", "Basque", "Bengali", "Burmese", "Catalan", "Chinese (Simplified)", "Chinese (Traditional)", "Czech", "Danish", "Dutch", "Estonian", "Filipino", "Finnish", 'French', "Galician", "Georgian",
            "German", "Greek", "Gujarati", "Hebrew", "Hindi", "Hungarian", "Icelandic", "Indonesian", "Irish", "Italian", "Japanese", "Kannada", "Kazakh", "Khmer", "Korean", "Kurdish", "Kyrgyz", "Lao", "Latvian", "Lithuanian", "Luxembourgish", "Macedonian", "Malay", "Malayalam",
            "Maltese", "Marathi", "Mongolian", "Nepali", "Norwegian", "Odia", "Pashto", "Persian", "Polish", "Portuguese", "Punjabi", "Romanian", "Russian", "Serbian", "Sinhala", "Slovak", "Slovenian", "Spanish", "Swahili", "Swedish", "Tamil", "Telugu", "Thai", "Turkish",
            "Ukrainian", "Urdu", "Uzbek", "Vietnamese", "Welsh", "Yoruba", "Zulu"];

        const selection = await vscode.window.showQuickPick(options, {
            canPickMany: false,
            placeHolder: 'Select language to translate to'
        });

        // Test path
        // C:\Users\HP\Desktop\Workspace\internationalization\test_folder\app_en.arb

        if (!selection) {
            vscode.window.showErrorMessage('No language selected');
            return;
        }

        const formData = new FormData();
        formData.append('file', fs.createReadStream(input));
        formData.append('language', selection);
        try {
            // Show the status bar item and set an initial message
            statusBarItem.text = '$(sync~spin) Translating...';
            statusBarItem.show();

            const response = await axios.post('http://localhost:5000/translate', formData, {
                headers: {
                    ...formData.getHeaders()
                },
                maxContentLength: Infinity,
                maxBodyLength: Infinity
            });

            const translations = response.data.translations;
            for (const lang in translations) {
                const outputFilePath = generateFilePath(input, lang);
                fs.writeFileSync(outputFilePath, JSON.stringify(translations[lang], null, 2));
            }

            // Update the status bar message to indicate completion
            statusBarItem.text = 'Translation Complete!';
        } catch (error) {
            if (error.name === 'TooManyRequestsError') {
                // retry with another proxy agent
                vscode.window.showErrorMessage('Too many requests');
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
