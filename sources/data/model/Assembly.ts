import { Node } from "../Node"
import { String } from "../types/simple/String"
import { NodeSet } from "../NodeSet"
import { Shape } from "./Shape"
import { Part } from "./Part"

/** Defines a smart assembly. */
export class Assembly extends Node {

	// --------------------------------------------------------- PRIVATE FIELDS

	/** The (unique) name of the assembly. */
	private _name: String;

	/** The id of the class this instance inherits from. */
	private _extends: String;

	/** The shapes of the assembly. */
	private _shapes: NodeSet<Shape>;

	/** The parts of the assembly. */
	private _parts: NodeSet<Part>;


	// ------------------------------------------------------ PUBLIC PROPERTIES

	/** The (unique) name of the assembly. */
	get name(): String { return this._name; }

	/** The id of the class this instance inherits from. */
	get extends(): String { return this._extends; }

	/** The shapes of the assembly. */
	get shapes(): NodeSet<Shape> { return this._shapes; }

	/** The parts of the assembly. */
	get parts(): NodeSet<Part> { return this._parts; }


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new Assembly instance.
	 * @param data The initialization data. */
	constructor(name: string, parent?: Node, data: any = {}) {

		// Call the base class constructor
		super(["assembly"], name, parent, data);

		// Create the child nodes
		this._name = new String("name", this);
		this._extends = new String("extends", this);
		this._shapes = new NodeSet<Shape>("shapes", this, Shape);
		this._parts = new NodeSet<Part>("parts", this, Part);

		// Deserialize the initialization data
		if (data) this.deserialize(data);
	}
}
