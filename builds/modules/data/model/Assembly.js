import { Node } from "../Node.js";
import { String } from "../types/simple/String.js";
import { NodeSet } from "../NodeSet.js";
import { Shape } from "./Shape.js";
import { Part } from "./Part.js";

/** Defines a smart assembly. */
export class Assembly extends Node {


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new Assembly instance.
	 * @param data The initialization data. */
	constructor(name, parent, data = {}) {

		// Call the base class constructor
		super(["assembly"], name, parent, data);

		// Create the child nodes
		this._name = new String("name", this);
		this._extends = new String("extends", this);
		this._shapes = new NodeSet("shapes", this, Shape);
		this._parts = new NodeSet("parts", this, Part);

		// Deserialize the initialization data
		if (data)
			this.deserialize(data);
	}


	// ------------------------------------------------------ PUBLIC PROPERTIES

	/** The (unique) name of the assembly. */
	get name() { return this._name; }

	/** The id of the class this instance inherits from. */
	get extends() { return this._extends; }

	/** The shapes of the assembly. */
	get shapes() { return this._shapes; }

	/** The parts of the assembly. */
	get parts() { return this._parts; }
}

