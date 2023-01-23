import { Node, Link, StringNode } from "../../CoEditAR.js";

/** Defines a node that contains the data of a semantic class. */
export class ClassNode extends Node {


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new instance of the ClassNode class.
	 * @param name The name of the node.
	 * @param link The parent node link.
	 * @param data The initialization data. */
	constructor(name, link, data) {

		// Call the base class constructor
		super("class", name, link, data);

		// The properties of the class
		this.properties = new Link("properties", this._children, this);

		// Create a link for the instances of the class
		this.instances = new Link("instances", undefined, this);

		// Create a link for the relations with other classes
		this.relations = new Link("instances", undefined, this);

		//
		this.title = new StringNode("title", this.children);

	}
}
