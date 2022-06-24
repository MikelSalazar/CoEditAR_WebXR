import { Measure, MeasurementUnit } from "../Measure.js";

/** Defines a length measurement. */
export class Distance extends Measure {

	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new instance of the Length class.
	 * @param name The name of the data type.
	 * @param relation The data relation.
	 * @param data The initialization data. */
	constructor(name, relation, data) {

		// Call the parent class constructor
<<<<<<< HEAD
		super(name, relation, data, DistanceUnits);
=======
		super(name, parent, data, ["length"], DistanceUnits);
>>>>>>> a1bb1438a29eadf7da80cdc810cdac2dbd2d398a

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
