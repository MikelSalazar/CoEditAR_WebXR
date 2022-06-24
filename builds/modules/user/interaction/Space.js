<<<<<<< HEAD
import { Item } from "../../data/Item.js";
import { Type } from "../../data/Type.js";
import { SpaceEntity } from "../../logic/entities/SpaceEntity.js";

/** Defines a User Interaction Space. */
export class Space extends Item {

=======
import { Node } from "../../data/Node.js";
import { SpaceEntity } from "../../logic/entities/SpaceEntity.js";

/** Defines a User Interaction Space. */
export class Space extends Node {
>>>>>>> a1bb1438a29eadf7da80cdc810cdac2dbd2d398a


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new View instance.
<<<<<<< HEAD
	 * @param name The name of the data type.
	 * @param relation The data relation.
=======
	 * @param name The name of the View.
	 * @param parent The parent Node of the View.
>>>>>>> a1bb1438a29eadf7da80cdc810cdac2dbd2d398a
	 * @param data The initialization data. */
	constructor(name, relation, data) {

		// Call the parent class constructor
<<<<<<< HEAD
		super(name, relation);

		// Create the entity for the space
		this._entity = new SpaceEntity(name, this.children);
=======
		super(name, parent, data, ["space"]);

		// Create the entity for the space
		this._entity = new SpaceEntity(name, this);
>>>>>>> a1bb1438a29eadf7da80cdc810cdac2dbd2d398a

		// Deserialize the initialization data
		if (data)
			this.deserialize(data);
<<<<<<< HEAD

		console.log("Space created: " + this.name);
=======
>>>>>>> a1bb1438a29eadf7da80cdc810cdac2dbd2d398a
	}


	// ------------------------------------------------------- PUBLIC ACCESSORS

	/** The main entity of the Space. */
	get entity() { return this._entity; }


	/** Deserializes the Presence instance.
	 * @param data The data to deserialize.
	 * @param mode The deserialization mode. */
	deserialize(data, mode) {
<<<<<<< HEAD
		// this._entity.deserialize(data);
=======
		this._entity.deserialize(data);
>>>>>>> a1bb1438a29eadf7da80cdc810cdac2dbd2d398a
	}
}

/** The metadata of the Space class. */
Space.type = new Type(Space, Item.type);
