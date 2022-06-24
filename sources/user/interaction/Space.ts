<<<<<<< HEAD
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

=======
import { Node } from "../../data/Node";
import { NodeSet } from "../../data/NodeSet";
import { SpaceEntity } from "../../logic/entities/SpaceEntity";
import { Entity } from "../../logic/Entity";

/** Defines a User Interaction Space. */
export class Space extends Node {
>>>>>>> a1bb1438a29eadf7da80cdc810cdac2dbd2d398a

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
<<<<<<< HEAD
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
=======
	 * @param name The name of the View.
	 * @param parent The parent Node of the View.
	 * @param data The initialization data. */
	constructor(name: string, parent: Node, data?: any) {

		// Call the parent class constructor
		super(name, parent, data, ["space"]);

		// Create the entity for the space
		this._entity = new SpaceEntity(name, this);

		// Deserialize the initialization data
		if (data) this.deserialize(data);
>>>>>>> a1bb1438a29eadf7da80cdc810cdac2dbd2d398a
	}


	/** Deserializes the Presence instance.
	 * @param data The data to deserialize.
	 * @param mode The deserialization mode. */
	deserialize(data?: any, mode?: string): void {
<<<<<<< HEAD
		// this._entity.deserialize(data);
=======
		this._entity.deserialize(data);
>>>>>>> a1bb1438a29eadf7da80cdc810cdac2dbd2d398a
	}
}