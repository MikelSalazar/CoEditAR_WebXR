import { Node } from "../data/Node.js";
import { NodeSet } from "../data/NodeSet.js";
import { Presence } from "./interaction/Presence.js";
import { View } from "./interaction/View.js";

/** Defines a user. */
export class User extends Node {


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new User instance.
	 * @param name The name of the user.
	 * @param parent The parent Node of the user.
	 * @param data The initialization data. */
	constructor(name, parent, data) {

		// Call the parent class constructor
		super(["user"], name, parent, data);

		// Create the child nodes
		this._presences = new NodeSet("presences", this, Presence);
		this._views = new NodeSet("views", this, View);

		// Deserialize the initialization data
		if (data)
			this.deserialize(data);

		// Create the defaults
		if (this._presences.count == 0) {
			let spaces = this.nodeParent.spaces;
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
		if (this.nodeUpdated && !forced)
			return;

		// Call the base class function
		super.update(deltaTime, forced);

	}
}
