import { Node } from '../../../Node'
import { Measure } from "../Measure";

/** Defines a length measurement. */
export class Distance extends Measure {

	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new instance of the Length class.
	 * @param name The name of the Node.
	 * @param parent The parent Node.
	 * @param data The initialization data. */
	 constructor(name?: string, parent?: Node, data?: any) {

		// Call the parent class constructor
		super(["length"], ["meters"], name, parent, data);

		// Deserialize the initialization data
		if (data) this.deserialize(data);

	}
}