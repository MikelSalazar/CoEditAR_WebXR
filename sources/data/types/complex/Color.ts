import { Node } from "../../Node";
import { Complex } from "../Complex";
import { Number } from "../simple/Number";

/** Defines a RGB Color. */
export class Color extends Complex {

	// --------------------------------------------------------- PRIVATE FIELDS

	/** The red component of the Color. */
	private _r: Number = new Number("r", this);

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
	 * @param name The name of the Node.
	 * @param parent The parent Node.
	 * @param data The initialization data. */
	constructor(name?: string, parent?: Node, data?: any) { 
				
		// Call the base class constructor
		super(["color"], name, parent, data);

		// Initialize the child nodes
		this._r;
		this._g = new Number("g", this);
		this._b = new Number("b", this);
		this._a = new Number("a", this, 1);

		// Define the components of the Complex type
		this._components = [this._r, this._g, this._b, this._a];

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

	/** Gets the string representation of the Color. */
	toString(): string {
		return "rgb(" + this._r + ", " + this._g + ", " + this._b + ")";
	}
}
