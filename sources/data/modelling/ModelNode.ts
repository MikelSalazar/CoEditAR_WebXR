import { Node, Link } from "../../CoEditAR";

/** Defines a node that contains the data of a semantic domain. */
export class ModelNode extends Node {

	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new instance of the ModelNode class.
	 * @param name The name of the node.
	 * @param link The parent node link.
	 * @param data The initialization data. */
	constructor(name?: string, link?: Link<Node>, data?: any) {

		// Call the base class constructor
		super("model", name, link, data);
	}

}