<<<<<<< HEAD
import { Item } from "../data/Item";
import { Relation } from "../data/Relation";
import { Presence } from "./interaction/Presence";
import { View } from "./interaction/View";


/** Defines a user. */
export class User extends Item {
=======
import * as THREE from "three";
import { Node } from "../data/Node";
import { NodeSet } from "../data/NodeSet";
import { Vector } from "../data/types/complex/Vector";
import { Euler } from "../data/types/complex/Euler";
import { Presence } from "./interaction/Presence";
import { View } from "./interaction/View";

/** Defines a user. */
export class User extends Node {
>>>>>>> a1bb1438a29eadf7da80cdc810cdac2dbd2d398a

	// ------------------------------------------------------- PROTECTED FIELDS

	/** The presences of the user in the interaction spaces. */
<<<<<<< HEAD
	protected _presences: Relation<Presence>;

	/** The view of the user. */
	protected _views: Relation<View>;
=======
	protected _presences: NodeSet<Presence>;

	/** The view of the user. */
	protected _views: NodeSet<View>;
>>>>>>> a1bb1438a29eadf7da80cdc810cdac2dbd2d398a

	// ------------------------------------------------------- PUBLIC ACCESSORS

	/** The presences of the user in the interaction spaces. */
<<<<<<< HEAD
	get presences(): Relation<Presence> { return this._presences; }

	/** The point of views of the user. */
	get views(): Relation<View> { return this._views; }
=======
	get presences(): NodeSet<Presence> { return this._presences; }

	/** The point of views of the user. */
	get views(): NodeSet<View> { return this._views; }
>>>>>>> a1bb1438a29eadf7da80cdc810cdac2dbd2d398a

	
	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new User instance.
<<<<<<< HEAD
	 * @param name The name of the data type.
	 * @param relation The data relation.
	 * @param data The initialization data. */
	 constructor(name?: string, relation?: Relation<Item>, data?: any) {

		// Call the parent class constructor
		super(name, relation);

		// Create the child nodes
		this._presences = new Relation<Presence>("presences", [Presence.type],
			this, this.children);
		this._views = new Relation<View>("views", [View.type],
			this, this.children);
=======
	 * @param name The name of the user.
	 * @param parent The parent Node of the user.
	 * @param data The initialization data. */
	 constructor(name: string, parent: Node, data?: any) {
	 
		// Call the parent class constructor
		super(name, parent, data, ["user"]);

		// Create the child nodes
		this._presences = new NodeSet<Presence>("presences", this, Presence);
		this._views = new NodeSet<View>("views", this, View);
>>>>>>> a1bb1438a29eadf7da80cdc810cdac2dbd2d398a

		// Deserialize the initialization data
		if (data) this.deserialize(data);

		// Create the defaults
		if (this._presences.count == 0) {
<<<<<<< HEAD
			let spaces = (this.parent as any).spaces;
=======
			let spaces = (this.nodeParent as any).spaces;
>>>>>>> a1bb1438a29eadf7da80cdc810cdac2dbd2d398a
			for (let space of spaces) {
				let presence = new Presence("Presence", this._presences);
				presence.space = space;
			}
		}
		if (this._views.count == 0) new View("DefaultView", this._views);
	}


	// --------------------------------------------------------- PUBLIC METHODS

	/** Updates the Entity.
	 * @param deltaTime The update time. 
 	 * @param forced Indicates whether the update is forced or not. */
	update(deltaTime: number = 0, forced:boolean = false) {

		// If the update is not forced, skip it when the node is already updated
<<<<<<< HEAD
		if (this.updated && !forced) return;
=======
		if (this.nodeUpdated && !forced) return;
>>>>>>> a1bb1438a29eadf7da80cdc810cdac2dbd2d398a
	
		// Call the base class function
		super.update(deltaTime, forced);
	}

}