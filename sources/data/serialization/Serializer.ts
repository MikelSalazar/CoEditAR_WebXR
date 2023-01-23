
/** A basic class that describes the structure of Serializers. */
export abstract class Serializer { 

	// ---------------------------------------------------------- PUBLIC FIELDS

	/** The serialization parameters. */
	params: Record<string, any>;


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new instance of the Serializer class.
	 * @param params The serialization parameters. */
	constructor(params: Record<string, any> = {}) { this.params = params; }


	// --------------------------------------------------------- PUBLIC METHODS

	/** Translates a data item to a stream of characters/bytes.
	 * @param data The data item to serialize.
	 * @returns The stream of characters/bytes representing the data item. */
	serialize(data: any) : any {}


	/** Translates a stream of characters/bytes to a data item.
	 * @param stream The stream of characters/bytes to deserialize.
	 * @returns The stream of characters/bytes representing the data item. */
	deserialize(stream: any) : any {}
}