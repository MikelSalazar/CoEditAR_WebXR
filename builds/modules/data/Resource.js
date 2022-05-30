import { Node } from "./Node.js";
import { String } from "./types/simple/String.js";

/** Defines an external data resource. */
export class Resource extends Node {

	// ----------------------------------------------------- PUBLIC CONSTRUCTOR


	/** Initializes a new Resource instance.
	 * @param resourceType The type of the Node.
	 * @param name The name of the Node.
	 * @param parent The parent Node.
	 * @param data The initialization data. */
	constructor(resourceType, name, parent, data) {

		// Call the parent class constructor
		super([resourceType, "resource"], name, parent);

		// Create the URL of the Resource
		this._url = new String("url", this);
	}


	// ------------------------------------------------------- PUBLIC ACCESSORS

	/** The URL of the Resource. */
	get url() { return this._url; }


	// --------------------------------------------------------- PUBLIC METHODS

	/** Loads the resource.
	 * @param url The URL of the Resource. */
	load(url) {
	}
}
