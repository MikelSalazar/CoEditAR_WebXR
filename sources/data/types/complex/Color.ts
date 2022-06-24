import { Item } from "../../Item";
import { Relation } from "../../Relation";
import { Complex } from "../Complex";
import { Number } from "../simple/Number";

/** Defines a RGB Color. */
export class Color extends Complex {

	// --------------------------------------------------------- PRIVATE FIELDS

	/** The red component of the Color. */
	private _r: Number;

	/** The green component of the Color. */
	private _g: Number;

	/** The blue component of the Color. */
	private _b: Number;

	/** The alpha component of the Color. */
	private _a: Number;

	// ------------------------------------------------------ PUBLIC PROPERTIES

	/** The red component of the Color. */
	get r(): Number { return this._r; }

	/** The green component of the Color. */
	get g(): Number { return this._g; }

	/** The blue component of the Color. */
	get b(): Number { return this._b; }

	/** The alpha component of the Color. */
	get a(): Number { return this._a; }


	// ------------------------------------------------------------ CONSTRUCTOR

	/** Initializes a new instance of the Color class.
	 * @param name The name of the data type.
	 * @param relation The data relation.
	 * @param data The initialization data. */
	 constructor(name?: string, relation?: Relation<Item>, data?: any) {
				
<<<<<<< HEAD
		// Call the parent class constructor
		super(name, relation, data);
=======
		// Call the base class constructor
		super(name, parent, data, ["color"]);
>>>>>>> a1bb1438a29eadf7da80cdc810cdac2dbd2d398a

		// Initialize the child nodes
		this._r = new Number("r", this._components, {min: 0, max: 1});
		this._g = new Number("g", this._components, {min: 0, max: 1});
		this._b = new Number("b", this._components, {min: 0, max: 1});
		this._a = new Number("a", this._components, {min: 0, max: 1, defaultValue: 1});

		// Deserialize the initialization data
		if (data != undefined) this.deserialize(data);
	}


	// --------------------------------------------------------- PUBLIC METHODS

	/** Gets the values of the Color.
 	* @returns An object with the values of the Color. */
	getValues() { 
		return { r: this._r.value, g: this._g.value, b: this._b.value, 
			a: this._a.value }; 
	}

	/** Sets the values of the Color.
	 * @param r The value of the Red component Color
	 * @param g The value of the Green component Color.
	 * @param b The value of the Blue component Color.
	 * @param a The value of the Alpha component Color. */
	set(r: number = 0, g: number = 0, b: number = 0, a: number = 1) {
		this._r.value = r; this._g.value = g; this._b.value = b; 
		this._a.value = a;
	}

	/** Obtains the string representation of the Color. 
	 * @returns The string representation of the Color. */
	toString(): string {
		return "rgb(" + this._r + ", " + this._g + ", " + this._b + ")";
	}
}
