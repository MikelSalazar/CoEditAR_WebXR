import { Node } from "../../Node";
import { Complex } from "../Complex";
import { Distance } from "../simple/measures/Distance";

/** Defines a three-dimensional vector. */
export class Vector extends Complex {

	// --------------------------------------------------------- PRIVATE FIELDS

	/** The value in the X axis. */
	private _x: Distance;

	/** The value in the Y axis. */
	private _y: Distance;

	/** The value in the Z axis. */
	private _z: Distance;


	// ------------------------------------------------------- PUBLIC ACCESSORS

	/** The value in the X axis. */
	get x() { return this._x; }

	/** The value in the Y axis. */
	get y() { return this._y; }

	/** The value in the Z axis. */
	get z() { return this._z; }


	/** Indicates whether the value is the default or not. */
	get isDefault(): boolean {
		return (this._x.isDefault && this._y.isDefault && this._z.isDefault);
	}

	/** Indicates whether the value is undefined or not. */
	get isUndefined(): boolean {
		return (this._x.isUndefined &&
			this._y.isUndefined && this._z.isUndefined);
	}

	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new instance of the Vector3 class.
	 * @param name The name of the Node.
	 * @param parent The parent Node.
	 * @param data The initialization data. */
	constructor(name?: string, parent?: Node, data?: any) {

		// Call the parent class constructor
		super(["vector"], name, parent, data);

		// Create the children nodes
		this._x = new Distance("x", this);
		this._y = new Distance("y", this);
		this._z = new Distance("z", this);

		// Deserialize the initialization data
		if (data) this.deserialize(data);
	}


	// --------------------------------------------------------- PUBLIC METHODS

	/** Converts the Vector node into an array representation. */
	toArray(): number[] { 
		return [this._x.value, this._y.value, this._z.value];
	}
	


	/** Sets the values of the Vector node from an array.
	* @param values An array with the numerical values. */
	fromArray(values: number[]) {
		this._x.value = ((values.length > 0) ? values[0] : 0);
		this._y.value = ((values.length > 1) ? values[1] : 0);
		this._z.value = ((values.length > 2) ? values[2] : 0);
	}


	/** Sets the values of the Vector.
	 * @param x The value in the X axis.
	 * @param y The value in the Y axis.
	 * @param z The value in the Z axis. */
	set(x?: number, y?: number, z?: number) {
		if (x) this._x.value = x; else this._x.value = this._x.default;
		if (y) this._y.value = y; else this._y.value = this._y.default;
		if (z) this._z.value = z; else this._z.value = this._z.default;
	}

	toString() { return JSON.stringify(this.toArray()); }
}