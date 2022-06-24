import { Item } from "../data/Item.js";
import { Function } from "../data/types/Function.js";

/** Defines a Logic Behavior. */
export class Behavior extends Item {


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new Behavior instance.
	 * @param name The name of the data type.
	 * @param relation The data relation.
	 * @param data The initialization data. */
	constructor(name, relation, data) {

		// Call the parent class constructor
		super(name, relation);

		// Create the entity for the space
		this._startFunction = new Function("start", this.children);
		this._updateFunction = new Function("update", this.children);

		// Deserialize the initialization data
		if (data)
			this.deserialize(data);
	}


	// ------------------------------------------------------- PUBLIC ACCESSORS

	/** The start function name. */
	get startFunction() { return this._startFunction; }

	/** The update function name. */
	get updateFunction() { return this._updateFunction; }
}
