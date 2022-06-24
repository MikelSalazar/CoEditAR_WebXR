/******************************************************************************
	CoEditAR WebXR Data Model Generator
		This NodeJS script generates the data model code files.
******************************************************************************/

'use strict'  // Make sure that we are working on strict mode

// ------------------------------------------------------------- NODEJS MODULES

const fs = require('fs'), 						// File System access
	path = require('path');						// File Path handling

// ----------------------------------------------------------- GLOBAL CONSTANTS

const MAIN_NAMESPACE = 'CoEditAR';
const MAIN_FILENAME = 'coeditar';
const WEBSITE = 'https://coeditar.org';
const SCHEMA_URL = WEBSITE + '\\schema\\' + MAIN_FILENAME + '.schema.json';;
const PROJECT_FOLDER_PATH = path.resolve(__dirname, '..\\..\\') + '\\';
const SCHEMA_FOLDER_PATH = PROJECT_FOLDER_PATH + '..\\..\\documentation\\schema\\';
const BUNDLE_SCHEMA_PATH = SCHEMA_FOLDER_PATH + MAIN_FILENAME + '.schema.json';
const SOURCES_FOLDER_PATH = PROJECT_FOLDER_PATH + 'sources\\';
const DATA_FOLDER_PATH = SOURCES_FOLDER_PATH + 'data\\';
const DATA_NODE_FILE_PATH = DATA_FOLDER_PATH + 'Node.ts';
const DATA_NODE_SET_FILE_PATH = DATA_FOLDER_PATH + 'NodeSet.ts';
const DATA_MODEL_FOLDER_PATH = DATA_FOLDER_PATH + 'model\\';
const text = "utf8";


// ----------------------------------------------------------- GLOBAL VARIABLES

/** The list of schema files already detected. */
let schemas = {};
let schemaFilePaths = [];
let dataModelFilePaths = [];


//------------------------------------------------------------ GLOBAL FUNCTIONS

/** Calculates the relative path between two absolute paths.
 * @param from The origin path.
 * @param to The destination path.
 * @returns The relative path. */
 function relativePath(from,to) {
	return path.relative(from,to).replace(/\\/g,'/');
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
		} else deletedFileCount += cleanFolder(filePath + "/",
			excludePaths, startFolderPath);
	}

	// If no files were deleted, show a message
	if (startFolderPath == folderPath && deletedFileCount == 0)
		console.log("\t\tNo files needed to be deleted.")

	// Return the number of files deleted in the folder
	return deletedFileCount;
}


/** Reads the JSON schema file.
 * @param filePath The path to the JSON schema file. */
function readSchemaFile(filePath) {

	// Read the file
	let relativePath = path.relative(SCHEMA_FOLDER_PATH, filePath);
	console.log('\t\tReading: ' + relativePath);	
	let fileData = fs.readFileSync(path.join(filePath), text);
	let schemaData = JSON.parse(fileData);

	// Read the schema definitions
	schemas = schemaData.definitions;
}


