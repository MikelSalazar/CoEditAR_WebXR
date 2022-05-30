import { Node } from "../../data/Node.js";

/** Defines an user interaction Layer. */
export class Space extends Node {

	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new Layer instance.
	 * @param name The name of the Layer.
	 * @param parent The parent Node of the Layer.
	 * @param data The initialization data. */
	constructor(name, parent, data) {

		// Call the parent class constructor
		super(["space"], name, parent, data);
	}
}
