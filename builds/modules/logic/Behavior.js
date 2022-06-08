import { Node } from "../data/Node.js";

/** Defines a Logic Behavior. */
export class Behavior extends Node {

	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new Behavior instance.
	 * @param name The name of the behavior.
	 * @param parent The parent Node of the behavior.
	 * @param data The initialization data. */
	constructor(types, name, parent, data) {

		// Call the parent class constructor
		super([...types, "behavior"], name, parent, data);

		// Deserialize the initialization data
		if (data)
			this.deserialize(data);
	}
}
