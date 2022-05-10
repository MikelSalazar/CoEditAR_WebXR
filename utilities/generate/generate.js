/******************************************************************************
	CoEditAR WebXR Data Model Generator
		This NodeJS script generates the data model code files.
******************************************************************************/

'use strict'  // Make sure that we are working on strict mode

// ------------------------------------------------------------- NODEJS MODULES

const fs = require('fs'), 						// File System access
	path = require('path');						// File Path handling

// ----------------------------------------------------------- GLOBAL CONSTANTS

global.MAIN_NAMESPACE = 'CoEditAR';
global.MAIN_FILENAME = 'coeditar';
global.WEBSITE = 'https://coeditar.org';
global.SCHEMA_URL = WEBSITE + '/schema/' + MAIN_FILENAME + '.schema.json';;
global.PROJECT_FOLDER_PATH = path.resolve(__dirname, '..\\..\\..\\') + '\\';
global.SCHEMA_FOLDER_PATH = PROJECT_FOLDER_PATH + 'documentation\\schemas\\';
global.SCHEMA_FILES_FOLDER_PATH = SCHEMA_FOLDER_PATH + 'files\\';
global.BUNDLE_SCHEMA_PATH = SCHEMA_FOLDER_PATH + MAIN_FILENAME + '.schema.json';
global.ROOT_SCHEMA_FILE_PATH = SCHEMA_FILES_FOLDER_PATH + 'root.schema.json';
global.DATA_NODE_FILE_PATH = PROJECT_FOLDER_PATH + 'sources\\data\\Node.ts';
global.DATA_MODEL_FOLDER_PATH = PROJECT_FOLDER_PATH + 'sources\\data\\model\\';
global.text = "utf8";


// ----------------------------------------------------------- GLOBAL VARIABLES

/** The list of schema files already detected. */
let schemas = {};
let schemaFilePaths = [];
let dataModelFilePaths = [];


//------------------------------------------------------------ GLOBAL FUNCTIONS

/** Reads a JSON schema file.
 * @param filePath The path to the JSON schema file. */
function readSchemaFile(filePath) {

	// Operate with relative paths
	let relativePath = path.relative(SCHEMA_FILES_FOLDER_PATH, filePath);

	// Check if the file has already been read, and if so, move it 
	// (and its references) to the end of the list.
	if (schemaFilePaths.includes(relativePath)) {
		let movedItems = [];
		function moveToEndList(item) { 
			if(movedItems.includes(item)) return; else movedItems.push(item);
			schemaFilePaths.splice(schemaFilePaths.indexOf(item), 1);
			schemaFilePaths.push(item);
			for(let reference of schemas[item].references)
				if(reference != item) moveToEndList(reference);
		}
		moveToEndList(relativePath);
		return;
	} else schemaFilePaths.push(relativePath);

	// Read and parse the file data
	console.log('\t\tReading: ' + relativePath);	
	let fileData = fs.readFileSync(path.join(filePath), text);
	let schemaData = JSON.parse(fileData);

	// Add the data to the collection
	if (!schemaData.title) throw Error("No 'title' property defined");
	let schema = schemas[relativePath] = { name: schemaData.title.toLowerCase(),
		data: schemaData, references: [] };

	// Iteratively detect references to other files
	let items = [schemaData];
	while (items.length > 0) {
		let item = items.shift(), reference = item.$ref;
		if (reference) {
			reference = path.join(path.dirname(filePath), reference);
			if (reference != filePath) readSchemaFile(reference);
			item.$ref = path.relative(SCHEMA_FILES_FOLDER_PATH, reference);
			if (!schema.references.includes(item.$ref) && reference != filePath)
				schema.references.push(item.$ref);
		}
		for (let k in item) if (typeof item[k]=="object") items.push(item[k]);
	}
}



/** Generates the bundle schema file.
 * @param filePath The path to the JSON schema file. */
