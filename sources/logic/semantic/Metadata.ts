import { Class, Instance, Property } from "../../CoEditAR";

/** Defines the semantic metadata of an instance.
 * Extends the prototype object in Javascript. */
export class Metadata {

	// --------------------------------------------------------- PRIVATE FIELDS

	/** The associated instance. */
	private _instance: Instance;

	/** The prototype of the instance. */
	private _prototype: any;

	/** The classes of the instance. */
	private _classes: Class[];

	/** The properties of the instance. */
	private _properties: Record<string, Property>;

	/** The required properties of the instance. */
	private _required: string[];

	/** Indicates if additional properties are allowed or not. */
	private _additionalProperties: boolean;


	// ------------------------------------------------------- PUBLIC ACCESSORS

	/** The associated instance. */
	get instance(): Instance { return this._instance; }

	/** The prototype of the instance. */
	get prototype(): any { return this._prototype; }

	/** The classes of the instance. */
	get classes(): Class[] { return this._classes; }

	/** The properties of the instance. */
	get properties(): Record<string, Property> { return this._properties; }

	/** The required properties of the instance. */
	get required(): string[] { return this._required; }

	/** Indicates if additional properties are allowed or not. */
	get additionalProperties(): boolean { return this._additionalProperties; }
	set additionalProperties(v: boolean) {this._additionalProperties = v; }


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new instance of the Metadata class.
	 * @param instance The instance of the property. */
	constructor(instance: Instance) {
		
		// Store the instance and the prototype object
		this._instance = instance;
		this._prototype = Object.getPrototypeOf(instance);
		
		// Initialize the elements of the metadata
		this._classes = [];
		this._properties = {};
		this._required = [];
		this._additionalProperties = true;
	}

}