import * as THREE from "three";
import { Node } from "../../data/Node";
import { NodeSet } from "../../data/NodeSet";
import { Entity } from "../Entity";

/** Defines an entity associated to an interaction Space. */
export class SpaceEntity extends Entity {

	// --------------------------------------------------------- PRIVATE FIELDS

	/** The subspaces of the space. */
	private _spaces: NodeSet<SpaceEntity>;

	
	// ------------------------------------------------------- PUBLIC ACCESSORS

	/** The subspaces of the space. */
	get spaces(): NodeSet<SpaceEntity> { return this._spaces; }


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR
	
	/** Initializes a new Space instance.
	 * @param name The name of the space.
	 * @param parent The parent node of the space.
	 * @param data The initialization data. */
	constructor(name: string, parent: Node, data?: any) {
	 
		// Call the parent class constructor
		super(["space"], name, parent, data);

		// Create the child nodes
		this._spaces = new NodeSet<SpaceEntity>("spaces", this, SpaceEntity);

		// Deserialize the initialization data
		if (data) this.deserialize(data);

		// Create the representation of the space
		this._representation = new THREE.Scene();

		// TEMPORAL: Create a grid to represent the space
		let grid = new THREE.GridHelper(10, 20);
		this._representation.add(grid);
	}
}