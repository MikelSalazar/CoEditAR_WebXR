import { Item } from "../../Item";
import { Relation } from "../../Relation";
import { Simple } from "../Simple";

/** Defines a Boolean data type. */
export class Boolean extends Simple<boolean> {

	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new instance of the Boolean class.
	 * @param name The name of the data type.
	 * @param relation The data relation.
	 * @param data The initialization data. */
	 constructor(name?: string, relation?: Relation<Item>, data?: any) {

		// Call the parent class constructor
<<<<<<< HEAD
		super(name, relation, data);
=======
		super(name, parent, data, ["boolean"]);
>>>>>>> a1bb1438a29eadf7da80cdc810cdac2dbd2d398a

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