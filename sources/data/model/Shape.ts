import { Node } from "../Node";
import { String } from "../types/simple/String";
import { Vector } from "../types/complex/Vector";

/** Defines a geometric Shape. */
export class Shape extends Node {

	// --------------------------------------------------------- PRIVATE FIELDS

	/** The type of the Shape. */
	private _type: String;

	/** The size of the Shape. */
	private _size: Vector;


	// ------------------------------------------------------ PUBLIC PROPERTIES

	/** The type of the Shape. */
	get shape(): String { return this._type; }

	/** The size of the Shape. */
	get size(): Vector { return this._size; }


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new Shape instance.
	 * @param name The name of the Shape.
	 * @param parent The parent Node of the Shape.
	 * @param data The initialization data. */
	 constructor(name: string, parent: Node, data?: any) {
	 
		// Call the parent class constructor
		super(["shape"], name, parent, data);

		// Create the child nodes
		this._type = new String("type", this);
		this._size = new Vector("size", this);

		// Deserialize the initialization data
		if (data) this.deserialize(data);
	}

}