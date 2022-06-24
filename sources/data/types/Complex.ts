import { Item } from "../Item";
import { Type } from "../Type";
import { Relation } from "../Relation";
import { Number } from "./simple/Number";


/** Defines a Complex data type. */
export class Complex extends Item {

	/** The metadata of the data type. */
	static type: Type = new Type(Complex, Item.type);

	// ------------------------------------------------------- PROTECTED FIELDS

	/** The list of values of the Measure (one for each unit). */
	protected _components: Relation<Number>;


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


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new instance of the complex class.
	 * @param name The name of the data type.
	 * @param relation The data relation.
	 * @param data The initialization data. */
	 constructor(name?: string, relation?: Relation<Item>, data?: any) {

		// Call the parent class constructor
		super(name, relation);

		this._components = new Relation<Number>("component", [Number.type], 
			this, this.children);
		
		// // Deserialize the initialization data
		// if (data) this.deserialize(data);
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
		let childIndex = 0; let childCount = this.children.count;
		for (childIndex = 0; childIndex < childCount; childIndex++)
			this._components.getByIndex(childIndex).value = 
				((values.length > childIndex) ? values[childIndex] : undefined);
	}

	toString() { return JSON.stringify(this.toArray()); }

}