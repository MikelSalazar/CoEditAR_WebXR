import { Item } from "../../Item";
import { Relation } from "../../Relation";
import { Measure, MeasurementUnit } from "../Measure";

/** Defines a time measurement. */
export class Time extends Measure {

	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new instance of the Time class.
	 * @param name The name of the data type.
	 * @param relation The data relation.
	 * @param data The initialization data. */
	 constructor(name?: string, relation?: Relation<Item>, data?: any) {

		// Call the parent class constructor
<<<<<<< HEAD
		super(name, relation, data, TimeMeasurementUnits);
=======
		super(name, parent, data, ["time"], TimeMeasurementUnits);
>>>>>>> a1bb1438a29eadf7da80cdc810cdac2dbd2d398a

		// Deserialize the initialization data
		if (data) this.deserialize(data);
	}
}


// Define the Time Measurement Units
let TimeMeasurementUnits: MeasurementUnit[] = [
	new MeasurementUnit("seconds",["s", "sec"], 1),
	new MeasurementUnit("minutes",["m", "mins"], 1/60),
	new MeasurementUnit("hours",["h"], 1/3600),
	new MeasurementUnit("milliseconds",["ms", "millisecs"], 1000),
];