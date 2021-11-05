import { Node } from "../../Node";
import { Complex } from "../Complex";
import { Angle } from "../simple/measures/Angle";
import { String } from "../simple/String";

/** Defines the Euler Orientation. 
 * @see https://en.wikipedia.org/wiki/Euler_angles */
export class Euler extends Complex {

	// --------------------------------------------------------- PRIVATE FIELDS

	/** The Angle in the X axis. */
	private _x: Angle;

	/** The Angle in the Y axis. */
	private _y: Angle;

	/** The Angle in the Z axis. */
	private _z: Angle;

	/** The order of application of axis rotation. */
	private _order: String;

	// ------------------------------------------------------- PUBLIC ACCESSORS

	/** The Angle in the X axis. */
	get x(): Angle { return this._x; }

	/** The Angle in the Y axis. */
	get y(): Angle { return this._y; }

	/** The Angle in the Z axis. */
	get z(): Angle { return this._z; }

	/** The order of application of axis rotation. */
	get order(): String { return this._order; }


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new instance of the Euler class.
	 * @param name The name of the Node.
	 * @param parent The parent Node.
	 * @param data The initialization data. */
	constructor(name?: string, parent?: Node, data?: any) {

		// Call the parent constructor
		super(["euler"], name, parent, data);

		// Create the children nodes
		this._x = new Angle("x", this, 0);
		this._y = new Angle("y", this, 0);
		this._z = new Angle("z", this, 0);
		this._order = new String("order", this, "XYZ");

		// Deserialize the initialization data
		if (data) this.deserialize(data);
	}


	// --------------------------------------------------------- PUBLIC METHODS

	/** Converts the Euler node into an array representation. */
	toArray(): number[] { 
		return [this._x.value, this._y.value, this._z.value];
	}


	/** Sets the values of the Euler node from an array.
	* @param values An array with the numerical values. */
	fromArray(values: number[]) {
		this._x.value = ((values.length > 0) ? values[0] : 0);
		this._y.value = ((values.length > 1) ? values[1] : 0);
		this._z.value = ((values.length > 2) ? values[2] : 0);
	}


	/** Sets the values of the Euler node.
	 * @param x The value in the X axis.
	 * @param y The value in the Y axis.
	 * @param z The value in the Z axis. */
	set(x?: number, y?: number, z?: number) {
		if (x) this._x.value = x; else this._x.value = this._x.default;
		if (y) this._y.value = y; else this._y.value = this._y.default;
		if (z) this._z.value = z; else this._z.value = this._z.default;
	}
}
