import { Node } from "../Node";
import { Number } from "./simple/Number";
import { Event } from "../../logic/Event";

/** Defines a Complex data type. */
export class Complex extends Node {

	// ------------------------------------------------------- PROTECTED FIELDS

	/** The list of values of the Measure (one for each unit). */
	protected _components: Number[];

	/** An event triggered if the value is modified. */
	protected _onModified: Event;


	// ------------------------------------------------------- PUBLIC ACCESSORS

	/** Indicates whether the value is the default or not. */
	get isDefault(): boolean {
		for(let component of this._components) 
			if (!component.isDefault) return false;
		return true;
	}

	/** Indicates whether the value is undefined or not. */
	get isUndefined(): boolean {
		for(let component of this._components) 
			if (!component.isUndefined) return false;
		return true;
	}

	/** An event triggered if the value is modified. */
	get onModified(): Event { return this._onModified; }


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new instance of the Type class.
	 * @param types The types of the Node.
	 * @param defaultValue The default value of the Type.
	 * @param name The name of the Node.
	 * @param parent The parent Node.
	 * @param data The initialization data. */
	constructor(types: string[], name?: string, parent?: Node, data?: any) {

		// Call the parent class constructor
		super([...types, "complex"], name, parent, data);
		
		// Create the events
		this._onModified = new Event("modified", this);

		// Deserialize the initialization data
		if (data) this.deserialize(data);
	}
	
	// --------------------------------------------------------- PUBLIC METHODS

	/** Converts the Vector node into an array representation. */
	toArray(): number[] { 
		let values = [];
		for (let component of this._components) values.push(component.value);
		return values;
	}
	
	/** Sets the values of the Vector node from an array.
	* @param values An array with the numerical values. */
	fromArray(values: number[]) {
		let childIndex = 0; let childCount = this.nodeChildren.length;
		for (childIndex = 0; childIndex < childCount; childIndex++)
			this._components[childIndex].value = 
				((values.length > childIndex) ? values[childIndex] : undefined);
	}

	toString() { return JSON.stringify(this.toArray()); }

}