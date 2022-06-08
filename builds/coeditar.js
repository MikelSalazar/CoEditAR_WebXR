

/** Defines a data Node. */
       class Node {


	// ------------------------------------------------------------ CONSTRUCTOR

	/** Initializes a new instance of the Node class.
	 * @param types The types of the Node.
	 * @param name The name of the Node.
	 * @param parent The parent Node.
	 * @param data The initialization data. */
	constructor(types, name, parent, data) {

		// Initialize the data of the node
		this._nodeTypes = types;
		this._nodeName = name;
		this._nodeParent = parent;
		this._nodeChildren = [];
		this._nodeLinks = [];

		// If the name is undefined, create one based on the type data
		if (this._nodeName == undefined)
			this._nodeName =
				((types && types.length > 0) ? this.nodeType : "Node") +
					((parent && parent.nodeChildren.length > 1) ?
						parent.nodeChildren.length : "");

		// Create a link between the node and its parent
		if (parent)
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
		if (!this._nodeParent)
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
			for (const connectedNode of this._nodeLinks)
				connectedNode.nodeUpdated = false;
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
       class Event {


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

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
       class NodeSet extends Node {

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









/** Manages the CoEditAR Framework (and facilitates the creation of web
 * apps on top of it). */
       class CoEditAR extends Node {


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new CoEditAR instance.
	  * @param data The initialization data (or a URL to the data file). */
	constructor(data) {

		// Call the base class constructor
		super(["root"], "coeditar", null, data);

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
       class Simple extends Node {


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new instance of the Type class.
	 * @param types The types of the Node.
	 * @param defaultValue The default value of the Type.
	 * @param name The name of the Node.
	 * @param parent The parent Node.
	 * @param data The initialization data. */
	constructor(types, name, parent, data) {

		// Call the parent class constructor
		super([...types, "simple"], name, parent, data);

		/** The valid values of the Simple data type. */
		this._validValues = undefined;

		// Create the events
		this._onModified = new Event("modified", this);

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
				+ newValue + '" for: ' + this._nodeName);
		this._value = newValue;
		this.nodeUpdated = false;
		this._onModified.trigger(this, newValue);
	}

	/** The default value of the Simple data type. */
	get defaultValue() { return this._defaultValue; }
	set defaultValue(newDefaultValue) {
		if (this._defaultValue == newDefaultValue)
			return;
		if (!this.checkValue(newDefaultValue))
			throw Error('Invalid default value "' + newDefaultValue +
				'" for: ' + this._nodeName);
		this._defaultValue = newDefaultValue;
		this.nodeUpdated = false;
		this._onModified.trigger(this);
	}

	/** The valid values of the Simple data type.*/
	get validValues() { return this._validValues; }
	set validValues(newValidValues) {
		this._validValues = newValidValues;
		if (!this.checkValue(this._value))
			throw Error('Invalid value "'
				+ this._value + '" for: ' + this._nodeName);
		this._onModified.trigger(this);
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




/** Defines a Number Node. */
       class Number extends Simple {


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new instance of the Number class.
	 * @param name The name of the Node.
	 * @param parent The parent Node.
	 * @param data The initialization data. */
	constructor(name, parent, data) {

		// Call the parent class constructor
		super(["number"], name, parent, data);

		// --------------------------------------------------------- PRIVATE FIELDS

		/** The minimum possible value of Number. */
		this._min = undefined;

		/** The maximum possible value of the Number. */
		this._max = undefined;

		// Set the values of the properties
		this._value = undefined;
		this._defaultValue = 0;

		// Deserialize the initialization data
		if (data)
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
		this._min = newMin;
		this.nodeUpdated = false;
		this._onModified.trigger(this);
	}

	/** The maximum possible value of the Number. */
	get max() { return this._max; }
	set max(newMax) {
		if (this._min != undefined && newMax < this._min)
			this._min = newMax;
		if (this._value != undefined && this._value > newMax)
			this.value = newMax;
		this._max = newMax;
		this.nodeUpdated = false;
		this._onModified.trigger(this);
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









/** Describes a package (a collection of resources). */
       class Package extends Node {


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new Package instance.
	 * @param data The initialization data. */
	constructor(name, parent, data = {}) {

		// Call the base class constructor
		super(["package"], name, parent, data);

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





/** Defines a String Node. */
       class String extends Simple {


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new instance of the String class.
	 * @param name The name of the Node.
	 * @param parent The parent Node.
	 * @param data The initialization data. */
	constructor(name, parent, data) {

		// Call the parent class constructor
		super(["string"], name, parent, data);

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
}








/** Defines a smart assembly. */
       class Assembly extends Node {


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new Assembly instance.
	 * @param data The initialization data. */
	constructor(name, parent, data = {}) {

		// Call the base class constructor
		super(["assembly"], name, parent, data);

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
       class Shape extends Node {


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new Shape instance.
	 * @param data The initialization data. */
	constructor(name, parent, data = {}) {

		// Call the base class constructor
		super(["shape"], name, parent, data);

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
       class Part extends Node {


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new Part instance.
	 * @param data The initialization data. */
	constructor(name, parent, data = {}) {

		// Call the base class constructor
		super(["part"], name, parent, data);

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
       class Behavior extends Node {

	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new Behavior instance.
	 * @param name The name of the behavior.
	 * @param parent The parent Node of the behavior.
	 * @param data The initialization data. */
	constructor(types, name, parent, data) {

		// Call the parent class constructor
		super([...types, "behavior"], name, parent, data);

		// Deserialize the initialization data
		if (data)
			this.deserialize(data);
	}
}









/** Defines a logic Entity. */
       class Entity extends Node {


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new Entity instance.
	 * @param name The name of the Entity.
	 * @param parent The parent Node of the Entity.
	 * @param data The initialization data. */
	constructor(types, name, parent, data) {

		// Call the parent class constructor
		super([...types, "entity"], name, parent, data);

		// Create the child nodes
		this._position = new Vector("position", this);
		this._rotation = new Euler("rotation", this);
		this._behaviors = new NodeSet("behaviors", this, Behavior);
		this._entities = new NodeSet("entities", this, Entity);

		// Deserialize the initialization data
		if (data)
			this.deserialize(data);

		// Create the basic representation
		this._representation = new THREE.Object3D();
		this._representation.name = this.nodeName;
		if (parent && parent.nodeTypes.includes("entity"))
			parent._representation.add(this._representation);
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
		if (this.nodeUpdated && !forced)
			return;

		// Update the position, rotation and scale of the representation
		let rep = this._representation, p = this.position, r = this.rotation;
		if (p.nodeUpdated)
			rep.position.set(p.x.value, p.y.value, p.z.value);
		if (r.nodeUpdated)
			rep.rotation.set(r.x.value, r.y.value, r.z.value);

		// Call the base class function
		super.update(deltaTime, forced);


		// Show a message on console
		console.log("Updated Entity: " + this.nodeName);

	}
}





/** Defines a Complex data type. */
       class Complex extends Node {


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new instance of the Type class.
	 * @param types The types of the Node.
	 * @param defaultValue The default value of the Type.
	 * @param name The name of the Node.
	 * @param parent The parent Node.
	 * @param data The initialization data. */
	constructor(types, name, parent, data) {

		// Call the parent class constructor
		super([...types, "complex"], name, parent, data);

		// Create the events
		this._onModified = new Event("modified", this);

		// Deserialize the initialization data
		if (data)
			this.deserialize(data);
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

	/** An event triggered if the value is modified. */
	get onModified() { return this._onModified; }

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
		let childCount = this.nodeChildren.length;
		for (childIndex = 0; childIndex < childCount; childIndex++)
			this._components[childIndex].value =
				((values.length > childIndex) ? values[childIndex] : undefined);
	}

	toString() { return JSON.stringify(this.toArray()); }
}





/** Defines a three-dimensional vector. */
       class Vector extends Complex {


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new instance of the Vector3 class.
	 * @param name The name of the Node.
	 * @param parent The parent Node.
	 * @param data The initialization data. */
	constructor(name, parent, data) {

		// Call the parent class constructor
		super(["vector"], name, parent, data);

		// Create the children nodes
		this._x = new Distance("x", this);
		this._y = new Distance("y", this);
		this._z = new Distance("z", this);

		// Define the components of the Complex type
		this._components = [this._x, this._y, this._z];

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

	/** Obtains the string representation of the Vector.
	 * @returns The string representation of the Vector. */
	toString() { return this._components.join(", "); }
}





/** Defines a numeric Measure Node. */
       class Measure extends Number {


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new instance of the Type class.
	 * @param types The types of the Measure.
	 * @param defaultValue The default value of the Type.
	 * @param name The name of the Node.
	 * @param parent The parent Node.
	 * @param data The initialization data.
	 * @param unitNames The initialization data.
	 * @param unitFactors The initialization data. */
	constructor(types, name, parent, data, units) {

		// Call the parent class constructor
		super(name, parent, data);
		super.nodeTypes.push(...types);

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
	set unitIndex(u) {
		this._unitIndex = u;
		this._onModified.trigger(this);
	}


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


/** Defines a Measurement Unit. */
       class MeasurementUnit {


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new instance of the MeasurementUnit class.
	 * @param id The id of the Measurement Unit.
	 * @param abbrevs The abbreviations of the Measurement Unit.
	 * @param factor The relative conversion factor of the Measurement Unit.
	 * @param default The default value of the Measurement Unit.
	 * @param min The minimum possible value of the Measurement Unit.
	 * @param max The maximum possible value of the Measurement Unit. */
	constructor(id, abbrevs, factor = 1, defaultValue, min, max) {
		this._id = id;
		this._abbrevs = abbrevs;
		this._factor = factor;
		this._default = defaultValue;
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
	get default() { return this._default; }

	/** The minimum possible value of the Measurement Unit. */
	get min() { return this._min; }

	/** The maximum possible value of the Measurement Unit. */
	get max() { return this._max; }
}





/** Defines a length measurement. */
       class Distance extends Measure {

	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new instance of the Length class.
	 * @param name The name of the Node.
	 * @param parent The parent Node.
	 * @param data The initialization data. */
	constructor(name, parent, data) {

		// Call the parent class constructor
		super(["length"], name, parent, data, DistanceUnits);

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
       class Euler extends Complex {


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new instance of the Euler class.
	 * @param name The name of the Node.
	 * @param parent The parent Node.
	 * @param data The initialization data. */
	constructor(name, parent, data) {

		// Call the parent constructor
		super(["euler"], name, parent, data);

		// Create the children nodes
		this._x = new Angle("x", this, 0);
		this._y = new Angle("y", this, 0);
		this._z = new Angle("z", this, 0);
		this._order = new String("order", this, "XYZ");

		// Define the components of the Complex type
		this._components = [this._x, this._y, this._z];

		// Deserialize the initialization data
		if (data)
			this.deserialize(data);
	}

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
       class Angle extends Measure {

	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new instance of the Angle class.
	 * @param name The name of the Node.
	 * @param parent The parent Node.
	 * @param data The initialization data. */
	constructor(name, parent, data) {

		// Call the parent class constructor
		super(["angle"], name, parent, data, AngleUnits);

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





/** Defines a User Interaction Space. */
       class Space extends Node {


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new View instance.
	 * @param name The name of the View.
	 * @param parent The parent Node of the View.
	 * @param data The initialization data. */
	constructor(name, parent, data) {

		// Call the parent class constructor
		super(["space"], name, parent, data);

		// Create the entity for the space
		this._entity = new SpaceEntity(name, this);

		// Deserialize the initialization data
		if (data)
			this.deserialize(data);
	}


	// ------------------------------------------------------- PUBLIC ACCESSORS

	/** The main entity of the Space. */
	get entity() { return this._entity; }

	/** Deserializes the Presence instance.
	 * @param data The data to deserialize.
	 * @param mode The deserialization mode. */
	deserialize(data, mode) {

		this.entity.deserialize(data);
	}
}






/** Defines an entity associated to an interaction Space. */
       class SpaceEntity extends Entity {


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new Space instance.
	 * @param name The name of the space.
	 * @param parent The parent node of the space.
	 * @param data The initialization data. */
	constructor(name, parent, data) {

		// Call the parent class constructor
		super(["space"], name, parent, data);

		// Create the child nodes
		this._spaces = new NodeSet("spaces", this, SpaceEntity);

		// Deserialize the initialization data
		if (data)
			this.deserialize(data);

		// Create the representation of the space
		this._representation = new THREE.Scene();

		// TEMPORAL: Create a grid to represent the space
		let grid = new THREE.GridHelper(10, 20);
		this._representation.add(grid);
	}


	// ------------------------------------------------------- PUBLIC ACCESSORS

	/** The subspaces of the space. */
	get spaces() { return this._spaces; }
}







/** Defines a user. */
       class User extends Node {


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new User instance.
	 * @param name The name of the user.
	 * @param parent The parent Node of the user.
	 * @param data The initialization data. */
	constructor(name, parent, data) {

		// Call the parent class constructor
		super(["user"], name, parent, data);

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
       class Presence extends Node {


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new Presence instance.
	 * @param name The name of the presence.
	 * @param parent The parent Node of the presence.
	 * @param data The initialization data. */
	constructor(name, parent, data) {

		// Call the parent class constructor
		super(["presence"], name, parent, data);

		// Create the child nodes
		this._entity = new PresenceEntity(name + "Entity", this);
		// The space node is not initialized here because it is actually a link

		// Deserialize the initialization data
		if (data)
			this.deserialize(data);
	}


	// ------------------------------------------------------- PUBLIC ACCESSORS

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
}






/** Defines a user Presence entity. */
       class PresenceEntity extends Entity {


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new CameraEntity instance.
	 * @param name The name of the entity.
	 * @param name The parent of the entity.
	 * @param data The initialization data. */
	constructor(name, parent = null, data = {}) {

		// Call the base class constructor
		super(["camera"], name, parent),

			// Create the 
			this._fieldOfView = new Number("fov", this, { defaultValue: 45 });
		this._aspectRatio = new Number("aspect", this, { defaultValue: 1 });
		this._nearPlane = new Number("near", this, { defaultValue: 0.001 });
		this._farPlane = new Number("far", this, { defaultValue: 1000 });

		// Deserialize the initialization data
		if (data)
			this.deserialize(data);

		// 
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
		if (this.nodeUpdated && !forced)
			return;

		// Use a typed variable
		let camera = this._representation;

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
			camera.far = this._farPlane.value;
			camera.updateProjectionMatrix();
		}

		// Call the base class function
		super.update(deltaTime, forced);
	}
}









/** Defines a User Interaction View. */
       class View extends Node {


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new View instance.
	 * @param name The name of the View.
	 * @param parent The parent Node of the View.
	 * @param data The initialization data. */
	constructor(name, parent, data) {

		// Call the parent class constructor
		super(["view"], name, parent, data);

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
		this._width = new Number("width", this, { default: 100, min: 0 });
		this._height = new Number("height", this, { default: 100, min: 0 });
		this._state = new String("state", this, { default: "Normal",
			validValues: "Normal, Maximized, FullScreen, VR, AR" });
		this._layers = new NodeSet("layers", this, Layer);

		// Deserialize the initialization data
		if (data)
			this.deserialize(data);

		// Create the viewport WebGL renderer
		this._element = View.createDomElement("div", this.nodeName + "View", null, 'CoEditAR-View');
		this._canvas = View.createDomElement("canvas", this.nodeName + "Canvas", this._element, 'CoEditAR-Canvas', 'width:100%; height:100%;');
		this._viewport = new ViewPort(this._canvas, this.update.bind(this));


		// If there is no layer, create a default ones
		if (this._layers.count == 0) {
			let presences = this.nodeParent.presences;
			for (let presence of presences) {
				new Layer("Layer", this._layers, presence);
			}
		}


		// Set a connection to the resize event
		window.onresize = (e) => { this.resize(); };
		this._state.onModified.listen(() => { this.resize(); });

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
			layer.presence.update(this._deltaTime);
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
       class Layer extends Node {


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new Layer instance.
	 * @param name The name of the layer.
	 * @param parent The parent Node of the layer.
	 * @param data The initialization data. */
	constructor(name, parent, data) {

		// Call the parent class constructor
		super(["layer"], name, parent, data);

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
		if (data.nodeTypes.includes("presence"))
			this._presence = data;
	}
}




/** Defines a Viewport. */
       class ViewPort {

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
       class Resource extends Node {


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new Resource instance.
	 * @param type The type of resource.
	 * @param name The name of resource.
	 * @param parent The parent Node.
	 * @param data The initialization data. */
	constructor(type, name, parent, data) {

		// Call the parent class constructor
		super([type, "resource"], name, parent);

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
       class AudioResource extends Resource {


	// ------------------------------------------------------- PUBLIC ACCESSORS

	/** The representation of the Font. */
	get representation() { return this._representation; }
}




/** Defines a Model Resource. */
       class ModelResource extends Resource {
}








/** Provides a way to group resources. */
       class ResourceGroup extends Node {


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new ResourceManager instance.
	 * @param name The name of the interaction space. */
	constructor(name) {

		// Call the parent class constructor
		super(["resourceGroup"], name);

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
}





/** Defines a RGB Color. */
       class Color extends Complex {


	// ------------------------------------------------------------ CONSTRUCTOR

	/** Initializes a new instance of the Color class.
	 * @param name The name of the Node.
	 * @param parent The parent Node.
	 * @param data The initialization data. */
	constructor(name, parent, data) {

		// Call the base class constructor
		super(["color"], name, parent, data);

		// --------------------------------------------------------- PRIVATE FIELDS

		/** The red component of the Color. */
		this._r = new Number("r", this);

		// Initialize the child nodes
		this._r = new Number("r", this, { min: 0, max: 1 });
		this._g = new Number("g", this, { min: 0, max: 1 });
		this._b = new Number("b", this, { min: 0, max: 1 });
		this._a = new Number("a", this, { min: 0, max: 1, defaultValue: 1 });

		// Define the components of the Complex type
		this._components = [this._r, this._g, this._b, this._a];

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
       class Quaternion extends Complex {


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new instance of the Quaternion class.
	 * @param name The name of the Node.
	 * @param parent The parent Node.
	 * @param data The initialization data. */
	constructor(name, parent, data) {

		// Call the parent constructor
		super(["quaternion"], name, parent, data);

		// Create the children nodes
		this._x = new Number("x", this, 0);
		this._y = new Number("y", this, 0);
		this._z = new Number("z", this, 0);
		this._w = new Number("w", this, 1);

		// Define the components of the Complex type
		this._components = [this._x, this._y, this._z, this._w];

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
       class Time extends Measure {

	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new instance of the Time class.
	 * @param name The name of the Node.
	 * @param parent The parent Node.
	 * @param data The initialization data. */
	constructor(name, parent, data) {

		// Call the parent class constructor
		super(["time"], name, parent, data, TimeMeasurementUnits);

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




/** Defines a Boolean Node. */
       class Boolean extends Simple {

	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new instance of the Boolean class.
	 * @param name The name of the Node.
	 * @param parent The parent Node.
	 * @param data The initialization data. */
	constructor(name, parent, data) {

		// Call the parent class constructor
		super(["boolean"], name, parent, data);

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






/** Defines an entity associated to an object. */
       class ObjectEntity extends Entity {


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new Space instance.
	 * @param name The name of the space.
	 * @param parent The parent node of the space.
	 * @param data The initialization data. */
	constructor(name, parent, data) {

		// Call the parent class constructor
		super(["object"], name, parent, data);

		// Create the child nodes
		this._assembly = new Assembly("assembly", this);

		// Deserialize the initialization data
		if (data)
			this.deserialize(data);

		//TEMPORAL
		let sphere = new THREE.Mesh(new THREE.SphereGeometry(), new THREE.MeshPhongMaterial({ color: 0x0000ff }));
		// sphere.position.set(0,0,-4);
		this._representation.add(sphere);
	}


	// ------------------------------------------------------- PUBLIC ACCESSORS

	/** The assembly of the object. */
	get assembly() { return this._assembly; }
}
