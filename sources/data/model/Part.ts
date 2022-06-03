import { Node } from "../Node";
import { String } from "../types/simple/String";
import { Vector } from "../types/complex/Vector";


/** Defines a Part of a smart Assembly. */
export class Part extends Node {

	// --------------------------------------------------------- PRIVATE FIELDS

	/** The shape of the Part. */
	private _shape: String;

	/** The position of the Part. */
	private _position: Vector;


	// ------------------------------------------------------ PUBLIC PROPERTIES

	/** The shape of the Part. */
	get shape(): String { return this._shape; }

	/** The position of the Part. */
	get position(): Vector { return this._position; }


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new Part instance.
	 * @param name The name of the Part.
	 * @param parent The parent Node of the Part.
	 * @param data The initialization data. */
	 constructor(name: string, parent: Node, data?: any) {
	 
		// Call the parent class constructor
		super(["part"], name, parent, data);

		// Create the child nodes
		this._shape = new String("shape", this);
		this._position = new Vector("position", this);

		// Deserialize the initialization data
		if (data) this.deserialize(data);
	}
}