import { Node } from "../../Node";
import { Simple } from "../Simple";

/** Defines a Number Node. */
export class Number extends Simple {
	
	// ------------------------------------------------------- PUBLIC ACCESSORS

	/** The current value of the Number.*/
	get value(): number { 
		if (this._value == undefined) return this._default;
		return this._value;
	}
	set value(newValue: number) {
		if (this._value == newValue) return;
		this._value = newValue; this.nodeUpdated = false;
	}

	/** The default value of the Number. */
	get default(): number { return this._default; }
	set default (newDefault: number) {
		if (this.default == newDefault || newDefault == undefined) return;
		this._default = newDefault; this.nodeUpdated = false;
	}
	
	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new instance of the Number class.
	 * @param name The name of the Node.
	 * @param parent The parent Node.
	 * @param data The initialization data. */
	constructor(name?: string, parent?: Node, data?: any) {

		// Call the parent class constructor
		super(["number"], name, parent, data);

		// Set the values of the properties
		this._value = undefined; this._default = 0; 

		// Deserialize the initialization data
		if (data) this.deserialize(data);
	}


	// --------------------------------------------------------- PUBLIC METHODS

	/** Serializes the Number instance.
	 * @return The serialized data. */
	serialize(): any { return this._value; }


	/** Deserializes the Number instance.
	 * @param data The data to deserialize.
	 * @param mode The deserialization mode. */
	deserialize(data: any, mode?: string) {
		if (typeof data == "object") {
			this.value = data.value; this.default = data.default;
		}
		else if (typeof data !== "number") this.value = parseFloat(data);
		else this.value = data;
	}

}