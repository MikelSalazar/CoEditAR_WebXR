import { Number } from "./data/types/simple/Number";
import { User } from "./user/User";
import { Relation } from "./data/Relation";
import { Space } from "./user/interaction/Space";
import { Serializable } from "./data/serialization/Serializable";

/** Manages the CoEditAR Framework (and facilitates the creation of web 
 * apps on top of it). */
export class CoEditAR extends Serializable {

	// -------------------------------------------------- STATIC PRIVATE FIELDS

	/** The global list of CoEditAR App instances. */
	private static _instances: CoEditAR[] = [];


	// --------------------------------------------------- STATIC PUBLIC FIELDS

	/** The global list of CoEditAR App instances. */
	public static autoInitialize: boolean = true;


	// ------------------------------------------------ STATIC PUBLIC ACCESSORS

	/** The name of the CoEditAR Framework. */
	static get frameworkName(): string { return "CoEditAR"; }

	/** The version number of the CoEditAR Framework. */
	static get frameworkVersion(): number { return 0.1; }

	/** The global list of CoEditAR instances. */
	static get instances(): CoEditAR[] { return CoEditAR._instances; }

	/** Indicates whether the framework has already been initialized or not. */
	static get initialized(): boolean { return CoEditAR._instances.length > 0; }


	// -------------------------------------------------- STATIC PUBLIC METHODS

	/** Initializes the CoEditAR Framework.
	 * @param data The initialization data (or a URL to the data file). */
	static init(data?: object | URL) { 

		// TODO If it is already initialize, clean the previous data
		//if (!CoEditAR.initialized)

		// Create a new CoEditAR instance
		return new CoEditAR(data);
	}


	// --------------------------------------------------------- PRIVATE FIELDS

	/** The version number of CoEditAR system. */
	private _coeditar: Number;

	// /** The packages of the CoEditAR system. */
	// private _packages: Relation<Package>;

	/** The interaction spaces in the CoEditAR system. */
	private _spaces: Relation<Space>;

	/** The users of the CoEditAR system. */
	private _users: Relation<User>;


	// ------------------------------------------------------ PUBLIC PROPERTIES

	/** The version number of CoEditAR system. */
	get coeditar(): Number { return this._coeditar; }

	// /** The packages of the CoEditAR system. */
	// get packages(): Relation<Package> { return this._packages; }

	/** The interaction spaces in the CoEditAR system. */
	get spaces(): Relation<Space> { return this._spaces; }

	/** The users of the CoEditAR system. */
	get users(): Relation<User> { return this._users; }


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new CoEditAR instance.
	 * @param data The initialization data (or a URL to the data file). */
	constructor(data?: object | URL) {

		// Call the base class constructor
		super("root", null);

		// // Create the child nodes
		this._coeditar = new Number("coeditar", this.children);
		// this._packages = new NodeSet<Package>("packages", this, Package);
		this._spaces = new Relation<Space>("spaces", [Space.type], this, this.children);
		this._users = new Relation<User>("users", [User.type], this, this.children);

		// Deserialize the initialization data
		if (data) this.deserialize(data);

		// Define the basic elements if not defined
		if (this._spaces.count == 0) new Space("DefaultSpace", this._spaces);
		if (this._users.count == 0) new User("DefaultUser", this._users);
		
		// Add this instance to the list (and show a message if it is the first)
		CoEditAR._instances.push(this);
		if (CoEditAR._instances.length == 1) console.log(
			"CoEditAR " + CoEditAR.frameworkVersion + " Initialized");
	}

}


// Unless otherwise specified, automatically initialize the CoEditAR framework
// to make it easier for people to operate with it
if(CoEditAR.autoInitialize) window.addEventListener("load", () => 
	{ if(!CoEditAR.initialized) CoEditAR.init(); })