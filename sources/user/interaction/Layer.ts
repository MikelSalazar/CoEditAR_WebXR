import { Node } from "../../data/Node";
import { Presence } from "./Presence";

/** Defines an user interaction Layer. */
export class Layer extends Node {

	// --------------------------------------------------------- PRIVATE FIELDS

	/** The user presence associated with the presence. */
	private _presence: Presence;

	// ------------------------------------------------------- PUBLIC ACCESSORS

	/** The space associated with the presence. */
	get presence(): Presence { return this._presence; }
	set presence(presence: Presence) { this._presence = presence; }


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new Layer instance.
	 * @param name The name of the layer.
	 * @param parent The parent Node of the layer.
	 * @param data The initialization data. */
	 constructor(name: string, parent: Node, data?: any) {
	 
		// Call the parent class constructor
		super(["layer"], name, parent, data);

		// Deserialize the initialization data
		if (data) this.deserialize(data);
	}

	/** Deserializes the Layer instance.
	 * @param data The data to deserialize.
	 * @param mode The deserialization mode. */
	deserialize(data: any, mode?: string) {
		if(data.nodeTypes.includes("presence")) this._presence = data;
	}
}