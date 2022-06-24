import * as THREE from "three";
<<<<<<< HEAD
import { Entity } from "../Entity";
import { Item } from "../../data/Item";
import { Relation } from "../../data/Relation";
import { Number } from "../../data/types/simple/Number";

=======
import { Node } from "../../data/Node";
import { NodeSet } from "../../data/NodeSet";
import { Entity } from "../Entity";
import { Assembly } from "../../data/model/Assembly";
>>>>>>> a1bb1438a29eadf7da80cdc810cdac2dbd2d398a

/** Defines an entity associated to an object. */
export class ObjectEntity extends Entity {

	// --------------------------------------------------------- PRIVATE FIELDS

	/** The assembly of the object. */
<<<<<<< HEAD
	// private _assembly: Assembly;
=======
	private _assembly: Assembly;
>>>>>>> a1bb1438a29eadf7da80cdc810cdac2dbd2d398a

	
	// ------------------------------------------------------- PUBLIC ACCESSORS

	/** The assembly of the object. */
<<<<<<< HEAD
	// get assembly(): Assembly { return this._assembly; }
=======
	get assembly(): Assembly { return this._assembly; }
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
		// this._assembly = new Assembly("assembly", this);
=======
	 * @param name The name of the space.
	 * @param parent The parent node of the space.
	 * @param data The initialization data. */
	constructor(name: string, parent: Node, data?: any) {
	 
		// Call the parent class constructor
		super(name, parent, data, ["object"]);

		// Create the child nodes
		this._assembly = new Assembly("assembly", this);
>>>>>>> a1bb1438a29eadf7da80cdc810cdac2dbd2d398a

		// Deserialize the initialization data
		if (data) this.deserialize(data);

		//TEMPORAL
		let sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5),
			new THREE.MeshPhongMaterial({ color: 0x0000ff}));
		this._representation.add(sphere);

	}


	/** Updates the Entity.
	 * @param deltaTime The update time. 
 	 * @param forced Indicates whether the update is forced or not. */
	 update(deltaTime:number = 0, forced:boolean = false) {

		// TODO Change shape of object here
		// Call the base class function
		super.update(deltaTime, forced);

	}

}