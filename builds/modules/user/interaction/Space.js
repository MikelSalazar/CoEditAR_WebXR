import { Node } from "../../data/Node.js";
import { SpaceEntity } from "../../logic/entities/SpaceEntity.js";

/** Defines a User Interaction Space. */
export class Space extends Node {


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new View instance.
	 * @param name The name of the View.
	 * @param parent The parent Node of the View.
	 * @param data The initialization data. */
	constructor(name, parent, data) {

		// Call the parent class constructor
		super(["space"], name, parent, data);

		// Create the entity for the space
		this._entity = new SpaceEntity(name, this);

		// Deserialize the initialization data
		if (data)
			this.deserialize(data);
	}


	// ------------------------------------------------------- PUBLIC ACCESSORS

	/** The main entity of the Space. */
	get entity() { return this._entity; }

	/** Deserializes the Presence instance.
	 * @param data The data to deserialize.
	 * @param mode The deserialization mode. */
	deserialize(data, mode) {

		this.entity.deserialize(data);
	}
}
