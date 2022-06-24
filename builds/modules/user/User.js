<<<<<<< HEAD
import { Item } from "../data/Item.js";
import { Relation } from "../data/Relation.js";
import { Presence } from "./interaction/Presence.js";
import { View } from "./interaction/View.js";


/** Defines a user. */
export class User extends Item {
=======
import { Node } from "../data/Node.js";
import { NodeSet } from "../data/NodeSet.js";
import { Presence } from "./interaction/Presence.js";
import { View } from "./interaction/View.js";

/** Defines a user. */
export class User extends Node {
>>>>>>> a1bb1438a29eadf7da80cdc810cdac2dbd2d398a


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new User instance.
<<<<<<< HEAD
	 * @param name The name of the data type.
	 * @param relation The data relation.
	 * @param data The initialization data. */
	constructor(name, relation, data) {

		// Call the parent class constructor
		super(name, relation);

		// Create the child nodes
		this._presences = new Relation("presences", [Presence.type], this, this.children);
		this._views = new Relation("views", [View.type], this, this.children);
=======
	 * @param name The name of the user.
	 * @param parent The parent Node of the user.
	 * @param data The initialization data. */
	constructor(name, parent, data) {

		// Call the parent class constructor
		super(name, parent, data, ["user"]);

		// Create the child nodes
		this._presences = new NodeSet("presences", this, Presence);
		this._views = new NodeSet("views", this, View);
>>>>>>> a1bb1438a29eadf7da80cdc810cdac2dbd2d398a

		// Deserialize the initialization data
		if (data)
			this.deserialize(data);

		// Create the defaults
		if (this._presences.count == 0) {
<<<<<<< HEAD
			let spaces = this.parent.spaces;
=======
			let spaces = this.nodeParent.spaces;
>>>>>>> a1bb1438a29eadf7da80cdc810cdac2dbd2d398a
			for (let space of spaces) {
				let presence = new Presence("Presence", this._presences);
				presence.space = space;
			}
		}
		if (this._views.count == 0)
			new View("DefaultView", this._views);
	}

	// ------------------------------------------------------- PUBLIC ACCESSORS

	/** The presences of the user in the interaction spaces. */
	get presences() { return this._presences; }

	/** The point of views of the user. */
	get views() { return this._views; }


	// --------------------------------------------------------- PUBLIC METHODS

	/** Updates the Entity.
	 * @param deltaTime The update time.
	 * @param forced Indicates whether the update is forced or not. */
	update(deltaTime = 0, forced = false) {

		// If the update is not forced, skip it when the node is already updated
<<<<<<< HEAD
		if (this.updated && !forced)
=======
		if (this.nodeUpdated && !forced)
>>>>>>> a1bb1438a29eadf7da80cdc810cdac2dbd2d398a
			return;

		// Call the base class function
		super.update(deltaTime, forced);
	}
}
