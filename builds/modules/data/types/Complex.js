import { Item } from "../Item.js";
import { Type } from "../Type.js";
import { Relation } from "../Relation.js";
import { Number } from "./simple/Number.js";


/** Defines a Complex data type. */
export class Complex extends Item {


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new instance of the complex class.
<<<<<<< HEAD
	 * @param name The name of the data type.
	 * @param relation The data relation.
	 * @param data The initialization data. */
	constructor(name, relation, data) {

		// Call the parent class constructor
		super(name, relation);
=======
	 * @param name The name of the node.
	 * @param parent The parent node.
	 * @param data The initialization data.
	 * @param types The metadata of the node.  */
	constructor(name, parent, data, types = []) {

		// Call the parent class constructor
		super(name, parent, data, [...types, "complex"]);
>>>>>>> a1bb1438a29eadf7da80cdc810cdac2dbd2d398a

		this._components = new Relation("component", [Number.type], this, this.children);

		// // Deserialize the initialization data
		// if (data) this.deserialize(data);
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
		let childCount = this.children.count;
		for (childIndex = 0; childIndex < childCount; childIndex++)
			this._components.getByIndex(childIndex).value =
				((values.length > childIndex) ? values[childIndex] : undefined);
	}

	toString() { return JSON.stringify(this.toArray()); }
}

/** The metadata of the data type. */
Complex.type = new Type(Complex, Item.type);
