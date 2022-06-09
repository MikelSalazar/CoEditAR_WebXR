import { Node } from "./data/Node";
import { NodeSet } from "./data/NodeSet";
import { Number } from "./data/types/simple/Number";
import { Package } from "./data/model/Package";
import { Space } from "./user/interaction/Space";
import { User } from "./user/User";

/** Manages the CoEditAR Framework (and facilitates the creation of web 
 * apps on top of it). */
export class CoEditAR extends Node {

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

	/** The packages of the CoEditAR system. */
	private _packages: NodeSet<Package>;

	/** The interaction spaces in the CoEditAR system. */
	private _spaces: NodeSet<Space>;

	/** The users of the CoEditAR system. */
	private _users: NodeSet<User>;


	// ------------------------------------------------------ PUBLIC PROPERTIES

	/** The version number of CoEditAR system. */
	get coeditar(): Number { return this._coeditar; }

	/** The packages of the CoEditAR system. */
	get packages(): NodeSet<Package> { return this._packages; }

	/** The interaction spaces in the CoEditAR system. */
	get spaces(): NodeSet<Space> { return this._spaces; }

	/** The users of the CoEditAR system. */
	get users(): NodeSet<User> { return this._users; }


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new CoEditAR instance.
	  * @param data The initialization data (or a URL to the data file). */
	constructor(data?: object | URL) {

		// Call the base class constructor
		super("coeditar", null, data, ["root"]);

		// Create the child nodes
		this._coeditar = new Number("coeditar", this);
		this._packages = new NodeSet<Package>("packages", this, Package);
		this._spaces = new NodeSet<Space>("spaces", this, Space);
		this._users = new NodeSet<User>("users", this, User);

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