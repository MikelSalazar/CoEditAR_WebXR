<<<<<<< HEAD
import { Item } from "../data/Item.js";
import { Function } from "../data/types/Function.js";

/** Defines a Logic Behavior. */
export class Behavior extends Item {
=======
import { Node } from "../data/Node.js";
import { Function } from "../data/types/Function.js";

/** Defines a Logic Behavior. */
export class Behavior extends Node {
>>>>>>> a1bb1438a29eadf7da80cdc810cdac2dbd2d398a


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new Behavior instance.
<<<<<<< HEAD
	 * @param name The name of the data type.
	 * @param relation The data relation.
	 * @param data The initialization data. */
	constructor(name, relation, data) {

		// Call the parent class constructor
		super(name, relation);

		// Create the entity for the space
		this._startFunction = new Function("start", this.children);
		this._updateFunction = new Function("update", this.children);
=======
	 * @param name The name of the node.
	 * @param parent The parent node.
	 * @param data The initialization data.
	 * @param types The metadata of the node. */
	constructor(name, parent, data, types = []) {

		// Call the parent class constructor
		super(name, parent, data, [...types, "behavior"]);

		// Create the entity for the space
		this._startFunction = new Function("start", this);
		this._updateFunction = new Function("update", this);
>>>>>>> a1bb1438a29eadf7da80cdc810cdac2dbd2d398a

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
