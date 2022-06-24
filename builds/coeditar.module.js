import * as THREE from "./externals/three.module.js";

/** Defines a logic event. */
export class Event {


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new Event instance.
	 * @param name The event name.
	 * @param owner The event owner.
	 * @param data The event data. */
	constructor(name, owner, data) {


		// ---------------------------------------------------------- PUBLIC FIELDS

		/** Marks the object as an Event. */
		this.isEvent = true;

		// Check the given name
		if (!name || name.length == 0)
			throw Error("Invalid event name");
		this._name = name;

		// Store the event owner
		this._owner = owner;
		this._data = data;

		// Initialize the list of listeners
		this._listeners = [];
	}


	// ------------------------------------------------------- PUBLIC ACCESSORS

	/** The event name. */
	get name() { return this._name; }

	/** The event owner. */
	get owner() { return this._owner; }

	/** The event data. */
	get data() { return this._data; }

	/** The event listeners. */
	get listeners() { return this._listeners; }


	// --------------------------------------------------------- PUBLIC METHODS

	/** Adds a new listener for the event.
	 * @param listener The new listener function to add. */
	listen(listener) { this._listeners.push(listener); }

	/** Triggers the event.
	 * @param target The object that triggers the event.
	 * @param data Additional event data. */
	trigger(target, data) {
		for (let listener of this._listeners) {
			let captured = listener(this, target, data);
			if (captured)
				break; // If captured, stop broadcasting the event
		}
	}
}



/** Contains the metadata of a data type . */
export class Type {


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new instance of the Type class.
	 * @param innerType The Javascript type.
	 * @param parent The parent data type.
	 * @param params The initialization parameters. */
	constructor(innerType, parent, params = {}) {

		// Store the inner type
		this._innerType = innerType;

		// Store the given name
		let name = this._name = params.name || innerType.name;

		// Make sure the names are different
		if (!Type._record[name])
			Type._record[name] = this;
		else
			throw Error('Repeated data type name: "' + name + '"');

		if (!parent) {
			let superclass = Object.getPrototypeOf(innerType.prototype);
			if (superclass !== Object.prototype) {
				let parentInnerType = superclass.constructor;
				if (parentInnerType.type)
					parent = parentInnerType.type;
				else
					parent = superclass.type = new Type(parentInnerType);
			}
		}

		// If there is a parent meta type, store the reference and create a link
		if (parent) {
			this._parent = parent;
			this._parent.children.push(this);
		}

		// Initialize the list of child meta types
		this._children = [];

		// Initialize the list of instances of the data type
		this._instances = [];
	}


	// ------------------------------------------------------- PUBLIC ACCESSORS

	/** The global list of Item instances. */
	static get record() { return this._record; }

	/** The inner type of the data type. */
	get innerType() { return this._innerType; }

	/** The name of the data type. */
	get name() { return this._name; }

	/** The list of items of the data type. */
	get instances() { return this._instances; }

	/** The parent data type. */
	get parent() { return this._parent; }

	/** The child data types. */
	get children() { return this._children; }


	// --------------------------------------------------------- PUBLIC METHODS

	/** Checks if the type is
	 * @param typeName The name of the type. */
	is(typeName) {
		return (this.name == typeName ||
			(this.parent && this.parent.is(typeName)));
	}
}

// --------------------------------------------------------- PRIVATE FIELDS

/** The global list of Type instances. */
Type._record = {};








/** Defines a basic data structure.
 * Provides mechanisms to store semantic data. */
export class Item {


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new instance of the Item class.
	 * @param name The name of the data item.
	 * @param relation The data relation. */
	constructor(name, relation) {

		this._name = name;

		// Check that the class item is properly established
		let instance = this.constructor;
		this._type = instance["type"];
		if (!this._type || this.type.innerType != this.constructor)
			this._type = instance["type"] = new Type(this.constructor);

		// Create the relations
		this._relations = {};
		this._relations.parent = new Relation("parent", [Item.type], this);
		this._relations.children = new Relation("child", [Item.type], this);
		if (relation) {
			relation.add(this);
			this._relations.parent.add(relation.owner);
		}

		// Register the modification and events
		this._onModification = new Event("modification");
		this._onUpdate = new Event("update");
	}


	// ------------------------------------------------------- PUBLIC ACCESSORS

	/** The metadata associated to the data type
	 * (usually a reference to a static instance). */
	get type() { return this._type; }
	;

	/** The name of the data item. */
	get name() { return this._name; }

	/** The relations of with other data types. */
	get relations() { return this._relations; }

	/** The parent of the data item. */
	get parent() {
		if (!this._relations["parent"])
			return undefined;
		return this._relations["parent"].getByIndex(0);
	}

	/** The child data types. */
	get children() {
		if (!this._relations["children"])
			return undefined;
		return this._relations["children"];
	}

	/** Indicates if the Node has been updated or not. */
	get updated() { return this._updated; }
	set updated(value) {

		// Propagate "false" values upwards in the node hierarchy
		if (value == false && this.parent)
			this.parent.updated = false;

		if (value == false) {
			Item._onModification.trigger(this);
			this._onModification.trigger(this);
		}

		// Apply the new value
		this._updated = value;
	}

	/** An event triggered before a data item is modified.
	* (If any listener return a false value, it prevents the modification). */
	get onModification() { return this._onModification; }

	/** An event triggered before a data item is updated.
	 * (If any listener return a false value, it prevents the update).	*/
	get onUpdate() { return this._onUpdate; }

	/** A global event triggered before a data item is created.
	* (If any listener return a false value, it prevents the creation). */
	static get onCreation() { return Item._onCreation; }

	/** A global event triggered before a data item is created.
	* (If any listener return a false value, it prevents the creation). */
	static get onModification() { return Item._onModification; }

	/** A global event triggered before a data item is updated.
	 * (If any listener return a false value, it prevents the update).	*/
	static get onUpdate() { return Item._onUpdate; }


	// --------------------------------------------------------- PUBLIC METHODS

	/** Updates the Node.
	 * @param deltaTime The update time.
	 * @param forced Indicates whether the update is forced or not.
	 * @param data Additional update data. */
	update(deltaTime = 0, forced = false, data) {

		// If the update is not forced, skip it when the node is already updated
		if (this._updated && !forced)
			return;

		// Trigger the update event
		this._onUpdate.trigger(this, data);

		// Mark this node as updated
		this._updated = true;

		// Update the children
		for (let child of this.children)
			child.update(deltaTime, forced, data);
	}


	/** Serializes the Node instance.
	 * @param mode The serialization mode: full (default), simple,).
	 * @return The serialized data. */
	serialize(mode) {

		// Create an object to serialize the Node
		let data = {};

		// Save the name of the node
		if (this.name)
			data.name = this.name;

		// Serialize the child nodes
		for (let child of this.children) {
			let nodeChildData = child.serialize(mode);
			if (mode == "simple" && nodeChildData == undefined)
				continue;
			data[child.name] = nodeChildData;
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
				if (dataIndex >= this.children.count)
					return;
				this.children.getByIndex(dataIndex).deserialize(data[dataIndex], mode);
			}
		}

		// If the data is an object, analyze it key by key
		else
			for (let dataKey in data) {
				let dataItem = data[dataKey];
				if (dataItem == undefined)
					continue;

				// If the key references an existing child relation 
				let subRelation = false;
				for (let relation of this.children.children) {
					if (relation.name == dataKey) {
						subRelation = true;
						if (!Array.isArray(dataItem))
							break;
						for (let dataSubitem of dataItem) {
							let itemType = relation.types[0].innerType;
							new itemType("test", relation, dataSubitem);
						}
					}
				}
				if (subRelation)
					continue;

				// If the key references an existing item 
				for (let child of this.children) {
					if (child._name == dataKey) {
						child.deserialize(dataItem, mode);
						break;
					}
				}
			}
	}
}

/** The metadata associated to the data type. */
Item.type = new Type(Item);

/** A global event triggered before a data item is created
* (if any listener return a false value, it prevents the creation). */
Item._onCreation = new Event("creation");

/** A global event triggered before a data item is modified
* (if any listener return a false value, it prevents the modification). */
Item._onModification = new Event("modification");

/** A global event triggered before a data item is updated
 * (if any listener return a false value, it prevents the update). */
Item._onUpdate = new Event("update");



/** Defines a collection of data items. */
export class Collection {


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new instance of the Collection instance.
	 * @param types The types of items in the collection. */
	constructor(types) {

		// Store the types of items in the collection
		this._types = types;

		// Initialize the array of items
		this._items = [];
		this._count = 0;
	}

	// ------------------------------------------------------ PUBLIC PROPERTIES

	/** The types of items in the data collection. */
	get types() { return this._types; }

	/** The number of items of the data collection. */
	get count() { return this._count; }

	// ------------------------------------------------------ PROTECTED METHODS



	// --------------------------------------------------------- PUBLIC METHODS

	/** Gets a data item by index.
	 * @param index The index of the item to get.
	 * @returns The item with the specified index. */
	getByIndex(index) {
		if (index >= 0 && index < this._items.length)
			return this._items[index];
		return undefined;
	}


	// /** Gets a data item by name. 
	//  * @param index The name of the item to get.
	//  * @returns The item with the specified name. */
	// getByName(name: string): ItemType | undefined { 
	// 	for (let item of this._items) if (item.name == name) return item; 
	// 	return undefined;
	// }


	[Symbol.iterator]() {
		let pointer = 0, items = this._items;
		return {
			next() {
				if (pointer < items.length)
					return { done: false, value: items[pointer++] };
				else
					return { done: true, value: null };
			}
		};
	}
}




/** Defines a binary (1 to N) relation between data types.
 * Necessary for serialization and to store relational data. */
export class Relation extends Collection {


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new instance of the Relation class.
	 * @param name The name(s) of the relation.
	 * @param types The types of item in the collection.
	 * @param owner The main data the data relation.
	 * @param parent The parent the data relation. */
	constructor(name, types, owner, parent) {

		// Call the parent class constructor
		super(types);

		// Store the name and the owner of the data relation
		this._name = name;
		this._owner = owner;

		//Check if there is a parent relation
		if (parent) {
			this._parent = parent;
			parent._children.push(this);
		}

		// Initialize the list of child relations
		this._children = [];

	}


	// ------------------------------------------------------- PUBLIC ACCESSORS

	/** The name of the data relation. */
	get name() { return this._name; }

	/** The main type the data relation. */
	get owner() { return this._owner; }

	/** The parent data relation. */
	get parent() { return this._parent; }

	/** The child data relations. */
	get children() { return this._children; }


	// --------------------------------------------------------- PUBLIC METHODS

	/** Adds a new type to the relation.
	 * @param item The item to add.
	 * @returns The added type.  */
	add(item) {

		// Add the item to the collection
		this._items.push(item);
		this._count++;

		// If there is a parent relation, also add it to it
		if (this._parent)
			this._parent.add(item);
	}
}






/** Defines an object ready for serialization */
export class Serializable extends Item {
}

/** The metadata of the data type. */
Serializable.type = new Type(Serializable, Item.type);



<<<<<<< HEAD





/** Manages the CoEditAR Framework (and facilitates the creation of web
 * apps on top of it). */
