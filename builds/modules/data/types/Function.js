import { Node } from "../Node.js";
import { Event } from "../../logic/Event.js";

/** Defines a function handler data Type. */
export class Function extends Node {


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new instance of the Simple class.
	 * @param name The name of the node.
	 * @param parent The parent node.
	 * @param data The initialization data.
	 * @param types The metadata of the node. */
	constructor(name, parent, data, types = []) {

		// Call the parent class constructor
		super(name, parent, data, [...types, "simple"]);

		// Create the events
		this._onModified = new Event("modified", this);

		// Deserialize the initialization data
		if (data)
			this.deserialize(data);
	}

	// ------------------------------------------------------ PUBLIC PROPERTIES

	/** The current value of the Simple data type.*/
	get value() {
		return this._value;
	}
	set value(newValue) {
		if (this._value == newValue)
			return;
		this._value = newValue;
		this.nodeUpdated = false;
		this._onModified.trigger(this, newValue);
	}


	/** Indicates whether the value is undefined or not. */
	get isUndefined() { return (this._value == undefined); }

	/** An event triggered if the value is modified. */
	get onModified() { return this._onModified; }


	// --------------------------------------------------------- PUBLIC METHODS

	/** Serializes the String instance.
	 * @return The serialized data. */
	serialize() { return this._value; }


	/** Deserializes the Simple data type.
	 * @param data The value to deserialize.
	 * @param mode The deserialization mode. */
	deserialize(data, mode) {
		this._value = data;
	}


	/** Obtains the value of the Simple data type
	 * @return The value of the Type. */
	valueOf() { return this.value; }
}
