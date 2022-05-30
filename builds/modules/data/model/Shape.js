import { Node } from "../Node.js";
import { String } from "../types/simple/String.js";
import { Vector } from "../types/complex/Vector.js";

/** Defines a geometric Shape. */
export class Shape extends Node {


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new Shape instance.
	 * @param name The name of the Shape.
	 * @param parent The parent Node of the Shape.
	 * @param data The initialization data. */
	constructor(name, parent, data) {

		// Call the parent class constructor
		super(["shape"], name, parent, data);

		// Create the child nodes
		this._type = new String("type", this);
		this._size = new Vector("size", this);

		// Deserialize the initialization data
		if (data)
			this.deserialize(data);
	}


	// ------------------------------------------------------ PUBLIC PROPERTIES

	/** The type of the Shape. */
	get shape() { return this._type; }

	/** The size of the Shape. */
	get size() { return this._size; }
}
