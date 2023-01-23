import { CoEditAR, Node, Link, Class } from "../../CoEditAR";


/** Defines a 3 dimensional vector. */
export class VectorNode extends Node {

	/** The semantic metadata of the class. */
	static class: Class = new Class("Vector", null,
	{ implementation: VectorNode,
		properties: {
			x: { type: "number", default: 0 },
			y: { type: "number", default: 0 },
			z: { type: "number", default: 0 }
		}
	});


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new instance of the VectorNode class.
	 * @param name The name of the node.
	 * @param link The parent node link.
	 * @param data The initialization data. */
	constructor(name?: string, link?: Link<Node>, data?: any) {

		// Call the base class constructor
		super("vector", name, link, data);
	}


	// --------------------------------------------------------- PUBLIC METHODS

	/** Deserializes the number.
	 * @param data The data to deserialize. */
	deserialize(data: any) {
		super.deserialize();
		if (data == undefined) return;
	}


	/** Serializes the number.
	* @param data Additional data to include in the serialized object.
	* @return The serialized data. */
	serialize(data: any = {}) {

		data = super.serialize(data);
		debugger;
		
		// Return the serialized data

		return data;
	}
}

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



