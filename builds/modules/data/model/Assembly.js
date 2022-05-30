import { Node } from "../Node.js";
import { NodeSet } from "../NodeSet.js";
import { String } from "../types/simple/String.js";
import { Part } from "./Part.js";
import { Shape } from "./Shape.js";

/** Defines a smart Assembly. */
export class Assembly extends Node {


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new Assembly instance.
	 * @param name The name of the Assembly.
	 * @param parent The parent Node of the Assembly.
	 * @param data The initialization data. */
	constructor(name, parent, data) {

		// Call the parent class constructor
		super(["assembly"], name, parent, data);

		// Create the child nodes
		this._classification = new String("classification", this);
		this._shapes = new NodeSet("shapes", this, Shape);
		this._parts = new NodeSet("parts", this, Part);

		// Deserialize the initialization data
		if (data)
			this.deserialize(data);
	}


	// ------------------------------------------------------ PUBLIC PROPERTIES

	/** The classification of the Assembly. */
	get classification() { return this._classification; }

	/** The shapes of the Assembly. */
	get shapes() { return this._shapes; }

	/** The parts of the Assembly. */
	get parts() { return this._parts; }
}
