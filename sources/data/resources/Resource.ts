import { Node } from "../Node";
import { String } from "../types/simple/String";

/** Defines an external data resource. */
export abstract class Resource extends Node {

	// --------------------------------------------------------- PRIVATE FIELDS

	/** The URL of the Resource. */
	private _url: String;


	// ------------------------------------------------------- PUBLIC ACCESSORS

	/** The URL of the Resource. */
	get url(): String { return this._url; }

	// ----------------------------------------------------- PUBLIC CONSTRUCTOR


	/** Initializes a new Resource instance.
	 * @param resourceType The type of the Node.
	 * @param name The name of the Node.
	 * @param parent The parent Node.
	 * @param data The initialization data. */
	constructor(resourceType: string, name?: string, parent?: Node, data?: any) {
		
		// Call the parent class constructor
		super([resourceType, "resource"], name, parent);

		// Create the URL of the Resource
		this._url = new String("url", this);
	}


	// --------------------------------------------------------- PUBLIC METHODS

	/** Loads the resource.
	 * @param url The URL of the Resource. */
	public load(url?: string) {
	}


}