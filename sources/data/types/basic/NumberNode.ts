import { Node, Link } from "../../../CoEditAR";


/** Defines a node that contains a numeric data type. */
export class NumberNode extends Node {

	// --------------------------------------------------------- PRIVATE FIELDS

	/** The value of the Number. */
	private _value: number | undefined;

	/** The default value of the Number. */
	private _defaultValue: number;

	/** The minimum possible value of the Number. */
	private _min: number = undefined;

	/** The maximum possible value of the Number. */
	private _max: number = undefined;


	// ------------------------------------------------------- PUBLIC ACCESSORS

	/** The current value of the Number data type.*/
	get value(): number {
		if (this._value == undefined) return this._defaultValue;
		return this._value;
	}
	set value(newValue: number) {
		if (this._value == newValue) return;
		if (!this.checkValue(newValue)) throw Error('Invalid value "'
			+ newValue + '" for: ' + this.name);
		this._value = newValue; this.updated = false;
	}


	/** The default value of the Number data type. */
	get defaultValue(): number { return this._defaultValue; }
	set defaultValue(newDefaultValue: number) {
		if (this._defaultValue == newDefaultValue) return;
		if (!this.checkValue(newDefaultValue))
			throw Error('Invalid default value "' + newDefaultValue +
				'" for: ' + this.name);
		this._defaultValue = newDefaultValue; this.updated = false;
	}


	/** The minimum possible value of the Number. */
	get min(): number { return this._min; }
	set min(newMin: number) {
		if (this._max != undefined && newMin > this._max) this._max = newMin;
		if (this._value!=undefined && this._value < newMin) this.value = newMin;
		this.updated = false; this._min = newMin; 
	}


	/** The maximum possible value of the Number. */
	get max(): number { return this._max; }
	set max(newMax: number) {
		if (this._min != undefined && newMax < this._min) this._min = newMax;
		if (this._value!=undefined && this._value > newMax) this.value = newMax;
		this.updated = false; this._max = newMax;
	}


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new instance of the Number class.
	 * @param name The name of the node.
	 * @param link The parent node link.
	 * @param data The initialization data. */
	constructor(name?: string, link?: Link<Node>, data?: any) {

		// Call the base class constructor
		super("number", name, link, data);
	}

	// --------------------------------------------------------- PUBLIC METHODS

	/** Deserializes the number.
	 * @param data The data to deserialize. */
	deserialize(data: any) {
		if (data == undefined) return;
		if (typeof data == "object") {
			this.min = data.min; this.max = data.max;
			this.defaultValue = data.defaultValue; this.value = data.value;
		}
		else if (typeof data !== "number") this.value = parseFloat(data);
		else this.value = data;
	}


	/** Serializes the number.
	* @param data Additional data to include in the serialized object.
	* @return The serialized data. */
	serialize(data: any = {}) {

		// Return the serialized data
		return this.value;
	}



	/** Checks if a value is valid for this Number node.
	 * @param value The value to check.
	 * @returns A boolean value indicating whether the value is valid or not. */
	checkValue(value:number): boolean {

		// Check the range 
		if (this._min != undefined && value < this._min) return false;
		if (this._max != undefined && value > this._max) return false;

		return true;
	}
}