export class CoEditAR extends Serializable {


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new CoEditAR instance.
	 * @param data The initialization data (or a URL to the data file). */
	constructor(data) {

		// Call the base class constructor
		super("root", null);

		// // Create the child nodes
		this._coeditar = new Number("coeditar", this.children);
		// this._packages = new NodeSet<Package>("packages", this, Package);
		this._spaces = new Relation("spaces", [Space.type], this, this.children);
		this._users = new Relation("users", [User.type], this, this.children);

		// Deserialize the initialization data
		if (data)
			this.deserialize(data);

		// Define the basic elements if not defined
		if (this._spaces.count == 0)
			new Space("DefaultSpace", this._spaces);
		if (this._users.count == 0)
			new User("DefaultUser", this._users);

		// Add this instance to the list (and show a message if it is the first)
		CoEditAR._instances.push(this);
		if (CoEditAR._instances.length == 1)
			console.log("CoEditAR " + CoEditAR.frameworkVersion + " Initialized");
	}


	// ------------------------------------------------ STATIC PUBLIC ACCESSORS

	/** The name of the CoEditAR Framework. */
	static get frameworkName() { return "CoEditAR"; }

	/** The version number of the CoEditAR Framework. */
	static get frameworkVersion() { return 0.1; }

	/** The global list of CoEditAR instances. */
	static get instances() { return CoEditAR._instances; }

	/** Indicates whether the framework has already been initialized or not. */
	static get initialized() { return CoEditAR._instances.length > 0; }


	// -------------------------------------------------- STATIC PUBLIC METHODS

	/** Initializes the CoEditAR Framework.
	 * @param data The initialization data (or a URL to the data file). */
	static init(data) {

		// TODO If it is already initialize, clean the previous data
		//if (!CoEditAR.initialized)

		// Create a new CoEditAR instance
		return new CoEditAR(data);
	}


	// ------------------------------------------------------ PUBLIC PROPERTIES

	/** The version number of CoEditAR system. */
	get coeditar() { return this._coeditar; }

	// /** The packages of the CoEditAR system. */
	// get packages(): Relation<Package> { return this._packages; }

	/** The interaction spaces in the CoEditAR system. */
	get spaces() { return this._spaces; }

	/** The users of the CoEditAR system. */
	get users() { return this._users; }
}

// -------------------------------------------------- STATIC PRIVATE FIELDS

/** The global list of CoEditAR App instances. */
CoEditAR._instances = [];


// --------------------------------------------------- STATIC PUBLIC FIELDS

/** The global list of CoEditAR App instances. */
CoEditAR.autoInitialize = true;


// Unless otherwise specified, automatically initialize the CoEditAR framework
// to make it easier for people to operate with it
if (CoEditAR.autoInitialize)
	window.addEventListener("load", () => { if (!CoEditAR.initialized)
		CoEditAR.init(); });





/** Defines a simple data type. */
export class Simple extends Item {
=======
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



/** Defines a Logic Event */
export class Event {
>>>>>>> a1bb1438a29eadf7da80cdc810cdac2dbd2d398a


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

<<<<<<< HEAD
	/** Initializes a new instance of the Simple class.
	 * @param name The name of the data type.
	 * @param relation The data relation.
	 * @param data The initialization data. */
	constructor(name, relation, data) {

		// Call the parent class constructor
		super(name, relation);

		/** The valid values of the simple data type. */
=======
	/** Initializes a new Event instance.
	 * @param type The event type.
	 * @param owner The event owner.
	 * @param data The event data. */
	constructor(type, owner, data) {


		// ---------------------------------------------------------- PUBLIC FIELDS

		/** Marks the object as an Event. */
		this.isEvent = true;
		this._type = type;
		this._owner = owner;
		this._data = data;
		this._listeners = [];
	}


	// ------------------------------------------------------- PUBLIC ACCESSORS

	/** The event type. */
	get type() { return this._type; }

	/** The event owner. */
	get owner() { return this._owner; }

	/** The event data. */
	get data() { return this._data; }

	/** The event listeners. */
	get listeners() { return this._listeners; }


	// --------------------------------------------------------- PUBLIC METHODS

	/** Adds a new listener for the event.
	 * @param listener The new listener function to add. */
	listen(listener) { this._listeners.push(listener); }

	/** Triggers the event.
	 * @param target The object that triggers the event.
	 * @param data Additional event data. */
	trigger(target, data) {
		for (let listener of this._listeners) {
			let captured = listener(this, target, data);
			if (captured)
				break; // If captured, stop broadcasting the event
		}
	}
}




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
		super(name, parent, data, ["nodeset"]);

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









/** Manages the CoEditAR Framework (and facilitates the creation of web
 * apps on top of it). */
export class CoEditAR extends Node {


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new CoEditAR instance.
	  * @param data The initialization data (or a URL to the data file). */
	constructor(data) {

		// Call the base class constructor
		super("coeditar", null, data, ["root"]);

		// Create the child nodes
		this._coeditar = new Number("coeditar", this);
		this._packages = new NodeSet("packages", this, Package);
		this._spaces = new NodeSet("spaces", this, Space);
		this._users = new NodeSet("users", this, User);

		// Deserialize the initialization data
		if (data)
			this.deserialize(data);

		// Define the basic elements if not defined
		if (this._spaces.count == 0)
			new Space("DefaultSpace", this._spaces);
		if (this._users.count == 0)
			new User("DefaultUser", this._users);

		// Add this instance to the list (and show a message if it is the first)
		CoEditAR._instances.push(this);
		if (CoEditAR._instances.length == 1)
			console.log("CoEditAR " + CoEditAR.frameworkVersion + " Initialized");
	}

	// ------------------------------------------------ STATIC PUBLIC ACCESSORS

	/** The name of the CoEditAR Framework. */
	static get frameworkName() { return "CoEditAR"; }

	/** The version number of the CoEditAR Framework. */
	static get frameworkVersion() { return 0.1; }

	/** The global list of CoEditAR instances. */
	static get instances() { return CoEditAR._instances; }

	/** Indicates whether the framework has already been initialized or not. */
	static get initialized() { return CoEditAR._instances.length > 0; }


	// -------------------------------------------------- STATIC PUBLIC METHODS

	/** Initializes the CoEditAR Framework.
	 * @param data The initialization data (or a URL to the data file). */
	static init(data) {

		// TODO If it is already initialize, clean the previous data
		//if (!CoEditAR.initialized)

		// Create a new CoEditAR instance
		return new CoEditAR(data);
	}


	// ------------------------------------------------------ PUBLIC PROPERTIES

	/** The version number of CoEditAR system. */
	get coeditar() { return this._coeditar; }

	/** The packages of the CoEditAR system. */
	get packages() { return this._packages; }

	/** The interaction spaces in the CoEditAR system. */
	get spaces() { return this._spaces; }

	/** The users of the CoEditAR system. */
	get users() { return this._users; }
}

// -------------------------------------------------- STATIC PRIVATE FIELDS

/** The global list of CoEditAR App instances. */
CoEditAR._instances = [];

// --------------------------------------------------- STATIC PUBLIC FIELDS

/** The global list of CoEditAR App instances. */
CoEditAR.autoInitialize = true;


// Unless otherwise specified, automatically initialize the CoEditAR framework
// to make it easier for people to operate with it
if (CoEditAR.autoInitialize)
	window.addEventListener("load", () => { if (!CoEditAR.initialized)
		CoEditAR.init(); });





/** Defines a Simple data Type. */
export class Simple extends Node {


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new instance of the Simple class.
	 * @param name The name of the node.
	 * @param parent The parent node.
	 * @param data The initialization data.
	 * @param types The metadata of the node. */
	constructor(name, parent, data, types = []) {

		// Call the parent class constructor
		super(name, parent, data, [...types, "simple"]);

		/** The valid values of the Simple data type. */
>>>>>>> a1bb1438a29eadf7da80cdc810cdac2dbd2d398a
		this._validValues = undefined;

		// Deserialize the initialization data
		if (data)
			this.deserialize(data);
	}


	// ------------------------------------------------------ PUBLIC PROPERTIES

	/** The current value of the Simple data type.*/
	get value() {
		if (this._value == undefined)
			return this._defaultValue;
		return this._value;
	}
	set value(newValue) {
		if (this._value == newValue)
			return;
		if (!this.checkValue(newValue))
			throw Error('Invalid value "'
				+ newValue + '" for: ' + this._name);
		this._value = newValue;
		this.updated = false;
	}

	/** The default value of the Simple data type. */
	get defaultValue() { return this._defaultValue; }
	set defaultValue(newDefaultValue) {
		if (this._defaultValue == newDefaultValue)
			return;
		if (!this.checkValue(newDefaultValue))
			throw Error('Invalid default value "' + newDefaultValue +
				'" for: ' + this._name);
		this._defaultValue = newDefaultValue;
		this.updated = false;
	}

	/** The valid values of the Simple data type.*/
	get validValues() { return this._validValues; }
	set validValues(newValidValues) {
		this._validValues = newValidValues;
		if (!this.checkValue(this._value))
			throw Error('Invalid value "'
				+ this._value + '" for: ' + this._name);
		this.updated = false;
	}

	/** The index of the value in the valid Simple data type. */
	get validValueIndex() {
		if (this.validValues != undefined && this.value != undefined)
			return this.validValues.indexOf(this.value);
		return undefined;
	}

	/** Indicates whether the value is the default or not. */
	get isDefault() { return (this._value == this._defaultValue); }

	/** Indicates whether the value is undefined or not. */
	get isUndefined() { return (this._value == undefined); }


	// --------------------------------------------------------- PUBLIC METHODS

	/** Serializes the String instance.
	 * @return The serialized data. */
	serialize() { return this._value; }

	/** Deserializes the Simple data type.
	 * @param data The value to deserialize.
	 * @param mode The deserialization mode. */
	deserialize(data, mode) {
		if (typeof (data) == "object") {
			this._defaultValue = data.defaultValue;
			this._validValues = data.validValues;
			this._value = data.value;
		}
		else
			this._value = data;
	}

	/** Obtains the value of the Simple data type
	 * @return The value of the Type. */
	valueOf() { return this.value; }

	/** Checks if the value is valid for the Simple data type,
	 * @param value The value to check.
	 * @returns A boolean value indicating whether the value is valid or not. */
	checkValue(value) {

		// Check the list of valid values
		if (this._validValues && !this._validValues.includes(value))
			return false;

		// If the value has not been rejected, return true
		return true;
	}
}

<<<<<<< HEAD
/** The metadata of the data type. */
Simple.type = new Type(Simple, Item.type);





/** Defines a Number data type. */
=======



/** Defines a Number Node. */
>>>>>>> a1bb1438a29eadf7da80cdc810cdac2dbd2d398a
export class Number extends Simple {


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new instance of the Number class.
	 * @param name The name of the data type.
	 * @param relation The data relation.
	 * @param data The initialization data. */
	constructor(name, relation, data) {

		// Call the parent class constructor
<<<<<<< HEAD
		super(name, relation, data);
=======
		super(name, parent, data, ["number"]);
>>>>>>> a1bb1438a29eadf7da80cdc810cdac2dbd2d398a

		// --------------------------------------------------------- PRIVATE FIELDS

		/** The minimum possible value of Number. */
		this._min = undefined;

		/** The maximum possible value of the Number. */
		this._max = undefined;

		// Set the values of the properties
		this._value = undefined;
		this._defaultValue = 0;

		// Deserialize the initialization data
		if (data != undefined)
			this.deserialize(data);
	}


