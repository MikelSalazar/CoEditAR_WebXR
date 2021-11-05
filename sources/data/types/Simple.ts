import { Node } from "../Node";

/** Defines a simple data Type. */
export class Simple extends Node {

	// ------------------------------------------------------- PROTECTED FIELDS

	/** The value of the Type. */
	protected _value: any | undefined;

	/** The default value of the Type. .*/
	protected _default: any;

	// ------------------------------------------------------- PUBLIC ACCESSORS

	/** The value of the Type. */
	get value(): any { return (this.isUndefined)? this._value: this._default; }
	set value(v: any) { this._value = v; this.nodeUpdated = false; }
	
	/** The default value of the Measure. */
	get default(): any { return this._default; }
	set default(d : any) { this._default = d; this.nodeUpdated = false; }

	/** Indicates whether the value is the default or not. */
	get isDefault(): boolean { return (this._value == this._default); }

	/** Indicates whether the value is undefined or not. */
	get isUndefined(): boolean { return (this._value == undefined); }
	get isDefined(): boolean { return (this._value != undefined); }


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new instance of the Type class.
	 * @param types The types of the Node.
	 * @param defaultValue The default value of the Type.
	 * @param name The name of the Node.
	 * @param parent The parent Node.
	 * @param data The initialization data. */
	constructor(types: string[], name?: string, parent?: Node, data?: any) {

		// Call the parent class constructor
		super([...types, "simple"], name, parent, data);

	}


	// --------------------------------------------------------- PUBLIC METHODS

	/** Serializes the String instance.
	 * @return The serialized data. */
	serialize(): any { return this._value; }


	/** Deserializes the String instance.
	 * @param data The value to deserialize.
	 * @param mode The deserialization mode. */
	deserialize(data: any, mode?: string) { 
		this._value = data;
	}

	
	/** Obtains the value of the data type.
	 * @return The value of the Type. */
	valueOf(): any { return this.value; }
}