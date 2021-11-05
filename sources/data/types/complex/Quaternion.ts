import { Node } from "../../Node";
import { Complex } from "../Complex";
import { Number } from "../simple/Number";

/** Defines a four-dimensional complex number to describe rotations. */
export class Quaternion extends Complex {

	// --------------------------------------------------------- PRIVATE FIELDS

	/** The value of the quaternion vector in the X(i) axis. */
	private _x: Number;

	/** The value of the quaternion vector in the Y(j) axis. */
	private _y: Number;

	/** The value of the quaternion vector in the Z(k) axis. */
	private _z: Number;

	/** The rotation half-angle around the quaternion vector. */
	private _w: Number;


	// ------------------------------------------------------- PUBLIC ACCESSORS

	/** The value of the quaternion vector in the X(i) axis. */
	get x() { return this._x; }

	/** The value of the quaternion vector in the Y(j) axis. */
	get y() { return this._y; }

	/** The value of the quaternion vector in the Z(k) axis. */
	get z() { return this._z; }

	/** The rotation half-angle around the quaternion vector. */
	get w() { return this._w; }


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new instance of the Quaternion class.
	 * @param name The name of the Node.
	 * @param parent The parent Node.
	 * @param data The initialization data. */
	 constructor(name?: string, parent?: Node, data?: any) {

		// Call the parent constructor
		super(["quaternion"], name, parent, data);

		// Create the children nodes
		this._x = new Number("x", this, 0);
		this._y = new Number("y", this, 0);
		this._z = new Number("z", this, 0);
		this._w = new Number("w", this, 1);

		// Deserialize the initialization data
		if (data) this.deserialize(data);
	}
}