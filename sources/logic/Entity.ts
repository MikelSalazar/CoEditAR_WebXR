import * as THREE from "three";
import { Node } from "../data/Node";
import { Vector } from "../data/types/complex/Vector";
import { Euler } from "../data/types/complex/Euler";
import { NodeSet } from "../data/NodeSet";
import { Behavior } from "./Behavior";

/** Defines a logic Entity. */
export class Entity extends Node {

	// ------------------------------------------------------- PROTECTED FIELDS

	/** The representation of the Entity. */
	protected _representation: THREE.Object3D;
	
	/** The position of the Entity. */
	protected _position: Vector;

	/** The rotation of the Entity. */
	protected _rotation: Euler;

	/** The behaviors of the Entity. */
	protected _behaviors: NodeSet<Behavior>;


	// ------------------------------------------------------- PUBLIC ACCESSORS

	/** The representation of the Entity. */
	get representation(): THREE.Object3D { return this._representation; }
	
	/** The position of the Entity. */
	get position(): Vector { return this._position; }
	
	/** The rotation of the Entity. */
	get rotation(): Euler { return this._rotation; }

	/** The behaviors of the Entity. */
	get behaviors(): NodeSet<Behavior> { return this._behaviors; }

	
	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new Entity instance.
	 * @param name The name of the Entity.
	 * @param parent The parent Node of the Entity.
	 * @param data The initialization data. */
	 constructor(types: string[], name: string, parent: Node, data?: any) {
	 
		// Call the parent class constructor
		super([...types, "entity"], name, parent, data);

		// Create the child nodes
		this._position = new Vector("position", this);
		this._rotation = new Euler("rotation", this);
		this._behaviors = new NodeSet<Behavior>("behaviors", this, Behavior);

		// TODO
		this._representation = new THREE.Mesh(
			new THREE.SphereGeometry(0.1,64,64),
			new THREE.MeshLambertMaterial({color: 0x00ff00}));
		
		this._representation.name = this.nodeName;
		

		// Deserialize the initialization data
		if (data) this.deserialize(data);
	}


	// --------------------------------------------------------- PUBLIC METHODS

	/** Updates the Entity.
	 * @param deltaTime The update time. 
 	 * @param forced Indicates whether the update is forced or not. */
	update(deltaTime: number = 0, forced:boolean = false) {

		// If the update is not forced, skip it when the node is already updated
		if (this.nodeUpdated && !forced) return;

		// Update the position, rotation and scale of the representation
		let rep = this._representation, p = this.position, r = this.rotation;
		if (p.nodeUpdated) rep.position.set(p.x.value, p.y.value, p.z.value);
		if (r.nodeUpdated) rep.rotation.set(r.x.value, r.y.value, r.z.value);
		
		// Call the base class function
		super.update(deltaTime, forced);

	}

}