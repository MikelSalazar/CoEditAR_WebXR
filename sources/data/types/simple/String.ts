import { Node } from "../../Node";
import { Simple } from "../Simple";

/** Defines a String Node. */
export class String extends Simple {

	// ------------------------------------------------------- PROTECTED FIELDS

	/** The valid values of the String. */
	protected _validValues: string[] | undefined;

	// ------------------------------------------------------- PUBLIC ACCESSORS

	/** The current value of the String.*/
	get value(): string {
		if (this._value == undefined) return this._default;
		return this._value;
	}
	set value(newValue: string) {
		if (this._value == newValue) return;
		if (this._validValues && !this._validValues.includes(newValue))
			throw Error('Invalid value "' + newValue + '" for node: ' +
				this._nodeName);
		this._value = newValue; this.nodeUpdated = false;
	}

	/** The default value of the String. */
	get default(): string { return this._default; }
	set default(newDefault: string) {
		if (this.default == newDefault || newDefault == undefined) return;
		this._default = newDefault; this.nodeUpdated = false;
	}



	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new instance of the String class.
	 * @param name The name of the Node.
	 * @param parent The parent Node.
	 * @param data The initialization data. */
	constructor(name?: string, parent?: Node, data?: any) {

		// Call the parent class constructor
		super(["string"], name, parent, data);

		// Set the values of the properties
		this._value = undefined; this._default = "";
		this._validValues = undefined;

		// Deserialize the initialization data
		if (data) this.deserialize(data);
	}


	// --------------------------------------------------------- PUBLIC METHODS

	/** Deserializes the String instance.
	 * @param data The data to deserialize.
	 * @param mode The deserialization mode. */
	deserialize(data: any, mode?: string) {
		if (typeof data == "object") {
			this._validValues = data.validValues; this.default = data.default;
			data = this.value = data.value;
		}
		if (typeof data !== "string") data = JSON.stringify(data);
		this.value = data;
	}

}