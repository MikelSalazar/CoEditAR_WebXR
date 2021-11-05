/******************************************************************************
  Build System - Main
******************************************************************************/

'use strict' // Make sure that we are working on strict mode

// ----------------------------------------------------------- NODEJS MODULES
// The NodeJS modules
const fs = require('fs'), 						// File System access
	path = require('path'),						// File Path handling
	codebase = require('./tasks/build_codebase'),
	documentation = require('./tasks/build_documentation'),
	distributables = require('./tasks/build_distributables');


// ----------------------------------------------------------- GLOBAL CONSTANTS
global.FRAMEWORK_NAME = 'CoEditAR';
global.MAIN_FILE_NAME = 'coeditar';
global.FRAMEWORK_VERSION = '0.1';
global.PROJECT_FOLDER_PATH = path.resolve(__dirname, '..\\..\\') + '\\';
global.SOURCES_FOLDER_PATH = PROJECT_FOLDER_PATH + 'sources\\';
global.DOCS_FOLDER_PATH = PROJECT_FOLDER_PATH + 'docs\\';
global.ENGINE_FOLDER_PATH = PROJECT_FOLDER_PATH + 'node_modules\\three\\';
global.ENGINE_FILE_PATH = ENGINE_FOLDER_PATH + 'build\\three.min.js';
global.LOADERS_FOLDER_PATH = ENGINE_FOLDER_PATH + 'examples\\js\\loaders\\';
global.BUILDS_FOLDER_PATH = PROJECT_FOLDER_PATH + 'builds\\';
global.TEMPORAL_FOLDER_PATH = BUILDS_FOLDER_PATH + 'temporal\\';
global.MODULES_FOLDER_PATH = BUILDS_FOLDER_PATH + 'modules\\';
global.SOURCES_MAIN_FILE_PATH = SOURCES_FOLDER_PATH + MAIN_FILE_NAME +'.ts';
global.BUILD_FILE_PATH = BUILDS_FOLDER_PATH + "coeditar";
global.TEXT_FILE = {encoding:'utf8'};

//------------------------------------------------------------ GLOBAL FUNCTIONS

/** Calculates the relative path between two absolute paths.
 * @param from The origin path.
 * @param to The destination path.
 * @returns The relative path. */
 function relativePath(from,to) {
	return path.relative(from,to).replace(/\\/g,'/');
}


/** Makes sure that the parent directory exists. 
 * @param folderPath The path of the directory (or file) to check.
 * @returns A boolean value indicating whether the parent directory existed. */
function checkFolderStructure(folderPath) {
	if (fs.existsSync(folderPath)) return true;
	checkFolderStructure(path.dirname(folderPath));
	fs.mkdirSync(folderPath);
	return false;
}

/** Cleans a folder recursively.
 * @param folderPath The path of the folder to clean. 
 * @param removeFolder Whether to remove the folder afterwards or not. */
function cleanFolder(folderPath, removeFolder = false) {
	var filePaths = fs.readdirSync(folderPath);
	filePaths.forEach(filePath => {
		filePath = path.join(folderPath, filePath);
		if (fs.lstatSync(filePath).isFile()) fs.unlinkSync(filePath);
		else cleanFolder(filePath, true);
	});
	if(removeFolder) fs.rmdirSync(folderPath);
}

/** Recursively finds the files inside a folder
 * @param folderPath The path to the folder.
 * @param fileExtension The file extension. */
function findFilesInFolder(folderPath, fileExtension = "") {
	let sourceFilePaths = [], names = fs.readdirSync(folderPath);
	for (const name of names) {
		let filePath = path.join(folderPath,name);
		if(fs.statSync(filePath).isDirectory()) 
			sourceFilePaths = sourceFilePaths.concat(findFilesInFolder(
				filePath, fileExtension));
		else if(filePath.endsWith(fileExtension))sourceFilePaths.push(filePath);
	}
	return sourceFilePaths;
}

/** Shows a message on console.
 * @param message The message to show on console.
 * @param level The level of the message (both in tabulation and importance). 
 * @param verboseOnly The message will only be displayed in the verbose mode. */
function log(message, level = 0, verboseOnly = false) { 
	if (verboseOnly && !module.exports.options.verbose) return;
	if (level < maxLogLevel) console.log('  '.repeat(level) + message);
 }

//------------------------------------------------------------- GLOBAL VARIABLES
/** Defines the maximum level of log level. */
let options = {
	clean: true,	// Indicates whether to clean the build folder or not
	build: true,	// Indicates whether to initiate the building process or not
	docs: false,	// Indicates whether to generate documentation or not
	watch: false,	// Indicates whether the watch mode is enabled or not
	verbose: false,	// Indicates whether the verbose mode is enabled or not
};

