import { Item } from "../../Item";
import { Relation } from "../../Relation";
import { Complex } from "../Complex";
import { Angle } from "../measures/Angle";
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
	 * @param name The name of the data type.
	 * @param relation The data relation.
	 * @param data The initialization data. */
	 constructor(name?: string, relation?: Relation<Item>, data?: any) {

		// Call the parent class constructor
		super(name, relation, data);

		// Create the children nodes
		this._x = new Angle("x", this._components, 0);
		this._y = new Angle("y", this._components, 0);
		this._z = new Angle("z", this._components, 0);
		this._order = new String("order", this.children, "XYZ");


		// Deserialize the initialization data
		if (data) this.deserialize(data);
	}


	// --------------------------------------------------------- PUBLIC METHODS

	/** Gets the values of the Euler Node.
 	* @returns An object with the values of the Euler Node. */
	getValues() { return { x: this._x.value, y: this._y.value, z: this._z.value }; }

	/** Sets the values of the Euler Node.
	 * @param x The value in the X axis.
	 * @param y The value in the Y axis.
	 * @param z The value in the Z axis. */
	setValues(x?: number, y?: number, z?: number) {
		this._x.value = x; this._y.value = y; this._z.value = z;
	}

}
