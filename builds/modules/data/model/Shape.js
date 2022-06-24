import { Node } from "../Node.js";
import { String } from "../types/simple/String.js";
import { Distance } from "../types/measures/distance.js";

/** Defines a shape of a smart assembly. */
export class Shape extends Node {


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new Shape instance.
	 * @param name The name of the node.
	 * @param parent The parent node.
	 * @param data The initialization data. */
	constructor(name, parent, data = {}) {

		// Call the base class constructor
		super(name, parent, data, ["shape"]);

		// Create the child nodes
		this._name = new String("name", this);
		this._extends = new String("extends", this);
		this._type = new String("type", this);
		this._width = new Distance("width", this);
		this._height = new Distance("height", this);
		this._depth = new Distance("depth", this);
		this._radius = new Distance("radius", this);
		this._radius2 = new Distance("radius2", this);

		// Deserialize the initialization data
		if (data)
			this.deserialize(data);
	}


	// ------------------------------------------------------ PUBLIC PROPERTIES

	/** The (unique) name of the shape. */
	get name() { return this._name; }

	/** The id of the class this instance inherits from. */
	get extends() { return this._extends; }

	/** The type of the shape ('box', 'ellipsoid', 'cylinder' or 'cone'). */
	get type() { return this._type; }

	/** The width of the shape. */
	get width() { return this._width; }

	/** The height of the shape. */
	get height() { return this._height; }

	/** The depth of the shape. */
	get depth() { return this._depth; }

	/** The radius of the shape. */
	get radius() { return this._radius; }

	/** The secondary radius of the shape (for cones). */
	get radius2() { return this._radius2; }
}

