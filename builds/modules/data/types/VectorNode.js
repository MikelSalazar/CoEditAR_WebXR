import { Node, Class } from "../../CoEditAR.js";


/** Defines a 3 dimensional vector. */
export class VectorNode extends Node {


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new instance of the VectorNode class.
	 * @param name The name of the node.
	 * @param link The parent node link.
	 * @param data The initialization data. */
	constructor(name, link, data) {

		// Call the base class constructor
		super("vector", name, link, data);
	}


	// --------------------------------------------------------- PUBLIC METHODS

	/** Deserializes the number.
	 * @param data The data to deserialize. */
	deserialize(data) {
		super.deserialize();
		if (data == undefined)
			return;
	}


	/** Serializes the number.
	* @param data Additional data to include in the serialized object.
	* @return The serialized data. */
	serialize(data = {}) {

		data = super.serialize(data);
		debugger;

		// Return the serialized data

		return data;
	}
}

/** The semantic metadata of the class. */
VectorNode.class = new Class("Vector", null, { implementation: VectorNode,
	properties: {
		x: { type: "number", default: 0 },
		y: { type: "number", default: 0 },
		z: { type: "number", default: 0 }
	}
});

// SCHEMA DATA
// /** The semantic metadata of the class. */
// static class: Class = new Class("Vector", undefined, [Node.class],
// 	{ implementation: VectorNode,
// 		properties: {
// 			x: { type: "number", default: 0 },
// 			y: { type: "number", default: 0 },
// 			z: { type: "number", default: 0 }
// 		}
// 	});