	// ------------------------------------------------------- PUBLIC ACCESSORS

	/** The minimum possible value of Number. */
	get min() { return this._min; }
	set min(newMin) {
		if (this._max != undefined && newMin > this._max)
			this._max = newMin;
		if (this._value != undefined && this._value < newMin)
			this.value = newMin;
		this.updated = false;
		this._min = newMin;
	}

	/** The maximum possible value of the Number. */
	get max() { return this._max; }
	set max(newMax) {
		if (this._min != undefined && newMax < this._min)
			this._min = newMax;
		if (this._value != undefined && this._value > newMax)
			this.value = newMax;
		this.updated = false;
		this._max = newMax;
	}


	// --------------------------------------------------------- PUBLIC METHODS

	/** Serializes the Number instance.
	 * @return The serialized data. */
	serialize() { return this._value; }

	/** Deserializes the Number instance.
	 * @param data The data to deserialize.
	 * @param mode The deserialization mode. */
	deserialize(data, mode) {
		if (typeof data == "object") {
			this.min = data.min;
			this.max = data.max;
			this.defaultValue = data.defaultValue;
			this.value = data.value;
		}
		else if (typeof data !== "number")
			this.value = parseFloat(data);
		else
			this.value = data;
	}

	/** Checks if the value is valid for this Number instance.
	 * @param value The value to check.
	 * @returns A boolean value indicating whether the value is valid or not. */
	checkValue(value) {

		// Check the range 
		if (this._min != undefined && value < this._min)
			return false;
		if (this._max != undefined && value > this._max)
			return false;

		// If the value has not been rejected, check the 
		return super.checkValue(value);
	}

	/** Obtains the string representation of the Number.
	 * @returns The string representation of the Number. */
	toString() { return this.value.toFixed() || ""; }
}








<<<<<<< HEAD
/** Defines a user. */
export class User extends Item {
=======

/** Describes a package (a collection of resources). */
export class Package extends Node {
>>>>>>> a1bb1438a29eadf7da80cdc810cdac2dbd2d398a


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

<<<<<<< HEAD
	/** Initializes a new User instance.
	 * @param name The name of the data type.
	 * @param relation The data relation.
	 * @param data The initialization data. */
	constructor(name, relation, data) {

		// Call the parent class constructor
		super(name, relation);

		// Create the child nodes
		this._presences = new Relation("presences", [Presence.type], this, this.children);
		this._views = new Relation("views", [View.type], this, this.children);
=======
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
>>>>>>> a1bb1438a29eadf7da80cdc810cdac2dbd2d398a

		// Deserialize the initialization data
		if (data)
			this.deserialize(data);
<<<<<<< HEAD

		// Create the defaults
		if (this._presences.count == 0) {
			let spaces = this.parent.spaces;
			for (let space of spaces) {
				let presence = new Presence("Presence", this._presences);
				presence.space = space;
			}
		}
		if (this._views.count == 0)
			new View("DefaultView", this._views);
	}

	// ------------------------------------------------------- PUBLIC ACCESSORS

	/** The presences of the user in the interaction spaces. */
	get presences() { return this._presences; }

	/** The point of views of the user. */
	get views() { return this._views; }
=======
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





/** Defines a String Node. */
export class String extends Simple {


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new instance of the String class.
	 * @param name The name of the Node.
	 * @param parent The parent Node.
	 * @param data The initialization data. */
	constructor(name, parent, data) {

		// Call the parent class constructor
		super(name, parent, data, ["string"]);

		// ------------------------------------------------------- PROTECTED FIELDS

		/** The regular expression of the String. */
		this._validRegEx = undefined;

		// Deserialize the initialization data
		if (data)
			this.deserialize(data);
	}


	// ------------------------------------------------------- PUBLIC ACCESSORS

	/** The regular expression values of the String.*/
	get validRegEx() { return this._validRegEx; }
	set validRegEx(newValidRegEx) {
		this._validRegEx = newValidRegEx;
		if (!this.checkValue(this._value))
			throw Error('Invalid value "'
				+ this._value + '" for: ' + this._nodeName);
		this._onModified.trigger(this);
	}
>>>>>>> a1bb1438a29eadf7da80cdc810cdac2dbd2d398a


	// --------------------------------------------------------- PUBLIC METHODS

<<<<<<< HEAD
	/** Updates the Entity.
	 * @param deltaTime The update time.
	 * @param forced Indicates whether the update is forced or not. */
	update(deltaTime = 0, forced = false) {

		// If the update is not forced, skip it when the node is already updated
		if (this.updated && !forced)
			return;

		// Call the base class function
		super.update(deltaTime, forced);
	}
=======
	/** Deserializes the String instance.
	 * @param data The data to deserialize.
	 * @param mode The deserialization mode. */
	deserialize(data, mode) {
		if (typeof data == "object") {
			this._validValues = data.validValues;
			this._validRegEx = data.validRegEx;
			this._defaultValue = data.default; // Check the default value
			data = this.value = data.value;
		}
		if (typeof data !== "string")
			data = JSON.stringify(data);
		this.value = data;
	}


	/** Checks if the value is valid for this String instance.
	 * @param value The value to check.
	 * @returns A boolean value indicating whether the value is valid or not. */
	checkValue(value) {

		// Check the regular expression
		if (this._validRegEx && !this._validRegEx.test(value))
			return false;

		// If the value has not been rejected, check the 
		return super.checkValue(value);
	}


	/** Obtains the string representation of the Number.
	 * @returns The string representation of the Number. */
	toString() { return this.value || ""; }
>>>>>>> a1bb1438a29eadf7da80cdc810cdac2dbd2d398a
}





<<<<<<< HEAD
/** Defines a user presence in an User Interaction space. */
export class Presence extends Item {
=======



/** Defines a smart assembly. */
export class Assembly extends Node {
>>>>>>> a1bb1438a29eadf7da80cdc810cdac2dbd2d398a


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

<<<<<<< HEAD
	/** Initializes a new Presence instance.
	 * @param name The name of the data type.
	 * @param relation The data relation.
	 * @param data The initialization data. */
	constructor(name, relation, data) {

		// Call the parent class constructor
		super(name, relation);

		// Create the child nodes
		this._entity = new PresenceEntity(name + "Entity", this.children);
		// The space node is not initialized here because it is actually a link
=======
	/** Initializes a new Assembly instance.
	 * @param name The name of the node.
	 * @param parent The parent node.
	 * @param data The initialization data. */
	constructor(name, parent, data = {}) {

		// Call the base class constructor
		super(name, parent, data, ["assembly"]);

		// Create the child nodes
		this._name = new String("name", this);
		this._extends = new String("extends", this);
		this._shapes = new NodeSet("shapes", this, Shape);
		this._parts = new NodeSet("parts", this, Part);

		// Deserialize the initialization data
		if (data)
			this.deserialize(data);
	}


	// ------------------------------------------------------ PUBLIC PROPERTIES

	/** The (unique) name of the assembly. */
	get name() { return this._name; }

	/** The id of the class this instance inherits from. */
	get extends() { return this._extends; }

	/** The shapes of the assembly. */
	get shapes() { return this._shapes; }

	/** The parts of the assembly. */
	get parts() { return this._parts; }
}







/** Defines a shape of a smart assembly. */
export class Shape extends Node {


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new Shape instance.
	 * @param name The name of the node.
	 * @param parent The parent node.
	 * @param data The initialization data. */
	constructor(name, parent, data = {}) {

		// Call the base class constructor
		super(name, parent, data, ["shape"]);

		// Create the child nodes
		this._name = new String("name", this);
		this._extends = new String("extends", this);
		this._type = new String("type", this);
		this._width = new Distance("width", this);
		this._height = new Distance("height", this);
		this._depth = new Distance("depth", this);
		this._radius = new Distance("radius", this);
		this._radius2 = new Distance("radius2", this);

		// Deserialize the initialization data
		if (data)
			this.deserialize(data);
	}


	// ------------------------------------------------------ PUBLIC PROPERTIES

	/** The (unique) name of the shape. */
	get name() { return this._name; }

	/** The id of the class this instance inherits from. */
	get extends() { return this._extends; }

	/** The type of the shape ('box', 'ellipsoid', 'cylinder' or 'cone'). */
	get type() { return this._type; }

	/** The width of the shape. */
	get width() { return this._width; }

	/** The height of the shape. */
	get height() { return this._height; }

	/** The depth of the shape. */
	get depth() { return this._depth; }

	/** The radius of the shape. */
	get radius() { return this._radius; }

	/** The secondary radius of the shape (for cones). */
	get radius2() { return this._radius2; }
}








/** Defines a part of a smart assembly. */
export class Part extends Node {


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new Part instance.
	 * @param name The name of the node.
	 * @param parent The parent node.
	 * @param data The initialization data. */
	constructor(name, parent, data = {}) {

		// Call the base class constructor
		super(name, parent, data, ["part"]);

		// Create the child nodes
		this._name = new String("name", this);
		this._extends = new String("extends", this);
		this._shapes = new NodeSet("shapes", this, Shape);

		// Deserialize the initialization data
		if (data)
			this.deserialize(data);
	}


	// ------------------------------------------------------ PUBLIC PROPERTIES

	/** The (unique) name of the part. */
	get name() { return this._name; }

	/** The id of the class this instance inherits from. */
	get extends() { return this._extends; }

	/** The shape of the part. */
	get shapes() { return this._shapes; }
}






/** Defines a Logic Behavior. */
export class Behavior extends Node {


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new Behavior instance.
	 * @param name The name of the node.
	 * @param parent The parent node.
	 * @param data The initialization data.
	 * @param types The metadata of the node. */
	constructor(name, parent, data, types = []) {

		// Call the parent class constructor
		super(name, parent, data, [...types, "behavior"]);

		// Create the entity for the space
		this._startFunction = new Function("start", this);
		this._updateFunction = new Function("update", this);
>>>>>>> a1bb1438a29eadf7da80cdc810cdac2dbd2d398a

		// Deserialize the initialization data
		if (data)
			this.deserialize(data);
	}


	// ------------------------------------------------------- PUBLIC ACCESSORS

<<<<<<< HEAD
	/** The entity associated with this presence. */
	get entity() { return this._entity; }

	/** The space associated with the presence. */
	get space() { return this._space; }
	set space(space) { this._space = space; }


	/** Deserializes the Presence instance.
	 * @param data The data to deserialize.
	 * @param mode The deserialization mode. */
	deserialize(data, mode) {

		// Get the space reference
		// if (data.space) {
		// 	let spaceName = data.space;
		// 	let root = this.node.ancestor("root").datatype as unknown as CoEditAR;
		// 	let space = root.spaces.getByName(spaceName);
		// 	if (!space) throw Error("Space '" + spaceName + "' not found");
		// 	this.space = space;
		// }

		this.entity.deserialize(data);
	}
=======
	/** The start function name. */
	get startFunction() { return this._startFunction; }

	/** The update function name. */
	get updateFunction() { return this._updateFunction; }
>>>>>>> a1bb1438a29eadf7da80cdc810cdac2dbd2d398a
}





<<<<<<< HEAD
=======
/** Defines a function handler data Type. */
export class Function extends Node {


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new instance of the Simple class.
	 * @param name The name of the node.
	 * @param parent The parent node.
	 * @param data The initialization data.
	 * @param types The metadata of the node. */
	constructor(name, parent, data, types = []) {

		// Call the parent class constructor
		super(name, parent, data, [...types, "simple"]);

		// Create the events
		this._onModified = new Event("modified", this);

		// Deserialize the initialization data
		if (data)
			this.deserialize(data);
	}

