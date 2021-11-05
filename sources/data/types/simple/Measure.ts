import { Node } from "../../Node";
import { Simple } from "../Simple";

// ----------------------------------------------------------------- UNIT CLASS

/** Defines a measurement Unit. */
export class Unit {

	// --------------------------------------------------------- PRIVATE FIELDS

	/** The minimum possible value of Measure. */
	private _min: number = Number.NEGATIVE_INFINITY;

}


/** Defines a numeric Measure Node. */
export class Measure extends Simple {

	// --------------------------------------------------------- PRIVATE FIELDS

	/** The minimum possible value of Measure. */
	private _min: number = Number.NEGATIVE_INFINITY;

	/** The maximum possible value of the Measure. */
	private _max: number = Number.POSITIVE_INFINITY;

	/** The measurement unit of the Measure. */
	private _unit: string | undefined = undefined;

	/** The different types of units for the Measure. */
	private _unitTypes: string [];


	// ------------------------------------------------------- PUBLIC ACCESSORS

	/** The current value of the Measure.*/
	get value(): number { 
		if (this._value == undefined) return this._default;
		return this._value;
	}
	set value(newValue: number) {
		if (this._value == newValue) return;
		if (newValue != undefined) {
			if (newValue < this._min) newValue = this._min;
			else if (newValue > this._max) newValue = this._max;
		}
		this._value = newValue; this.nodeUpdated = false;
	}

	/** The default value of the Measure. */
	get default(): number { return this._default; }
	set default (newDefault: number) {
		if (this.default == newDefault || newDefault == undefined) return;
		this._default = newDefault; this.nodeUpdated = false;
	}

	/** The minimum possible value of Measure. */
	get min(): number { return this._min; }
	set min(newMin: number) {
		if (newMin > this._max) this._max = newMin;
		if (this._value && newMin > this._value) this.value = newMin;
		this._min = newMin; this.nodeUpdated = false;
	}


	/** The maximum possible value of the Measure. */
	get max(): number { return this._max; }
	set max(newMax: number) {
		if (newMax < this._min) this._min = newMax;
		if (this._value && this._value) this.value = newMax;
		this._max = newMax; this.nodeUpdated = false;
	}


	/** The measurement unit of the Measure. */
	get unit(): string | undefined { return this._unit; }
	set unit(newUnit: string | undefined) {
		if (newUnit == undefined) this.unit = this._unitTypes [0];
		else if (!this._unitTypes.includes(newUnit))
			throw Error("Invalid Unit type: '" + newUnit + 
			"' valid options are: " + JSON.stringify(this._unitTypes));
		this._unit = newUnit; this.nodeUpdated = false;
		// TODO apply transforms between units
	}

	/** The different types of units for the Measure. */
	get unitTypes(): string [] { return this._unitTypes; }


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new instance of the Measure class.
	 * @param type The type of the Node.
	 * @param type The different types of units.
	 * @param name The name of the Node.
	 * @param parent The parent Node.
	 * @param data The initialization data. */
	 constructor(type: string[], unitTypes: string[], name?: string, parent?: Node, data?: any) {

		// Call the parent class constructor
		super([...type, "measure"], name, parent, data);

		// Set the values of the properties
		this._value = undefined; this._default = 0; 
		this._unitTypes = unitTypes; this._unit = unitTypes[0];
	}


	// --------------------------------------------------------- PUBLIC METHODS

	/** Serializes the Number instance.
	 * @return The serialized data. */
	serialize(): any { return this._value; }

	/** Deserializes the Number instance.
	 * @param data The data to deserialize.
	 * @param mode The deserialization mode. */
	 deserialize(data: any, mode?: string) {
		if (typeof data == "object") {
			this.value = data.value; this.default = data.default;
			this.min = data.min; this.max = data.max; this.unit = data.unit;
		}
		else if (typeof data !== "number") this.value = parseFloat(data);
		else this.value = data;
	}

		/** Obtains the calculated value. 
	 * @returns The calculated value; */
	valueOf(): number { return this.value; }
}


