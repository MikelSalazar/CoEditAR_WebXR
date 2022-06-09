import { Node } from "../Node.js";
import { String } from "../types/simple/String.js";
import { NodeSet } from "../NodeSet.js";
import { Assembly } from "./Assembly.js";
import { Behavior } from "../../logic/Behavior.js";
import { Entity } from "../../logic/Entity.js";

/** Describes a package (a collection of resources). */
export class Package extends Node {


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new Package instance.
	 * @param name The name of the node.
	 * @param parent The parent node.
	 * @param data The initialization data. */
	constructor(name, parent, data = {}) {

		// Call the base class constructor
		super(name, parent, data, ["package"]);

		// Create the child nodes
		this._name = new String("name", this);
		this._extends = new String("extends", this);
		this._assemblies = new NodeSet("assemblies", this, Assembly);
		this._behaviors = new NodeSet("behaviors", this, Behavior);
		this._entities = new NodeSet("entities", this, Entity);

		// Deserialize the initialization data
		if (data)
			this.deserialize(data);
	}


	// ------------------------------------------------------ PUBLIC PROPERTIES

	/** The (unique) name of the package. */
	get name() { return this._name; }

	/** The id of the class this instance inherits from. */
	get extends() { return this._extends; }

	/** The behaviors contained in the package. */
	get assemblies() { return this._assemblies; }

	/** The behaviors contained in the package. */
	get behaviors() { return this._behaviors; }

	/** The entities contained in the package. */
	get entities() { return this._entities; }
}

