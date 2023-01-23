
/** Defines the semantic metadata of an instance.
 * Extends the prototype object in Javascript. */
export class Metadata {


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new instance of the Metadata class.
	 * @param instance The instance of the property. */
	constructor(instance) {

		// Store the instance and the prototype object
		this._instance = instance;
		this._prototype = Object.getPrototypeOf(instance);

		// Initialize the elements of the metadata
		this._classes = [];
		this._properties = {};
		this._required = [];
		this._additionalProperties = true;
	}


	// ------------------------------------------------------- PUBLIC ACCESSORS

	/** The associated instance. */
	get instance() { return this._instance; }

	/** The prototype of the instance. */
	get prototype() { return this._prototype; }

	/** The classes of the instance. */
	get classes() { return this._classes; }

	/** The properties of the instance. */
	get properties() { return this._properties; }

	/** The required properties of the instance. */
	get required() { return this._required; }

	/** Indicates if additional properties are allowed or not. */
	get additionalProperties() { return this._additionalProperties; }
	set additionalProperties(v) { this._additionalProperties = v; }
}
