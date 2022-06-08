import { Node } from "../../data/Node.js";
import { PresenceEntity } from "../../logic/entities/PresenceEntity.js";

/** Defines a user presence in an User Interaction space. */
export class Presence extends Node {


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new Presence instance.
	 * @param name The name of the presence.
	 * @param parent The parent Node of the presence.
	 * @param data The initialization data. */
	constructor(name, parent, data) {

		// Call the parent class constructor
		super(["presence"], name, parent, data);

		// Create the child nodes
		this._entity = new PresenceEntity(name + "Entity", this);
		// The space node is not initialized here because it is actually a link

		// Deserialize the initialization data
		if (data)
			this.deserialize(data);
	}


	// ------------------------------------------------------- PUBLIC ACCESSORS

	/** The entity associated with this presence. */
	get entity() { return this._entity; }

	/** The space associated with the presence. */
	get space() { return this._space; }
	set space(space) { this._space = space; }


	/** Deserializes the Presence instance.
	 * @param data The data to deserialize.
	 * @param mode The deserialization mode. */
	deserialize(data, mode) {

		// Get the space reference
		if (data.space) {
			let spaceName = data.space;
			let root = this.nodeAncestor("root");
			let space = root.spaces.getByName(spaceName);
			if (!space)
				throw Error("Space '" + spaceName + "' not found");
			this.space = space;
		}

		this.entity.deserialize(data);
	}
}
