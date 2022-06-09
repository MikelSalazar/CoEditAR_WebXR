import { Node } from "./Node";
import { String } from "./types/simple/String";

/** Defines an external data resource. */
export abstract class Resource extends Node {

	// --------------------------------------------------------- PRIVATE FIELDS

	/** The URL of the resource. */
	private _url: String;

	/** The load percentage of the resource. */
	private _loaded: number;


	// ------------------------------------------------------- PUBLIC ACCESSORS

	/** The URL of the resource. */
	get url(): String { return this._url; }

	/** The load percentage of the resource. */
	get loaded(): number { return this._loaded; }


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new instance of the Simple class.
	 * @param name The name of the node.
	 * @param parent The parent node.
	 * @param data The initialization data.
	 * @param types The metadata of the node. */
	constructor(type: string, name?: string, parent?: Node, data?: any) {
		
		// Call the parent class constructor
		super(name, parent),[type, "resource"];

		// Create the child nodes
		this._url = new String("url", this);

		// Deserialize the initialization data
		if (data != undefined) this.deserialize(data);

		// Mark the resource as not loaded
		// Mark the resource as not loaded
		this._loaded = 0;
	}


	// --------------------------------------------------------- PUBLIC METHODS

	/** Serializes the String instance.
 	* @return The serialized data. */
	serialize(): any { return this._url; }

	/** Deserializes the Simple data type.
	 * @param data The value to deserialize.
	 * @param mode The deserialization mode. */
	deserialize(data: any, mode?: string) { 
		if (data && typeof(data) == "string") this._url.value = data; 
	}
		
	/** Loads the resource.
	 * @param url The URL of the Resource. */
	public load(url?: URL) {
		if (url) this._url.value = url.toString(); 
		this._loaded = 0;	
	}

}