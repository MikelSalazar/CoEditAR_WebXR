import { Measure, MeasurementUnit } from "../Measure.js";

/** Defines a length measurement. */
export class Distance extends Measure {

	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new instance of the Length class.
	 * @param name The name of the Node.
	 * @param parent The parent Node.
	 * @param data The initialization data. */
	constructor(name, parent, data) {

		// Call the parent class constructor
		super(name, parent, data, ["length"], DistanceUnits);

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
