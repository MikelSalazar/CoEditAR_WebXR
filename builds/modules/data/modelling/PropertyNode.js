import { Node } from "../../CoEditAR.js";

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
