import { Node, Link, BooleanNode, StringNode } from "../../CoEditAR";
import { PropertyNode } from "./PropertyNode";

/** Defines a node that contains the data of a semantic class. */
export class ClassNode extends Node {

	// ---------------------------------------------------------- PUBLIC FIELDS

	/** The title of the class. */
	readonly title: StringNode;

	/** The description of the class. */
	readonly description: StringNode;

	/** The abstract nature of the class. */
	readonly isAbstract: BooleanNode;

	/** The properties of the class. */
	readonly properties: Link<PropertyNode>;

	/** The list of required properties. */
	readonly required: StringNode;

	/** Indicates if additional properties are allowed or not. */
	readonly additionalProperties: BooleanNode;
	
	/** The instances of the class. */
	readonly instances: Link<Node>;

	/** The relations of the class (links with others classes). */
	readonly relations: Link<ClassNode>;


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new instance of the ClassNode class.
	 * @param name The name of the node.
	 * @param link The parent node link.
	 * @param data The initialization data. */
	constructor(name?: string, link?: Link<Node>, data?: any) {

		// Call the base class constructor
		super("class", name, link, data);

		// The properties of the class
		this.properties = new Link("properties", this._children, this );

		// Create a link for the instances of the class
		this.instances = new Link("instances", undefined, this);

		// Create a link for the relations with other classes
		this.relations = new Link("instances", undefined, this);

		//
		this.title = new StringNode("title", this.children);

	}
}