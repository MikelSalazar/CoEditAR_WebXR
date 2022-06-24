<<<<<<< HEAD
import { Number } from "./data/types/simple/Number.js";
import { User } from "./user/User.js";
import { Relation } from "./data/Relation.js";
import { Space } from "./user/interaction/Space.js";
import { Serializable } from "./data/serialization/Serializable.js";

/** Manages the CoEditAR Framework (and facilitates the creation of web
 * apps on top of it). */
export class CoEditAR extends Serializable {
=======
import { Node } from "./data/Node.js";
import { NodeSet } from "./data/NodeSet.js";
import { Number } from "./data/types/simple/Number.js";
import { Package } from "./data/model/Package.js";
import { Space } from "./user/interaction/Space.js";
import { User } from "./user/User.js";

/** Manages the CoEditAR Framework (and facilitates the creation of web
 * apps on top of it). */
export class CoEditAR extends Node {
>>>>>>> a1bb1438a29eadf7da80cdc810cdac2dbd2d398a


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new CoEditAR instance.
	 * @param data The initialization data (or a URL to the data file). */
	constructor(data) {

		// Call the base class constructor
<<<<<<< HEAD
		super("root", null);

		// // Create the child nodes
		this._coeditar = new Number("coeditar", this.children);
		// this._packages = new NodeSet<Package>("packages", this, Package);
		this._spaces = new Relation("spaces", [Space.type], this, this.children);
		this._users = new Relation("users", [User.type], this, this.children);
=======
		super("coeditar", null, data, ["root"]);

		// Create the child nodes
		this._coeditar = new Number("coeditar", this);
		this._packages = new NodeSet("packages", this, Package);
		this._spaces = new NodeSet("spaces", this, Space);
		this._users = new NodeSet("users", this, User);
>>>>>>> a1bb1438a29eadf7da80cdc810cdac2dbd2d398a

		// Deserialize the initialization data
		if (data)
			this.deserialize(data);

		// Define the basic elements if not defined
		if (this._spaces.count == 0)
			new Space("DefaultSpace", this._spaces);
		if (this._users.count == 0)
			new User("DefaultUser", this._users);

		// Add this instance to the list (and show a message if it is the first)
		CoEditAR._instances.push(this);
		if (CoEditAR._instances.length == 1)
			console.log("CoEditAR " + CoEditAR.frameworkVersion + " Initialized");
	}


	// ------------------------------------------------ STATIC PUBLIC ACCESSORS

	/** The name of the CoEditAR Framework. */
	static get frameworkName() { return "CoEditAR"; }

	/** The version number of the CoEditAR Framework. */
	static get frameworkVersion() { return 0.1; }

	/** The global list of CoEditAR instances. */
	static get instances() { return CoEditAR._instances; }

	/** Indicates whether the framework has already been initialized or not. */
	static get initialized() { return CoEditAR._instances.length > 0; }


	// -------------------------------------------------- STATIC PUBLIC METHODS

	/** Initializes the CoEditAR Framework.
	 * @param data The initialization data (or a URL to the data file). */
	static init(data) {

		// TODO If it is already initialize, clean the previous data
		//if (!CoEditAR.initialized)

		// Create a new CoEditAR instance
		return new CoEditAR(data);
	}


	// ------------------------------------------------------ PUBLIC PROPERTIES

	/** The version number of CoEditAR system. */
	get coeditar() { return this._coeditar; }

<<<<<<< HEAD
	// /** The packages of the CoEditAR system. */
	// get packages(): Relation<Package> { return this._packages; }
=======
	/** The packages of the CoEditAR system. */
	get packages() { return this._packages; }
>>>>>>> a1bb1438a29eadf7da80cdc810cdac2dbd2d398a

	/** The interaction spaces in the CoEditAR system. */
	get spaces() { return this._spaces; }

	/** The users of the CoEditAR system. */
	get users() { return this._users; }
}

// -------------------------------------------------- STATIC PRIVATE FIELDS

/** The global list of CoEditAR App instances. */
CoEditAR._instances = [];

// --------------------------------------------------- STATIC PUBLIC FIELDS

<<<<<<< HEAD
// --------------------------------------------------- STATIC PUBLIC FIELDS

=======
>>>>>>> a1bb1438a29eadf7da80cdc810cdac2dbd2d398a
/** The global list of CoEditAR App instances. */
CoEditAR.autoInitialize = true;


// Unless otherwise specified, automatically initialize the CoEditAR framework
// to make it easier for people to operate with it
if (CoEditAR.autoInitialize)
	window.addEventListener("load", () => { if (!CoEditAR.initialized)
		CoEditAR.init(); });
