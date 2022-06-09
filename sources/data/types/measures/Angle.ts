import { Node } from '../../Node'
import { Measure, MeasurementUnit } from "../Measure";

/** Defines a angular measurement. */
export class Angle extends Measure {

	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new instance of the Angle class.
	 * @param name The name of the Node.
	 * @param parent The parent Node.
	 * @param data The initialization data. */
	constructor(name?: string, parent?: Node, data?: any) {

		// Call the parent class constructor
		super(name, parent, data, ["angle"], AngleUnits);

		// Deserialize the initialization data
		if (data) this.deserialize(data);
	}
}


// Define the angular measurement units
let AngleUnits: MeasurementUnit[] = [
	new MeasurementUnit("degrees",["deg", "d", "º"], 1),
	new MeasurementUnit("radians",["rad", "RAD"], Math.PI/180)
];