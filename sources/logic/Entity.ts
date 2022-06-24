import * as THREE from "three";
import { Item } from "../data/Item";
import { Type } from "../data/Type";
import { Relation } from "../data/Relation";
import { Vector } from "../data/types/complex/Vector";
import { Euler } from "../data/types/complex/Euler";
import { Behavior } from "./Behavior";

/** Defines a logic Entity. */
export class Entity extends Item {

	/** The metadata of the data type. */
	static type: Type = new Type(Entity, Item.type);

	// ------------------------------------------------------- PROTECTED FIELDS

	/** The representation of the Entity. */
	protected _representation: THREE.Object3D;
	
	/** The position of the Entity. */
	protected _position: Vector;

	/** The rotation of the Entity. */
	protected _rotation: Euler;

	/** The behaviors of the Entity. */
	protected _behaviors: Relation<Behavior>;

	/** The children entities of the Entity. */
	protected _entities: Relation<Entity>;

	/** The children entities of the Entity. */
	protected _entities: NodeSet<Entity>;


	// ------------------------------------------------------- PUBLIC ACCESSORS

	/** The representation of the Entity. */
	get representation(): THREE.Object3D { return this._representation; }
	
	/** The position of the Entity. */
	get position(): Vector { return this._position; }
	
	/** The rotation of the Entity. */
	get rotation(): Euler { return this._rotation; }

	/** The behaviors of the Entity. */
	get behaviors(): Relation<Behavior> { return this._behaviors; }

	/** The children entities of the Entity. */
	get entities(): Relation<Entity> { return this._entities; }

	/** The children entities of the Entity. */
	get entities(): NodeSet<Entity> { return this._entities; }

	
	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new Entity instance.
<<<<<<< HEAD
	 * @param name The name of the data type.
	 * @param relation The data relation.
	 * @param data The initialization data. */
	 constructor(name?: string, relation?: Relation<Item>, data?: any) {

		// Call the parent class constructor
		super(name, relation);

		// Create the child nodes
		this._position = new Vector("position", this.children);
		this._rotation = new Euler("rotation", this.children);
		this._behaviors = new Relation<Behavior>("behaviors", [Behavior.type],
			 this, this.children);
		this._entities = new Relation<Entity>("entities", [Entity.type],
			this, this.children);
=======
	 * @param name The name of the node.
	 * @param parent The parent node.
	 * @param data The initialization data.
	 * @param types The metadata of the node. */
	constructor(name?: string, parent?: Node, data?: any, types: string[]=[]) {
	 
		// Call the parent class constructor
		super(name, parent, data, [...types, "entity"]);

		// Create the child nodes
		this._position = new Vector("position", this);
		this._rotation = new Euler("rotation", this);
		this._behaviors = new NodeSet<Behavior>("behaviors", this, Behavior);
		this._entities = new NodeSet<Entity>("entities", this, Entity);
>>>>>>> a1bb1438a29eadf7da80cdc810cdac2dbd2d398a

		// Deserialize the initialization data
		if (data) this.deserialize(data);

		// Create the basic representation
		this._representation = new THREE.Object3D();
<<<<<<< HEAD
		this._representation.name = this.name;
		if(this.parent && this.parent.type.is("Entity"))
			(this.parent as Entity)._representation.add(this._representation);
=======
		this._representation.name = this.nodeName;
		if(this.nodeParent && this.nodeParent.nodeTypes.includes("entity"))
			(this.nodeParent as Entity)._representation.add(this._representation);
>>>>>>> a1bb1438a29eadf7da80cdc810cdac2dbd2d398a

		// Call the start functions in the behaviors
		for (let behavior of this.behaviors) {
			let startFunction = behavior.startFunction.value;
			if (startFunction) startFunction(this);
		}
	}


	// --------------------------------------------------------- PUBLIC METHODS

	/** Updates the Entity.
	 * @param deltaTime The update time. 
 	 * @param forced Indicates whether the update is forced or not. */
	update(deltaTime:number = 0, forced:boolean = false) {

		// If the update is not forced, skip it when the node is already updated
		if (this.updated && !forced) return;

		// Update the position, rotation and scale of the representation
		let rep = this._representation, p = this.position, r = this.rotation;
<<<<<<< HEAD
		if (!p.updated) rep.position.set(p.x.value, p.y.value, p.z.value);
		if (!r.updated) rep.rotation.set(r.x.value, r.y.value, r.z.value);
=======
		if (!p.nodeUpdated) rep.position.set(p.x.value, p.y.value, p.z.value);
		if (!r.nodeUpdated) rep.rotation.set(r.x.value, r.y.value, r.z.value);
>>>>>>> a1bb1438a29eadf7da80cdc810cdac2dbd2d398a
		
		// Call the update functions in the behaviors
		for (let behavior of this.behaviors) {
			let updateFunction = behavior.updateFunction.value;
			if (updateFunction) updateFunction(this);
		}

		// Call the base class function
		super.update(deltaTime, forced);

		// Show a message on console
		// console.log("Updated Entity: " + this.nodeName);
	}
}