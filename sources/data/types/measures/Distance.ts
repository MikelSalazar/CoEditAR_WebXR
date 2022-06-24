import { Item } from "../../Item";
import { Relation } from "../../Relation";
import { Measure, MeasurementUnit } from "../Measure";

/** Defines a length measurement. */
export class Distance extends Measure {

	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new instance of the Length class.
	 * @param name The name of the data type.
	 * @param relation The data relation.
	 * @param data The initialization data. */
	 constructor(name?: string, relation?: Relation<Item>, data?: any) {

		// Call the parent class constructor
		super(name, relation, data, DistanceUnits);

		// Deserialize the initialization data
		if (data) this.deserialize(data);

	}
}


// Define the Distance measurement units
let DistanceUnits: MeasurementUnit[] = [
	new MeasurementUnit("meters",["m", "ms"], 1),
	new MeasurementUnit("centimeters",["cm", "cms"], 0.01),
	new MeasurementUnit("millimeters",["mm", "mms"], 0.001),
	new MeasurementUnit("kilometers",["km", "kms"], 1000)
];