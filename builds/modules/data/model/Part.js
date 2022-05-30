import { Node } from "../Node.js";
import { String } from "../types/simple/String.js";
import { Vector } from "../types/complex/Vector.js";


/** Defines a Part of a smart Assembly. */
export class Part extends Node {


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new Part instance.
	 * @param name The name of the Part.
	 * @param parent The parent Node of the Part.
	 * @param data The initialization data. */
	constructor(name, parent, data) {

		// Call the parent class constructor
		super(["part"], name, parent, data);

		// Create the child nodes
		this._shape = new String("shape", this);
		this._position = new Vector("position", this);

		// Deserialize the initialization data
		if (data)
			this.deserialize(data);
	}


	// ------------------------------------------------------ PUBLIC PROPERTIES

	/** The shape of the Part. */
	get shape() { return this._shape; }

	/** The position of the Part. */
	get position() { return this._position; }
}
