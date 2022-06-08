import { Node } from "../../data/Node.js";

/** Defines an user interaction Layer. */
export class Layer extends Node {


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new Layer instance.
	 * @param name The name of the layer.
	 * @param parent The parent Node of the layer.
	 * @param data The initialization data. */
	constructor(name, parent, data) {

		// Call the parent class constructor
		super(["layer"], name, parent, data);

		// Deserialize the initialization data
		if (data)
			this.deserialize(data);
	}

	// ------------------------------------------------------- PUBLIC ACCESSORS

	/** The space associated with the presence. */
	get presence() { return this._presence; }
	set presence(presence) { this._presence = presence; }

	/** Deserializes the Layer instance.
	 * @param data The data to deserialize.
	 * @param mode The deserialization mode. */
	deserialize(data, mode) {
		if (data.nodeTypes.includes("presence"))
			this._presence = data;
	}
}
