import { Item } from "../Item.js";

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
}
