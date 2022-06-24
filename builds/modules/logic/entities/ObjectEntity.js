import * as THREE from "../../../externals/three.module.js";
import { Entity } from "../Entity.js";


/** Defines an entity associated to an object. */
export class ObjectEntity extends Entity {

	// --------------------------------------------------------- PRIVATE FIELDS

	/** The assembly of the object. */
	// private _assembly: Assembly;


	// ------------------------------------------------------- PUBLIC ACCESSORS

	/** The assembly of the object. */
	// get assembly(): Assembly { return this._assembly; }


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new Space instance.
	 * @param name The name of the data type.
	 * @param relation The data relation.
	 * @param data The initialization data. */
	constructor(name, relation, data) {

		// Call the parent class constructor
		super(name, relation);

		// Create the child nodes
		// this._assembly = new Assembly("assembly", this);

		// Deserialize the initialization data
		if (data)
			this.deserialize(data);

		//TEMPORAL
		let sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5), new THREE.MeshPhongMaterial({ color: 0x0000ff }));
		this._representation.add(sphere);

	}


	/** Updates the Entity.
	 * @param deltaTime The update time.
	 * @param forced Indicates whether the update is forced or not. */
	update(deltaTime = 0, forced = false) {

		// TODO Change shape of object here
		// Call the base class function
		super.update(deltaTime, forced);

	}
}
