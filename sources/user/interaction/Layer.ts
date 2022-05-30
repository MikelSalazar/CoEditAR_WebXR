import { Node } from "../../data/Node";

/** Defines an user interaction Layer. */
export class Layer extends Node {

	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new Layer instance.
	 * @param name The name of the Layer.
	 * @param parent The parent Node of the Layer.
	 * @param data The initialization data. */
	 constructor(name: string, parent: Node, data?: any) {
	 
		// Call the parent class constructor
		super(["layer"], name, parent, data);
	}

}