
/** Provides a basic interface to serialize/deserialize data. */
export abstract class Serializable {

	// --------------------------------------------------------- PRIVATE FIELDS

	/** Deserializes the instance from a JSON representation.
	 * @param data The JSON data to deserialize. */
	deserialize(data: any): void {}
	
	
	/** Serializes the instance to a JSON representation.
	* @param params The serialization parameters.
	* @param data Additional data to include in the serialized object.
	* @return The resulting JSON (schema) data. */
	serialize(params?: any, data: any = {}): any {}


	/** Converts the instance to a string representation.
	 * @param format The serialization parameters.
	 * @returns The string representation of the instance. */
	toString(params: string = "JSON") { return this.serialize(params);}

}