	// ------------------------------------------------------ PUBLIC PROPERTIES

	/** The current value of the Simple data type.*/
	get value() {
		return this._value;
	}
	set value(newValue) {
		if (this._value == newValue)
			return;
		this._value = newValue;
		this.nodeUpdated = false;
		this._onModified.trigger(this, newValue);
	}


	/** Indicates whether the value is undefined or not. */
	get isUndefined() { return (this._value == undefined); }

	/** An event triggered if the value is modified. */
	get onModified() { return this._onModified; }


	// --------------------------------------------------------- PUBLIC METHODS

	/** Serializes the String instance.
	 * @return The serialized data. */
	serialize() { return this._value; }


	/** Deserializes the Simple data type.
	 * @param data The value to deserialize.
	 * @param mode The deserialization mode. */
	deserialize(data, mode) {
		this._value = data;
	}


	/** Obtains the value of the Simple data type
	 * @return The value of the Type. */
	valueOf() { return this.value; }
}




>>>>>>> a1bb1438a29eadf7da80cdc810cdac2dbd2d398a





/** Defines a logic Entity. */
<<<<<<< HEAD
export class Entity extends Item {
=======
export class Entity extends Node {
>>>>>>> a1bb1438a29eadf7da80cdc810cdac2dbd2d398a


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new Entity instance.
<<<<<<< HEAD
	 * @param name The name of the data type.
	 * @param relation The data relation.
	 * @param data The initialization data. */
	constructor(name, relation, data) {

		// Call the parent class constructor
		super(name, relation);

		// Create the child nodes
		this._position = new Vector("position", this.children);
		this._rotation = new Euler("rotation", this.children);
		this._behaviors = new Relation("behaviors", [Behavior.type], this, this.children);
		this._entities = new Relation("entities", [Entity.type], this, this.children);
=======
	 * @param name The name of the node.
	 * @param parent The parent node.
	 * @param data The initialization data.
	 * @param types The metadata of the node. */
	constructor(name, parent, data, types = []) {

		// Call the parent class constructor
		super(name, parent, data, [...types, "entity"]);

		// Create the child nodes
		this._position = new Vector("position", this);
		this._rotation = new Euler("rotation", this);
		this._behaviors = new NodeSet("behaviors", this, Behavior);
		this._entities = new NodeSet("entities", this, Entity);
>>>>>>> a1bb1438a29eadf7da80cdc810cdac2dbd2d398a

		// Deserialize the initialization data
		if (data)
			this.deserialize(data);

		// Create the basic representation
		this._representation = new THREE.Object3D();
<<<<<<< HEAD
		this._representation.name = this.name;
		if (this.parent && this.parent.type.is("Entity"))
			this.parent._representation.add(this._representation);
=======
		this._representation.name = this.nodeName;
		if (this.nodeParent && this.nodeParent.nodeTypes.includes("entity"))
			this.nodeParent._representation.add(this._representation);
>>>>>>> a1bb1438a29eadf7da80cdc810cdac2dbd2d398a

		// Call the start functions in the behaviors
		for (let behavior of this.behaviors) {
			let startFunction = behavior.startFunction.value;
			if (startFunction)
				startFunction(this);
		}
	}


	// ------------------------------------------------------- PUBLIC ACCESSORS

	/** The representation of the Entity. */
	get representation() { return this._representation; }

	/** The position of the Entity. */
	get position() { return this._position; }

	/** The rotation of the Entity. */
	get rotation() { return this._rotation; }

	/** The behaviors of the Entity. */
	get behaviors() { return this._behaviors; }

	/** The children entities of the Entity. */
	get entities() { return this._entities; }


	// --------------------------------------------------------- PUBLIC METHODS

	/** Updates the Entity.
	 * @param deltaTime The update time.
	 * @param forced Indicates whether the update is forced or not. */
	update(deltaTime = 0, forced = false) {

		// If the update is not forced, skip it when the node is already updated
<<<<<<< HEAD
		if (this.updated && !forced)
=======
		if (this.nodeUpdated && !forced)
>>>>>>> a1bb1438a29eadf7da80cdc810cdac2dbd2d398a
			return;

		// Update the position, rotation and scale of the representation
		let rep = this._representation, p = this.position, r = this.rotation;
<<<<<<< HEAD
		if (!p.updated)
			rep.position.set(p.x.value, p.y.value, p.z.value);
		if (!r.updated)
=======
		if (!p.nodeUpdated)
			rep.position.set(p.x.value, p.y.value, p.z.value);
		if (!r.nodeUpdated)
>>>>>>> a1bb1438a29eadf7da80cdc810cdac2dbd2d398a
			rep.rotation.set(r.x.value, r.y.value, r.z.value);

		// Call the update functions in the behaviors
		for (let behavior of this.behaviors) {
			let updateFunction = behavior.updateFunction.value;
			if (updateFunction)
				updateFunction(this);
		}

		// Call the base class function
		super.update(deltaTime, forced);

		// Show a message on console
		// console.log("Updated Entity: " + this.nodeName);
	}
}

<<<<<<< HEAD
/** The metadata of the data type. */
Entity.type = new Type(Entity, Item.type);




=======
>>>>>>> a1bb1438a29eadf7da80cdc810cdac2dbd2d398a




/** Defines a Complex data type. */
<<<<<<< HEAD
export class Complex extends Item {
=======
export class Complex extends Node {
>>>>>>> a1bb1438a29eadf7da80cdc810cdac2dbd2d398a


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new instance of the complex class.
<<<<<<< HEAD
	 * @param name The name of the data type.
	 * @param relation The data relation.
	 * @param data The initialization data. */
	constructor(name, relation, data) {

		// Call the parent class constructor
		super(name, relation);

		this._components = new Relation("component", [Number.type], this, this.children);

		// // Deserialize the initialization data
		// if (data) this.deserialize(data);
=======
	 * @param name The name of the node.
	 * @param parent The parent node.
	 * @param data The initialization data.
	 * @param types The metadata of the node.  */
	constructor(name, parent, data, types = []) {

		// Call the parent class constructor
		super(name, parent, data, [...types, "complex"]);

		// Create the events
		this._onModified = new Event("modified", this);

		// Deserialize the initialization data
		if (data)
			this.deserialize(data);
>>>>>>> a1bb1438a29eadf7da80cdc810cdac2dbd2d398a
	}


	// ------------------------------------------------------- PUBLIC ACCESSORS

	/** Indicates whether the value is the default or not. */
	get isDefault() {
		for (let component of this._components)
			if (!component.isDefault)
				return false;
		return true;
	}

	/** Indicates whether the value is undefined or not. */
	get isUndefined() {
		for (let component of this._components)
			if (!component.isUndefined)
				return false;
		return true;
	}

<<<<<<< HEAD
=======
	/** An event triggered if the value is modified. */
	get onModified() { return this._onModified; }

>>>>>>> a1bb1438a29eadf7da80cdc810cdac2dbd2d398a
	// --------------------------------------------------------- PUBLIC METHODS

	/** Converts the Vector node into an array representation. */
	toArray() {
		let values = [];
		for (let component of this._components)
			values.push(component.value);
		return values;
	}

	/** Sets the values of the Vector node from an array.
	* @param values An array with the numerical values. */
	fromArray(values) {
		let childIndex = 0;
<<<<<<< HEAD
		let childCount = this.children.count;
		for (childIndex = 0; childIndex < childCount; childIndex++)
			this._components.getByIndex(childIndex).value =
=======
		let childCount = this.nodeChildren.length;
		for (childIndex = 0; childIndex < childCount; childIndex++)
			this._components[childIndex].value =
>>>>>>> a1bb1438a29eadf7da80cdc810cdac2dbd2d398a
				((values.length > childIndex) ? values[childIndex] : undefined);
	}

	toString() { return JSON.stringify(this.toArray()); }
}

<<<<<<< HEAD
/** The metadata of the data type. */
Complex.type = new Type(Complex, Item.type);

=======
>>>>>>> a1bb1438a29eadf7da80cdc810cdac2dbd2d398a




/** Defines a three-dimensional vector. */
export class Vector extends Complex {


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new instance of the Vector3 class.
	 * @param name The name of the data type.
	 * @param relation The data relation.
	 * @param data The initialization data. */
	constructor(name, relation, data) {

		// Call the parent class constructor
<<<<<<< HEAD
		super(name, relation, data);
=======
		super(name, parent, data, ["vector"]);
>>>>>>> a1bb1438a29eadf7da80cdc810cdac2dbd2d398a

		// Create the children nodes
		this._x = new Distance("x", this._components);
		this._y = new Distance("y", this._components);
		this._z = new Distance("z", this._components);

		// Deserialize the initialization data
		if (data)
			this.deserialize(data);
	}


	// ------------------------------------------------------- PUBLIC ACCESSORS

	/** The vector component in the X axis. */
	get x() { return this._x; }

	/** The vector component in the Y axis. */
	get y() { return this._y; }

	/** The vector component in the Z axis. */
	get z() { return this._z; }


	// --------------------------------------------------------- PUBLIC METHODS

	/** Gets the values of the Vector.
	* @returns An object with the values of the Vector. */
	getValues() { return { x: this._x.value, y: this._y.value, z: this._z.value }; }

	/** Sets the values of the Vector.
	 * @param x The vector component in the X axis.
	 * @param y The vector component in the Y axis.
	 * @param z The vector component in the Z axis. */
	setValues(x, y, z) {
		this._x.value = x;
		this._y.value = y;
		this._z.value = z;
	}
}






/** Defines a numeric Measure Node. */
export class Measure extends Number {


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new instance of the Type class.
<<<<<<< HEAD
	 * @param name The name of the data type.
	 * @param relation The data relation.
	 * @param data The initialization data.
	 * @param units The measurement units of the Node. */
	constructor(name, relation, data, units) {
=======
	 * @param name The name of the Node.
	 * @param parent The parent Node.
	 * @param data The initialization data.
	 * @param types The metadata of the node.
	 * @param units The measurement units of the Node. */
	constructor(name, parent, data, types = [], units) {
>>>>>>> a1bb1438a29eadf7da80cdc810cdac2dbd2d398a

		// Call the parent class constructor
		super(name, relation, data);

		// Store the units of the Measure
		this._units = units || [new MeasurementUnit("", [""], 1)];
		this._unitIndex = 0;
	}


	// ------------------------------------------------------- PUBLIC ACCESSORS

	/** The current unit of the Measure. */
	get unit() { return this._units[this._unitIndex]; }

	/** The units of the Measure. */
	get units() { return this._units; }

	/** The value of the Measure in the selected unit.*/
	get unitIndex() { return this._unitIndex; }
	set unitIndex(u) { this._unitIndex = u; this.updated = false; }


	// --------------------------------------------------------- PUBLIC METHODS

	/** Serializes the String instance.
	 * @return The serialized data. */
	serialize() { return this.value; }

	/** Deserializes the Simple data type.
	 * @param data The value to deserialize.
	 * @param mode The deserialization mode. */
	deserialize(data, mode) {
		// TODO check unit
		this.value = data;
	}

	/** Obtains the value of the Simple data type
	 * @return The value of the Type. */
	valueOf() { return this.value; }

	/** Obtains the String representation of the measure.
	 * @return The String representation of the measure. */
	toString() { return this.value + " " + this.unit.abbrevs[0]; }
}

/** The metadata of the data type. */
Measure.type = new Type(Measure, Number.type);


/** Defines a Measurement Unit. */
export class MeasurementUnit {


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new instance of the MeasurementUnit class.
	 * @param id The id of the Measurement Unit.
	 * @param abbrevs The abbreviations of the Measurement Unit.
	 * @param factor The relative conversion factor of the Measurement Unit.
	 * @param defaultValue The default value of the Measurement Unit.
	 * @param min The minimum possible value of the Measurement Unit.
	 * @param max The maximum possible value of the Measurement Unit. */
	constructor(id, abbrevs, factor = 1, defaultValue, min, max) {
		this._id = id;
		this._abbrevs = abbrevs;
		this._factor = factor;
		this._defaultValue = defaultValue;
		this._min = min;
		this._max = max;
	}