function generateBundleSchemaFile(filePath) {
	
	// Create the basic JSON Schema data
	let data = {
		$id: SCHEMA_URL,
		$schema: "http://json-schema.org/draft-07/schema",
		title:  MAIN_NAMESPACE + " JSON Schema",
		description: "The JSON schema of the " + MAIN_NAMESPACE + " framework files.",
		allOf: [{ "$ref": "#/definitions/root" } ],
	};

	// Create the definitions
	data.definitions = {};
	let schemaIndex, schemaCount = schemaFilePaths.length;
	for (schemaIndex = 0; schemaIndex < schemaCount; schemaIndex++) {
		let schemaFilePath = schemaFilePaths[schemaIndex];
		let schema = schemas[schemaFilePath];
		let schemaData =  Object.assign({}, schema.data);
		data.definitions[schema.name] = schemaData;

		// Remove the $id and $schema properties
		schemaData.$id = undefined;	schemaData.$schema = undefined;

		// Solve inner references
		let items = [schemaData];
		while (items.length > 0) {
			let item = items.shift();
			if (item.$ref && schemas[item.$ref]) 
				item.$ref = "#/definitions/" + schemas[item.$ref].name;
			for (let k in item) if(typeof item[k]=="object")items.push(item[k]);
		}
	}

	// Create the file data
	let fileData = JSON.stringify(data, null, '\t');

	// Try to reduce the number of lines by compressing "leaf" objects and 
	// arrays (within a 80 char limit)
	let lines = fileData.split('\n');
	let comb = "", startIndex = -1, startChar = null;
	for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
		let line = lines[lineIndex], li = line.trim(), 
			firstChar = li[0], lastChar = li[li.length-1];
		
		// Find the char that starts the definition array or an object
		if (((lastChar == '{') || (lastChar == '[')) && lastChar != startChar) {
			startChar = lastChar; startIndex = lineIndex; comb = line; continue;
		}
		
		// Skip until an open char has been found
		if (!startChar) continue;
		
		// Combine the lines until now
		comb += ((comb[comb.length-1]!= ' ')?' ':'') + li;

		// If the size of the line exceeds the size limit, try the next line
		if (comb.replace(/\t/g,'    ').length > 80) {
			lineIndex = startIndex + 1; startChar = null; continue;
		}

		// Continue combining until the end of the definition
		if ((firstChar == '}' && startChar == '{') || 
			(firstChar == ']' && startChar == '[')) {
			lines.splice(startIndex + 1, lineIndex - startIndex);
			lines[startIndex] = comb; lineIndex = 0; startIndex = -1;
		}
	
	}
	fileData = lines.join('\n');

	// Write the bundle schema file
	console.log('\t\tWriting: ' + path.relative(SCHEMA_FOLDER_PATH, filePath));	
	fs.writeFileSync(filePath, fileData, text);
}


