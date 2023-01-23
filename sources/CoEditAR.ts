
// ----------------------------------------------------------- EXPORTS SEQUENCE

// Manage the exports of the entire framework to avoid circular references
export * from './data/serialization/Serializable'
export * from './data/serialization/Serialization'
export * from './data/serialization/serializers/JsonSerializer'
// export * from './data/serialization/XmlSerializer'
export * from './data/localization/Locale'
export * from './data/localization/LocalizedString'
export * from './logic/Expression'
export * from './logic/Context'
export * from './logic/Event'
export * from './logic/semantic/Domain'
export * from './logic/semantic/Class'
export * from './logic/semantic/Property'
export * from './logic/semantic/Relation'
export * from './logic/semantic/Instance'
export * from './logic/semantic/Metadata'
export * from './data/Node'
export * from './data/Link'
export * from './data/modelling/ModelNode'
export * from './data/modelling/ClassNode'
export * from './data/modelling/PropertyNode'
export * from './data/types/basic/BooleanNode'
export * from './data/types/basic/NumberNode'
export * from './data/types/basic/StringNode'
export * from './data/types/VectorNode'


// ----------------------------------------------------------------- MAIN CLASS

import { Node } from "./data/Node";
import { Domain } from "./logic/semantic/Domain";
import { Class } from "./logic/semantic/Class";

/** Manages the CoEditAR Framework. */
export class CoEditAR extends Node {

	// ------------------------------------------------------ SEMANTIC METADATA

	/** The main domain of the CoEditAR Framework. */
	static domain: Domain = Domain.default;


	/** The semantic metadata of the class. */
	static class: Class = new Class("root", Domain.default,
		{
			implementation: CoEditAR,
			properties:{
				"CoEditAR": { type: "number"},
				"title": { type: "string"},
				"description": { type: "string"},
				// "vector": { classes: [VectorNode.class]}
			},
			required: ["CoEditAR"],
			// additionalProperties: false
		}
	);


	//- -------------------------------------------------- STATIC PUBLIC FIELDS

	/** The global list of CoEditAR App instances. */
	static instances: CoEditAR[] = [];

	/** The global list of CoEditAR App instances. */
	static autoInitialize: boolean = true;


	// ------------------------------------------------ STATIC PUBLIC ACCESSORS

	/** The name of the CoEditAR Framework. */
	static get frameworkName(): string { return "CoEditAR"; }

	/** The version number of the CoEditAR Framework. */
	static get frameworkVersion(): number { return 0.1; }

	/** Indicates whether the framework has already been initialized or not. */
	static get initialized(): boolean { return CoEditAR.instances.length > 0; }


	// -------------------------------------------------- STATIC PUBLIC METHODS

	/** Initializes the CoEditAR Framework.
	 * @param data The initialization data (or a URL to the data file). */
	static init(data?: object | URL) { return new CoEditAR(data); }


	// ------------------------------------------------------- PUBLIC ACCESSORS

	/** The name of the node (removed when there is no other instance). */
	get name(): string { return undefined; }


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new CoEditAR instance.
	 * @param data The initialization data (or a URL to the data file). */
	constructor(data?: object | URL | string) {

		// Call the base class constructor
		super(CoEditAR.class, 'CoEditAR');

		// Load/Deserialize the initialization data
		if (data) {
			if (typeof(data) == 'string') this.load(data);
			else this.deserialize(data);
		}

		// Add this instance to the list (and show a message if it is the first)
		CoEditAR.instances.push(this);
		if (CoEditAR.instances.length == 1) console.log(
			"CoEditAR " + CoEditAR.frameworkVersion + " Initialized");
	}


	// --------------------------------------------------------- PUBLIC METHODS

	/** Initializes a new CoEditAR instance.
	 * @param url The initialization data (or a URL to the data file). */
	load(url: URL | string) {

		// Check the provided URL
		if(!url) throw Error ("Invalid URL.");
		if(typeof(url) == 'string') url = encodeURI(url);
		
		// Load the file as a text file to 
		fetch(url).then((response) => response.text()).then((textData) => {

			// let serializer = new JsonSerializer();
			// serializer.deserialize(textData, this);
		});
	}


	/** Deserializes the CoEditAR instance.
	 * @param data The data to deserialize. */
	deserialize(data: any) {
		
		// Check if there is data to deserialize
		if (data == undefined) return;

		// Call the base class function
		super.deserialize(data);

		// Show the serialized data on console
		console.log("Result: ");
		console.log(this);
		console.log(this.toString("JSON"));

		// for(let view of this.views) view.init(this.spaces);
	}
}

// -------------------------------------------------------------- STATIC EVENTS

// Unless otherwise specified, automatically initialize the CoEditAR framework
// to make it easier for people to operate with it
window.addEventListener("load", () => {
	if(CoEditAR.autoInitialize && !CoEditAR.initialized) CoEditAR.init();
});