	// ------------------------------------------------------- PUBLIC ACCESSORS

	/** The name of the Measurement Unit. */
	get id() { return this._id; }

	/** The list of abbreviations of the Measurement Unit. */
	get abbrevs() { return this._abbrevs; }

	/** The relative conversion factor of the Measurement Unit. */
	get factor() { return this._factor; }

	/** The default value of the Measurement Unit. */
	get defaultValue() { return this._defaultValue; }

	/** The minimum possible value of the Measurement Unit. */
	get min() { return this._min; }

	/** The maximum possible value of the Measurement Unit. */
	get max() { return this._max; }
}





/** Defines a length measurement. */
export class Distance extends Measure {

	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new instance of the Length class.
	 * @param name The name of the data type.
	 * @param relation The data relation.
	 * @param data The initialization data. */
	constructor(name, relation, data) {

		// Call the parent class constructor
<<<<<<< HEAD
		super(name, relation, data, DistanceUnits);
=======
		super(name, parent, data, ["length"], DistanceUnits);
>>>>>>> a1bb1438a29eadf7da80cdc810cdac2dbd2d398a

		// Deserialize the initialization data
		if (data)
			this.deserialize(data);

	}
}


// Define the Distance measurement units
let DistanceUnits = [
	new MeasurementUnit("meters", ["m", "ms"], 1),
	new MeasurementUnit("centimeters", ["cm", "cms"], 0.01),
	new MeasurementUnit("millimeters", ["mm", "mms"], 0.001),
	new MeasurementUnit("kilometers", ["km", "kms"], 1000)
];






/** Defines the Euler Orientation.
 * @see https://en.wikipedia.org/wiki/Euler_angles */
export class Euler extends Complex {


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new instance of the Euler class.
<<<<<<< HEAD
	 * @param name The name of the data type.
	 * @param relation The data relation.
	 * @param data The initialization data. */
	constructor(name, relation, data) {

		// Call the parent class constructor
		super(name, relation, data);

		// Create the children nodes
		this._x = new Angle("x", this._components, 0);
		this._y = new Angle("y", this._components, 0);
		this._z = new Angle("z", this._components, 0);
		this._order = new String("order", this.children, "XYZ");

=======
	 * @param name The name of the Node.
	 * @param parent The parent Node.
	 * @param data The initialization data. */
	constructor(name, parent, data) {

		// Call the parent constructor
		super(name, parent, data, ["euler"]);

		// Create the children nodes
		this._x = new Angle("x", this, 0);
		this._y = new Angle("y", this, 0);
		this._z = new Angle("z", this, 0);
		this._order = new String("order", this, "XYZ");

		// Define the components of the Complex type
		this._components = [this._x, this._y, this._z];
>>>>>>> a1bb1438a29eadf7da80cdc810cdac2dbd2d398a

		// Deserialize the initialization data
		if (data)
			this.deserialize(data);
	}

<<<<<<< HEAD

=======
>>>>>>> a1bb1438a29eadf7da80cdc810cdac2dbd2d398a
	// ------------------------------------------------------- PUBLIC ACCESSORS

	/** The Angle in the X axis. */
	get x() { return this._x; }

	/** The Angle in the Y axis. */
	get y() { return this._y; }

	/** The Angle in the Z axis. */
	get z() { return this._z; }

	/** The order of application of axis rotation. */
	get order() { return this._order; }


	// --------------------------------------------------------- PUBLIC METHODS

	/** Gets the values of the Euler Node.
	* @returns An object with the values of the Euler Node. */
	getValues() { return { x: this._x.value, y: this._y.value, z: this._z.value }; }

	/** Sets the values of the Euler Node.
	 * @param x The value in the X axis.
	 * @param y The value in the Y axis.
	 * @param z The value in the Z axis. */
	setValues(x, y, z) {
		this._x.value = x;
		this._y.value = y;
		this._z.value = z;
	}
}





/** Defines a angular measurement. */
export class Angle extends Measure {

	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new instance of the Angle class.
<<<<<<< HEAD
	 * @param name The name of the data type.
	 * @param relation The data relation.
	 * @param data The initialization data. */
	constructor(name, relation, data) {

		// Call the parent class constructor
		super(name, relation, data, AngleUnits);
=======
	 * @param name The name of the Node.
	 * @param parent The parent Node.
	 * @param data The initialization data. */
	constructor(name, parent, data) {

		// Call the parent class constructor
		super(name, parent, data, ["angle"], AngleUnits);
>>>>>>> a1bb1438a29eadf7da80cdc810cdac2dbd2d398a

		// Deserialize the initialization data
		if (data)
			this.deserialize(data);
	}
}


// Define the angular measurement units
let AngleUnits = [
	new MeasurementUnit("degrees", ["deg", "d", "º"], 1),
	new MeasurementUnit("radians", ["rad", "RAD"], Math.PI / 180)
];




<<<<<<< HEAD
/** Defines a String data type. */
export class String extends Simple {
=======

/** Defines a User Interaction Space. */
export class Space extends Node {
>>>>>>> a1bb1438a29eadf7da80cdc810cdac2dbd2d398a


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

<<<<<<< HEAD
	/** Initializes a new instance of the String class.
	 * @param name The name of the data type.
	 * @param relation The data relation.
	 * @param data The initialization data. */
	constructor(name, relation, data) {

		// Call the parent class constructor
		super(name, relation, data);

		// ------------------------------------------------------- PROTECTED FIELDS

		/** The regular expression of the String. */
		this._validRegEx = undefined;
=======
	/** Initializes a new View instance.
	 * @param name The name of the View.
	 * @param parent The parent Node of the View.
	 * @param data The initialization data. */
	constructor(name, parent, data) {

		// Call the parent class constructor
		super(name, parent, data, ["space"]);

		// Create the entity for the space
		this._entity = new SpaceEntity(name, this);
>>>>>>> a1bb1438a29eadf7da80cdc810cdac2dbd2d398a

		// Deserialize the initialization data
		if (data)
			this.deserialize(data);
	}


	// ------------------------------------------------------- PUBLIC ACCESSORS

<<<<<<< HEAD
	/** The regular expression values of the String.*/
	get validRegEx() { return this._validRegEx; }
	set validRegEx(newValidRegEx) {
		this.updated = false;
		this._validRegEx = newValidRegEx;
		if (!this.checkValue(this._value))
			throw Error('Invalid value "'
				+ this._value + '" for: ' + this.name);
	}


	// --------------------------------------------------------- PUBLIC METHODS

	/** Deserializes the String instance.
	 * @param data The data to deserialize.
	 * @param mode The deserialization mode. */
	deserialize(data, mode) {
		if (typeof data == "object") {
			this._validValues = data.validValues;
			this._validRegEx = data.validRegEx;
			this._defaultValue = data.default; // Check the default value
			data = this.value = data.value;
		}
		if (typeof data !== "string")
			data = JSON.stringify(data);
		this.value = data;
	}


	/** Checks if the value is valid for this String instance.
	 * @param value The value to check.
	 * @returns A boolean value indicating whether the value is valid or not. */
	checkValue(value) {

		// Check the regular expression
		if (this._validRegEx && !this._validRegEx.test(value))
			return false;

		// If the value has not been rejected, check the 
		return super.checkValue(value);
	}


	/** Obtains the string representation of the Number.
	 * @returns The string representation of the Number. */
	toString() { return this.value || ""; }
=======
	/** The main entity of the Space. */
	get entity() { return this._entity; }


	/** Deserializes the Presence instance.
	 * @param data The data to deserialize.
	 * @param mode The deserialization mode. */
	deserialize(data, mode) {
		this._entity.deserialize(data);
	}
>>>>>>> a1bb1438a29eadf7da80cdc810cdac2dbd2d398a
}





<<<<<<< HEAD
/** Defines a Logic Behavior. */
export class Behavior extends Item {
=======


/** Defines an entity associated to an interaction Space. */
export class SpaceEntity extends Entity {
>>>>>>> a1bb1438a29eadf7da80cdc810cdac2dbd2d398a


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

<<<<<<< HEAD
	/** Initializes a new Behavior instance.
	 * @param name The name of the data type.
	 * @param relation The data relation.
	 * @param data The initialization data. */
	constructor(name, relation, data) {

		// Call the parent class constructor
		super(name, relation);

		// Create the entity for the space
		this._startFunction = new Function("start", this.children);
		this._updateFunction = new Function("update", this.children);
=======
	/** Initializes a new Space instance.
	 * @param name The name of the space.
	 * @param parent The parent node of the space.
	 * @param data The initialization data. */
	constructor(name, parent, data) {

		// Call the parent class constructor
		super(name, parent, data, ["space"]);

		// Create the child nodes
		this._spaces = new NodeSet("spaces", this, SpaceEntity);
		this._objects = new NodeSet("objects", this, ObjectEntity);

		// Deserialize the initialization data
		if (data)
			this.deserialize(data);

		// Create the representation of the space
		this._representation = new THREE.Scene();

		// TEMPORAL: Create a grid to represent the space
		let grid = new THREE.GridHelper(10, 20);
		this._representation.add(grid);

		// TEMPORAL: Create lights to illuminate the space
		let ambientLight = new THREE.AmbientLight(0x444444);
		this._representation.add(ambientLight);
		let directionalLight = new THREE.DirectionalLight(0xffffff);
		this._representation.add(directionalLight);

	}

	// ------------------------------------------------------- PUBLIC ACCESSORS

	/** The subspaces of the space. */
	get spaces() { return this._spaces; }
}






/** Defines an entity associated to an object. */
export class ObjectEntity extends Entity {


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new Space instance.
	 * @param name The name of the space.
	 * @param parent The parent node of the space.
	 * @param data The initialization data. */
	constructor(name, parent, data) {

		// Call the parent class constructor
		super(name, parent, data, ["object"]);

		// Create the child nodes
		this._assembly = new Assembly("assembly", this);

		// Deserialize the initialization data
		if (data)
			this.deserialize(data);

		//TEMPORAL
		let sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5), new THREE.MeshPhongMaterial({ color: 0x0000ff }));
		this._representation.add(sphere);

	}


	// ------------------------------------------------------- PUBLIC ACCESSORS

	/** The assembly of the object. */
	get assembly() { return this._assembly; }


