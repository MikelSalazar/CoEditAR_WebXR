import { Node } from "../Node";
import { Event } from "../../logic/Event";

/** Defines a function handler data Type. */
export class Function extends Node {

	// ------------------------------------------------------- PROTECTED FIELDS

	/** The value of the Simple data type. */
	protected _value: CallableFunction | undefined;

	/** An event triggered if the value is modified. */
	protected _onModified: Event;

	// ------------------------------------------------------ PUBLIC PROPERTIES

	/** The current value of the Simple data type.*/
	get value(): CallableFunction {
		return this._value;
	}
	set value(newValue: CallableFunction) {
		if (this._value == newValue) return;
		this._value = newValue; this.nodeUpdated = false;
		this._onModified.trigger(this, newValue);
	}


	/** Indicates whether the value is undefined or not. */
	get isUndefined(): boolean { return (this._value == undefined); }

	/** An event triggered if the value is modified. */
	get onModified(): Event { return this._onModified; }


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new instance of the Simple class.
	 * @param name The name of the node.
	 * @param parent The parent node.
	 * @param data The initialization data.
	 * @param types The metadata of the node. */
	constructor(name?: string, parent?: Node, data?: any, types: string[] = []) {

		// Call the parent class constructor
		super(name, parent, data, [...types, "simple"]);

		// Create the events
		this._onModified = new Event("modified", this);

		// Deserialize the initialization data
		if (data) this.deserialize(data);
	}


	// --------------------------------------------------------- PUBLIC METHODS

	/** Serializes the String instance.
	 * @return The serialized data. */
	serialize(): any { return this._value; }


	/** Deserializes the Simple data type.
	 * @param data The value to deserialize.
	 * @param mode The deserialization mode. */
	deserialize(data: any, mode?: string) {
		this._value = data;
	}


	/** Obtains the value of the Simple data type
	 * @return The value of the Type. */
	valueOf(): any { return this.value; }
}