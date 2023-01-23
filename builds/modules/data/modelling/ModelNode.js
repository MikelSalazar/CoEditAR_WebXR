import { Node } from "../../CoEditAR.js";

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
