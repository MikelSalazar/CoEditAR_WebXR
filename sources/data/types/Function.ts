import { Item } from "../Item";
import { Relation } from "../Relation";

/** Defines a function handler data Type. */
export class Function extends Item {

	// ------------------------------------------------------- PROTECTED FIELDS

	/** The value of the Simple data type. */
	protected _value: CallableFunction | undefined;

	/** An event triggered if the value is modified. */
	protected _onModified: Event;

	// ------------------------------------------------------ PUBLIC PROPERTIES

	/** The current value of the Simple data type.*/
	get value(): CallableFunction { return this._value; }
	set value(newValue: CallableFunction) {
		if (this._value == newValue) return;
		this._value = newValue; this.updated = false;
	}


	/** Indicates whether the value is undefined or not. */
	get isUndefined(): boolean { return (this._value == undefined); }

	/** An event triggered if the value is modified. */
	get onModified(): Event { return this._onModified; }


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new instance of the Simple class.
	 * @param name The name of the data type.
	 * @param relation The data relation.
	 * @param data The initialization data. */
	 constructor(name?: string, relation?: Relation<Item>, data?: any) {

		// Call the parent class constructor
		super(name, relation);

		// Deserialize the initialization data
		if (data) this.deserialize(data);
	}


	// --------------------------------------------------------- PUBLIC METHODS

	/** Serializes the Function instance.
	 * @return The serialized data. */
	serialize(): any { return this._value; }

	/** Deserializes the Function data type.
	 * @param data The value to deserialize.
	 * @param mode The deserialization mode. */
	deserialize(data: any, mode?: string) {	this._value = data; }

	/** Obtains the value of the Function data type
	 * @return The value of the Function. */
	valueOf(): any { return this.value; }
}