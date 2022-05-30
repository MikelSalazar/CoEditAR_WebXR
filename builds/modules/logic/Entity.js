import * as THREE from "../../externals/three.module.js";
import { Node } from "../data/Node.js";
import { Vector } from "../data/types/complex/Vector.js";
import { Euler } from "../data/types/complex/Euler.js";
import { NodeSet } from "../data/NodeSet.js";
import { Behavior } from "./Behavior.js";

/** Defines a logic Entity. */
export class Entity extends Node {


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new Entity instance.
	 * @param name The name of the Entity.
	 * @param parent The parent Node of the Entity.
	 * @param data The initialization data. */
	constructor(types, name, parent, data) {

		// Call the parent class constructor
		super([...types, "entity"], name, parent, data);

		// Create the child nodes
		this._position = new Vector("position", this);
		this._rotation = new Euler("rotation", this);
		this._behaviors = new NodeSet("behaviors", this, Behavior);

		// TODO
		this._representation = new THREE.Mesh(new THREE.SphereGeometry(0.1, 64, 64), new THREE.MeshLambertMaterial({ color: 0x00ff00 }));

		this._representation.name = this.nodeName;


		// Deserialize the initialization data
		if (data)
			this.deserialize(data);
	}


	// ------------------------------------------------------- PUBLIC ACCESSORS

	/** The representation of the Entity. */
	get representation() { return this._representation; }

	/** The position of the Entity. */
	get position() { return this._position; }

	/** The rotation of the Entity. */
	get rotation() { return this._rotation; }

	/** The behaviors of the Entity. */
	get behaviors() { return this._behaviors; }


	// --------------------------------------------------------- PUBLIC METHODS

	/** Updates the Entity.
	 * @param deltaTime The update time.
	 * @param forced Indicates whether the update is forced or not. */
	update(deltaTime = 0, forced = false) {

		// If the update is not forced, skip it when the node is already updated
		if (this.nodeUpdated && !forced)
			return;

		// Update the position, rotation and scale of the representation
		let rep = this._representation, p = this.position, r = this.rotation;
		if (p.nodeUpdated)
			rep.position.set(p.x.value, p.y.value, p.z.value);
		if (r.nodeUpdated)
			rep.rotation.set(r.x.value, r.y.value, r.z.value);

		// Call the base class function
		super.update(deltaTime, forced);

	}
}
