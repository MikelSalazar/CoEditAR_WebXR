import { Node } from "../../../CoEditAR.js";


/** Defines a node that contains a boolean data type. */
export class BooleanNode extends Node {


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new instance of the BooleanNode class.
	 * @param name The name of the node.
	 * @param link The parent node link.
	 * @param data The initialization data. */
	constructor(name, link, data) {

		// Call the base class constructor
		super("boolean", name, link, data);
	}



	// ------------------------------------------------------- PUBLIC ACCESSORS

	/** The current value of the BooleanNode.*/
	get value() {
		if (this._value == undefined)
			return this._defaultValue;
		return this._value;
	}
	set value(newValue) {
		if (this._value == newValue)
			return;
		this._value = (newValue == true);
		this.updated = false;
	}


	/** The default value of the BooleanNode. */
	get defaultValue() { return this._defaultValue; }
	set defaultValue(newDefaultValue) {
		if (this._defaultValue == newDefaultValue)
			return;
		this._defaultValue = newDefaultValue;
		this.updated = false;
	}

	// --------------------------------------------------------- PUBLIC METHODS

	/** Deserializes the node.
	 * @param data The data to deserialize. */
	deserialize(data) {
		if (data == undefined)
			return;
		if (typeof data == "object") {
			this.defaultValue = data.defaultValue;
			this.value = data.value;
		}
		else if (typeof data !== "boolean")
			this.value = (data == true);
		else
			this.value = data;
	}


	/** Serializes the node.
	* @param data Additional data to include in the serialized object.
	* @return The serialized data. */
	serialize(data = {}) {

		// Return the serialized data
		return this.value;
	}
}