/** Defines the maximum level of log level. */
let maxLogLevel = 100;

//-------------------------------------------------------------- MODULE EXPORTS
// module.exports = {relativePath:relativePath, 
// 	checkFolderStructure:checkFolderStructure, cleanFolder:cleanFolder,
// 	findFilesInFolder:findFilesInFolder, log:log, options:options, 
// 	maxLogLevel:maxLogLevel};

// Add the functions to the module exports object to make them available
module.exports.relativePath = relativePath;
module.exports.checkFolderStructure = checkFolderStructure;
module.exports.cleanFolder = cleanFolder;
module.exports.findFilesInFolder = findFilesInFolder;
module.exports.log = log;

// Add the global variables
module.exports.maxLogLevel = maxLogLevel;
module.exports.options = options;

//----------------------------------------------------------------- ENTRY POINT

// Clean the console
process.stdout.write('\x1B[2J');
log('Initializing build system for: ' + FRAMEWORK_NAME);

// Check the given command line arguments
for (let argIndex = 0; argIndex < process.argv.length; argIndex++) {
	const arg = process.argv[argIndex]; let bo = options;
	if (!arg.startsWith('-')) continue; // Build parameters start with a dash
	switch (arg) {
		case '-h': case '--help': //Show the help message and quit
			function d(p) { return options[p]? 'Disable' : 'Enable'; }
			console.log('Build System commands:\n' +
				'  -b | --bundle :\t' + d('bundle') +  ' code bundling.\n'+
				'  -c | --clean :\t'+ d('clean') +  ' build folder cleaning.\n'+
				'  -d | --docs : \t'+ d('docs') +' documentation generation.\n'+
				'  -v | --verbose :\t' + d('verbose') + ' verbose mode\n' +
				'  -w | --watch :\t' + d('watch') +  ' watch mode\n');
			process.exit(0); // Quit
			break;
		case '-b': case '--build':		bo.build = !bo.build;		break;
		case '-c': case '--clean':		bo.clean = !bo.clean;		break;
		case '-d': case '--doc':		bo.docs = !bo.docs;			break;
		case '-v': case '--verbose':	bo.verbose = !bo.verbose;	break;
		case '-w': case '--watch':		bo.watch = !bo.watch;		break;
	}
}

// Clean the building folder
if (options.clean) {
	log('Cleaning ' + BUILDS_FOLDER_PATH);
	checkFolderStructure(BUILDS_FOLDER_PATH);
	cleanFolder(BUILDS_FOLDER_PATH);
} 

// Start the building process
if(!options.build) { log('The build process has been stopped.'); return; }
try {
	// Build the codebase
	codebase.build();

	// Build the documentation
	if (options.docs) documentation.build();

	// Build the output files
	distributables.build(); 

}
catch (e) { // If there is any error, show a message
	log('The build process has been stopped.'); 
	console.log(e); process.exit(1);
}

// Start watching the source file folder for changes
if (options.watch) {
	log('Watching changes in Folder: "' + SOURCES_FOLDER_PATH + '"\n' +
		'(Press CTRL+C to Stop)');
	let lastWatchModeTime = Date.now();
	let watchFiles = [], watchInterval = 1000, refreshInterval = 10000;

	// Check the ist of files to process each second
	setInterval(function(){
		if(watchFiles.length == 0) return;

		// Refresh the console message if 10 seconds pass since the last event
		let currentWatchModeTime = Date.now();
		if ((currentWatchModeTime - lastWatchModeTime) > refreshInterval) {
			console.clear(); process.stdout.write('\x1B[2J');
			log('Watching changes in Folder: ' + SOURCES_FOLDER_PATH);
			log('(Press CTRL+C to Stop)');
		}
		lastWatchModeTime = currentWatchModeTime;

		// Try to build only the files that have been updated
		maxLogLevel = 1;
		try { distributables.build({files: watchFiles}); }
		catch (e) { console.error('...But the Watch process is still active.');}
		maxLogLevel = 100;

		// Show a message on console
		console.log('Updated files: ' +  watchFiles.join(', '));

		// Clean the list of files to process
		watchFiles = [];
	}, watchInterval);

	// Start watching the sources folder recursively
	fs.watch(SOURCES_FOLDER_PATH, {recursive: true}, (eventType, filePath) => {

		// Check the file path
		filePath = SOURCES_FOLDER_PATH + '\\' + filePath;
		if (fs.statSync(filePath).isDirectory()) {
			// TODO remove files and  folders when they are removed or renamed
		} else {
			if (eventType == 'change') {
				if (!watchFiles.includes(filePath)) watchFiles.push(filePath);
			}
		}
	});
}

// Otherwise, just show a message and exit
else log('Build Process Complete');

