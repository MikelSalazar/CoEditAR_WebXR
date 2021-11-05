/** Defines a data Node. */
export abstract class Node {

	// ------------------------------------------------------- PROTECTED FIELDS

	/** The name of the Node. */
	protected _nodeName: string | undefined;

	/** The list of types of the Node. */
	protected _nodeTypes: string[];

	/** The parent Node. */
	protected _nodeParent: Node | undefined;

	/** The child Nodes. */
	protected _nodeChildren: Node[];

	/** The linked Nodes. */
	protected _nodeLinks: Node[];

	/** Indicates whether the Node has been updated or not. */
	protected _nodeUpdated: boolean;


	// ------------------------------------------------------ PUBLIC PROPERTIES

	/** The name of the Node. */
	get nodeName(): string | undefined { return this._nodeName; }

	/** The current type of the Node. */
	get nodeType(): string { return this._nodeTypes[0]; }

	/** The list of types of the Node. */
	get nodeTypes(): string[] { return this._nodeTypes; }

	/** The parent Node. */
	get nodeParent(): Node | undefined { return this._nodeParent; }

	/** The child Nodes. */
	get nodeChildren(): Node[] { return this._nodeChildren; }

	/** Indicates if the Node has been updated or not. */
	get nodeUpdated(): boolean { return this._nodeUpdated; }
	set nodeUpdated(value: boolean) {

		// If the value provided is the same than the current one, do nothing
		// if (this._nodeUpdated == value) return;

		// Propagate "true" values downwards in the node hierarchy
		// if (value) for (let child in this._nodeChildren)
			// this._nodeChildren[child].nodeUpdated = false;

		// Otherwise, propagate "false" values upwards in the node hierarchy
		// and the connected nodes
		if (!value && this._nodeParent) {
			this._nodeParent.nodeUpdated = false;
			for (const connectedNode of this._nodeLinks) 
			connectedNode.nodeUpdated = false;
		}

		// Apply the new value
		this._nodeUpdated = value
	}


	// ---------------------------------------------------------- PUBLIC FIELDS

	/** Marks the object as a Node. */
	public isNode: boolean = true;

	/** A function callback to be used before the node update. */
	public onPreUpdate: CallableFunction | undefined = undefined;

	/** A function callback to be used before the node update. */
	public onPostUpdate: CallableFunction | undefined = undefined;


	// ------------------------------------------------------------ CONSTRUCTOR

	/** Initializes a new instance of the Number class.
	 * @param types The types of the Node.
	 * @param name The name of the Node.
	 * @param parent The parent Node.
	 * @param data The initialization data. */
	constructor(types: string[], name?: string, parent?: Node, data?: any) {

		// Initialize the data of the node
		this._nodeTypes = types;
		this._nodeName = name;
		this._nodeParent = parent;
		this._nodeChildren = [];
		this._nodeLinks = [];
		

		// Create a link between the node and its parent
		if (parent) parent._nodeChildren.push(this);

		// Send an update request upwards in the Node hierarchy
		this._nodeUpdated = true; this.nodeUpdated = false;
	}


	// --------------------------------------------------------- PUBLIC METHODS

	/** Updates the Node. 
	 * @param deltaTime The update time.
	 * @param forced Indicates whether the update is forced or not. 
	 * @param data Additional update data. */
	update(deltaTime: number = 0, forced: boolean = false, data?: any) {

		// If the update is not forced, skip it when the node is already updated
		if (this._nodeUpdated && !forced) return;

		// Call the event function
		if (this.onPreUpdate) this.onPreUpdate(this);

		// Mark this node as updated
		this._nodeUpdated = true;

		// Update the children
		for (let child of this._nodeChildren)
			child.update(deltaTime, forced, data);

		for (let link of this._nodeLinks) link.nodeUpdated = false;

		// Call the event function
		if (this.onPostUpdate) this.onPostUpdate(this);
	}


	/** Serializes the Node instance.
	 * @param mode The serialization mode: full (default), simple,).
	 * @return The serialized data. */
	serialize(mode?: string): any {

		// Create an object to serialize the Node
		let data: any = {};

		// Save the name of the node
		if (this.nodeName) data.name = this.nodeName;

		// Serialize the child nodes
		for (let child of this._nodeChildren) {
			let nodeChildData = child.serialize(mode);
			if (mode == "simple" && nodeChildData == undefined) continue;
			data[child.nodeName || child.nodeType] = nodeChildData;
		}

		// Return the object with the serialized data
		return data;
	}


	/** Deserializes the Node instance.
	 * @param data The data to deserialize.
	 * @param mode The deserialization mode. */
	deserialize(data: any = {}, mode?: string) {

		// If the data is a string, check if it is JSON or CSV data
		if (typeof data == "string") JSON.parse(data);

		// If the data is an array, try to parse it value by value
		if (Array.isArray(data)) {
			for (let dataIndex = 0; dataIndex < data.length; dataIndex++) {
				if (dataIndex >= this.nodeChildren.length) return;
				this.nodeChildren[dataIndex].deserialize(data[dataIndex], mode);
			}
		}

		// If the data is an object, analyze it key by key
		else for (let dataKey in data) {
			if (data[dataKey] == undefined) continue;
			for (let child of this._nodeChildren) {
				if (child._nodeName == dataKey) {
					child.deserialize(data[dataKey], mode); break;
				}
			}
		}
	}

	
	/** Gets a specific Node higher in the hierarchy that satisfies the conditions.
	 * 
	 */
	ancestor(type?: string, name?: string): Node | undefined{
		let searchNode: Node | undefined = this._nodeParent;
		while(searchNode) {
			if (type && searchNode._nodeTypes.includes(type)) break;
			searchNode = searchNode._nodeParent;
		}
		return searchNode;
	}

	propagate(downwards: boolean = true, update: boolean = false) {
		this.nodeUpdated = update;
		if (downwards) for (let child of this._nodeChildren) 
			child.propagate(downwards, update);
		else if (this._nodeParent)
			this._nodeParent.propagate(downwards, update);
	}

	toString(): string { return JSON.stringify(this.serialize()); }
}