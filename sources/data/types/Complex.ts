import { Node } from "../Node";

/** Defines a Complex data type. */
export class Complex extends Node {

	// ------------------------------------------------------- PUBLIC ACCESSORS

	/** Indicates whether the value is the default or not. */
	get isDefault(): boolean {

		
		return true;
	}

	/** Indicates whether the value is undefined or not. */
	get isUndefined(): boolean {
		return true;
	}



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
	}

}