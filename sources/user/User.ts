import { Item } from "../data/Item";
import { Relation } from "../data/Relation";
import { Presence } from "./interaction/Presence";
import { View } from "./interaction/View";


/** Defines a user. */
export class User extends Item {

	// ------------------------------------------------------- PROTECTED FIELDS

	/** The presences of the user in the interaction spaces. */
	protected _presences: Relation<Presence>;

	/** The view of the user. */
	protected _views: Relation<View>;

	// ------------------------------------------------------- PUBLIC ACCESSORS

	/** The presences of the user in the interaction spaces. */
	get presences(): Relation<Presence> { return this._presences; }

	/** The point of views of the user. */
	get views(): Relation<View> { return this._views; }

	
	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new User instance.
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

		// Deserialize the initialization data
		if (data) this.deserialize(data);

		// Create the defaults
		if (this._presences.count == 0) {
			let spaces = (this.parent as any).spaces;
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
		if (this.updated && !forced) return;
	
		// Call the base class function
		super.update(deltaTime, forced);
	}

}