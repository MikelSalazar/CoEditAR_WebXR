import { Item } from "../Item.js";
import { Type } from "../Type.js";

/** Defines a simple data type. */
export class Simple extends Item {


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new instance of the Simple class.
<<<<<<< HEAD
	 * @param name The name of the data type.
	 * @param relation The data relation.
	 * @param data The initialization data. */
	constructor(name, relation, data) {

		// Call the parent class constructor
		super(name, relation);
=======
	 * @param name The name of the node.
	 * @param parent The parent node.
	 * @param data The initialization data.
	 * @param types The metadata of the node. */
	constructor(name, parent, data, types = []) {

		// Call the parent class constructor
		super(name, parent, data, [...types, "simple"]);
>>>>>>> a1bb1438a29eadf7da80cdc810cdac2dbd2d398a

		/** The valid values of the simple data type. */
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

/** The metadata of the data type. */
Simple.type = new Type(Simple, Item.type);

