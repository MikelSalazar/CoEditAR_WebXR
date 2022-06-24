import { Item } from "../data/Item";
import { Relation } from "../data/Relation";
import { Function } from "../data/types/Function";

/** Defines a Logic Behavior. */
export class Behavior extends Item {

	
	// --------------------------------------------------------- PRIVATE FIELDS

	/** The start function name. */
	private _startFunction: Function;

	/** The update function name. */
	private _updateFunction: Function;


	// ------------------------------------------------------- PUBLIC ACCESSORS

	/** The start function name. */
	get startFunction(): Function { return this._startFunction; }

	/** The update function name. */
	get updateFunction(): Function { return this._updateFunction; }


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new Behavior instance.
	 * @param name The name of the data type.
	 * @param relation The data relation.
	 * @param data The initialization data. */
	 constructor(name?: string, relation?: Relation<Item>, data?: any) {

		// Call the parent class constructor
		super(name, relation);

		// Create the entity for the space
		this._startFunction = new Function("start", this.children);
		this._updateFunction = new Function("update", this.children);

		// Deserialize the initialization data
		if (data) this.deserialize(data);
	}
}