import { Type } from "../Type.js";
import { Number } from "./simple/Number.js";


/** Defines a numeric Measure Node. */
export class Measure extends Number {


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new instance of the Type class.
	 * @param name The name of the data type.
	 * @param relation The data relation.
	 * @param data The initialization data.
	 * @param units The measurement units of the Node. */
	constructor(name, relation, data, units) {

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

