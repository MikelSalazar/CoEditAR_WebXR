
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

import { Node } from "./data/Node.js";
import { Domain } from "./logic/semantic/Domain.js";
import { Class } from "./logic/semantic/Class.js";

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