	/** Updates the Entity.
	 * @param deltaTime The update time.
	 * @param forced Indicates whether the update is forced or not. */
	update(deltaTime = 0, forced = false) {

		// TODO Change shape of object here
		// Call the base class function
		super.update(deltaTime, forced);

	}
}







/** Defines a user. */
export class User extends Node {


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new User instance.
	 * @param name The name of the user.
	 * @param parent The parent Node of the user.
	 * @param data The initialization data. */
	constructor(name, parent, data) {

		// Call the parent class constructor
		super(name, parent, data, ["user"]);

		// Create the child nodes
		this._presences = new NodeSet("presences", this, Presence);
		this._views = new NodeSet("views", this, View);

		// Deserialize the initialization data
		if (data)
			this.deserialize(data);

		// Create the defaults
		if (this._presences.count == 0) {
			let spaces = this.nodeParent.spaces;
			for (let space of spaces) {
				let presence = new Presence("Presence", this._presences);
				presence.space = space;
			}
		}
		if (this._views.count == 0)
			new View("DefaultView", this._views);
	}

	// ------------------------------------------------------- PUBLIC ACCESSORS

	/** The presences of the user in the interaction spaces. */
	get presences() { return this._presences; }

	/** The point of views of the user. */
	get views() { return this._views; }


	// --------------------------------------------------------- PUBLIC METHODS

	/** Updates the Entity.
	 * @param deltaTime The update time.
	 * @param forced Indicates whether the update is forced or not. */
	update(deltaTime = 0, forced = false) {

		// If the update is not forced, skip it when the node is already updated
		if (this.nodeUpdated && !forced)
			return;

		// Call the base class function
		super.update(deltaTime, forced);
	}
}





/** Defines a user presence in an User Interaction space. */
export class Presence extends Node {


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new Presence instance.
	 * @param name The name of the presence.
	 * @param parent The parent Node of the presence.
	 * @param data The initialization data. */
	constructor(name, parent, data) {

		// Call the parent class constructor
		super(name, parent, data, ["presence"]);

		// Create the child nodes
		this._entity = new PresenceEntity(name + "Entity", this);
		// The space node is not initialized here because it is actually a link
>>>>>>> a1bb1438a29eadf7da80cdc810cdac2dbd2d398a

		// Deserialize the initialization data
		if (data)
			this.deserialize(data);
	}


	// ------------------------------------------------------- PUBLIC ACCESSORS

<<<<<<< HEAD
	/** The start function name. */
	get startFunction() { return this._startFunction; }

	/** The update function name. */
	get updateFunction() { return this._updateFunction; }
}




/** Defines a function handler data Type. */
export class Function extends Item {


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new instance of the Simple class.
	 * @param name The name of the data type.
	 * @param relation The data relation.
	 * @param data The initialization data. */
	constructor(name, relation, data) {

		// Call the parent class constructor
		super(name, relation);

		// Deserialize the initialization data
		if (data)
			this.deserialize(data);
	}

	// ------------------------------------------------------ PUBLIC PROPERTIES

	/** The current value of the Simple data type.*/
	get value() { return this._value; }
	set value(newValue) {
		if (this._value == newValue)
			return;
		this._value = newValue;
		this.updated = false;
	}


	/** Indicates whether the value is undefined or not. */
	get isUndefined() { return (this._value == undefined); }

	/** An event triggered if the value is modified. */
	get onModified() { return this._onModified; }


	// --------------------------------------------------------- PUBLIC METHODS

	/** Serializes the Function instance.
	 * @return The serialized data. */
	serialize() { return this._value; }

	/** Deserializes the Function data type.
	 * @param data The value to deserialize.
	 * @param mode The deserialization mode. */
	deserialize(data, mode) { this._value = data; }

	/** Obtains the value of the Function data type
	 * @return The value of the Function. */
	valueOf() { return this.value; }
=======
	/** The entity associated with this presence. */
	get entity() { return this._entity; }

	/** The space associated with the presence. */
	get space() { return this._space; }
	set space(space) { this._space = space; }


	/** Deserializes the Presence instance.
	 * @param data The data to deserialize.
	 * @param mode The deserialization mode. */
	deserialize(data, mode) {

		// Get the space reference
		if (data.space) {
			let spaceName = data.space;
			let root = this.nodeAncestor("root");
			let space = root.spaces.getByName(spaceName);
			if (!space)
				throw Error("Space '" + spaceName + "' not found");
			this.space = space;
		}

		this.entity.deserialize(data);
	}
>>>>>>> a1bb1438a29eadf7da80cdc810cdac2dbd2d398a
}






/** Defines a user Presence entity. */
export class PresenceEntity extends Entity {


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new CameraEntity instance.
<<<<<<< HEAD
	 * @param name The name of the data type.
	 * @param relation The data relation.
	 * @param data The initialization data. */
	constructor(name, relation, data) {

		// Call the parent class constructor
		super(name, relation);

		// Create the 
		this._fieldOfView = new Number("fov", this.children, { defaultValue: 45 });
		this._aspectRatio = new Number("aspect", this.children, { defaultValue: 1 });
		this._nearPlane = new Number("near", this.children, { defaultValue: 0.001 });
		this._farPlane = new Number("far", this.children, { defaultValue: 1000 });
=======
	 * @param name The name of the entity.
	 * @param name The parent of the entity.
	 * @param data The initialization data. */
	constructor(name, parent = null, data = {}) {

		// Call the base class constructor
		super(name, parent, data, ["camera"]),

			// Create the 
			this._fieldOfView = new Number("fov", this, { defaultValue: 45 });
		this._aspectRatio = new Number("aspect", this, { defaultValue: 1 });
		this._nearPlane = new Number("near", this, { defaultValue: 0.001 });
		this._farPlane = new Number("far", this, { defaultValue: 1000 });
>>>>>>> a1bb1438a29eadf7da80cdc810cdac2dbd2d398a

		// Deserialize the initialization data
		if (data)
			this.deserialize(data);

<<<<<<< HEAD
		// Create the representation of the camera
=======
		// 
>>>>>>> a1bb1438a29eadf7da80cdc810cdac2dbd2d398a
		this._representation = new THREE.PerspectiveCamera(this._fieldOfView.value, this._aspectRatio.value, this._nearPlane.value, this._farPlane.value);

	}


	// ------------------------------------------------------- PUBLIC ACCESSORS

	/** The field of view of the Camera. */
	get fieldOfView() { return this._fieldOfView; }

	/** The aspect ratio of the Camera. */
	get aspectRatio() { return this._aspectRatio; }

	/** The near plane of the Camera frustum. */
	get nearPlane() { return this._nearPlane; }

	/** The far plane of the Camera frustum. */
	get farPlane() { return this._farPlane; }


	/** Updates the Entity.
	 * @param deltaTime The update time.
	 * @param forced Indicates whether the update is forced or not. */
	update(deltaTime = 0, forced = false) {

		// If the update is not forced, skip it when the node is already updated
<<<<<<< HEAD
		if (this.updated && !forced)
=======
		if (this.nodeUpdated && !forced)
>>>>>>> a1bb1438a29eadf7da80cdc810cdac2dbd2d398a
			return;

		// Use a typed variable
		let camera = this._representation;

<<<<<<< HEAD
		// Update the properties of the entity
		if (!this._position.updated) {
			camera.position.set(this._position.x.value, this._position.y.value, this._position.z.value);
		}
		if (!this._rotation.updated) {
			camera.rotation.set(this._rotation.x.value, this._rotation.y.value, this._rotation.z.value);
		}
		if (!this._fieldOfView.updated) {
			camera.fov = this._fieldOfView.value;
			camera.updateProjectionMatrix();
		}
		if (!this._aspectRatio.updated) {
			camera.aspect = this._aspectRatio.value;
			camera.updateProjectionMatrix();
		}
		if (!this._nearPlane.updated) {
			camera.near = this._nearPlane.value;
			camera.updateProjectionMatrix();
		}
		if (!this._farPlane.updated) {
=======
		// Update the properties of the node
		if (!this._position.nodeUpdated) {
			camera.position.set(this._position.x.value, this._position.y.value, this._position.z.value);
		}
		if (!this._rotation.nodeUpdated) {
			camera.rotation.set(this._rotation.x.value, this._rotation.y.value, this._rotation.z.value);
		}
		if (!this._fieldOfView.nodeUpdated) {
			camera.fov = this._fieldOfView.value;
			camera.updateProjectionMatrix();
		}
		if (!this._aspectRatio.nodeUpdated) {
			camera.aspect = this._aspectRatio.value;
			camera.updateProjectionMatrix();
		}
		if (!this._nearPlane.nodeUpdated) {
			camera.near = this._nearPlane.value;
			camera.updateProjectionMatrix();
		}
		if (!this._farPlane.nodeUpdated) {
>>>>>>> a1bb1438a29eadf7da80cdc810cdac2dbd2d398a
			camera.far = this._farPlane.value;
			camera.updateProjectionMatrix();
		}

		// Call the base class function
		super.update(deltaTime, forced);
	}
}






<<<<<<< HEAD
/** Defines a User Interaction Space. */
export class Space extends Item {


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new View instance.
	 * @param name The name of the data type.
	 * @param relation The data relation.
	 * @param data The initialization data. */
	constructor(name, relation, data) {

		// Call the parent class constructor
		super(name, relation);

		// Create the entity for the space
		this._entity = new SpaceEntity(name, this.children);

		// Deserialize the initialization data
		if (data)
			this.deserialize(data);

		console.log("Space created: " + this.name);
	}


	// ------------------------------------------------------- PUBLIC ACCESSORS

	/** The main entity of the Space. */
	get entity() { return this._entity; }


	/** Deserializes the Presence instance.
	 * @param data The data to deserialize.
	 * @param mode The deserialization mode. */
	deserialize(data, mode) {
		// this._entity.deserialize(data);
	}
}

/** The metadata of the Space class. */
Space.type = new Type(Space, Item.type);







/** Defines an entity associated to an interaction Space. */
export class SpaceEntity extends Entity {


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new Space instance.
	 * @param name The name of the data type.
	 * @param relation The data relation.
	 * @param data The initialization data. */
	constructor(name, relation, data) {

		// Call the parent class constructor
		super(name, relation);

		// Create the child nodes
		this._spaces = new Relation("spaces", [SpaceEntity.type], this, this.children);
		this._objects = new Relation("objects", [ObjectEntity.type], this, this.children);

		// Deserialize the initialization data
		if (data)
			this.deserialize(data);

		// Create the representation of the space
		this._representation = new THREE.Scene();

		// TEMPORAL: Create a grid to represent the space
		let grid = new THREE.GridHelper(10, 20);
		this._representation.add(grid);

		// TEMPORAL: Create lights to illuminate the space
		let ambientLight = new THREE.AmbientLight(0x444444);
		this._representation.add(ambientLight);
		let directionalLight = new THREE.DirectionalLight(0xffffff);
		this._representation.add(directionalLight);

	}


	// ------------------------------------------------------- PUBLIC ACCESSORS

	/** The subspaces of the space. */
	get spaces() { return this._spaces; }
}






/** Defines an entity associated to an object. */
export class ObjectEntity extends Entity {

	// --------------------------------------------------------- PRIVATE FIELDS

	/** The assembly of the object. */
	// private _assembly: Assembly;


	// ------------------------------------------------------- PUBLIC ACCESSORS

	/** The assembly of the object. */
	// get assembly(): Assembly { return this._assembly; }


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new Space instance.
	 * @param name The name of the data type.
	 * @param relation The data relation.
	 * @param data The initialization data. */
	constructor(name, relation, data) {

		// Call the parent class constructor
		super(name, relation);

		// Create the child nodes
		// this._assembly = new Assembly("assembly", this);

		// Deserialize the initialization data
		if (data)
			this.deserialize(data);

		//TEMPORAL
		let sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5), new THREE.MeshPhongMaterial({ color: 0x0000ff }));
		this._representation.add(sphere);

	}


