import { Node } from "./Node.js";
import { String } from "./types/simple/String.js";

/** Defines an external data resource. */
export class Resource extends Node {


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new Resource instance.
	 * @param type The type of resource.
	 * @param name The name of resource.
	 * @param parent The parent Node.
	 * @param data The initialization data. */
	constructor(type, name, parent, data) {

		// Call the parent class constructor
		super([type, "resource"], name, parent);

		// Create the child nodes
		this._url = new String("url", this);

		// Deserialize the initialization data
		if (data != undefined)
			this.deserialize(data);

		// Mark the resource as not loaded
		// Mark the resource as not loaded
		this._loaded = 0;
	}


	// ------------------------------------------------------- PUBLIC ACCESSORS

	/** The URL of the resource. */
	get url() { return this._url; }

	/** The load percentage of the resource. */
	get loaded() { return this._loaded; }


	// --------------------------------------------------------- PUBLIC METHODS

	/** Serializes the String instance.
	* @return The serialized data. */
	serialize() { return this._url; }

	/** Deserializes the Simple data type.
	 * @param data The value to deserialize.
	 * @param mode The deserialization mode. */
	deserialize(data, mode) {
		if (data && typeof (data) == "string")
			this._url.value = data;
	}

	/** Loads the resource.
	 * @param url The URL of the Resource. */
	load(url) {
		if (url)
			this._url.value = url.toString();
		this._loaded = 0;
	}
}
