import * as THREE from "../../../externals/three.module.js";
import { Entity } from "../Entity.js";
import { Assembly } from "../../data/model/Assembly.js";

/** Defines an entity associated to an object. */
export class ObjectEntity extends Entity {


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new Space instance.
	 * @param name The name of the space.
	 * @param parent The parent node of the space.
	 * @param data The initialization data. */
	constructor(name, parent, data) {

		// Call the parent class constructor
		super(["object"], name, parent, data);

		// Create the child nodes
		this._assembly = new Assembly("assembly", this);

		// Deserialize the initialization data
		if (data)
			this.deserialize(data);

		//TEMPORAL
		let sphere = new THREE.Mesh(new THREE.SphereGeometry(), new THREE.MeshPhongMaterial({ color: 0x0000ff }));
		// sphere.position.set(0,0,-4);
		this._representation.add(sphere);
	}


	// ------------------------------------------------------- PUBLIC ACCESSORS

	/** The assembly of the object. */
	get assembly() { return this._assembly; }
}
