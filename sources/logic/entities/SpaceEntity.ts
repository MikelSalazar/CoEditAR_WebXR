import * as THREE from "three";
import { Entity } from "../Entity";
import { Item } from "../../data/Item";
import { Relation } from "../../data/Relation";
import { ObjectEntity } from "./ObjectEntity";

/** Defines an entity associated to an interaction Space. */
export class SpaceEntity extends Entity {

	// --------------------------------------------------------- PRIVATE FIELDS

	/** The subspaces of the space. */
	private _spaces: Relation<SpaceEntity>;

	/** The objects of the space. */
	private _objects: Relation<ObjectEntity>;

	
	// ------------------------------------------------------- PUBLIC ACCESSORS

	/** The subspaces of the space. */
	get spaces(): Relation<SpaceEntity> { return this._spaces; }


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR
	
	/** Initializes a new Space instance.
	 * @param name The name of the data type.
	 * @param relation The data relation.
	 * @param data The initialization data. */
	 constructor(name?: string, relation?: Relation<Item>, data?: any) {

		// Call the parent class constructor
		super(name, relation);

		// Create the child nodes
		this._spaces = new Relation<SpaceEntity>("spaces", [SpaceEntity.type],
			this, this.children);
		this._objects = new Relation<ObjectEntity>("objects", 
			[ObjectEntity.type], this, this.children);

		// Deserialize the initialization data
		if (data) this.deserialize(data);

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
}