/** Generates the data model files. */
function generateDataModelFiles() {


	function createSectionComment(text) {
		return '\n\t// ' + '-'.repeat(71 - text.length) + ' ' + text + '\n\n';
	}

	for(let schemaID in schemas) {
		let schema = schemas[schemaID];
		let fileName = schema.name + ".ts", 
			filePath = DATA_MODEL_FOLDER_PATH + fileName;

		let fileData = "";
		let className = schema.data.title

		// Get the references
		let references = [DATA_NODE_FILE_PATH];
		for (let reference of schema.references) 
			references.push(path.join(DATA_MODEL_FOLDER_PATH, 
				path.dirname(reference), schemas[reference].data.title));

		// Get the properties
		let properties = [];
		for (let propertyId in schema.data.properties) {
			let p = schema.data.properties[propertyId];
			let property = {name: propertyId, description: p.description,
				type: "Node"};
			if (p["$ref"]) property.type = schemas[p["$ref"]].data.title;
			if (p.type) {
				switch (p.type) {
					case "number": property.type = "Number"; break;
					case "string": property.type = "String"; break;
					case "array": property.type = "Node[]"; break;
				}
			}
			properties.push(property);
		}
		let hasProperties = (properties.length > 0);

		// Write the imports
		for (let reference of references) {
			let referenceName = path.parse(reference).name, referencePath = 
				path.relative(path.dirname(filePath), path.dirname(reference));
			if (referencePath.length == 0) referencePath = '.';
			fileData += 'import { ' + referenceName + ' } from "' + 
				 referencePath + '/' + referenceName + '"\n';
			}

		// Start the class declaration
		fileData += "\n/** " + schema.data.description + " */\n";
		fileData += "export class " + className + " extends Node {\n";

		// Create the private fields
		if (hasProperties) fileData += createSectionComment('PRIVATE FIELDS');
		for (let property of properties)
			fileData += "\t/** " + property.description + " */\n" +
				"\tprivate _" + property.name + ": " +  property.type +";\n\n"
		
		// Create the public properties (getters and setters)
		if (hasProperties) fileData += createSectionComment('PUBLIC PROPERTIES');
		for (let property of properties)
			fileData += "\t/** " + property.description + " */\n" +
				"\tget " + property.name + "(): " +  property.type +
				"{ return this._" + property.name + "; }\n\n"

		// Create the constructor
		fileData += createSectionComment('PUBLIC CONSTRUCTOR');
		fileData += "\t/** Initializes a new " + className + " instance.\n" +
			"\t * @param data The initialization data. */\n" +
			"\tconstructor(name: string, parent?: Node, data: any = {}) {\n\n" +
			"\t\t// Call the base class constructor\n"+
			"\t\tsuper(\"" + schema.name + "\", name, parent, data);\n\n";
		
		// Initialize the child Nodes
		if (hasProperties) fileData += "\t\t// Create the child nodes\n";
		for (let property of properties)
			fileData += "\t\tthis._" + property.name + 
				" = new " + property.type + "(\"" + 
				property.name + "\", this);\n";

		// Close the constructor and class declaration
		fileData += "\t}\n}\n";

		// Write the source code file
		console.log("\t\tWriting: " + fileName);
		fs.writeFileSync(filePath, fileData, text);
		dataModelFilePaths.push(filePath);
	}
}

/** Recursively cleans a folder.
 * @param folderPath The path to the folder. 
 * @param excludePaths A list of paths to skip.
 * @param {*} startFolderPath The starting folder path.
 * @returns The number of files deleted.*/
 function cleanFolder(folderPath, excludePaths, startFolderPath = folderPath) {
	
	// Make sure the path is a folder
	if (!fs.lstatSync(folderPath).isDirectory()) return;
	
	// Check every path in the folder
	let fileNames = fs.readdirSync(folderPath), deletedFileCount = 0;
	for (let fileName of fileNames) {
		let filePath = folderPath + fileName;

		// Exclude the files contained in the array
		if (excludePaths && excludePaths.includes(filePath)) continue;
		
		// If the file path is valid, remove it
		if (fs.lstatSync(filePath).isFile()) {
			console.log("\t\tDeleting: " + 
				path.relative(startFolderPath, filePath));
			fs.unlinkSync(filePath);
			deletedFileCount++;
		} else deletedFileCount += cleanFolder(filePath + "\\",
			excludePaths, startFolderPath);
	}

	// If no files were deleted, show a message
	if (startFolderPath == folderPath && deletedFileCount == 0)
		console.log("\t\tNo files needed to be deleted.")

	// Return the number of files deleted in the folder
	return deletedFileCount;
}


//----------------------------------------------------------------- ENTRY POINT

// Clean the console
process.stdout.write('\x1B[2J');
console.log('Initializing Code Generator:');

// Read the schema files
console.log('\tReading schema files:');
readSchemaFile(ROOT_SCHEMA_FILE_PATH);

// Generating the data model code files
console.log('\tGenerating the data model files:');
generateDataModelFiles(BUNDLE_SCHEMA_PATH);

// Bundle the schema files into a single one
console.log('\tWriting bundle schema file:');
generateBundleSchemaFile(BUNDLE_SCHEMA_PATH);

// Generating the data model code files
console.log('\tClearing the data model folder:');
cleanFolder(DATA_MODEL_FOLDER_PATH, dataModelFilePaths);

// Properly end the execution of the script
console.log('ALL DONE'); process.exit(0);