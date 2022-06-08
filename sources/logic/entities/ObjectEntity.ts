import * as THREE from "three";
import { Node } from "../../data/Node";
import { NodeSet } from "../../data/NodeSet";
import { Entity } from "../Entity";
import { Assembly } from "../../data/model/Assembly";

/** Defines an entity associated to an object. */
export class ObjectEntity extends Entity {

	// --------------------------------------------------------- PRIVATE FIELDS

	/** The assembly of the object. */
	private _assembly: Assembly;

	
	// ------------------------------------------------------- PUBLIC ACCESSORS

	/** The assembly of the object. */
	get assembly(): Assembly { return this._assembly; }


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR
	
	/** Initializes a new Space instance.
	 * @param name The name of the space.
	 * @param parent The parent node of the space.
	 * @param data The initialization data. */
	constructor(name: string, parent: Node, data?: any) {
	 
		// Call the parent class constructor
		super(["object"], name, parent, data);

		// Create the child nodes
		this._assembly = new Assembly("assembly", this);

		// Deserialize the initialization data
		if (data) this.deserialize(data);

		//TEMPORAL
		let sphere = new THREE.Mesh(new THREE.SphereGeometry(),
			new THREE.MeshPhongMaterial({ color: 0x0000ff}));
		// sphere.position.set(0,0,-4);
		this._representation.add(sphere);
	}
}