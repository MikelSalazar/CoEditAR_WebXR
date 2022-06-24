import * as THREE from "../../../externals/three.module.js";
import { Entity } from "../Entity.js";
import { Relation } from "../../data/Relation.js";
import { ObjectEntity } from "./ObjectEntity.js";

/** Defines an entity associated to an interaction Space. */
export class SpaceEntity extends Entity {


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new Space instance.
	 * @param name The name of the data type.
	 * @param relation The data relation.
	 * @param data The initialization data. */
	constructor(name, relation, data) {

		// Call the parent class constructor
		super(name, relation);

		// Create the child nodes
		this._spaces = new Relation("spaces", [SpaceEntity.type], this, this.children);
		this._objects = new Relation("objects", [ObjectEntity.type], this, this.children);

		// Deserialize the initialization data
		if (data)
			this.deserialize(data);

		// Create the representation of the space
		this._representation = new THREE.Scene();

		// TEMPORAL: Create a grid to represent the space
		let grid = new THREE.GridHelper(10, 20);
		this._representation.add(grid);

		// TEMPORAL: Create lights to illuminate the space
		let ambientLight = new THREE.AmbientLight(0x444444);
		this._representation.add(ambientLight);
		let directionalLight = new THREE.DirectionalLight(0xffffff);
		this._representation.add(directionalLight);

	}


	// ------------------------------------------------------- PUBLIC ACCESSORS

	/** The subspaces of the space. */
	get spaces() { return this._spaces; }
}
