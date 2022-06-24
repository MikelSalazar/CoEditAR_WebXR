import { Complex } from "../Complex.js";
import { Number } from "../simple/Number.js";

/** Defines a four-dimensional complex number to describe rotations. */
export class Quaternion extends Complex {


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new instance of the Quaternion class.
	 * @param name The name of the data type.
	 * @param relation The data relation.
	 * @param data The initialization data. */
	constructor(name, relation, data) {

<<<<<<< HEAD
		// Call the parent class constructor
		super(name, relation, data);
=======
		// Call the parent constructor
		super(name, parent, data, ["quaternion"]);
>>>>>>> a1bb1438a29eadf7da80cdc810cdac2dbd2d398a

		// Create the children nodes
		this._x = new Number("x", this._components, 0);
		this._y = new Number("y", this._components, 0);
		this._z = new Number("z", this._components, 0);
		this._w = new Number("w", this._components, 1);

		// Deserialize the initialization data
		if (data)
			this.deserialize(data);
	}


	// ------------------------------------------------------- PUBLIC ACCESSORS

	/** The value of the quaternion vector in the X(i) axis. */
	get x() { return this._x; }

	/** The value of the quaternion vector in the Y(j) axis. */
	get y() { return this._y; }

	/** The value of the quaternion vector in the Z(k) axis. */
	get z() { return this._z; }

	/** The rotation half-angle around the quaternion vector. */
	get w() { return this._w; }


	// --------------------------------------------------------- PUBLIC METHODS

	/** Gets the values of the Quaternion.
	 * @returns An object with the values of the Quaternion. */
	getValues() {
		return { x: this._x.value, y: this._y.value, z: this._z.value,
			w: this._w.value };
	}


	/** Sets the values of the Quaternion.
	 * @param x The value of the quaternion vector in the X(i) axis.
	 * @param y The value of the quaternion vector in the Y(j) axis.
	 * @param z The value of the quaternion vector in the Z(k) axis.
	 * @param w The rotation half-angle around the quaternion vector. */
	setValues(x = 0, y = 0, z = 0, w = 1) {
		this._x.value = x;
		this._y.value = y;
		this._y.value = z;
		this._w.value = w;
	}
}
