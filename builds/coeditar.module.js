

/** Defines the semantic metadata of a object instance (Individual). */
export class Instance {


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new instance.
	 * @param classEx The class expression of the instance.
	 * @param data The initialization data. */
	constructor(classEx, data) {

		// Initialize the metadata for this instance
		this._metadata = new Metadata(this);
		Object.defineProperty(this, "_metadata", { enumerable: false });

		// Store the classes of the instance and add this instance to them
		let classes = [];
		if (typeof classEx == "string") {

			let c = Domain.default.classes[classEx];
			if (c)
				classes.push(c);

			else
				throw Error('Unknown class "' + classEx + '"');
		}
		for (let c of classes) {
			if (!c || !c.isClass)
				throw Error("Invalid class to instantiate");
			this._metadata.classes.push(c);
		}

		// Instantiate the classes (adding the properties to the class)
		for (let c of this._metadata.classes)
			c.instantiate(this);

		// If there is any initialization data, deserialize it
		this.deserialize(data);
	}


	// ------------------------------------------------------- PUBLIC ACCESSORS

	/** The metadata of the instance. */
	get metadata() { return this._metadata; }

	// --------------------------------------------------------- PUBLIC METHODS


	/** Deserializes the instance.
	 * @param data The data to deserialize. */
	deserialize(data) {

		// Show a debug message on the console
		console.log("Deserializing Instance");

		// First, check that the required properties are defined
		for (let requiredProperty of this.metadata.required)
			if ((!data || !data[requiredProperty]))
				throw new Error('Required property not defined: "' + requiredProperty + '"');

		function createProperty(instance, name, property) {
			Object.defineProperty(instance, name, {
				enumerable: true,
				get: () => { return property.value; },
				set: (v) => { property.value = v; }
			});
		}

		// Create the properties defined in the metadata
		for (let propertyName in this._metadata.properties) {
			let property = this._metadata.properties[propertyName];
			createProperty(this, propertyName, property);
		}

		// Create the Javascript properties of the object
		// let propertyDescriptors : any = {};
		// for (let itemName in data) {
		// 	let item = data[itemName], type = typeof item;
		// 	let propertyDescriptor: any = {};
		// 	switch(type) {
		// 		case "boolean": case "number": case "bigint": case "string":
		// 			propertyDescriptor.value = item;
		// 			break;
		// 		case "object":
		// 			// TODO recursively deserialize objects
		// 			break;
		// 	}
		// 	if (type == "object") {	}
		// 	propertyDescriptors[itemName] = propertyDescriptor;
		// }

	}


	/** Serializes the instance.
	* @param params The serialization parameters.
	* @param data Additional data to include in the serialized object.
	* @return The serialized data. */
	serialize(params, data = {}) {

		// Add each property
		for (let propertyName in this.metadata.properties) {
			let property = this.metadata.properties[propertyName];
			let propertyData = property.value;
			if (Array.isArray(propertyData)) {
				data[propertyName] = [];
				for (let item of propertyData)
					data[propertyName].push(item.serialize());
			}
			else if (typeof (propertyData) == "object")
				data[propertyName] = propertyData.serialize();
			else
				data[propertyName] = propertyData;
		}

		// If there are serialization parameters language, use them
		if (params)
			return Serialization.serialize(params, data);

		// Otherwise, just return the object
		return data;
	}

	/** Destroys the instance.
	 * @param propagate Indicates whether to propagate the destruction through
	 * relations or not.*/
	destroy(propagate = true) { }
}






/** Defines a basic node (in a hierarchical structure). */
export class Node extends Instance {



	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new instance of the Node class.
	 * @param type The type of the node.
	 * @param name The name of the node.
	 * @param link The node link.
	 * @param data The initialization data. */
	constructor(type, name, link, data) {

		// Call the base class constructor without the data.
		super(type);

		// Check the given name
		if (!name && data)
			name = data.name;
		if (!name)
			throw Error('No name provided for node');
		if (!Serialization.isName(name))
			throw Error('Invalid node name: "' + name + '"');

		// TODO check the name on the parent
		this._name = name;

		if (type != undefined) {
			if (typeof type == "string") {
				//TODO get Class via name
			}

			else
				this._class = type;
		}


		// Create the node links
		this._links = {};
		this._parent = this._links.parent = new Link("parent", undefined, this, (link) ? [link.source] : undefined, "children", undefined, 0, 1);
		this._children = this._links.children = new Link("children", undefined, this, [], "parent");

		// If there is a node link, create a link
		if (link) {
			link.add(this);
			this._parent.add(link.source);
		}

		// If there is any initialization data, deserialize it
		this.deserialize(data);
	}


	// ------------------------------------------------------- PUBLIC ACCESSORS

	/** The name of the node. */
	get name() { return this._name; }

	/** The class of the node. */
	get class() { return this._class; }

	/** The parent node. */
	get parent() { return this._parent.target; }

	/** Get the unique id of the node. */
	get id() {
		return (this._parent.target ? this._parent.target.id : "") + this._name;
	}

	/** The child nodes. */
	get children() { return this._children; }

	/** Indicates if the Node has been updated or not. */
	get updated() { return this._updated; }
	set updated(value) {

		// Propagate "false" values upwards in the node hierarchy
		if (value == false && this.parent)
			this.parent.updated = false;

		// Apply the new value
		this._updated = value;
	}

	// --------------------------------------------------------- PUBLIC METHODS

	/** Deserializes the Node.
	 * @param data The data to deserialize. */
	deserialize(data) {

		// Show a debug message on the console
		console.log("Deserializing Node: " + this.id);

		console.log(this.class);


		Object.defineProperty(this, "test", { value: new BooleanNode("test", this.children) });
	}


	/** Serializes the Node.
	* @param data Additional data to include in the serialized object.
	* @return The serialized data. */
	serialize(data = {}) {

		// Save the name of the node
		data.name = this.name;

		// Add the children nodes
		if (this.children.cardinality > 0) {
			let childrenData = [];
			for (let child of this.children) {
				let childData = child.serialize();
				if (childData == undefined)
					continue;
				if (typeof childData == "object")
					childrenData.push(childData);
				else
					data[child.name] = childData;
			}
			if (childrenData.length > 0)
				data.children = childrenData;
		}

		// Return the serialized data
		return data;
	}


	/** Obtains a string representation of the type instance.
	 * @param mode The type of serialization: id (default), JSON.
	 * @returns The string representation of the node instance. */
	toString(mode) {
		switch (mode) {
			case "JSON": return JSON.stringify(this.serialize());
			default: return this.name;
		}
	}
}

// ------------------------------------------------------ SEMANTIC METADATA

/** The semantic metadata of the class. */
Node.class = new Class("Node", null, { implementation: Node });




/** Provides a basic interface to serialize/deserialize data. */
export class Serializable {

	// --------------------------------------------------------- PRIVATE FIELDS

	/** Deserializes the instance from a JSON representation.
	 * @param data The JSON data to deserialize. */
	deserialize(data) { }


	/** Serializes the instance to a JSON representation.
	* @param params The serialization parameters.
	* @param data Additional data to include in the serialized object.
	* @return The resulting JSON (schema) data. */
	serialize(params, data = {}) { }


	/** Converts the instance to a string representation.
	 * @param format The serialization parameters.
	 * @returns The string representation of the instance. */
	toString(params = "JSON") { return this.serialize(params); }
}



/** A basic class that describes the structure of Serializers. */
export class Serializer {


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new instance of the Serializer class.
	 * @param params The serialization parameters. */
	constructor(params = {}) { this.params = params; }


	// --------------------------------------------------------- PUBLIC METHODS

	/** Translates a data item to a stream of characters/bytes.
	 * @param data The data item to serialize.
	 * @returns The stream of characters/bytes representing the data item. */
	serialize(data) { }


	/** Translates a stream of characters/bytes to a data item.
	 * @param stream The stream of characters/bytes to deserialize.
	 * @returns The stream of characters/bytes representing the data item. */
	deserialize(stream) { }
}




/** Facilitates the serialization/Deserialization of JSON data. */
export class JsonSerializer extends Serializer {

	// ------------------------------------------------------ PUBLIC PROPERTIES

	/** Whether to minify the  json. */
	get minify() { return this.params.minify; }
	set minify(value) { this.params.minify = (value == true); }

	/** Whether to serialize to be in a single text line ort not. */
	get multiline() { return this.params.multiline; }
	set multiline(value) { this.params.multiline = (value == true); }

	/** The maximum size of the line. */
	get maxLineSize() { return this.params.maxLineSize; }
	set maxLineSize(value) { this.params.maxLineSize = value; }

