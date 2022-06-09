import { Node } from "../Node.js";
import { String } from "../types/simple/String.js";
import { NodeSet } from "../NodeSet.js";
import { Shape } from "./Shape.js";

/** Defines a part of a smart assembly. */
export class Part extends Node {


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new Part instance.
	 * @param name The name of the node.
	 * @param parent The parent node.
	 * @param data The initialization data. */
	constructor(name, parent, data = {}) {

		// Call the base class constructor
		super(name, parent, data, ["part"]);

		// Create the child nodes
		this._name = new String("name", this);
		this._extends = new String("extends", this);
		this._shapes = new NodeSet("shapes", this, Shape);

		// Deserialize the initialization data
		if (data)
			this.deserialize(data);
	}


	// ------------------------------------------------------ PUBLIC PROPERTIES

	/** The (unique) name of the part. */
	get name() { return this._name; }

	/** The id of the class this instance inherits from. */
	get extends() { return this._extends; }

	/** The shape of the part. */
	get shapes() { return this._shapes; }
}

