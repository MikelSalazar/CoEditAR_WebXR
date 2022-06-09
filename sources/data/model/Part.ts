import { Node } from "../Node"
import { String } from "../types/simple/String"
import { NodeSet } from "../NodeSet"
import { Shape } from "./Shape"

/** Defines a part of a smart assembly. */
export class Part extends Node {

	// --------------------------------------------------------- PRIVATE FIELDS

	/** The (unique) name of the part. */
	private _name: String;

	/** The id of the class this instance inherits from. */
	private _extends: String;

	/** The shape of the part. */
	private _shapes: NodeSet<Shape>;


	// ------------------------------------------------------ PUBLIC PROPERTIES

	/** The (unique) name of the part. */
	get name(): String { return this._name; }

	/** The id of the class this instance inherits from. */
	get extends(): String { return this._extends; }

	/** The shape of the part. */
	get shapes(): NodeSet<Shape> { return this._shapes; }


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new Part instance.
	 * @param name The name of the node.
	 * @param parent The parent node.
	 * @param data The initialization data. */
	constructor(name: string, parent?: Node, data: any = {}) {

		// Call the base class constructor
		super(name, parent, data, ["part"]);

		// Create the child nodes
		this._name = new String("name", this);
		this._extends = new String("extends", this);
		this._shapes = new NodeSet<Shape>("shapes", this, Shape);

		// Deserialize the initialization data
		if (data) this.deserialize(data);
	}
}
