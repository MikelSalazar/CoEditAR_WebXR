import { Domain, Metadata, Serialization } from "../../CoEditAR.js";

/** Defines the semantic metadata of a object instance (Individual). */
export class Instance {


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new instance.
	 * @param classEx The class expression of the instance.
	 * @param data The initialization data. */
	constructor(classEx, data) {

		// Initialize the metadata for this instance
		this._metadata = new Metadata(this);
		Object.defineProperty(this, "_metadata", { enumerable: false });

		// Store the classes of the instance and add this instance to them
		let classes = [];
		if (typeof classEx == "string") {

			let c = Domain.default.classes[classEx];
			if (c)
				classes.push(c);

			else
				throw Error('Unknown class "' + classEx + '"');
		}
		for (let c of classes) {
			if (!c || !c.isClass)
				throw Error("Invalid class to instantiate");
			this._metadata.classes.push(c);
		}

		// Instantiate the classes (adding the properties to the class)
		for (let c of this._metadata.classes)
			c.instantiate(this);

		// If there is any initialization data, deserialize it
		this.deserialize(data);
	}


	// ------------------------------------------------------- PUBLIC ACCESSORS

	/** The metadata of the instance. */
	get metadata() { return this._metadata; }

	// --------------------------------------------------------- PUBLIC METHODS


	/** Deserializes the instance.
	 * @param data The data to deserialize. */
	deserialize(data) {

		// Show a debug message on the console
		console.log("Deserializing Instance");

		// First, check that the required properties are defined
		for (let requiredProperty of this.metadata.required)
			if ((!data || !data[requiredProperty]))
				throw new Error('Required property not defined: "' + requiredProperty + '"');

		function createProperty(instance, name, property) {
			Object.defineProperty(instance, name, {
				enumerable: true,
				get: () => { return property.value; },
				set: (v) => { property.value = v; }
			});
		}

		// Create the properties defined in the metadata
		for (let propertyName in this._metadata.properties) {
			let property = this._metadata.properties[propertyName];
			createProperty(this, propertyName, property);
		}

		// Create the Javascript properties of the object
		// let propertyDescriptors : any = {};
		// for (let itemName in data) {
		// 	let item = data[itemName], type = typeof item;
		// 	let propertyDescriptor: any = {};
		// 	switch(type) {
		// 		case "boolean": case "number": case "bigint": case "string":
		// 			propertyDescriptor.value = item;
		// 			break;
		// 		case "object":
		// 			// TODO recursively deserialize objects
		// 			break;
		// 	}
		// 	if (type == "object") {	}
		// 	propertyDescriptors[itemName] = propertyDescriptor;
		// }

	}


	/** Serializes the instance.
	* @param params The serialization parameters.
	* @param data Additional data to include in the serialized object.
	* @return The serialized data. */
	serialize(params, data = {}) {

		// Add each property
		for (let propertyName in this.metadata.properties) {
			let property = this.metadata.properties[propertyName];
			let propertyData = property.value;
			if (Array.isArray(propertyData)) {
				data[propertyName] = [];
				for (let item of propertyData)
					data[propertyName].push(item.serialize());
			}
			else if (typeof (propertyData) == "object")
				data[propertyName] = propertyData.serialize();
			else
				data[propertyName] = propertyData;
		}

		// If there are serialization parameters language, use them
		if (params)
			return Serialization.serialize(params, data);

		// Otherwise, just return the object
		return data;
	}

	/** Destroys the instance.
	 * @param propagate Indicates whether to propagate the destruction through
	 * relations or not.*/
	destroy(propagate = true) { }
}

