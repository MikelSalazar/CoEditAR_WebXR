import { Item } from "../../data/Item.js";
import { Type } from "../../data/Type.js";
import { SpaceEntity } from "../../logic/entities/SpaceEntity.js";

/** Defines a User Interaction Space. */
export class Space extends Item {


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new View instance.
	 * @param name The name of the data type.
	 * @param relation The data relation.
	 * @param data The initialization data. */
	constructor(name, relation, data) {

		// Call the parent class constructor
		super(name, relation);

		// Create the entity for the space
		this._entity = new SpaceEntity(name, this.children);

		// Deserialize the initialization data
		if (data)
			this.deserialize(data);

		console.log("Space created: " + this.name);
	}


	// ------------------------------------------------------- PUBLIC ACCESSORS

	/** The main entity of the Space. */
	get entity() { return this._entity; }


	/** Deserializes the Presence instance.
	 * @param data The data to deserialize.
	 * @param mode The deserialization mode. */
	deserialize(data, mode) {
		// this._entity.deserialize(data);
	}
}

/** The metadata of the Space class. */
Space.type = new Type(Space, Item.type);
