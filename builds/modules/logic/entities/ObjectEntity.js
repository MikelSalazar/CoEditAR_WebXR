import * as THREE from "../../../externals/three.module.js";
import { Entity } from "../Entity.js";
<<<<<<< HEAD

=======
import { Assembly } from "../../data/model/Assembly.js";
>>>>>>> a1bb1438a29eadf7da80cdc810cdac2dbd2d398a

/** Defines an entity associated to an object. */
export class ObjectEntity extends Entity {

<<<<<<< HEAD
	// --------------------------------------------------------- PRIVATE FIELDS

	/** The assembly of the object. */
	// private _assembly: Assembly;


	// ------------------------------------------------------- PUBLIC ACCESSORS

	/** The assembly of the object. */
	// get assembly(): Assembly { return this._assembly; }

=======
>>>>>>> a1bb1438a29eadf7da80cdc810cdac2dbd2d398a

	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new Space instance.
<<<<<<< HEAD
	 * @param name The name of the data type.
	 * @param relation The data relation.
	 * @param data The initialization data. */
	constructor(name, relation, data) {

		// Call the parent class constructor
		super(name, relation);

		// Create the child nodes
		// this._assembly = new Assembly("assembly", this);
=======
	 * @param name The name of the space.
	 * @param parent The parent node of the space.
	 * @param data The initialization data. */
	constructor(name, parent, data) {

		// Call the parent class constructor
		super(name, parent, data, ["object"]);

		// Create the child nodes
		this._assembly = new Assembly("assembly", this);
>>>>>>> a1bb1438a29eadf7da80cdc810cdac2dbd2d398a

		// Deserialize the initialization data
		if (data)
			this.deserialize(data);

		//TEMPORAL
		let sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5), new THREE.MeshPhongMaterial({ color: 0x0000ff }));
		this._representation.add(sphere);

	}


<<<<<<< HEAD
=======
	// ------------------------------------------------------- PUBLIC ACCESSORS

	/** The assembly of the object. */
	get assembly() { return this._assembly; }


>>>>>>> a1bb1438a29eadf7da80cdc810cdac2dbd2d398a
	/** Updates the Entity.
	 * @param deltaTime The update time.
	 * @param forced Indicates whether the update is forced or not. */
	update(deltaTime = 0, forced = false) {

		// TODO Change shape of object here
		// Call the base class function
		super.update(deltaTime, forced);

	}
}
