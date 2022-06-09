import { Node } from "../Node.js";
import { Event } from "../../logic/Event.js";

/** Defines a Complex data type. */
export class Complex extends Node {


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new instance of the complex class.
	 * @param name The name of the node.
	 * @param parent The parent node.
	 * @param data The initialization data.
	 * @param types The metadata of the node.  */
	constructor(name, parent, data, types = []) {

		// Call the parent class constructor
		super(name, parent, data, [...types, "complex"]);

		// Create the events
		this._onModified = new Event("modified", this);

		// Deserialize the initialization data
		if (data)
			this.deserialize(data);
	}


	// ------------------------------------------------------- PUBLIC ACCESSORS

	/** Indicates whether the value is the default or not. */
	get isDefault() {
		for (let component of this._components)
			if (!component.isDefault)
				return false;
		return true;
	}

	/** Indicates whether the value is undefined or not. */
	get isUndefined() {
		for (let component of this._components)
			if (!component.isUndefined)
				return false;
		return true;
	}

	/** An event triggered if the value is modified. */
	get onModified() { return this._onModified; }

	// --------------------------------------------------------- PUBLIC METHODS

	/** Converts the Vector node into an array representation. */
	toArray() {
		let values = [];
		for (let component of this._components)
			values.push(component.value);
		return values;
	}

	/** Sets the values of the Vector node from an array.
	* @param values An array with the numerical values. */
	fromArray(values) {
		let childIndex = 0;
		let childCount = this.nodeChildren.length;
		for (childIndex = 0; childIndex < childCount; childIndex++)
			this._components[childIndex].value =
				((values.length > childIndex) ? values[childIndex] : undefined);
	}

	toString() { return JSON.stringify(this.toArray()); }
}
