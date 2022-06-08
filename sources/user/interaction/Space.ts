import { Node } from "../../data/Node";
import { NodeSet } from "../../data/NodeSet";
import { SpaceEntity } from "../../logic/entities/SpaceEntity";
import { Entity } from "../../logic/Entity";

/** Defines a User Interaction Space. */
export class Space extends Node {

	// --------------------------------------------------------- PRIVATE FIELDS

	/** The main entity of the Space. */
	private _entity: SpaceEntity;

	/** The type of the Space (). */
	private _isShared: string;


	// ------------------------------------------------------- PUBLIC ACCESSORS

	/** The main entity of the Space. */
	get entity(): SpaceEntity { return this._entity; }


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new View instance.
	 * @param name The name of the View.
	 * @param parent The parent Node of the View.
	 * @param data The initialization data. */
	constructor(name: string, parent: Node, data?: any) {

		// Call the parent class constructor
		super(["space"], name, parent, data);

		// Create the entity for the space
		this._entity = new SpaceEntity(name, this);

		// Deserialize the initialization data
		if (data) this.deserialize(data);
	}

	/** Deserializes the Presence instance.
	 * @param data The data to deserialize.
	 * @param mode The deserialization mode. */
	deserialize(data?: any, mode?: string): void {

		this.entity.deserialize(data);
	}
}