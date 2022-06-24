import { Item } from "../../data/Item";
import { Relation } from "../../data/Relation";
import { Type } from "../../data/Type";
import { SpaceEntity } from "../../logic/entities/SpaceEntity";

/** Defines a User Interaction Space. */
export class Space extends Item {
	
	/** The metadata of the Space class. */
	static type: Type = new Type(Space, Item.type);

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
	 * @param name The name of the data type.
	 * @param relation The data relation.
	 * @param data The initialization data. */
	 constructor(name?: string, relation?: Relation<Item>, data?: any) {

		// Call the parent class constructor
		super(name, relation);

		// Create the entity for the space
		this._entity = new SpaceEntity(name, this.children);

		// Deserialize the initialization data
		if (data) this.deserialize(data);

		console.log("Space created: " + this.name);
	}


	/** Deserializes the Presence instance.
	 * @param data The data to deserialize.
	 * @param mode The deserialization mode. */
	deserialize(data?: any, mode?: string): void {
		// this._entity.deserialize(data);
	}
}