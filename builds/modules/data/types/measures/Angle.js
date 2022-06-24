import { Measure, MeasurementUnit } from "../Measure.js";

/** Defines a angular measurement. */
export class Angle extends Measure {

	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new instance of the Angle class.
	 * @param name The name of the data type.
	 * @param relation The data relation.
	 * @param data The initialization data. */
	constructor(name, relation, data) {

		// Call the parent class constructor
<<<<<<< HEAD
		super(name, relation, data, AngleUnits);
=======
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
