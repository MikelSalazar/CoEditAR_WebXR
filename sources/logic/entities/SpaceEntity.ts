import * as THREE from "three";
<<<<<<< HEAD
import { Entity } from "../Entity";
import { Item } from "../../data/Item";
import { Relation } from "../../data/Relation";
=======
import { Node } from "../../data/Node";
import { NodeSet } from "../../data/NodeSet";
import { Entity } from "../Entity";
>>>>>>> a1bb1438a29eadf7da80cdc810cdac2dbd2d398a
import { ObjectEntity } from "./ObjectEntity";

/** Defines an entity associated to an interaction Space. */
export class SpaceEntity extends Entity {

	// --------------------------------------------------------- PRIVATE FIELDS

	/** The subspaces of the space. */
<<<<<<< HEAD
	private _spaces: Relation<SpaceEntity>;

	/** The objects of the space. */
	private _objects: Relation<ObjectEntity>;

=======
	private _spaces: NodeSet<SpaceEntity>;

	/** The objects of the space. */
	private _objects: NodeSet<ObjectEntity>;
>>>>>>> a1bb1438a29eadf7da80cdc810cdac2dbd2d398a
	
	// ------------------------------------------------------- PUBLIC ACCESSORS

	/** The subspaces of the space. */
<<<<<<< HEAD
	get spaces(): Relation<SpaceEntity> { return this._spaces; }
=======
	get spaces(): NodeSet<SpaceEntity> { return this._spaces; }
>>>>>>> a1bb1438a29eadf7da80cdc810cdac2dbd2d398a


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR
	
	/** Initializes a new Space instance.
<<<<<<< HEAD
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
=======
	 * @param name The name of the space.
	 * @param parent The parent node of the space.
	 * @param data The initialization data. */
	constructor(name: string, parent: Node, data?: any) {
	 
		// Call the parent class constructor
		super(name, parent, data, ["space"]);

		// Create the child nodes
		this._spaces = new NodeSet<SpaceEntity>("spaces", this, SpaceEntity);
		this._objects = new NodeSet<ObjectEntity>("objects", this, ObjectEntity);
>>>>>>> a1bb1438a29eadf7da80cdc810cdac2dbd2d398a

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