	/** Updates the Entity.
	 * @param deltaTime The update time.
	 * @param forced Indicates whether the update is forced or not. */
	update(deltaTime = 0, forced = false) {

		// TODO Change shape of object here
		// Call the base class function
		super.update(deltaTime, forced);

	}
}







=======
>>>>>>> a1bb1438a29eadf7da80cdc810cdac2dbd2d398a



/** Defines a User Interaction View. */
<<<<<<< HEAD
export class View extends Item {
=======
export class View extends Node {
>>>>>>> a1bb1438a29eadf7da80cdc810cdac2dbd2d398a


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new View instance.
<<<<<<< HEAD
	 * @param name The name of the data type.
	 * @param relation The data relation.
	 * @param data The initialization data. */
	constructor(name, relation, data) {

		// Call the parent class constructor
		super(name, relation);
=======
	 * @param name The name of the View.
	 * @param parent The parent Node of the View.
	 * @param data The initialization data. */
	constructor(name, parent, data) {

		// Call the parent class constructor
		super(name, parent, data, ["view"]);
>>>>>>> a1bb1438a29eadf7da80cdc810cdac2dbd2d398a

		/** The time between updates. */
		this._deltaTime = 0;

		/** The last update time. */
		this._lastTime = 0;

		/** The Frames Per Second counter. */
		this._fpsCounter = 0;

		/** The Frames Per Second timer. */
		this._fpsTimer = 0;

		/** The current Frames Per Second value. */
		this._fpsValue = 0;

		/** The list of Frames Per Second values. */
		this._fpsValues = [];

		/** The maximum size of the array of Frames Per Second values. */
		this._fpsValuesMaxSize = 100;

		// Create the sub nodes
<<<<<<< HEAD
		this._width = new Number("width", this.children, { default: 100, min: 0 });
		this._height = new Number("height", this.children, { default: 100, min: 0 });
		this._state = new String("state", this.children, { default: "Normal",
			validValues: "Normal, Maximized, FullScreen, VR, AR" });
		this._layers = new Relation("layers", [Layer.type], this, this.children);
=======
		this._width = new Number("width", this, { default: 100, min: 0 });
		this._height = new Number("height", this, { default: 100, min: 0 });
		this._state = new String("state", this, { default: "Normal",
			validValues: "Normal, Maximized, FullScreen, VR, AR" });
		this._layers = new NodeSet("layers", this, Layer);
>>>>>>> a1bb1438a29eadf7da80cdc810cdac2dbd2d398a

		// Deserialize the initialization data
		if (data)
			this.deserialize(data);

		// Create the viewport WebGL renderer
<<<<<<< HEAD
		this._element = View.createDomElement("div", this.name + "View", null, 'CoEditAR-View');
		this._canvas = View.createDomElement("canvas", this.name + "Canvas", this._element, 'CoEditAR-Canvas', 'width:100%; height:100%;');
		this._viewport = new Viewport(this._canvas, this.update.bind(this));
=======
		this._element = View.createDomElement("div", this.nodeName + "View", null, 'CoEditAR-View');
		this._canvas = View.createDomElement("canvas", this.nodeName + "Canvas", this._element, 'CoEditAR-Canvas', 'width:100%; height:100%;');
		this._viewport = new ViewPort(this._canvas, this.update.bind(this));
>>>>>>> a1bb1438a29eadf7da80cdc810cdac2dbd2d398a


		// If there is no layer, create a default ones
		if (this._layers.count == 0) {
<<<<<<< HEAD
			let presences = this.parent.presences;
=======
			let presences = this.nodeParent.presences;
>>>>>>> a1bb1438a29eadf7da80cdc810cdac2dbd2d398a
			for (let presence of presences) {
				new Layer("Layer", this._layers, presence);
			}
		}


		// Set a connection to the resize event
		window.onresize = (e) => { this.resize(); };
<<<<<<< HEAD
		this._state.onModification.listen(() => { this.resize(); });
=======
		this._state.onModified.listen(() => { this.resize(); });
>>>>>>> a1bb1438a29eadf7da80cdc810cdac2dbd2d398a

		// TEMPORAL
		this._element.addEventListener("dblclick", () => {
			this._state.value = "Fullscreen";
		});

		// Update the viewport
		this._state.value = "Maximized";
	}


	// ------------------------------------------------------- PUBLIC ACCESSORS

	/** The main element of the view. */
	get element() { return this._element; }

	/** The canvas element of the view. */
	get canvas() { return this._canvas; }

	/** The state of the view. */
	get state() { return this._state; }

	/** The width of the view. */
	get width() { return this._width; }

	/** The height of the view. */
	get height() { return this._height; }

	/** The layers of the view. */
	get layers() { return this._layers; }

	/** The current Frames Per Second value. */
	get fpsValue() { return this._fpsValue; }

	/** The list of Frames Per Second values. */
	get fpsValues() { return this._fpsValues; }


	// --------------------------------------------------------- PUBLIC METHODS

	/** Updates the Viewport.
	 * @param time The time (in milliseconds) since the last call. */
	update(time = 0) {

		// Update the delta time and Frames Per Second counter
		time /= 1000; // Convert the time to seconds
		this._deltaTime = time - this._lastTime;
		this._lastTime = time;
		this._fpsTimer += this._deltaTime;
		this._fpsCounter++;
		if (this._fpsTimer >= 1) {
			this._fpsValue = this._fpsCounter;
			console.log("FPS: " + this._fpsValue);
			if (this._fpsValues.length >= this._fpsValuesMaxSize)
				this._fpsValues.shift();
			this._fpsValues.push(this._fpsValue);
			this._fpsTimer %= 1;
			this._fpsCounter = 0;
		}


		// Update and render the layers
		for (let layer of this._layers) {
			layer.presence.space.update(this._deltaTime);
			// layer.presence.update(this._deltaTime);
			this._viewport.render(layer.presence);
		}
	}


	/** Resizes the viewport. */
	resize() {

		//
		if (this._state.value !== "FullScreen" && document.fullscreenElement) {
			document.exitFullscreen();
		}


		switch (this._state.value) {
			case "Normal":
				this._element.style.position = "initial";
				this._width.value = this._element.clientWidth;
				this._height.value = this._element.clientHeight;
				break;
			case "Maximized":
				this._element.style.position = "fixed";
				this._element.style.top = "0";
				this._element.style.left = "0";
				this._element.style.width = "100vw";
				this._element.style.height = "100vh";
				this._width.value = this._element.clientWidth;
				this._height.value = this._element.clientHeight;
				break;
			case "FullScreen":
				// debugger
				if (!document.fullscreenElement)
					this._element.requestFullscreen();
				this._element.style.width = "100vw";
				this._element.style.height = "100vh";
				this._width.value = this._element.clientWidth;
				this._height.value = this._element.clientHeight;
				break;
		}

		// Set the size of the viewport
		this._viewport.resize(this._width.value, this._height.value);
		let aspectRatio = this._width.value / this._height.value;

		// Update the camera properties of the associated presences
		for (let layer of this._layers) {
			layer.presence.entity.aspectRatio.value = aspectRatio;
			layer.presence.entity.update();
		}
	}


	/** Creates a DOM element
	 * @param type The type of the element (its tag name)
	 * @param id The id of the element.
	 * @param parent The parent of the element.
	 * @param classes The classes of the element.
	 * @param style The style of the element.
	 * @param content The HTML content of the element.
	 * @returns The generated element. */
	static createDomElement(type, id, parent, classes, style, content) {

		// Create the element
		let element = document.createElement(type);

		// Set the properties of the element
		if (id)
			element.id = id;
		if (classes)
			element.className = classes;
		if (style)
			element.style.cssText = style;
		if (content)
			element.innerHTML = content;

		// Set the parent of element
		((parent) ? parent : document.body).appendChild(element);

		// Return the generated element
		return element;
	}


	/** Creates a CSS rule.
	 * @param selector The CSS selector
	 * @param rule The css rule
	 * @param override Indicates whether to override rules or not. */
	static addCssRule(selector, rule, override = false) {

		// If there is no stylesheet, create it
		if (document.styleSheets.length == 0)
			document.head.append(document.createElement('style'));
		let stylesheet = document.styleSheets[0];

		// Check if the rule exists
		let rules = stylesheet.cssRules, ruleIndex, ruleCount = rules.length;
		for (ruleIndex = 0; ruleIndex < ruleCount; ruleIndex++) {
			if (rules[ruleIndex].cssText.startsWith(selector)) {
				if (override)
					rules[ruleIndex].cssText = selector + " " + rule;
				else
					return;
			}
		}

		// If no rule was fond, create i and add it at the end
		stylesheet.insertRule(selector + " " + rule, ruleCount);
	}
}




/** Defines an user interaction Layer. */
<<<<<<< HEAD
export class Layer extends Item {
=======
export class Layer extends Node {
>>>>>>> a1bb1438a29eadf7da80cdc810cdac2dbd2d398a


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new Layer instance.
<<<<<<< HEAD
	 * @param name The name of the data type.
	 * @param relation The data relation.
	 * @param data The initialization data. */
	constructor(name, relation, data) {

		// Call the parent class constructor
		super(name, relation);
=======
	 * @param name The name of the layer.
	 * @param parent The parent Node of the layer.
	 * @param data The initialization data. */
	constructor(name, parent, data) {

		// Call the parent class constructor
		super(name, parent, data, ["layer"]);
>>>>>>> a1bb1438a29eadf7da80cdc810cdac2dbd2d398a

		// Deserialize the initialization data
		if (data)
			this.deserialize(data);
	}

	// ------------------------------------------------------- PUBLIC ACCESSORS

	/** The space associated with the presence. */
	get presence() { return this._presence; }
	set presence(presence) { this._presence = presence; }


	/** Deserializes the Layer instance.
	 * @param data The data to deserialize.
	 * @param mode The deserialization mode. */
	deserialize(data, mode) {
<<<<<<< HEAD
		if (data.type.is("Presence"))
			this._presence = data;
	}
=======
		if (data.nodeTypes.includes("presence"))
			this._presence = data;
	}
}




/** Defines a Viewport. */
export class ViewPort {

	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new View instance.
	 * @param canvas The canvas of the viewport. */
	constructor(canvas, updateFunction) {

		this._canvas = canvas;

		// Create the renderer
		this._renderer = new THREE.WebGLRenderer({ canvas: this._canvas });
		this._renderer.xr.enabled = true;
		this._renderer.setAnimationLoop(updateFunction);
	}


	// ------------------------------------------------------- PUBLIC ACCESSORS

	/** The main element of the view. */
	get element() { return this._element; }

	/** The canvas element of the view. */
	get canvas() { return this._canvas; }

	/** The renderer of the view. */
	get renderer() { return this._renderer; }

	resize(width, height) {
		this._renderer.setSize(width, height);
	}

