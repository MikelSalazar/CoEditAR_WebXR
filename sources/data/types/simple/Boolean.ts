import { Node } from "../../Node";
import { Simple } from "../Simple";

/** Defines a Boolean Node. */
export class Boolean extends Simple<boolean> {

	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new instance of the Boolean class.
	 * @param name The name of the Node.
	 * @param parent The parent Node.
	 * @param data The initialization data. */
	constructor(name?: string, parent?: Node, data?: any) {

		// Call the parent class constructor
		super(name, parent, data, ["boolean"]);

		// Set the values of the properties
		this._value = undefined; this._defaultValue = false; 

		// Deserialize the initialization data
		if (data) this.deserialize(data);
	}


	// --------------------------------------------------------- PUBLIC METHODS

	/** Serializes the Boolean instance.
	 * @return The serialized data. */
	serialize(): any { return this._value; }

	/** Deserializes the Boolean instance.
	 * @param data The data to deserialize.
	 * @param mode The deserialization mode. */
	deserialize(data: any, mode?: string) {
		if (typeof data == "object") {
			this.defaultValue = data.default; this.value = data.value; 
		}
		else if (typeof data !== "boolean") 
			this.value = (data == "false" || data == 0)? false: true;
		else this.value = data;
	}

	/** Obtains the string representation of the Boolean.
	 * @returns The string representation of the Number. */
	toString(): string { return this.value? "true" : "false"; }
}