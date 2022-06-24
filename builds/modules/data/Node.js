import { Event } from "../logic/Event.js";

/** Defines a data Node. */
export class Node {


	// ------------------------------------------------------------ CONSTRUCTOR

	/** Initializes a new instance of the Node class.
	 * @param name The name of the Node.
	 * @param parent The parent Node.
	 * @param data The initialization data.
	 * @param types The metadata of the node. */
	constructor(name, parent, data, types = []) {

		// Initialize the data of the node
		this._nodeName = name;
		this._nodeParent = parent;
		this._nodeChildren = [];
		this._nodeTypes = types;

		// If the name is undefined, create one based on the type data
		if (this._nodeName == undefined)
			this._nodeName =
				((types && types.length > 0) ? this.nodeType : "Node") +
					((parent && parent.nodeChildren.length > 1) ?
						parent.nodeChildren.length : "");

		// Create a link between the node and its parent
		if (parent && parent.nodeType)
			parent._nodeChildren.push(this);

		// Send an update request upwards in the Node hierarchy
		this._nodeUpdated = true;
		this.nodeUpdated = false;

		// Create the events
		this._onPreUpdate = new Event("preUpdate", this);
		this._onPostUpdate = new Event("postUpdate", this);
	}


	// ------------------------------------------------------ PUBLIC PROPERTIES

	/** The name of the Node. */
	get nodeName() { return this._nodeName; }

	/** The current type of the Node. */
	get nodeType() { return this._nodeTypes[this._nodeTypes.length - 1]; }

	/** The list of types of the Node. */
	get nodeTypes() { return this._nodeTypes; }

	/** The parent Node. */
	get nodeParent() {
		if (!this._nodeParent || !this._nodeParent.nodeType)
			return undefined;
		if (this._nodeParent._nodeTypes[0] == "nodeset")
			return this._nodeParent._nodeParent;
		return this._nodeParent;
	}

	/** The child Nodes. */
	get nodeChildren() { return this._nodeChildren; }

	/** Indicates if the Node has been updated or not. */
	get nodeUpdated() { return this._nodeUpdated; }
	set nodeUpdated(value) {

		// If the value provided is the same than the current one, do nothing
		// if (this._nodeUpdated == value) return;

		// Propagate "true" values downwards in the node hierarchy
		// if (value) for (let child in this._nodeChildren)
		// this._nodeChildren[child].nodeUpdated = false;

		// Otherwise, propagate "false" values upwards in the node hierarchy
		// and the connected nodes
		if (!value && this._nodeParent) {
			this._nodeParent.nodeUpdated = false;
		}

		// Apply the new value
		this._nodeUpdated = value;
	}

	/** An event triggered before the Node is updated. */
	get onPreUpdate() { return this._onPreUpdate; }

	/** An event triggered after the Node is updated. */
	get onPostUpdate() { return this._onPostUpdate; }


	// --------------------------------------------------------- PUBLIC METHODS

	/** Updates the Node.
	 * @param deltaTime The update time.
	 * @param forced Indicates whether the update is forced or not.
	 * @param data Additional update data. */
	update(deltaTime = 0, forced = false, data) {

		// If the update is not forced, skip it when the node is already updated
		if (this._nodeUpdated && !forced)
			return;

		// Trigger the pre-update event
		this._onPreUpdate.trigger(this, data);

		// Mark this node as updated
		this._nodeUpdated = true;

		// Update the children
		for (let child of this._nodeChildren)
			child.update(deltaTime, forced, data);

		//
		//for (let link of this._nodeLinks) link.nodeUpdated = false;

		// Trigger the post-update event
		this._onPostUpdate.trigger(this, data);
	}


	/** Serializes the Node instance.
	 * @param mode The serialization mode: full (default), simple,).
	 * @return The serialized data. */
	serialize(mode) {

		// Create an object to serialize the Node
		let data = {};

		// Save the name of the node
		if (this.nodeName)
			data.name = this.nodeName;

		// Serialize the child nodes
		for (let child of this._nodeChildren) {
			let nodeChildData = child.serialize(mode);
			if (mode == "simple" && nodeChildData == undefined)
				continue;
			data[child.nodeName || child.nodeType] = nodeChildData;
		}

		// Return the object with the serialized data
		return data;
	}


	/** Deserializes the Node instance.
	 * @param data The data to deserialize.
	 * @param mode The deserialization mode. */
	deserialize(data = {}, mode) {

		// If the data is a string, check if it is JSON or CSV data
		if (typeof data == "string")
			JSON.parse(data);

		// If the data is an array, try to parse it value by value
		if (Array.isArray(data)) {
			for (let dataIndex = 0; dataIndex < data.length; dataIndex++) {
				if (dataIndex >= this.nodeChildren.length)
					return;
				this.nodeChildren[dataIndex].deserialize(data[dataIndex], mode);
			}
		}

		// If the data is an object, analyze it key by key
		else
			for (let dataKey in data) {
				if (data[dataKey] == undefined)
					continue;
				for (let child of this._nodeChildren) {
					if (child._nodeName == dataKey) {
						child.deserialize(data[dataKey], mode);
						break;
					}
				}
			}
	}


	/** Searches for a specific ancestor Node (higher in the Node hierarchy).
	 * @param type The type of node to look for.
	 * @param name The name of node to look for.
	 * @returns The node that satisfies the search conditions (if it exists). */
	nodeAncestor(type, name) {
		let searchNode = this._nodeParent;
		while (searchNode) {
			if (type && searchNode._nodeTypes.includes(type))
				break;
			searchNode = searchNode._nodeParent;
		}
		return searchNode;
	}


	/** Converts the Node into its String representation.
	 * @returns The string representation of the Node. */
	toString() { return JSON.stringify(this.serialize()); }
}