	render(presence) {

		// Clear the renderer
		this._renderer.setClearColor(0xff0000);
		this._renderer.clear();


		this._renderer.render(presence.space.entity.representation, presence.entity.representation);

	}
}





/** Defines an external data resource. */
export class Resource extends Node {


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new instance of the Simple class.
	 * @param name The name of the node.
	 * @param parent The parent node.
	 * @param data The initialization data.
	 * @param types The metadata of the node. */
	constructor(type, name, parent, data) {

		// Call the parent class constructor
		super(name, parent), [type, "resource"];

		// Create the child nodes
		this._url = new String("url", this);

		// Deserialize the initialization data
		if (data != undefined)
			this.deserialize(data);

		// Mark the resource as not loaded
		// Mark the resource as not loaded
		this._loaded = 0;
	}


	// ------------------------------------------------------- PUBLIC ACCESSORS

	/** The URL of the resource. */
	get url() { return this._url; }

	/** The load percentage of the resource. */
	get loaded() { return this._loaded; }


	// --------------------------------------------------------- PUBLIC METHODS

	/** Serializes the String instance.
	* @return The serialized data. */
	serialize() { return this._url; }

	/** Deserializes the Simple data type.
	 * @param data The value to deserialize.
	 * @param mode The deserialization mode. */
	deserialize(data, mode) {
		if (data && typeof (data) == "string")
			this._url.value = data;
	}

	/** Loads the resource.
	 * @param url The URL of the Resource. */
	load(url) {
		if (url)
			this._url.value = url.toString();
		this._loaded = 0;
	}
}




/** Defines a Audio Resource. */
export class AudioResource extends Resource {


	// ------------------------------------------------------- PUBLIC ACCESSORS

	/** The representation of the Font. */
	get representation() { return this._representation; }
}




/** Defines a Model Resource. */
export class ModelResource extends Resource {
}








/** Provides a way to group resources. */
export class ResourceGroup extends Node {


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new ResourceManager instance.
	 * @param name The name of the interaction space. */
	constructor(name) {

		// Call the parent class constructor
		super(name);

		// Create the node sets
		this._models = new NodeSet("models", this, ModelResource);
		// this._fonts = new NodeSet<FontResource>("fonts", this, FontResource);
		this._audios = new NodeSet("audios", this, AudioResource);
	}


	// ------------------------------------------------------- PUBLIC ACCESSORS

	/** The model resources. */
	get models() { return this._models; }

	/** The font resources. */
	// get fonts (): NodeSet<FontResource> { return this._fonts; }

	/** The audio resources. */
	get audios() { return this._audios; }
>>>>>>> a1bb1438a29eadf7da80cdc810cdac2dbd2d398a
}




/** Defines a Viewport. */
export class Viewport {

	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new Viewport instance.
	 * @param canvas The canvas of the viewport.
	 * @param updateFunction The function called upon viewport update. */
	constructor(canvas, updateFunction) {

		// Save the canvas reference
		this._canvas = canvas;

		// Create the renderer
		this._renderer = new THREE.WebGLRenderer({ canvas: this._canvas });
		this._renderer.xr.enabled = true;
		this._renderer.setAnimationLoop(updateFunction);
	}


	// ------------------------------------------------------- PUBLIC ACCESSORS

	/** The main element of the viewport. */
	get element() { return this._element; }

	/** The canvas element of the viewport. */
	get canvas() { return this._canvas; }

	/** The renderer of the viewport. */
	get renderer() { return this._renderer; }


	/** Resizes the viewport.
	 * @param width The width of the viewport.
	 * @param height The height of the viewport. */
	resize(width, height) {
		this._renderer.setSize(width, height);
	}


	/** Renders the a user presence in an interaction space.
	 * @param presence The user presence. */
	render(presence) {

		// Clear the renderer
		this._renderer.setClearColor(0xff0000);
		this._renderer.clear();


		this._renderer.render(presence.space.entity.representation, presence.entity.representation);

	}
}




/** Defines a generic list of data types. */
export class List extends Collection {

	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new instance of the List instance.
	 * @param types The types of types in the collection. */
	constructor(types) {

		// Call the base class constructor
		super(types);
	}

	// --------------------------------------------------------- PUBLIC METHODS

	/** Adds a new item to the list.
	 * @param item The item to add.
	 * @param position The position where to add the item (by default, at the
	 * end). Negative values imply counting from the end of the list.
	 * @returns The added type.  */
	add(item, position) {

		// If no position is defined, just add the item to the end of the array
		if (position == undefined)
			this._items.push(item);
		else { // Otherwise, calculate the index from the position
			let index = 0, size = this._items.length;
			if (position > 0) {
				index = position;
				if (index > size)
					index = size; // Prevent out_of_bounds errors
			}
			else { // Negative values imply counting backwards
				index = size - position;
				if (index < 0)
					index = 0; // Prevent out_of_bounds errors
			}

			// Insert the item in the right position
			this._items.splice(index, 0, item);
		}

		// Remember to increase the counter 
		this._count++;
	}
}







/** Defines a RGB Color. */
export class Color extends Complex {


	// ------------------------------------------------------------ CONSTRUCTOR

	/** Initializes a new instance of the Color class.
	 * @param name The name of the data type.
	 * @param relation The data relation.
	 * @param data The initialization data. */
	constructor(name, relation, data) {

<<<<<<< HEAD
		// Call the parent class constructor
		super(name, relation, data);
=======
		// Call the base class constructor
		super(name, parent, data, ["color"]);

		// --------------------------------------------------------- PRIVATE FIELDS

		/** The red component of the Color. */
		this._r = new Number("r", this);
>>>>>>> a1bb1438a29eadf7da80cdc810cdac2dbd2d398a

		// Initialize the child nodes
		this._r = new Number("r", this._components, { min: 0, max: 1 });
		this._g = new Number("g", this._components, { min: 0, max: 1 });
		this._b = new Number("b", this._components, { min: 0, max: 1 });
		this._a = new Number("a", this._components, { min: 0, max: 1, defaultValue: 1 });

		// Deserialize the initialization data
		if (data != undefined)
			this.deserialize(data);
	}

	// ------------------------------------------------------ PUBLIC PROPERTIES

	/** The red component of the Color. */
	get r() { return this._r; }

	/** The green component of the Color. */
	get g() { return this._g; }

	/** The blue component of the Color. */
	get b() { return this._b; }

	/** The alpha component of the Color. */
	get a() { return this._a; }


	// --------------------------------------------------------- PUBLIC METHODS

	/** Gets the values of the Color.
	* @returns An object with the values of the Color. */
	getValues() {
		return { r: this._r.value, g: this._g.value, b: this._b.value,
			a: this._a.value };
	}

	/** Sets the values of the Color.
	 * @param r The value of the Red component Color
	 * @param g The value of the Green component Color.
	 * @param b The value of the Blue component Color.
	 * @param a The value of the Alpha component Color. */
	set(r = 0, g = 0, b = 0, a = 1) {
		this._r.value = r;
		this._g.value = g;
		this._b.value = b;
		this._a.value = a;
	}

	/** Obtains the string representation of the Color.
	 * @returns The string representation of the Color. */
	toString() {
		return "rgb(" + this._r + ", " + this._g + ", " + this._b + ")";
	}
}






/** Defines a four-dimensional complex number to describe rotations. */
export class Quaternion extends Complex {


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new instance of the Quaternion class.
	 * @param name The name of the data type.
	 * @param relation The data relation.
	 * @param data The initialization data. */
	constructor(name, relation, data) {

<<<<<<< HEAD
		// Call the parent class constructor
		super(name, relation, data);
=======
		// Call the parent constructor
		super(name, parent, data, ["quaternion"]);
>>>>>>> a1bb1438a29eadf7da80cdc810cdac2dbd2d398a

		// Create the children nodes
		this._x = new Number("x", this._components, 0);
		this._y = new Number("y", this._components, 0);
		this._z = new Number("z", this._components, 0);
		this._w = new Number("w", this._components, 1);

		// Deserialize the initialization data
		if (data)
			this.deserialize(data);
	}


	// ------------------------------------------------------- PUBLIC ACCESSORS

	/** The value of the quaternion vector in the X(i) axis. */
	get x() { return this._x; }

	/** The value of the quaternion vector in the Y(j) axis. */
	get y() { return this._y; }

	/** The value of the quaternion vector in the Z(k) axis. */
	get z() { return this._z; }

	/** The rotation half-angle around the quaternion vector. */
	get w() { return this._w; }


	// --------------------------------------------------------- PUBLIC METHODS

	/** Gets the values of the Quaternion.
	 * @returns An object with the values of the Quaternion. */
	getValues() {
		return { x: this._x.value, y: this._y.value, z: this._z.value,
			w: this._w.value };
	}


	/** Sets the values of the Quaternion.
	 * @param x The value of the quaternion vector in the X(i) axis.
	 * @param y The value of the quaternion vector in the Y(j) axis.
	 * @param z The value of the quaternion vector in the Z(k) axis.
	 * @param w The rotation half-angle around the quaternion vector. */
	setValues(x = 0, y = 0, z = 0, w = 1) {
		this._x.value = x;
		this._y.value = y;
		this._y.value = z;
		this._w.value = w;
	}
}




/** Defines a time measurement. */
export class Time extends Measure {

	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new instance of the Time class.
	 * @param name The name of the data type.
	 * @param relation The data relation.
	 * @param data The initialization data. */
	constructor(name, relation, data) {

		// Call the parent class constructor
<<<<<<< HEAD
		super(name, relation, data, TimeMeasurementUnits);
=======
		super(name, parent, data, ["time"], TimeMeasurementUnits);
>>>>>>> a1bb1438a29eadf7da80cdc810cdac2dbd2d398a

		// Deserialize the initialization data
		if (data)
			this.deserialize(data);
	}
}


// Define the Time Measurement Units
let TimeMeasurementUnits = [
	new MeasurementUnit("seconds", ["s", "sec"], 1),
	new MeasurementUnit("minutes", ["m", "mins"], 1 / 60),
	new MeasurementUnit("hours", ["h"], 1 / 3600),
	new MeasurementUnit("milliseconds", ["ms", "millisecs"], 1000),
];




/** Defines a Boolean data type. */
export class Boolean extends Simple {

	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new instance of the Boolean class.
	 * @param name The name of the data type.
	 * @param relation The data relation.
	 * @param data The initialization data. */
	constructor(name, relation, data) {

		// Call the parent class constructor
<<<<<<< HEAD
		super(name, relation, data);
=======
		super(name, parent, data, ["boolean"]);
>>>>>>> a1bb1438a29eadf7da80cdc810cdac2dbd2d398a

		// Set the values of the properties
		this._value = undefined;
		this._defaultValue = false;

		// Deserialize the initialization data
		if (data)
			this.deserialize(data);
	}


	// --------------------------------------------------------- PUBLIC METHODS

	/** Serializes the Boolean instance.
	 * @return The serialized data. */
	serialize() { return this._value; }

	/** Deserializes the Boolean instance.
	 * @param data The data to deserialize.
	 * @param mode The deserialization mode. */
	deserialize(data, mode) {
		if (typeof data == "object") {
			this.defaultValue = data.default;
			this.value = data.value;
		}
		else if (typeof data !== "boolean")
			this.value = (data == "false" || data == 0) ? false : true;
		else
			this.value = data;
	}

	/** Obtains the string representation of the Boolean.
	 * @returns The string representation of the Number. */
	toString() { return this.value ? "true" : "false"; }
}


export default CoEditAR;