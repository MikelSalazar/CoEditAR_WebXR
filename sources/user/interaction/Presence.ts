import { Item } from "../../data/Item";
import { Relation } from "../../data/Relation";
import { PresenceEntity } from "../../logic/entities/PresenceEntity";
import { Space } from "./Space";

/** Defines a user presence in an User Interaction space. */
export class Presence extends Item {

	// --------------------------------------------------------- PRIVATE FIELDS

	/** The main entity of the presence. */
	private _entity: PresenceEntity;

	/** The space associated with the presence. */
	private _space: Space;


	// ------------------------------------------------------- PUBLIC ACCESSORS

	/** The entity associated with this presence. */
	get entity(): PresenceEntity { return this._entity; }

	/** The space associated with the presence. */
	get space(): Space { return this._space; }
	set space(space: Space) { this._space = space; }


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new Presence instance.
	 * @param name The name of the data type.
	 * @param relation The data relation.
	 * @param data The initialization data. */
	 constructor(name?: string, relation?: Relation<Item>, data?: any) {

		// Call the parent class constructor
		super(name, relation);

		// Create the child nodes
		this._entity = new PresenceEntity(name + "Entity", this.children);
		// The space node is not initialized here because it is actually a link

		// Deserialize the initialization data
		if (data) this.deserialize(data);
	}


	/** Deserializes the Presence instance.
	 * @param data The data to deserialize.
	 * @param mode The deserialization mode. */
	deserialize(data?: any, mode?: string): void {

		// Get the space reference
		// if (data.space) {
		// 	let spaceName = data.space;
		// 	let root = this.node.ancestor("root").datatype as unknown as CoEditAR;
		// 	let space = root.spaces.getByName(spaceName);
		// 	if (!space) throw Error("Space '" + spaceName + "' not found");
		// 	this.space = space;
		// }

		this.entity.deserialize(data);
	}

}