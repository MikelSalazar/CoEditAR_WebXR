import { Node } from "../../Node";
import { Simple } from "../Simple";

/** Defines a Boolean Node. */
export class Boolean extends Simple {
	
	// ------------------------------------------------------- PUBLIC ACCESSORS

	/** The current value of the Boolean.*/
	get value(): boolean { 
		if (this._value == undefined) return this._default;
		return this._value;
	}
	set value(newValue: boolean) {
		if (this._value == newValue) return;
		this._value = newValue; this.nodeUpdated = false;
	}

	/** The default value of the Boolean. */
	get default(): boolean { return this._default; }
	set default (newDefault: boolean) {
		if (this.default == newDefault || newDefault == undefined) return;
		this._default = newDefault; this.nodeUpdated = false;
	}
	
	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new instance of the Boolean class.
	 * @param name The name of the Node.
	 * @param parent The parent Node.
	 * @param data The initialization data. */
	constructor(name?: string, parent?: Node, data?: any) {

		// Call the parent class constructor
		super(["number"], name, parent, data);

		// Set the values of the properties
		this._value = undefined; this._default = false; 

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
			this.value = data.value; this.default = data.default;
		}
		else if (typeof data !== "boolean") 
			this.value = (data == "false" || data == 0)? false: true;
		else this.value = data;
	}

}