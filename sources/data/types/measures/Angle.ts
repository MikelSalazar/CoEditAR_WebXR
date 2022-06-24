import { Item } from "../../Item";
import { Relation } from "../../Relation";
import { Measure, MeasurementUnit } from "../Measure";

/** Defines a angular measurement. */
export class Angle extends Measure {

	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new instance of the Angle class.
	 * @param name The name of the data type.
	 * @param relation The data relation.
	 * @param data The initialization data. */
	 constructor(name?: string, relation?: Relation<Item>, data?: any) {

		// Call the parent class constructor
		super(name, relation, data, AngleUnits);

		// Deserialize the initialization data
		if (data) this.deserialize(data);
	}
}


// Define the angular measurement units
let AngleUnits: MeasurementUnit[] = [
	new MeasurementUnit("degrees",["deg", "d", "º"], 1),
	new MeasurementUnit("radians",["rad", "RAD"], Math.PI/180)
];