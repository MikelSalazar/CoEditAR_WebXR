import { Node, LocalizedString } from "../../../CoEditAR.js";


/** Defines a node that contains a textual data type. */
export class StringNode extends Node {





	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new instance of the String class.
	 * @param name The name of the node.
	 * @param link The parent node link.
	 * @param data The initialization data. */
	constructor(name, link, data) {

		// Call the base class constructor
		super("string", name, link);

		this._value = new LocalizedString("value");
		this._defaultValue = new LocalizedString("default");
	}


	// ------------------------------------------------------- PUBLIC ACCESSORS

	/** The current value of the Number data type.*/
	get value() {
		if (this._value == undefined)
			return this._defaultValue.value;
		return this._value.value;
	}
	set value(newValue) {
		if (this._value.value == newValue)
			return;
		if (!this.checkValue(newValue))
			throw Error('Invalid value "'
				+ newValue + '" for: ' + this.name);
		this._value.setValue(newValue);
		this.updated = false;
	}


	/** The default value of the Number data type. */
	get defaultValue() { return this._defaultValue.value; }
	set defaultValue(newDefaultValue) {
		if (this._defaultValue.value == newDefaultValue)
			return;
		if (!this.checkValue(newDefaultValue))
			throw Error('Invalid default value "' + newDefaultValue +
				'" for: ' + this.name);
		this._defaultValue.setValue(newDefaultValue);
		this.updated = false;
	}

	// --------------------------------------------------------- PUBLIC METHODS

	/** Deserializes the string.
	 * @param data The data to deserialize. */
	deserialize(data) {
		if (data == undefined)
			return;
		if (typeof data == "object") {
			this._defaultValue.deserialize(data.defaultValue);
			this._value.deserialize(data.value);
		}
		this._value.deserialize(data);
	}


	/** Serializes the string.
	* @param data Additional data to include in the serialized object.
	* @return The serialized data. */
	serialize(data = {}) {

		// Return the serialized data
		return this._value.serialize();
	}



	/** Checks if a value is valid for this String node.
	 * @param value The value to check.
	 * @returns A boolean value indicating whether the value is valid or not. */
	checkValue(value) {

		return true;
	}
}