	/** The string to use for the tabulation. */
	get separator() { return this.params.separator; }
	set separator(value) { this.params.separator = value; }

	/** The string to use for the tabulation. */
	get tabString() { return this.params.tabString; }
	set tabString(value) { this.params.tabString = value; }

	/** The size of string to use for the tabulation. */
	get tabSize() { return this.params.tabSize; }
	set tabSize(value) { this.params.tabSize = value; }


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new instance of the Serializer class.
	 * @param params The serialization parameters. */
	constructor(params = {}) {

		// Call the base class constructor
		super(params);

		// Check the current parameters
		this.minify = params.minify != undefined ? params.minify : false;
		this.multiline = params.multiline != undefined ? params.multiline : true;
		this.maxLineSize = params.maxLineSize != undefined ?
			params.maxLineSize : 80;
		this.separator = params.separator != undefined ? params.separator : ' ';
		this.tabString = params.tabString != undefined ? params.tabString : '\t';
		this.tabSize = params.tabSize != undefined ? params.tabSize : 4;
	}


	// --------------------------------------------------------- PUBLIC METHODS

	/** Translates a data item to a JSON string.
	 * @param data The data item to serialize.
	 * @param params The serialization parameters.
	 * @returns The JSON string representing the data item. */
	serialize(data, params = {}) {

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
	serializeNode(name, data = undefined, params = {}) {

		// Get the serialization parameters

		let minify = params.minify || this.minify, separator = params.separator || (minify) ? '' : this.separator, itemSeparator = params.itemSeparator || ',', newLine = params.newLine || (minify) ? '' : '\n', tabString = params.tabString || (minify) ? '' : this.tabString, tabSize = params.tabSize || (minify) ? 0 : this.tabSize, tabLevel = params.tabLevel || 0;

		// Create a copy of the params, with an increased tabulation level
		let itemParams = Object.assign({}, params);
		itemParams.tabLevel = tabLevel + 1;

		// Start defining the structure of the node
		let node = { name: name, items: [],
			type: (Array.isArray(data) ? 'array' : typeof data),
			string: (name ? '"' + name + '":' + separator : ''),
			multiline: false, separator: itemSeparator
		};

		// If the value is null, return a null node
		if (data == null) {
			node.string = 'null';
			return node;
		}

		// Check the type of the value
		node.type = (Array.isArray(data)) ? 'array' : typeof data;
		switch (node.type) {
			case 'boolean':
				node.string += data ? 'true' : 'false';
				break;
			case 'bigint':
				node.string += data + 'n';
				break;
			case 'number':
				node.string += data;
				break;
			case 'string': // Strings require a bit of care
				node.string += '"' + data.replace(/\"/g, '\\"') + '"';
				break;
			case 'array': // Arrays
				node.start = '[', node.end = ']';
				for (let item of data)
					node.items.push(this.serializeNode(undefined, item, itemParams));
				break;
			case 'object':
				if (data.type == 'comment') {
					node.string = '// ' + data.text;
					node.separator = '';
					node.multiline = true;
					break;
				}
				node.start = '{', node.end = '}';
				for (let itemName in data)
					node.items.push(this.serializeNode(itemName, data[itemName], itemParams));
				break;
			// TODO Add additional types of values
		}

		// If it is not a complex object, just return the node as it is
		if (node.items.length == 0)
			return node;

		// Check if the inner nodes are already in multiple lines
		let line = '', lineSize = 0, itemIndex, itemCount = node.items.length;
		for (itemIndex = 0; itemIndex < itemCount; itemIndex++) {
			if (node.items[itemIndex].multiline == true) {
				node.multiline = true;
				break;
			}
		}

		// If it is an array or an object, try to keep it in a single line
		if (node.multiline == false || this.multiline == false) {
			line = node.start;
			for (itemIndex = 0; itemIndex < itemCount; itemIndex++) {
				let item = node.items[itemIndex];
				line += separator + item.string;
				if (itemIndex < itemCount - 1)
					line += item.separator;
			}
			line += separator + node.end;
			lineSize = tabLevel + tabSize + line.length;
			node.multiline = lineSize > this.maxLineSize;
		}

		// Check if the element must be made into multiple lines 
		if (this.multiline && node.multiline) {
			node.string = node.string + node.start + newLine;
			for (itemIndex = 0; itemIndex < itemCount; itemIndex++) {
				let item = node.items[itemIndex];
				node.string += tabString.repeat(tabLevel + 1) + item.string;
				if (itemIndex < itemCount - 1)
					node.string += item.separator;
				node.string += newLine;
			}
			node.string += tabString.repeat(tabLevel) + node.end;
			node.multiline = true;
		}
		// Otherwise, just add the created line
		else
			node.string += line;

		// Return the resulting node
		return node;
	}

	/** Translates a JSON string to a data item.
	 * @param jsonString The JSON string with the data of the item.
	 * @returns The JSON string representing the data item. */
	deserialize(jsonString) {

		// Use the internal methods for now
		let data = {}; // JSON.parse(jsonString);




		// Return the JSON data
		return data;
	}


	/** Translates a data item to a JSON string.
	 * @param data The data item to translate.
	 * @param params The serialization parameters.
	 * @returns The JSON string representing the data item. */
	static serialize(data, params) {
		return new JsonSerializer(params).serialize(data);
	}


	/** Translates a JSON string to a data item.
	* @param jsonString The JSON string with the data of the item.
	* @param params The serialization parameters.
	* @returns The JSON string representing the data item. */
	static deserialize(jsonString, params) {
		return new JsonSerializer(params).deserialize(jsonString);
	}
}




/** A utility class that facilitates the (de)serialization process. */
export class Serialization {

	// --------------------------------------------------------- PUBLIC METHODS

	/** Checks if a character is a letter.
	 * @param char the character to validate.
	 * @returns validates */
	static isLetter(char) { return RegExp(/^\p{L}/, 'u').test(char); }


	/** Validates if a string is a valid name (a combination of letters,
	 * numbers and dashes, starting with a letter).
	 * @param name The name to validate.
	 * @param strict Whether to accept null or void names .
	 * @returns A boolean value with the result of the validation. */
	static isName(name, strict = true) {
		if (name == undefined || name == '')
			return !strict;
		if (typeof name != 'string')
			name = '' + name;
		return RegExp(/^\p{L}[\p{L}\p{N}_-]*$/, 'u').test(name);
	}


	/** Provides a way to more easily serialize data into different formats.
	 * @param data The data to serialize.
	 * @param params The serialization parameters.
	 * @returns The serialization result.*/
	static serialize(data = {}, params) {

		if (params == "JSON")
			return JsonSerializer.serialize(data);

		return data;
	}
}




/** Defines a localized string. */
export class LocalizedString {


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new instance of the LocalizedString class.
	 * @param name The name of the localized string.
	 * @param data The initialization data. */
	constructor(name, data) {

		// The name of the localized string (can be undefined)
		this._name = name;
		if (this._name && !Serialization.isName(this._name))
			throw Error('Invalid name "' + this._name + '" for LocalizedString');

		// Initialize the Record of values
		this._values = {};

		// Deserialize the given data
		if (data)
			this.deserialize(data);
	}


	// ------------------------------------------------------- PUBLIC ACCESSORS

	/** Indicates whether the localized string has values or not. */
	get isNull() { return Object.keys(this._values).length == 0; }

	/** The name of the localized string. */
	get name() { return this._name; }

	/** The current value of localized string. */
	get value() {
		let result = this._values[Locale.current.id];
		return (result != undefined) ? result : '[' + this._name + ']';
	}
	set value(v) {
		this._values[Locale.current.id] = v;
	}

	/** The locale ids of the localized string. */
	get locales() { return Object.keys(this._values); }


	/** Creates a copy of the LocalizedString instance.
	 * @returns The copy of the LocalizedString instance. */
	clone(name) {
		return new LocalizedString(name || this._name, this._values);
	}


	/** Deserializes the instance from a JSON representation.
	 * @param data The JSON data to deserialize. */
	deserialize(data) {
		if (!data)
			this._values = { null: "" };
		else if (typeof data == "string")
			this._values = { null: data };
		else if (typeof data == "object")
			for (let localeId in data)
				this.setValue(localeId, data[localeId]);
		else
			throw Error('Invalid value for LocalizeString "' + this._name +
				'": ' + JSON.stringify(data));
	}


	/** Serializes the instance to a JSON representation.
	* @param data Additional data to include in the serialized object.
	* @return The serialized JSON data. */
	serialize(data = {}) {
		for (let localeId in this._values)
			data[localeId] = this._values[localeId];
		return data;
	}


	/** Sets the value of the string for a particular Locale.
	 * @param locale The locale (or the locale id).
	 * @param value The new value (can be undefined). */
	setValue(locale, value) {
		if (!locale)
			locale = Locale.current;
		else if (typeof locale == 'string') {
			let id = locale;
			locale = Locale.instances[id];
			if (!locale)
				throw Error('Invalid Locale Id: "' + id + '"');
		}
		if (typeof value == "string")
			this._values[locale.id] = value;
		else
			throw Error('Invalid value for LocalizeString "' + this._name +
				'": ' + JSON.stringify(value));
		locale.strings[this._name] = this;
	}

	toString() { }
}



var _a;

/** Defines a simple way to store localization data. */
export class Locale {


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new instance of the Locale class.
	 * @param id The id of the locale.
	 * @param data The initialization data */
	constructor(id, data = {}) {

		/** The list of strings for this Locale. */
		this._strings = {};

		// Save the given values
		this._id = id;
		this._name = (id ? data.name : "default") || null;

		// Add this instance to the global list
		if (Locale._instances[id])
			throw Error('Repeated Locale ID: "' + id + '"');
		Locale._instances[id] = this;

		// Initialize the lists of strings
		this._strings = {};
	}


	// ------------------------------------------------------  PUBLIC ACCESSORS

	/** The global list of Locale instances. */
	static get instances() { return Locale._instances; }

	/** The default Locale instance. */
	static get default() { return Locale._default; }

	/** The current Locale instance. */
	static get current() { return Locale._current; }
	static set current(locale) {
		if (!locale)
			locale = this._default;
		else if (typeof locale == 'string') {
			let id = locale;
			locale = this.instances[id];
			if (!locale)
				throw Error('Invalid Locale Id: "' + id + '"');
		}
		Locale._current = locale;
	}

	/** The id of the Locale (recommended to use ISO 639-1 codes). */
	get id() { return this._id; }

	/** The name of the Locale. */
	get name() { return this._name; }

	/** The list of strings for the Locale. */
	get strings() { return this._strings; }
}
_a = Locale;

// --------------------------------------------------------- PRIVATE FIELDS

/** The global list of Locale instances. */
Locale._instances = {};

/** The default Locale instance. */
Locale._default = new Locale(null);

/** The current Locale instance. */
Locale._current = _a._default;



/** Defines a logic expression. */
export class Expression {
}



/** Defines a logic context (a logical expression). */
export class Context {

	// ------------------------------------------------------- PUBLIC ACCESSORS


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new instance of the Node class. */
	constructor() {

	}
}


/** Defines a logic event. */
export class Event {


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new Event instance.
	 * @param name The event name.
	 * @param owner The event owner.
	 * @param data The event data. */
	constructor(name, owner, data) {

		// Check the given name
		if (!name || name.length == 0)
			throw Error("Invalid event name");
		this._name = name;

		// Store the event owner
		this._owner = owner;
		this._data = data;

		// Initialize the list of listeners
		this._listeners = [];
	}


	// ------------------------------------------------------- PUBLIC ACCESSORS

	/** Identifies the object as an Event. */
	get isEvent() { return true; }

	/** The event name. */
	get name() { return this._name; }

	/** The event owner. */
	get owner() { return this._owner; }

	/** The event data. */
	get data() { return this._data; }

	/** The event listeners. */
	get listeners() { return this._listeners; }


	// --------------------------------------------------------- PUBLIC METHODS

	/** Adds a new listener for the event.
	 * @param listener The new listener function to add. */
	listen(listener) { this._listeners.push(listener); }


	/** Triggers the event.
	 * @param target The object that triggers the event.
	 * @param data Additional event data. */
	trigger(target, data) {
		for (let listener of this._listeners) {
			let captured = listener(this, target, data);
			if (captured)
				break; // If captured, stop broadcasting the event
		}
	}
}





/** Defines an semantic domain. Necessary to differentiate between classes
 * with the same name, but also useful to describe knowledge fields/domains
 * in a hierarchical (taxonomical) way. */
export class Domain {


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new instance of the Domain class.
	 * @param name The name of the domain.
	 * @param parent The parent (super)domain.
	 * @param data The initialization data. */
	constructor(name, parent, data) {

		/** The classes contained in this domain. */
		this._classes = {};

		/** The child subdomains. */
		this._children = {};

		// Store the name
		this._name = (data && data.name) ? data.name : name;
		if (!this._name)
			throw Error('No name provided for Domain');
		if (!Serialization.isName(this._name))
			throw Error('Invalid name "' + this._name + '" for a Domain');

		// Create the default values for the title and description
		this._title = new LocalizedString('DomainTitle' + this._name);
		this._description = new LocalizedString('DomainDescription' + this._name);

		// Create the hierarchical link
		if (parent) {
			this._parent = parent;
			parent._children[name] = this;
		}

		// Add the domain to the list (using the complete Id)
		if (Domain.list[this.id])
			throw Error('Domain "' + this._name + '" ' +
				'already exists' + (parent ? ' in domain "' + parent.id + '"' : ''));
		Domain.list[this.id] = this;

		// If there is any initialization data, deserialize it
		if (data)
			this.deserialize(data);
	}


	// ------------------------------------------------------- PUBLIC ACCESSORS

	/** Marks the Domain instance. */
	get isDomain() { return true; }

	/** The name of the domain (in the parent domain). */
	get name() { return this._name; }

	/** The title of the domain. */
	get title() { return this._title; }

	/** The description of the domain. */
	get description() { return this._description; }

	/** The parent (super)domain. */
	get parent() { return this._parent; }

	/** The child (sub)domains. */
	get children() { return this._children; }

	/** The unique ID of the domain (including the ids of the super-domains). */
	get id() {
		return (this._parent ? this._parent.id + "/" : "") + this._name;
	}

	/** The classes contained in this domain. */
	get classes() { return this._classes; }


	// --------------------------------------------------------- PUBLIC METHODS


	/** Deserializes the Class from a JSON Schema object.
	 * @param data The schema data to deserialize. */
	deserialize(data) {

		// Check if there is data to deserialize
		if (!data || typeof data != 'object')
			return;

		// Deserialize the title and description
		if (data.title)
			this._description.deserialize(data.title);
		if (data.description)
			this._description.deserialize(data.description);
	}


	/** Serializes the Domain instance.
	* @param data Additional data to include in the serialized object.
	* @return The serialized data. */
	serialize(data = {}) {
		data.name = this._name;
		data.title = this._title.serialize();
		data.description = this._description.serialize();
		return data;
	}


	/** Adds a class to the domain.
	 * @param c the class to add to the domain.
	 * @param alias If a class with the name.
	 * @returns The class added to the domain. */
	add(c) { return c; }


	/** Get the string representation of the domain.
	 * @returns The ID of the domain. */
	toString() { return this.id; }
}

// ---------------------------------------------------------- STATIC FIELDS

/** The global list of domains. */
Domain.list = {};

/** The global default domain. */
Domain.default = new Domain("CoEditAR");






/** Defines a semantic class that stores the metadata of a OOP class. */
export class Class {



	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new Class instance.
	 * @param name The name of the class.
	 * @param domain The domain the class belongs to.
	 * @param properties The properties of the class.
	 * @param parents The parent (super)classes.
	 * @param data The initialization data. */
	constructor(name, domain, data) {

		// Check the given name
		this._name = (data && data.name) ? data.name : name;
		if (!this._name)
			throw Error('No name provided for Class');
		if (!Serialization.isName(this._name))
			throw Error('Invalid name "' + this._name + '" for a Class');

		// Create the default values for the title and description
		this._title = new LocalizedString('ClassTitle' + this._name);
		this._description = new LocalizedString('ClassDescription' + this._name);

		// Check the given domain
		this._domain = (data && data.name) ? data.name : name;
		if (domain) {
			if (typeof (domain) == 'string') {
				if (!Domain.list[domain])
					throw Error('Invalid domain path: "' + domain + '"');
				domain = Domain.list[domain];
			}
			else
				this._domain = domain;
		}
		else
			this._domain = Domain.default;

		// Add this class to the list of the domain
		if (this._domain.classes[this._name])
			throw Error('Class "' + this._name + '" already exists' +
				'in domain: "' + this._domain.name + '"');
		this._domain.classes[name] = this;

		// Initialize the basic elements
		this._abstract = false;
		this._final = false;
		this._instances = [];
		this._properties = {};
		this._required = [];
		this._additionalProperties = true;

		// Create the different relations between classes
		this._relations = {};
		this._parents = new Relation("parents", this, [], undefined, "children");
		this._children = new Relation("children", this, [], undefined, "parents");
		this._aliases = new Relation("aliases", this, [], undefined, "aliases");

		// If there is any initialization data, deserialize it
		if (data)
			this.deserialize(data);
	}



	// ------------------------------------------------------- PUBLIC ACCESSORS

	/** Marks the Class instance. */
	get isClass() { return true; }

	/** The name of the class. */
	get name() { return this._name; }

	/** The domain of the class. */
	get domain() { return this._domain; }

	/** The unique Id of the class (including the ids of the super-domains). */
	get id() {
		return ((this.domain) ? this.domain.id + "/" : "") + this._name;
	}

	/** The implementation of the class. */
	get implementation() { return this._implementation; }

	/** The title of the class. */
	get title() { return this._title; }

	/** The description of the class. */
	get description() { return this._description; }

	/** The abstract nature of the class (if it can have instances or not). */
	get abstract() { return this._abstract; }

	/** The final nature of the class (if it can have children or not). */
	get final() { return this._final; }

	/** The description of the class. */
	get instances() { return this._instances; }

	/** The properties of the class. */
	get properties() { return this._properties; }

	/** The list of required properties. */
	get required() { return this._required; }

	/** Indicates if additional properties are allowed or not. */
	get additionalProperties() { return this._additionalProperties; }

	/** The relations of the class (links with others classes). */
	get relations() { return this._relations; }

	/** The parent (super)classes. */
	get parents() { return this._parents; }

	/** The child (sub)classes. */
	get children() { return this._children; }

	/** The classes with equivalent meaning (generally, in other domains). */
	get aliases() { return this._aliases; }


	// --------------------------------------------------------- PUBLIC METHODS


	/** Deserializes the Class from a JSON Schema object.
	 * @param data The JSON (schema) data to deserialize. */
	deserialize(data) {

		// Check if there is data to deserialize
		if (!data || typeof data != 'object')
			return;

		// Deserialize the title and description
		if (data.title)
			this._description.deserialize(data.title);
		if (data.description)
			this._description.deserialize(data.description);

		// Check the nature of the class
		if (data.abstract != undefined)
			this._abstract = data.abstract == true;
		if (data.final != undefined)
			this._final = data.final == true;

		// Check if there is an implementation of the class
		if (data.implementation)
			this._implementation = data.implementation;

		// Process the properties
		if (data.properties) {
			for (let propertyName in data.properties) {
				let propertyData = data.properties[propertyName];
				propertyData.required = this._required.includes(propertyName);
				this._properties[propertyName] =
					new Property(propertyName, propertyData);
			}
		}

		// Get the required properties and whether additional ones are allowed
		this._required = [];
		if (data.required !== undefined) {
			if (!Array.isArray(data.required))
				data.required = [data.required];
			for (let propertyName of data.required) {
				if (typeof propertyName !== 'string' ||
					!this._properties[propertyName])
					throw new Error('Invalid required property "' + propertyName + '" ' +
						'for class "' + this._name + '"');
				this._required.push(propertyName);
			}
		}
		if (data.additionalProperties !== undefined)
			this._additionalProperties = (data.additionalProperties == true);

		// TODO: Deserialize the relations between classes
		// if()
	}


	/** Serializes the instance to a JSON (Schema) representation.
	* @param data Additional data to include in the serialized object.
	* @return The resulting JSON (schema) data. */
	serialize(data = {}) {

		// Set the basic elements
		data.name = this._name;
		data.title = this._title.serialize();
		data.description = this._description.serialize();

		// Save the optional elements of the property
		if (this._abstract != undefined)
			data.abstract = this._abstract;
		if (this._final != undefined)
			data.final = this._final;

		// Save the properties
		let properties = Object.keys(this._properties);
		if (properties.length > 0) {
			data.properties = [];
			for (let property of properties)
				data.properties.push(this._properties[property].serialize());
		}

		data.required = this._required;
		data.additionalProperties = this._additionalProperties;

		// Return the result
		return data;
	}


	/** Creates an instance of the class (or adds it to an existing instance).
	 * @param instance An already existing object.
	 * @param data The initialization data.
	 * @returns The instance of the class. */
	instantiate(instance, data) {

		// Show a debug message on console
		// console.log("Instantiating class: " + this._name);

		// If there is no provided instance, create it
		if (!instance) {

			// Check if there is already an implementation
			if (this._implementation) {
				instance = new this._implementation(data.name, data.link, data);
				// TODO Check that the properties are applied
				//return instance; 
			}
			// Otherwise create a basic Instance
			else
				instance = new Instance(this);

			// Add the class to the list
			if (!instance.metadata.classes.includes(this))
				instance.metadata.classes.push(this);
		}

		// Recursively apply the parents properties first
		for (let p of this._parents)
			p.instantiate(instance, data);

		// Apply the properties of the class
		for (let propertyName in this._properties)
			this._properties[propertyName].associate(instance);

		// Apply the required properties
		for (let requiredPropertyName of this._required)
			instance.metadata.required.push(requiredPropertyName);

		// Check if additional properties 
		if (instance.metadata.additionalProperties)
			instance.metadata.additionalProperties =
				(this._additionalProperties == true);

		// If there is any data to deserialize, do it now
		if (data != null)
			instance.deserialize(data);

		// Return the generated instance
		return instance;
	}
}

// ---------------------------------------------------------- STATIC FIELDS

/** The global list of classes. */
Class.list = {};






/** Defines a property of a semantic class.
 * @see https://json-schema.org/understanding-json-schema/ */
export class Property extends Serializable {


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new instance of the Property class.
	 * @param name The name of the property.
	 * @param data The initialization data. */
	constructor(name, data) {

		super();

		// Store the name, title and description
		this._name = (data && data.name) ? data.name : name;
		if (!this._name)
			throw Error('No name provided for Property');
		if (!Serialization.isName(this._name))
			throw Error('Invalid name "' + this._name + '" for a Property');

		// Create the default values for the title and description
		this._title = new LocalizedString('PropertyTitle' + this._name);
		this._description = new LocalizedString('PropertyDescription' + this._name);

		// Initialize the different fields
		this._type = 'object'; // By default every property defines an object
		this._required = false;
		this._unique = false;
		this._readOnly = false;
		this._classes = [];
		this._instances = [];
		this._original = null;
		this._copies = [];
		this._value = undefined;
		this._default = undefined;
		this._enum = undefined;
		this._minimum = undefined;
		this._maximum = undefined;
		this._minLength = undefined;
		this._maxLength = undefined;
		this._pattern = undefined;
		this._format = undefined;
		this._items = [];
		this._minItems = undefined;
		this._maxItems = undefined;

		// If there is any initialization data, deserialize it
		if (data)
			this.deserialize(data);
	}



	// ------------------------------------------------------- PUBLIC ACCESSORS

	/** Marks the Property instance. */
	get isProperty() { return true; }

	/** The name of the property. */
	get name() { return this._name; }

	/** The name of the property. */
	get type() { return this._type; }
	set type(type) {
		if (Property.types.includes(type))
			this._type = type;
		else
			throw Error('Invalid type "' + type + '" ' +
				'for property "' + this.name + '" (available options are: "' +
				Property.types.join('", "') + '")');
	}

	/** The title of the property. */
	get title() { return this._title; }

	/** The description of the property. */
	get description() { return this._description; }

	/** Indicates if the property has to defined or not. */
	get required() { return this._required; }
	set required(required) { this._required = required; }

	/** Indicates if the property is unique (among all instances). */
	get unique() { return this._unique; }
	set unique(unique) { this._unique = unique; }

	/** Indicates if the property can not be set after initialization. */
	get readOnly() { return this._readOnly; }
	set readOnly(readOnly) { this._readOnly = readOnly; }

	/** The value of the property. */
	get value() {
		return this._value == undefined ? this._default : this._value;
	}
	set value(newValue) {
		if (this.checkValue(newValue, true))
			this._value = newValue;
	}

	/** The default value of the property. */
	get default() { return this._default; }
	set default(defaultValue) {
		if (this.checkValue(defaultValue, true))
			this._default = defaultValue;
	}

	/** The valid values of the property. */
	get enum() { return this._enum; }
	set enum(ev) {
		this._enum = (ev) ? (Array.isArray(ev) ? [...ev] : [ev]) : undefined;
	}

	/** The minimum numeric value of the property. */
	get minimum() { return this._minimum; }
	set minimum(minimum) {
		if (minimum !== undefined && minimum < 0 && minimum > this._maximum)
			throw new Error('Invalid minimum value: "' + minimum + '"');
		this._minimum = minimum;
	}

	/** The maximum numeric value of the property. */
	get maximum() { return this._maximum; }
	set maximum(maximum) {
		if (maximum !== undefined && maximum < 0 && maximum < this._minimum)
			throw new Error('Invalid maximum value: "' + maximum + '"');
		this._maximum = maximum;
	}

	/** The minimum length of a text value of the property. */
	get minLength() { return this._minLength; }
	set minLength(mL) {
		if (mL !== undefined && mL < 0 && mL > this._maxLength)
			throw new Error('Invalid minLength value: "' + mL + '"');
		this.minLength = mL;
	}

	/** The maximum length of a text value of the property. */
	get maxLength() { return this._maxLength; }
	set maxLength(mL) {
		if (mL !== undefined && mL < 0 && mL < this._minLength)
			throw new Error('Invalid maxLength value: "' + mL + '"');
		this._maxLength = mL;
	}

	/** The pattern (regular expression) of a text value of the property. */
	get pattern() { return this._pattern; }
	set pattern(pattern) { this._pattern = pattern; }

	/** The semantic identification of a text value of the property. */
	get format() { return this._format; }
	set format(format) { this._format = format; }


	/** The type of items contained in an array property. */
	get items() { return this._items; }

	/** The minimum number of items contained in an array property. */
	get minItems() { return this._minItems; }
	set minItems(minItems) {
		if (minItems !== undefined && minItems < 0)
			throw new Error('Invalid minItems value: "' + minItems + '"');
		this._minItems = minItems;
	}

	/** The maximum number of items contained in an array property. */
	get maxItems() { return this._maxItems; }
	set maxItems(maxItems) {
		if (maxItems !== undefined && maxItems < 0)
			throw new Error('Invalid maxItems value: "' + maxItems + '"');
		this._maxItems = maxItems;
	}

	/** The classes with this property. */
	get classes() { return this._classes; }

	/** The instances associated with the property. */
	get instances() { return this._instances; }

	/** The original property instance (if not unique). */
	get original() { return this._original; }

	/** The copied instances of the property (if not unique). */
	get copies() { return this._copies; }


	// --------------------------------------------------------- PUBLIC METHODS

	/** Creates a deep copy of the property.
	 * @returns The generated copy of the property. */
	clone() {

		// Generate a new copy
		let prototype = (Object.getPrototypeOf(this));
		let copy = new prototype.constructor(this.name, this.serialize());

		// Create a copy and set the link to the original relation
		this._copies.push(copy);
		copy._original = this.original || this;

		// Return the copy
		return copy;
	}


	/** Deserializes the property.
	 * @param data The data to deserialize. */
	deserialize(data) {

		// Check if there is data to deserialize
		if (!data || typeof (data) != 'object')
			return;

		// Get the data type
		if (data.type != undefined)
			this.type = data.type;

		// Deserialize the title and description
		if (data.title)
			this._description.deserialize(data.title);
		if (data.description)
			this._description.deserialize(data.description);

		// Get the main attributes
		if (data.required != undefined)
			this.required = data.required == true;
		if (data.unique != undefined)
			this.unique = data.unique == true;
		if (data.readonly != undefined)
			this.readOnly = data.readonly == true;
		if (data.default != undefined)
			this.default = data.default;
		if (data.enum != undefined)
			this.enum = data.enum;
		if (data.minimum != undefined)
			this.minimum = data.minimum;
		if (data.maximum != undefined)
			this.maximum = data.maximum;
		if (data.minLength != undefined)
			this.minLength = data.minLength;
		if (data.maxLength != undefined)
			this.maxLength = data.maxLength;
		if (data.pattern != undefined)
			this.pattern = data.pattern;
		if (data.format != undefined)
			this.format = data.format;
		if (data.minItems != undefined)
			this.minItems = data.minItems;
		if (data.maxItems != undefined)
			this.maxItems = data.maxItems;

		// Serialize the sub-properties
		if (data.items != undefined) {
			if (!Array.isArray(data.items))
				data.items = [data.items];
			for (let itemIndex = 0; itemIndex < data.items.length; itemIndex++)
				this._items.push(new Property(this.name + itemIndex, data.items[itemIndex]));
		}

		// Get the value at the end, to be able to do the necessary checks
		if (data.value != undefined)
			this.value = data.value;

		// Link the properties to the classes and the instances
		this._classes = [];
		if (data.classes)
			for (let c of data.classes) {
				// c.properties[this._name] = this; 
				this.classes.push(c);
			}

		// Associate the instances
		this._instances = [];
		if (data.instances)
			for (let i of data.instances)
				this.associate(i);

		// Create the link between original and the copies
		this._original = data.original;
		this._copies = [];
		if (data.copies)
			for (let c of data.copies)
				this._copies.push(c);

		// If undefined, set the default values depending on the type
		if (this._default == undefined) {
			switch (this._type) {
				case "null":
					this._default = null;
					break;
				case "boolean":
					this._default = false;
					break;
			}
		}
	}


	/** Serializes the instance to a JSON (Schema) representation.
	* @param params The serialization parameters.
	* @param data Additional data to include in the serialized object.
	* @return The resulting JSON (schema) data. */
	serialize(params, data = {}) {

		// Set the basic attributes
		data.name = this._name;

		// Save the optional attributes of the property
		if (!this._title.isNull)
			data.title = this._title.serialize();
		if (!this._description.isNull)
			data.description = this._description.serialize();
		if (this._type !== "object")
			data.type = this._type;
		if (this._required != false)
			data.required = this._required;
		if (this._unique != false)
			data.unique = this._unique;
		if (this._readOnly != false)
			data.readOnly = this._readOnly;
		if (this._value != undefined)
			data.value = this._value;
		if (this._default != undefined)
			data.default = this._default;
		if (this._enum != undefined)
			data.enum = this._enum;
		if (this._minimum != undefined)
			data.minimum = this._minimum;
		if (this._maximum != undefined)
			data.maximum = this._maximum;
		if (this._minLength != undefined)
			data.minLength = this._minLength;
		if (this._maxLength != undefined)
			data.maxLength = this._maxLength;
		if (this._pattern != undefined)
			data.pattern = this._pattern;
		if (this._format != undefined)
			data.format = this._format;
		if (this._minItems != undefined)
			data.minItems = this._minItems;
		if (this._maxItems != undefined)
			data.maxItems = this._maxItems;

		// Serialize the sub-properties
		if (this._items != undefined && this._items.length > 0) {
			data.items = [];
			for (let item of this._items) {
				let itemData = item.serialize();
				itemData.name = undefined;
				data.items.push(itemData);
			}
		}

		// If there are serialization parameters language, use them
		if (params)
			return Serialization.serialize(data, params);

		// Otherwise, just return the object
		return data;
	}


	/** Links or copies a property to an instance.
	 * @param instances The instances to associate to. */
	associate(instances) {

		// Check the provided
		if (!instances)
			throw Error("No instances provided");
		if (!Array.isArray(instances))
			instances = [instances];
		for (let instance of instances) {

			// If it is unique, just link this property
			let properties = instance.metadata.properties;
			if (this._unique)
				properties[this._name] = this;

			// Otherwise, create a copy of this property
			else
				properties[this._name] = this.clone();

			// Add this instance to the list in the instance
			this.instances.push(instance);
		}
	}


	/** Checks if a value is valid with the current rules.
	 * @param value The value to test.
	 * @param trowException Whether to throw exception or not
	 * @returns A boolean indicating if the value is valid.  */
	checkValue(value, throwExceptions = false) {

		// Prepare an error message
		let property = this;
		function errorMessage(reason) {
			return 'Invalid value "' + value + '" for ' + property._type +
				' property "' + property._name + '"' +
				(reason ? ' (' + reason + ')' : '');
		}

		// If there is a enumeration, check the values
		if (this._readOnly)
			throw Error('Property "' + this.name + '" ' +
				'cannot receive a value because is marked as "read only"');

		// If there is a enumeration, check the values
		if (this._enum) {
			if (!this._enum.includes(value))
				throw Error(errorMessage('valid options are "' + this.enum.join('", "') + '"'));
		}

		// Check depending on the type
		switch (this._type) {
			case 'null':
				if (!throwExceptions)
					return false;
				throw Error(errorMessage('A null property can not have a value'));
			case 'boolean':
				if (!(value === true || value === false))
					if (!throwExceptions)
						return false;
					else
						throw Error(errorMessage('valid options are "true" or "false"'));
				break;
			case 'integer':
			case 'number':
				if ((this.type == 'integer' && typeof value != "bigint") ||
					(this.type == 'number' && typeof value != "number"))
					throw Error(errorMessage('invalid value type "' + typeof value + '"'));
				if (this._minimum != undefined && value < this._minimum)
					if (!throwExceptions)
						return false;
					else
						throw Error(errorMessage('the minimum value is ' + this._minimum));
				if (this._maximum != undefined && value > this._maximum)
					if (!throwExceptions)
						return false;
					else
						throw Error(errorMessage('the maximum value is ' + this._maximum));
				break;
			case 'string':
				if (typeof value != "string")
					throw Error(errorMessage('invalid value type "' + typeof value + '"'));
				if (this._minLength && value.length < this._minLength)
					if (!throwExceptions)
						return false;
					else
						throw Error(errorMessage('the minimum text size is ' + this._minLength));
				if (this._maxLength && value.length > this._maxLength)
					if (!throwExceptions)
						return false;
					else
						throw Error(errorMessage('the maximum text size is ' + this._maxLength));
				// TODO Check pattern and format
				break;
			case 'array': {
				if (!Array.isArray(value))
					throw Error(errorMessage('value is not an array'));

				// Check the items (sub-properties)
				if (this._items && this._items.length > 0) {
					for (let itemValue of value) {
						let validItem = false;
						for (let itemProperty of this._items)
							if (itemProperty.checkValue(itemValue)) {
								validItem = true;
								break;
							}
						if (!validItem)
							if (!throwExceptions)
								return false;
							else
								throw Error(errorMessage('the item "' +
									itemValue + '" is not a valid array element'));
					}
				}
				if (this._minItems && value.length < this._minItems)
					if (!throwExceptions)
						return false;
					else
						throw Error(errorMessage('the minimum number of items is ' + this._minItems));
				if (this._maxItems && value.length > this._maxItems)
					if (!throwExceptions)
						return false;
					else
						throw Error(errorMessage('the maximum number of items is ' + this._maxItems));
			}
		}

		// If we reached this point, the value is considered valid
		return true;
	}
}

// ---------------------------------------------------------- STATIC FIELDS

/** The valid property types (as defined in JSON Schema ). */
Property.types = [
	"null", "boolean", "integer", "number", "string", "array", "object"
];

/** The valid property types (as defined in JSON Schema ). */
Property.formats = [
	"date-time",
	"time",
	"date",
	"duration",
	"email",
	"idn-email",
	"hostname",
	"idn-hostname",
	"ipv4",
	"ipv6",
	"uuid",
	"uri",
	"uri-reference",
	"iri",
	"iri-reference",
	"uri-template",
	"json-pointer",
	"relative-json-pointer",
	"regex" // Regular Expressions
];





/** Defines a 1 to N (directed) relation between classes. */
export class Relation {


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new instance of the Relation class.
	 * @param name The name of the relation.
	 * @param source The source class of the relation.
	 * @param targets The target classes of the relation.
	 * @param parent  The parent relation.
	 * @param inverse The name of the inverse relation.
	 * @param equivalent The name of the equivalent relation.
	 * @param operator The operator of the relation (enumeration, union,
	 * intersection or complement). */
	constructor(name, source, targets = [], parent, inverse, equivalent, operator = RelationOperator.enumeration, data) {

		// Check the given name
		this._name = (data && data.name) ? data.name : name;
		if (!this._name)
			throw Error('No name provided for Relation');
		if (!Serialization.isName(this._name))
			throw Error('Invalid name "' + this._name + '" for a Relation');

		// Create the default values for the title and description
		this._title = new LocalizedString('RelationTitle' + this._name);
		this._description = new LocalizedString('RelationDescription' + this._name);

		// Check the given source class and save the relation in its list.
		if (source)
			source.relations[name] = this;

		// Store the source and target class references
		this._source = source;
		this._targets = targets;

		// Create a hierarchical links
		this._children = [];
		if (parent) {
			this._parent = parent;
			parent.children.push(this);
		}

		// Save the names of the inverse and equivalent relations
		this._inverse = inverse;
		this._equivalent = equivalent;

		// Store the operator
		this._operator = operator;

		// If there is any initialization data, deserialize it
		if (data)
			this.deserialize(data);
	}


	// ------------------------------------------------------- PUBLIC ACCESSORS

	/** Marks the Relation instance. */
	get isRelation() { return true; }

	/** The name of the expression. */
	get name() { return this._name; }

	/** The title of the relation. */
	get title() { return this._title; }

	/** The description of the relation. */
	get description() { return this._description; }

	/** The operator of the relation. */
	get operator() { return this._operator; }

	/** The source class of the relation. */
	get source() { return this._source; }

	/** The items of the relation. */
	get targets() { return this._targets; }

	/** The name of the inverse relation (in the target classes). */
	get inverse() { return this._inverse; }
	;

	/** The name of the equivalent relation (in the target classes). */
	get equivalent() { return this._equivalent; }
	;

	/** The parent relation. */
	get parent() { return this._parent; }

	/** The child expressions. */
	get children() { return this._children; }


	// --------------------------------------------------------- PUBLIC METHODS

	/** Deserializes the instance from a JSON representation.
	* @param data The JSON data to deserialize. */
	deserialize(data) {

		// Check if there is data to deserialize
		if (!data || typeof data != 'object')
			return;

		// Deserialize the title and description
		if (data.title)
			this._description.deserialize(data.title);
		if (data.description)
			this._description.deserialize(data.description);
	}


	/** Serializes the instance to a JSON representation.
	* @param data Additional data to include in the serialized object.
	* @return The serialized JSON data. */
	serialize(data = {}) {

		// Set the basic elements
		data.name = this._name;
		data.title = this._title.serialize();
		data.description = this._description.serialize();

		// Return the result
		return data;
	}


	/** Iterates through the items of the expression. */
	[Symbol.iterator]() {
		let pointer = 0, items = this.targets;
		return {
			next() {
				if (pointer < items.length)
					return { done: false, value: items[pointer++] };
				else
					return { done: true, value: null };
			}
		};
	}
}

/** Defines the operators of a relation. */
export var RelationOperator;
(function (RelationOperator) {
	RelationOperator["enumeration"] = ",";
	RelationOperator["union"] = "+";
	RelationOperator["intersection"] = "*";
	RelationOperator["complement"] = "-";
})(RelationOperator || (RelationOperator = {}));



/** Defines the semantic metadata of an instance.
 * Extends the prototype object in Javascript. */
export class Metadata {


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new instance of the Metadata class.
	 * @param instance The instance of the property. */
	constructor(instance) {

		// Store the instance and the prototype object
		this._instance = instance;
		this._prototype = Object.getPrototypeOf(instance);

		// Initialize the elements of the metadata
		this._classes = [];
		this._properties = {};
		this._required = [];
		this._additionalProperties = true;
	}


	// ------------------------------------------------------- PUBLIC ACCESSORS

	/** The associated instance. */
	get instance() { return this._instance; }

	/** The prototype of the instance. */
	get prototype() { return this._prototype; }

	/** The classes of the instance. */
	get classes() { return this._classes; }

	/** The properties of the instance. */
	get properties() { return this._properties; }

	/** The required properties of the instance. */
	get required() { return this._required; }

	/** Indicates if additional properties are allowed or not. */
	get additionalProperties() { return this._additionalProperties; }
	set additionalProperties(v) { this._additionalProperties = v; }
}




/** Defines a 1 to N (directed) link between data nodes. */
export class Link {


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new instance of the Link class.
	 * @param name The name of the link.
	 * @param parent The parent link.
	 * @param source The source node of the link.
	 * @param targets The target nodes of the link.
	 * @param inverse The inverse link.
	 * @param classes The valid classes for the link. */
	constructor(name, parent, source, targets, inverse, classes, minimumCardinality, maximumCardinality) {

		// Store the given values
		if (!name)
			throw Error('No name provided for Link');
		if (typeof (name) != 'string' || !Serialization.isName(name))
			throw Error('Invalid relation name: "' + name + '"');
		this._name = name;

		// Store the source and target node references
		this._source = source;
		this._targets = [];
		if (targets)
			for (let target of targets)
				this.add(target);

		// Create the hierarchical connections
		if (parent) {
			this._parent = parent;
			parent._children.push(this);
		}
		if (inverse) {
			this._inverse = inverse;
		}

		// Store the minimum and maximum cardinality values
		if (minimumCardinality)
			this._minimumCardinality =
				(minimumCardinality >= 0) ? minimumCardinality : undefined;
		if (maximumCardinality)
			this._maximumCardinality =
				(maximumCardinality >= 0) ? maximumCardinality : undefined;
		if (this._minimumCardinality > this._maximumCardinality)
			throw Error("Invalid cardinality range for: " + this.id);

		// Check the cardinality
		if (this._minimumCardinality != undefined &&
			this._targets.length > this._minimumCardinality)
			throw Error("Invalid cardinality range for: " + this.id);
	}


	// ------------------------------------------------------- PUBLIC ACCESSORS

	/** Identifies that instance as a Link. */
	get isLink() { return true; }

	/** The name of the link. */
	get name() { return this._name; }

	/** The id of the link. */
	get id() {
		return ((this._parent) ? this._parent.id + "." : "") + this._name;
	}

	/** The source node of the link. */
	get source() { return this._source; }

	/** The main target node (if any). */
	get target() {
		return (this._targets.length > 0) ? this._targets[0] : undefined;
	}

	/** The target nodes of the link. */
	get targets() { return this._targets; }

	/** The number of target nodes of the link. */
	get cardinality() { return this._targets.length; }

	/** The minimum number of target nodes of the link. */
	get minimumCardinality() { return this._minimumCardinality; }

	/** The maximum number of target nodes of the link. */
	get maximumCardinality() { return this._maximumCardinality; }

	/** The parent link. */
	get parent() { return this._parent; }

	/** The child links. */
	get children() { return this._children; }

	/** The inverse link. */
	get inverse() { return this._inverse; }

	/** The valid classes for the link. */
	get classes() { return this._classes; }

	/** Indicates if the link connects at least two modules */
	get isConnected() { return (this._source && this._targets.length > 0); }


	// --------------------------------------------------------- PUBLIC METHODS

	/** Adds a node to the link.
	 * @param target The node to add.
	 * @param position The position where to add the node (by default, at the
	 * end). Negative values imply counting from the end of the collection.
	 * @returns The added item.  */
	add(node, position) {

		// If no position is defined, just add it to the end of the array
		if (position == undefined)
			this._targets.push(node);
		else { // Otherwise, calculate the index from the position
			let index = 0, size = this._targets.length;
			if (position > 0) {
				index = position;
				if (index > size)
					index = size; // Prevent out_of_bounds errors
			}
			else { // Negative values imply counting backwards
				index = size - position;
				if (index < 0)
					index = 0; // Prevent out_of_bounds errors
			}

			// Insert the node in the right position
			this._targets.splice(index, 0, node);
		}

		// If there is parent collection, add the node to it
		if (this._parent)
			this._parent.add(node);
	}


	/** Get a specific target from the link.
	 * @param name The name of the node to get.
	 * @returns The node with the specified name. */
	getByName(name) {
		for (let t of this._targets)
			if (t.name == name)
				return t;
	}


	/** Removes an target from the link.
	* @param item The item to remove. */
	remove(node) {
		let cardinality = this._targets.length;
		for (let nodeIndex = 0; nodeIndex < cardinality; nodeIndex++) {
			if (this._targets[nodeIndex] == node) {
				this._targets.splice(nodeIndex, 1);
				nodeIndex--;
				cardinality--;
			}
		}

		// If there is parent link, also remove the node in it
		if (this._parent)
			this._parent.remove(node);
	}


	/** Clears the element of the collection. */
	clear() {
		let cardinality = this._targets.length;
		for (let nodeIndex = 0; nodeIndex < cardinality; nodeIndex++) {
			if (this._parent)
				this._parent.remove(this._targets[nodeIndex]);
			this._targets.splice(nodeIndex, 1);
			nodeIndex--;
			cardinality--;
		}
	}


	/** Iterates through the target nodes of the link. */
	[Symbol.iterator]() {
		let pointer = 0, nodes = this._targets;
		return {
			next() {
				if (pointer < nodes.length)
					return { done: false, value: nodes[pointer++] };
				else
					return { done: true, value: null };
			}
		};
	}
}





/** Defines a node that contains the data of a semantic domain. */
export class ModelNode extends Node {

	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new instance of the ModelNode class.
	 * @param name The name of the node.
	 * @param link The parent node link.
	 * @param data The initialization data. */
	constructor(name, link, data) {

		// Call the base class constructor
		super("model", name, link, data);
	}
}




/** Defines a node that contains the data of a semantic property. */
export class PropertyNode extends Node {

	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new instance of the PropertyNode class.
	 * @param name The name of the node.
	 * @param link The parent node link.
	 * @param data The initialization data. */
	constructor(name, link, data) {

		// Call the base class constructor
		super("property", name, link, data);
	}
}




/** Defines a node that contains the data of a semantic class. */
export class ClassNode extends Node {


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new instance of the ClassNode class.
	 * @param name The name of the node.
	 * @param link The parent node link.
	 * @param data The initialization data. */
	constructor(name, link, data) {

		// Call the base class constructor
		super("class", name, link, data);

		// The properties of the class
		this.properties = new Link("properties", this._children, this);

		// Create a link for the instances of the class
		this.instances = new Link("instances", undefined, this);

		// Create a link for the relations with other classes
		this.relations = new Link("instances", undefined, this);

		//
		this.title = new StringNode("title", this.children);

	}
}





/** Defines a node that contains a boolean data type. */
export class BooleanNode extends Node {


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new instance of the BooleanNode class.
	 * @param name The name of the node.
	 * @param link The parent node link.
	 * @param data The initialization data. */
	constructor(name, link, data) {

		// Call the base class constructor
		super("boolean", name, link, data);
	}



	// ------------------------------------------------------- PUBLIC ACCESSORS

	/** The current value of the BooleanNode.*/
	get value() {
		if (this._value == undefined)
			return this._defaultValue;
		return this._value;
	}
	set value(newValue) {
		if (this._value == newValue)
			return;
		this._value = (newValue == true);
		this.updated = false;
	}


	/** The default value of the BooleanNode. */
	get defaultValue() { return this._defaultValue; }
	set defaultValue(newDefaultValue) {
		if (this._defaultValue == newDefaultValue)
			return;
		this._defaultValue = newDefaultValue;
		this.updated = false;
	}

	// --------------------------------------------------------- PUBLIC METHODS

	/** Deserializes the node.
	 * @param data The data to deserialize. */
	deserialize(data) {
		if (data == undefined)
			return;
		if (typeof data == "object") {
			this.defaultValue = data.defaultValue;
			this.value = data.value;
		}
		else if (typeof data !== "boolean")
			this.value = (data == true);
		else
			this.value = data;
	}


	/** Serializes the node.
	* @param data Additional data to include in the serialized object.
	* @return The serialized data. */
	serialize(data = {}) {

		// Return the serialized data
		return this.value;
	}
}






/** Defines a node that contains a numeric data type. */
export class NumberNode extends Node {


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new instance of the Number class.
	 * @param name The name of the node.
	 * @param link The parent node link.
	 * @param data The initialization data. */
	constructor(name, link, data) {

		// Call the base class constructor
		super("number", name, link, data);

		/** The minimum possible value of the Number. */
		this._min = undefined;

		/** The maximum possible value of the Number. */
		this._max = undefined;
	}


	// ------------------------------------------------------- PUBLIC ACCESSORS

	/** The current value of the Number data type.*/
	get value() {
		if (this._value == undefined)
			return this._defaultValue;
		return this._value;
	}
	set value(newValue) {
		if (this._value == newValue)
			return;
		if (!this.checkValue(newValue))
			throw Error('Invalid value "'
				+ newValue + '" for: ' + this.name);
		this._value = newValue;
		this.updated = false;
	}


	/** The default value of the Number data type. */
	get defaultValue() { return this._defaultValue; }
	set defaultValue(newDefaultValue) {
		if (this._defaultValue == newDefaultValue)
			return;
		if (!this.checkValue(newDefaultValue))
			throw Error('Invalid default value "' + newDefaultValue +
				'" for: ' + this.name);
		this._defaultValue = newDefaultValue;
		this.updated = false;
	}


	/** The minimum possible value of the Number. */
	get min() { return this._min; }
	set min(newMin) {
		if (this._max != undefined && newMin > this._max)
			this._max = newMin;
		if (this._value != undefined && this._value < newMin)
			this.value = newMin;
		this.updated = false;
		this._min = newMin;
	}


	/** The maximum possible value of the Number. */
	get max() { return this._max; }
	set max(newMax) {
		if (this._min != undefined && newMax < this._min)
			this._min = newMax;
		if (this._value != undefined && this._value > newMax)
			this.value = newMax;
		this.updated = false;
		this._max = newMax;
	}

	// --------------------------------------------------------- PUBLIC METHODS

	/** Deserializes the number.
	 * @param data The data to deserialize. */
	deserialize(data) {
		if (data == undefined)
			return;
		if (typeof data == "object") {
			this.min = data.min;
			this.max = data.max;
			this.defaultValue = data.defaultValue;
			this.value = data.value;
		}
		else if (typeof data !== "number")
			this.value = parseFloat(data);
		else
			this.value = data;
	}


	/** Serializes the number.
	* @param data Additional data to include in the serialized object.
	* @return The serialized data. */
	serialize(data = {}) {

		// Return the serialized data
		return this.value;
	}



	/** Checks if a value is valid for this Number node.
	 * @param value The value to check.
	 * @returns A boolean value indicating whether the value is valid or not. */
	checkValue(value) {

		// Check the range 
		if (this._min != undefined && value < this._min)
			return false;
		if (this._max != undefined && value > this._max)
			return false;

		return true;
	}
}






/** Defines a node that contains a textual data type. */
export class StringNode extends Node {





	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new instance of the String class.
	 * @param name The name of the node.
	 * @param link The parent node link.
	 * @param data The initialization data. */
	constructor(name, link, data) {

		// Call the base class constructor
		super("string", name, link);

		this._value = new LocalizedString("value");
		this._defaultValue = new LocalizedString("default");
	}


	// ------------------------------------------------------- PUBLIC ACCESSORS

	/** The current value of the Number data type.*/
	get value() {
		if (this._value == undefined)
			return this._defaultValue.value;
		return this._value.value;
	}
	set value(newValue) {
		if (this._value.value == newValue)
			return;
		if (!this.checkValue(newValue))
			throw Error('Invalid value "'
				+ newValue + '" for: ' + this.name);
		this._value.setValue(newValue);
		this.updated = false;
	}


	/** The default value of the Number data type. */
	get defaultValue() { return this._defaultValue.value; }
	set defaultValue(newDefaultValue) {
		if (this._defaultValue.value == newDefaultValue)
			return;
		if (!this.checkValue(newDefaultValue))
			throw Error('Invalid default value "' + newDefaultValue +
				'" for: ' + this.name);
		this._defaultValue.setValue(newDefaultValue);
		this.updated = false;
	}

	// --------------------------------------------------------- PUBLIC METHODS

	/** Deserializes the string.
	 * @param data The data to deserialize. */
	deserialize(data) {
		if (data == undefined)
			return;
		if (typeof data == "object") {
			this._defaultValue.deserialize(data.defaultValue);
			this._value.deserialize(data.value);
		}
		this._value.deserialize(data);
	}


	/** Serializes the string.
	* @param data Additional data to include in the serialized object.
	* @return The serialized data. */
	serialize(data = {}) {

		// Return the serialized data
		return this._value.serialize();
	}



	/** Checks if a value is valid for this String node.
	 * @param value The value to check.
	 * @returns A boolean value indicating whether the value is valid or not. */
	checkValue(value) {

		return true;
	}
}






/** Defines a 3 dimensional vector. */
export class VectorNode extends Node {


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new instance of the VectorNode class.
	 * @param name The name of the node.
	 * @param link The parent node link.
	 * @param data The initialization data. */
	constructor(name, link, data) {

		// Call the base class constructor
		super("vector", name, link, data);
	}


	// --------------------------------------------------------- PUBLIC METHODS

	/** Deserializes the number.
	 * @param data The data to deserialize. */
	deserialize(data) {
		super.deserialize();
		if (data == undefined)
			return;
	}


	/** Serializes the number.
	* @param data Additional data to include in the serialized object.
	* @return The serialized data. */
	serialize(data = {}) {

		data = super.serialize(data);
		debugger;

		// Return the serialized data

		return data;
	}
}

/** The semantic metadata of the class. */
VectorNode.class = new Class("Vector", null, { implementation: VectorNode,
	properties: {
		x: { type: "number", default: 0 },
		y: { type: "number", default: 0 },
		z: { type: "number", default: 0 }
	}
});

// SCHEMA DATA
// /** The semantic metadata of the class. */
// static class: Class = new Class("Vector", undefined, [Node.class],
// 	{ implementation: VectorNode,
// 		properties: {
// 			x: { type: "number", default: 0 },
// 			y: { type: "number", default: 0 },
// 			z: { type: "number", default: 0 }
// 		}
// 	});







// ----------------------------------------------------------- EXPORTS SEQUENCE

// Manage the exports of the entire framework to avoid circular references
export * from './data/serialization/Serializable.js';
export * from './data/serialization/Serialization.js';
export * from './data/serialization/serializers/JsonSerializer.js';
// export * from './data/serialization/XmlSerializer'
export * from './data/localization/Locale.js';
export * from './data/localization/LocalizedString.js';
export * from './logic/Expression.js';
export * from './logic/Context.js';
export * from './logic/Event.js';
export * from './logic/semantic/Domain.js';
export * from './logic/semantic/Class.js';
export * from './logic/semantic/Property.js';
export * from './logic/semantic/Relation.js';
export * from './logic/semantic/Instance.js';
export * from './logic/semantic/Metadata.js';
export * from './data/Node.js';
export * from './data/Link.js';
export * from './data/modelling/ModelNode.js';
export * from './data/modelling/ClassNode.js';
export * from './data/modelling/PropertyNode.js';
export * from './data/types/basic/BooleanNode.js';
export * from './data/types/basic/NumberNode.js';
export * from './data/types/basic/StringNode.js';
export * from './data/types/VectorNode.js';


// ----------------------------------------------------------------- MAIN CLASS





/** Manages the CoEditAR Framework. */
export class CoEditAR extends Node {


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new CoEditAR instance.
	 * @param data The initialization data (or a URL to the data file). */
	constructor(data) {

		// Call the base class constructor
		super(CoEditAR.class, 'CoEditAR');

		// Load/Deserialize the initialization data
		if (data) {
			if (typeof (data) == 'string')
				this.load(data);
			else
				this.deserialize(data);
		}

		// Add this instance to the list (and show a message if it is the first)
		CoEditAR.instances.push(this);
		if (CoEditAR.instances.length == 1)
			console.log("CoEditAR " + CoEditAR.frameworkVersion + " Initialized");
	}


	// ------------------------------------------------ STATIC PUBLIC ACCESSORS

	/** The name of the CoEditAR Framework. */
	static get frameworkName() { return "CoEditAR"; }

	/** The version number of the CoEditAR Framework. */
	static get frameworkVersion() { return 0.1; }

	/** Indicates whether the framework has already been initialized or not. */
	static get initialized() { return CoEditAR.instances.length > 0; }


	// -------------------------------------------------- STATIC PUBLIC METHODS

	/** Initializes the CoEditAR Framework.
	 * @param data The initialization data (or a URL to the data file). */
	static init(data) { return new CoEditAR(data); }


	// ------------------------------------------------------- PUBLIC ACCESSORS

	/** The name of the node (removed when there is no other instance). */
	get name() { return undefined; }


	// --------------------------------------------------------- PUBLIC METHODS

	/** Initializes a new CoEditAR instance.
	 * @param url The initialization data (or a URL to the data file). */
	load(url) {

		// Check the provided URL
		if (!url)
			throw Error("Invalid URL.");
		if (typeof (url) == 'string')
			url = encodeURI(url);

		// Load the file as a text file to 
		fetch(url).then((response) => response.text()).then((textData) => {

			// let serializer = new JsonSerializer();
			// serializer.deserialize(textData, this);
		});
	}


	/** Deserializes the CoEditAR instance.
	 * @param data The data to deserialize. */
	deserialize(data) {

		// Check if there is data to deserialize
		if (data == undefined)
			return;

		// Call the base class function
		super.deserialize(data);

		// Show the serialized data on console
		console.log("Result: ");
		console.log(this);
		console.log(this.toString("JSON"));

		// for(let view of this.views) view.init(this.spaces);
	}
}

// ------------------------------------------------------ SEMANTIC METADATA

/** The main domain of the CoEditAR Framework. */
CoEditAR.domain = Domain.default;


/** The semantic metadata of the class. */
CoEditAR.class = new Class("root", Domain.default, {
	implementation: CoEditAR,
	properties: {
		"CoEditAR": { type: "number" },
		"title": { type: "string" },
		"description": { type: "string" },
		// "vector": { classes: [VectorNode.class]}
	},
	required: ["CoEditAR"],
	// additionalProperties: false
});


//- -------------------------------------------------- STATIC PUBLIC FIELDS

/** The global list of CoEditAR App instances. */
CoEditAR.instances = [];

/** The global list of CoEditAR App instances. */
CoEditAR.autoInitialize = true;

// -------------------------------------------------------------- STATIC EVENTS

// Unless otherwise specified, automatically initialize the CoEditAR framework
// to make it easier for people to operate with it
window.addEventListener("load", () => {
	if (CoEditAR.autoInitialize && !CoEditAR.initialized)
		CoEditAR.init();
});


export default CoEditAR;