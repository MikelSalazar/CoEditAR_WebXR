import { CoEditAR } from "../../CoEditAR";
import { Node } from "../../data/Node";
import { NodeSet } from "../../data/NodeSet";
import { PresenceEntity } from "../../logic/entities/PresenceEntity";
import { Entity } from "../../logic/Entity";
import { Space } from "./Space";

/** Defines a user presence in an User Interaction space. */
export class Presence extends Node {

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
	 * @param name The name of the presence.
	 * @param parent The parent Node of the presence.
	 * @param data The initialization data. */
	constructor(name: string, parent: Node, data?: any) {

		// Call the parent class constructor
		super(["presence"], name, parent, data);

		// Create the child nodes
		this._entity = new PresenceEntity(name + "Entity", this);
		// The space node is not initialized here because it is actually a link

		// Deserialize the initialization data
		if (data) this.deserialize(data);
	}


	/** Deserializes the Presence instance.
	 * @param data The data to deserialize.
	 * @param mode The deserialization mode. */
	deserialize(data?: any, mode?: string): void {

		// Get the space reference
		if (data.space) {
			let spaceName = data.space;
			let root = this.nodeAncestor("root") as CoEditAR;
			let space = root.spaces.getByName(spaceName);
			if (!space) throw Error("Space '" + spaceName + "' not found");
			this.space = space;
		}

		this.entity.deserialize(data);
	}

}