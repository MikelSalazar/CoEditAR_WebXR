import { Link, Class, Serialization, Instance } from "../CoEditAR";
import { BooleanNode, NumberNode, StringNode } from "../CoEditAR";

/** Defines a basic node (in a hierarchical structure). */
export class Node extends Instance {

	// ------------------------------------------------------ SEMANTIC METADATA

	/** The semantic metadata of the class. */
	static class: Class = new Class("Node", null, { implementation: Node });


	// ------------------------------------------------------- PROTECTED FIELDS

	/** The name of the node. */
	protected _name: string;

	/** The class of the node. */
	protected _class: Class;

	/** Indicates whether the data item has been updated or not. */
	protected _updated: boolean;

	/** The links of the node. */
	protected _links: Record<string, Link<Node>>;

	/** The link to the parent node. */
	protected _parent: Link<Node>;

	/** The link to the children nodes. */
	protected _children: Link<Node>;


	// ------------------------------------------------------- PUBLIC ACCESSORS

	/** The name of the node. */
	get name(): string { return this._name; }

	/** The class of the node. */
	get class(): Class { return this._class; }

	/** The parent node. */
	get parent(): Node | undefined { return this._parent.target; }

	/** Get the unique id of the node. */
	get id(): string {
		return (this._parent.target? this._parent.target.id : "") + this._name;
	}

	/** The child nodes. */
	get children(): Link<Node> { return this._children; }

	/** Indicates if the Node has been updated or not. */
	get updated(): boolean { return this._updated; }
	set updated(value: boolean) {

		// Propagate "false" values upwards in the node hierarchy
		if (value == false && this.parent) this.parent.updated = false;
		
		// Apply the new value
		this._updated = value;
	}

	

	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new instance of the Node class.
	 * @param type The type of the node.
	 * @param name The name of the node.
	 * @param link The node link.
	 * @param data The initialization data. */
	constructor(type: Class | string, name?: string, link?: Link<Node>, 
		data?: any) {

		// Call the base class constructor without the data.
		super(type);

		// Check the given name
		if (!name && data) name = data.name;
		if (!name) throw Error('No name provided for node');
		if (!Serialization.isName(name)) 
			throw Error ('Invalid node name: "' + name + '"');

		// TODO check the name on the parent
		this._name = name;

		if (type != undefined) {
			if(typeof type == "string")  {
				//TODO get Class via name
			}

			else this._class = type;
		}
		

		// Create the node links
		this._links = {};
		this._parent = this._links.parent = new Link("parent", undefined, this,
			(link)? [link.source] : undefined, "children", undefined, 0, 1);
		this._children = this._links.children = new Link("children", undefined,
			this, [], "parent");
		
		// If there is a node link, create a link
		if (link) {	link.add(this); this._parent.add(link.source); }

		// If there is any initialization data, deserialize it
		this.deserialize(data);
	}

	// --------------------------------------------------------- PUBLIC METHODS
	
	/** Deserializes the Node. 
	 * @param data The data to deserialize. */
	deserialize(data?: any) {
		
		// Show a debug message on the console
		console.log("Deserializing Node: " + this.id);	
		
		console.log (this.class);
		
		
		Object.defineProperty(this, "test", { value: new BooleanNode("test", this.children) });
	}


	/** Serializes the Node.
	* @param data Additional data to include in the serialized object.
	* @return The serialized data. */
	serialize(data: any = {}) {

		// Save the name of the node
		data.name = this.name;

		// Add the children nodes
		if (this.children.cardinality > 0) {
			let childrenData = [];
			for (let child of this.children) {
				let childData = child.serialize();
				if (childData == undefined) continue;
				if (typeof childData == "object") childrenData.push(childData);
				else data[child.name] = childData;
			}
			if (childrenData.length > 0) data.children = childrenData;
		}

		// Return the serialized data
		return data;
	}


	/** Obtains a string representation of the type instance.
	 * @param mode The type of serialization: id (default), JSON.
	 * @returns The string representation of the node instance. */
	toString(mode?: string): string { 
		switch (mode) {
			case "JSON": return JSON.stringify(this.serialize());
			default: return this.name;
		}
	}
}
