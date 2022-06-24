import { Item } from "../../data/Item";
import { Type } from "../../data/Type";
import { Relation } from "../../data/Relation";
import { Presence } from "./Presence";

/** Defines an user interaction Layer. */
export class Layer extends Item {

	// --------------------------------------------------------- PRIVATE FIELDS

	/** The user presence associated with the presence. */
	private _presence: Presence;

	// ------------------------------------------------------- PUBLIC ACCESSORS

	/** The space associated with the presence. */
	get presence(): Presence { return this._presence; }
	set presence(presence: Presence) { this._presence = presence; }


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new Layer instance.
	 * @param name The name of the data type.
	 * @param relation The data relation.
	 * @param data The initialization data. */
	 constructor(name?: string, relation?: Relation<Item>, data?: any) {

		// Call the parent class constructor
		super(name, relation);

		// Deserialize the initialization data
		if (data) this.deserialize(data);
	}


	/** Deserializes the Layer instance.
	 * @param data The data to deserialize.
	 * @param mode The deserialization mode. */
	deserialize(data: any, mode?: string) {
		if(data.type.is("Presence")) this._presence = data;
	}
}