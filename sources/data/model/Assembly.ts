import { Node } from "../Node";
import { NodeSet } from "../NodeSet";
import { String } from "../types/simple/String";
import { Part } from "./Part";
import { Shape } from "./Shape";

/** Defines a smart Assembly. */
export class Assembly extends Node {

	// --------------------------------------------------------- PRIVATE FIELDS

	/** The classification of the Assembly. */
	private _classification: String;

	/** The shapes of the Assembly. */
	private _shapes: NodeSet<Shape>;

	/** The parts of the Assembly. */
	private _parts: NodeSet<Part>;

	
	// ------------------------------------------------------ PUBLIC PROPERTIES

	/** The classification of the Assembly. */
	get classification(): String { return this._classification; }

	/** The shapes of the Assembly. */
	get shapes(): NodeSet<Shape> { return this._shapes; }

	/** The parts of the Assembly. */
	get parts(): NodeSet<Part> { return this._parts; }


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new Assembly instance.
	 * @param name The name of the Assembly.
	 * @param parent The parent Node of the Assembly.
	 * @param data The initialization data. */
	 constructor(name: string, parent: Node, data?: any) {
	 
		// Call the parent class constructor
		super(["assembly"], name, parent, data);

		// Create the child nodes
		this._classification = new String("classification", this);
		this._shapes = new NodeSet<Shape>("shapes", this, Shape);
		this._parts = new NodeSet<Part>("parts", this, Part);

		// Deserialize the initialization data
		if (data) this.deserialize(data);
	}

}