import { Item } from "../../data/Item.js";

/** Defines an user interaction Layer. */
export class Layer extends Item {



	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new Layer instance.
<<<<<<< HEAD
	 * @param name The name of the data type.
	 * @param relation The data relation.
=======
	 * @param name The name of the layer.
	 * @param parent The parent Node of the layer.
>>>>>>> a1bb1438a29eadf7da80cdc810cdac2dbd2d398a
	 * @param data The initialization data. */
	constructor(name, relation, data) {

		// Call the parent class constructor
<<<<<<< HEAD
		super(name, relation);
=======
		super(name, parent, data, ["layer"]);
>>>>>>> a1bb1438a29eadf7da80cdc810cdac2dbd2d398a

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
<<<<<<< HEAD
		if (data.type.is("Presence"))
=======
		if (data.nodeTypes.includes("presence"))
>>>>>>> a1bb1438a29eadf7da80cdc810cdac2dbd2d398a
			this._presence = data;
	}
}