/** Generates the data model files. */
function generateDataModelFiles() {

	// Create several utility functions
	function createSectionComment(text) {
		return '\n\t// ' + '-'.repeat(71 - text.length) + ' ' + text + '\n\n';
	}
	function addImport(name, filepath) {
		imports.push([name],filepath)
	}

	// Check schema by schema
	for(let schemaName in schemas) {
		let schema = schemas[schemaName];

		// Exclude the schemas outside the data model
		let relativeFilePath = schema["$comment"];
		if (!relativeFilePath || relativeFilePath.length == 0) continue;
		if (!relativeFilePath.startsWith("data/model")) continue;

		// Create the filename
		let className = schema.title;
		let fileName = className + ".ts", fileData = "",
			filePath = DATA_MODEL_FOLDER_PATH + fileName;

		// Get the import and the properties
		let imports = {}, properties = [];
		imports.Type = DATA_FOLDER_PATH + "Type";
		imports.MetaType = DATA_FOLDER_PATH + "MetaType";
		for (let propertyName in schema.properties) {
			let p = schema.properties[propertyName];
			let property = {name: propertyName, description: p.description,
		 		type: "Node", subtype: null};
			switch (p.type) {
				case "number": property.type = "Number"; 
					imports.Number= DATA_FOLDER_PATH + "types/simple/Number";
				break;
				case "string": property.type = "String"; 
					imports.String = DATA_FOLDER_PATH + "types/simple/String";
				break;
			}

			let ref = p["$ref"];
			if (!ref && p["allOf"]) ref = p["allOf"][0]["$ref"];
			if (ref) {
				ref = ref.slice(ref.lastIndexOf("/") + 1);
				let refSchema = schemas[ref];
				if (p["allOf"]) {
					imports.NodeSet = DATA_FOLDER_PATH + "NodeSet";
					property.type = "NodeSet<" + refSchema.title + ">"
					property.subtype = refSchema.title;
				}
				else property.type = refSchema.title;
				if (refSchema["$comment"]) imports[refSchema.title] = 
					SOURCES_FOLDER_PATH + refSchema["$comment"];
			}
				
			properties.push(property);
		}
		let hasProperties = (properties.length > 0);

		// Write the imports
		let dirPath = path.dirname(filePath);
		for (let importName in imports) {
			let importPath = imports[importName];
			importPath = relativePath(dirPath, importPath) ;
			if (importPath.length == 0) importPath = '.';
			if (importPath.startsWith('/')) importPath = '.' + importPath;
			else if (!importPath.startsWith('.')) importPath = './' + importPath;
			fileData += 'import { ' + importName + ' } from "' + importPath + '"\n';
		}

		// Start the class declaration
		fileData += "\n/** " + schema.description + " */\n";
		fileData += "export class " + className + " extends Type {\n";

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
				" { return this._" + property.name + "; }\n\n"

		// Create the constructor
		fileData += createSectionComment('PUBLIC CONSTRUCTOR');
		fileData += "\t/** Initializes a new " + className + " instance.\n" +
			"\t * @param name The name of the data type.\n" +
			"\t * @param name The parent data type.\n" +
			"\t * @param data The initialization data. */\n" +
			"\tconstructor(name: string, parent?: Type, data: any = {}) {\n" +
			"\n\t\t// Call the base class constructor\n"+
			"\t\tsuper(name, parent, data, new MetaType(\"" + schemaName + "\"));\n";
		
		// Initialize the child Nodes
		if (hasProperties) fileData += "\n\t\t// Create the child nodes\n";
		for (let property of properties)
			fileData += "\t\tthis._" + property.name + " = new " + 
				property.type + "(\"" + property.name + "\", this" +
				((property.subtype)? (", " + property.subtype) : "") + ");\n";

		// Deserialization
		fileData += "\n\t\t// Deserialize the initialization data\n" +
					"\t\tif (data) this.deserialize(data);\n";

		// Close the constructor and class declaration
		fileData += "\t}\n}\n";

		// Write the source code file
		console.log("\t\tWriting: " + fileName);
		fs.writeFileSync(filePath, fileData, text);
		dataModelFilePaths.push(filePath);
	}
}



//----------------------------------------------------------------- ENTRY POINT

// Clean the console
process.stdout.write('\x1B[2J');
console.log('Initializing Code Generator:');

// Read the schema files
console.log('\tReading schema files:');
readSchemaFile(BUNDLE_SCHEMA_PATH);

// Generating the data model code files
console.log('\tClearing the data model folder:');
cleanFolder(DATA_MODEL_FOLDER_PATH, dataModelFilePaths);

// Generating the data model code files
console.log('\tGenerating the data model files:');
generateDataModelFiles();

// Properly end the execution of the script
console.log('ALL DONE'); process.exit(0);