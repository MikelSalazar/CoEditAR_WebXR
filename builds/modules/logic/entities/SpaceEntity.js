import * as THREE from "../../../externals/three.module.js";
import { NodeSet } from "../../data/NodeSet.js";
import { Entity } from "../Entity.js";

/** Defines an entity associated to an interaction Space. */
export class SpaceEntity extends Entity {


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new Space instance.
	 * @param name The name of the space.
	 * @param parent The parent node of the space.
	 * @param data The initialization data. */
	constructor(name, parent, data) {

		// Call the parent class constructor
		super(["space"], name, parent, data);

		// Create the child nodes
		this._spaces = new NodeSet("spaces", this, SpaceEntity);

		// Deserialize the initialization data
		if (data)
			this.deserialize(data);

		// Create the representation of the space
		this._representation = new THREE.Scene();

		// TEMPORAL: Create a grid to represent the space
		let grid = new THREE.GridHelper(10, 20);
		this._representation.add(grid);
	}


	// ------------------------------------------------------- PUBLIC ACCESSORS

	/** The subspaces of the space. */
	get spaces() { return this._spaces; }
}
