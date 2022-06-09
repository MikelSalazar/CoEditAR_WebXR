import { Simple } from "../Simple.js";

/** Defines a Number Node. */
export class Number extends Simple {


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new instance of the Number class.
	 * @param name The name of the Node.
	 * @param parent The parent Node.
	 * @param data The initialization data. */
	constructor(name, parent, data) {

		// Call the parent class constructor
		super(name, parent, data, ["number"]);

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
