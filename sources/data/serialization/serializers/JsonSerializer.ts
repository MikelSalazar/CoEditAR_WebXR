import { Serializer } from "../Serializer";
import { Serializable } from "../Serializable";

/** Facilitates the serialization/Deserialization of JSON data. */
export class JsonSerializer extends Serializer {

	// ------------------------------------------------------ PUBLIC PROPERTIES

	/** Whether to minify the  json. */
	get minify(): boolean { return this.params.minify; }
	set minify (value: boolean) { this.params.minify = (value == true); }
	
	/** Whether to serialize to be in a single text line ort not. */
	get multiline(): boolean { return this.params.multiline; }
	set multiline (value: boolean) { this.params.multiline = (value == true); }

	/** The maximum size of the line. */
	get maxLineSize(): number { return this.params.maxLineSize; }
	set maxLineSize (value: number) { this.params.maxLineSize = value; }

	/** The string to use for the tabulation. */
	get separator(): string { return this.params.separator; }
	set separator (value: string) { this.params.separator = value; }

	/** The string to use for the tabulation. */
	get tabString(): string { return this.params.tabString; }
	set tabString (value: string) { this.params.tabString = value; }

	/** The size of string to use for the tabulation. */
	get tabSize(): number { return this.params.tabSize; }
	set tabSize (value: number) { this.params.tabSize = value; }


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new instance of the Serializer class.
	 * @param params The serialization parameters. */
	constructor(params: Record<string, any> = {}) { 
	
		// Call the base class constructor
		super(params);

		// Check the current parameters
		this.minify = params.minify != undefined? params.minify : false;
		this.multiline = params.multiline != undefined? params.multiline : true;
		this.maxLineSize = params.maxLineSize != undefined? 
			params.maxLineSize : 80;
		this.separator = params.separator != undefined? params.separator : ' ';
		this.tabString = params.tabString != undefined? params.tabString : '\t';
		this.tabSize = params.tabSize != undefined? params.tabSize : 4;
	}


	// --------------------------------------------------------- PUBLIC METHODS

	/** Translates a data item to a JSON string.
	 * @param data The data item to serialize.
 	 * @param params The serialization parameters.
	 * @returns The JSON string representing the data item. */
	serialize(data: any, params: any = {}) : string {
			
		// // Check if the data is a serializable object
		// if (data instanceof Serializable) data = data.serialize();

		// Create the necessary variables for the serialization

		// Create a node and save its 
		return this.serializeNode(null, data, params).string;
	}


	/** Serializes a data item to a JSON node.
	 * @param name The name of the JSON node.
	 * @param data The data item to serialize. 
	 * @param params The serialization parameters.
	 * @returns The generated JSON node representing the data item. */
	serializeNode(name?: string, data: any = undefined, params: any = {}): any {
	
		// Get the serialization parameters

		let minify = params.minify || this.minify,
			separator = params.separator || (minify)? '' : this.separator, 
			itemSeparator =  params.itemSeparator || ',', 
			newLine = params.newLine ||  (minify)? '' : '\n',
			tabString = params.tabString || (minify)? '' : this.tabString, 
			tabSize = params.tabSize || (minify)? 0 :  this.tabSize,
			tabLevel = params.tabLevel || 0;

		// Create a copy of the params, with an increased tabulation level
		let itemParams = { ...params }; itemParams.tabLevel = tabLevel + 1

		// Start defining the structure of the node
		let node: any = { name: name, items: [], 
			type: (Array.isArray(data)? 'array' : typeof data),
			string: (name? '"' + name + '":' + separator : ''),
			multiline: false, separator: itemSeparator
		};

		// If the value is null, return a null node
		if (data == null) { node.string = 'null'; return node; }

		// Check the type of the value
		node.type = (Array.isArray(data))? 'array' : typeof data;
		switch (node.type) {
			case 'boolean': node.string += data? 'true' : 'false'; break;
			case 'bigint': node.string += data + 'n'; break; 
			case 'number': node.string += data; break;
			case 'string': // Strings require a bit of care
				node.string += '"' + data.replace(/\"/g, '\\"') + '"';
			break;
			case 'array': // Arrays
				node.start = '[', node.end = ']';
				for (let item of data) node.items.push(
					this.serializeNode(undefined, item, itemParams));
			break;
			case 'object': 
				if (data.type == 'comment' ) {
					node.string = '// ' + data.text; 
					node.separator = ''; node.multiline = true;
					break;
				}
				node.start = '{', node.end = '}';
				for (let itemName in data)	node.items.push(
					this.serializeNode(itemName, data[itemName], itemParams));
			break;
			// TODO Add additional types of values
		}

		// If it is not a complex object, just return the node as it is
		if (node.items.length == 0) return node;

		// Check if the inner nodes are already in multiple lines
		let line = '', lineSize = 0, 
			itemIndex, itemCount = node.items.length;
		for (itemIndex = 0; itemIndex < itemCount; itemIndex++) {
			if (node.items[itemIndex].multiline == true) {
				node.multiline = true; break;
			}
		}

		// If it is an array or an object, try to keep it in a single line
		if (node.multiline == false || this.multiline == false) {
			line = node.start;
			for (itemIndex = 0; itemIndex < itemCount; itemIndex++) {
				let item = node.items[itemIndex];
				line += separator + item.string;
				if (itemIndex < itemCount - 1) line += item.separator;
			}
			line += separator + node.end;
			lineSize = tabLevel + tabSize + line.length;
			node.multiline = lineSize > this.maxLineSize
		}

		// Check if the element must be made into multiple lines 
		if (this.multiline && node.multiline) {
			node.string = node.string +	node.start + newLine;
			for (itemIndex = 0; itemIndex < itemCount; itemIndex++) {
				let item = node.items[itemIndex];
				node.string += tabString.repeat(tabLevel + 1) + item.string;
				if (itemIndex < itemCount-1) node.string += item.separator;
				node.string += newLine;
			}
			node.string += tabString.repeat(tabLevel) + node.end;
			node.multiline = true;
		}
		// Otherwise, just add the created line
		else node.string += line;
	
		// Return the resulting node
		return node;
	}

	/** Translates a JSON string to a data item.
	 * @param jsonString The JSON string with the data of the item.
	 * @returns The JSON string representing the data item. */
	deserialize(jsonString: string) : any {
		
		// Use the internal methods for now
		let data = {}; // JSON.parse(jsonString);




		// Return the JSON data
		return data;
	}


	/** Translates a data item to a JSON string.
	 * @param data The data item to translate.
	 * @param params The serialization parameters.
	 * @returns The JSON string representing the data item. */
	static serialize(data: any, params?: Record<string, any>)  : string {
		return new JsonSerializer(params).serialize(data);
	}


	/** Translates a JSON string to a data item.
	* @param jsonString The JSON string with the data of the item.
	* @param params The serialization parameters.
	* @returns The JSON string representing the data item. */
	static deserialize(jsonString: string, params?: Record<string, any>) : any {
		return new JsonSerializer(params).deserialize(jsonString);
	}
}