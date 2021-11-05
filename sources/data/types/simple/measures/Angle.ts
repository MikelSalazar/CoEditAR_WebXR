import { Node } from '../../../Node'
import { Measure } from "../Measure";

/** Defines a angular measurement. */
export class Angle extends Measure {

	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new instance of the Angle class.
	 * @param name The name of the Node.
	 * @param parent The parent Node.
	 * @param data The initialization data. */
	 constructor(name?: string, parent?: Node, data?: any) {

		// Call the parent class constructor
		super(["angle"], ["degrees", "radians"], name, parent, data);

		// Deserialize the initialization data
		if (data) this.deserialize(data);
	}
}