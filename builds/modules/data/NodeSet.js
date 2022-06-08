import { Node } from "./Node.js";

/** Define a set of data Nodes. */
export class NodeSet extends Node {

	// ------------------------------------------------------------ CONSTRUCTOR

	/** Initializes a new instance of the NodeSet class.
	 * @param name The name of the NodeSet.
	 * @param parent The parent Node.
	 * @param subtypes The node subtypes of the NodeSet.
	 * @param data The initialization data. */
	constructor(name, parent, subtypes, data) {

		// Call the parent class constructor
		super(["nodeset"], name, parent, data);

		// Set the node subtype
		this._nodeSubtypes = subtypes;
	}


	// ------------------------------------------------------ PUBLIC PROPERTIES

	/** The children Nodes (converted to the type). */
	get typedChildren() {
		return this.nodeChildren;
	}

	/** The number of child in the NodeSet. */
	get count() { return this.nodeChildren.length; }

	/** Identifies teh instance as a NodeSet. */
	get isNodeSet() { return true; }


	// --------------------------------------------------------- PUBLIC METHODS

	/** Serializes the Node instance.
	 * @param mode The serialization mode.
	 * @return The serialized data. */
	serialize(mode) {

		// Create an object to serialize the Node
		let serializedData = [];

		// Serialize the child nodes
		for (let child of this._nodeChildren) {
			serializedData.push(child.serialize(mode));
			if (this.nodeName != this.nodeType)
				serializedData.name = this.nodeName;
		}

		// Return the object with the serialized data
		if (mode == "simple" && serializedData.length == 0)
			serializedData = undefined;
		return serializedData;
	}


	/** Deserializes the NodeSet instance.
	 * @param data The data to deserialize.
	 * @param mode The deserialization mode. */
	deserialize(data, mode) {

		// Get the subtype data
		let subtype = this._nodeSubtypes;

		if (Array.isArray(data)) {
			for (const datum of data) {
				let subtype = this._nodeSubtypes;
				if (typeof subtype == "object")
					subtype = (datum.type) ? subtype[datum.type] : subtype[""];
				if (!subtype)
					throw new Error("Unknown type: " + datum.type);
				new subtype(datum.name, this, datum);
			}
		}
		else
			for (const key in data) {
				const datum = data[key];
				if (typeof subtype == "object")
					subtype = (datum.type) ? subtype[datum.type] : subtype[""];
				if (!subtype)
					throw new Error("Unknown type: " + datum.type);
				let node = new subtype(key, this, data[key]);
				this[key] = node;
			}
	}


	/** Gets a specific Node in the collection.
	 * @param name The name of the node to get. */
	getByName(name) {
		for (let child of this.nodeChildren)
			if (child.nodeName == name)
				return child;
		return undefined;
	}


	/** Gets a node by index.
	 * @param index The index of the node to get.
	 * @returns The node with the given index. */
	getByIndex(index) {
		return this.nodeChildren[index];
	}


	/** Provides an iterator to navigate though the NodeSet. */
	[Symbol.iterator]() {
		let pointer = 0;
		let items = this._nodeChildren;
		return {
			next() {
				if (pointer < items.length)
					return { done: false,
						value: items[pointer++] };
				else
					return { done: true, value: null };
			}
		};
	}
}
