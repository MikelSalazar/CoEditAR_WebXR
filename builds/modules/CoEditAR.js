import { Assembly } from "./data/model/Assembly.js";
import { Node } from "./data/Node.js";
import { NodeSet } from "./data/NodeSet.js";
import { ResourceGroup } from "./data/resources/ResourceGroup.js";
import { Space } from "./user/interaction/Space.js";
import { View } from "./user/interaction/View.js";

/** Manages the CoEditAR Framework (and facilitates the creation of web
 * apps on top of it). */
export class CoEditAR {


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new CoEditAR instance.
	  * @param data The initialization data (or a URL to the data file). */
	constructor(data) {

		// Create the root node and its child nodes
		let root = this._root = new Node(["coeditar"], "root", null);
		this._resources = new NodeSet("resources", root, ResourceGroup);
		this._assemblies = new NodeSet("assemblies", root, Assembly);
		this._spaces = new NodeSet("spaces", root, Space);
		this._views = new NodeSet("views", root, View);

		// Load the data
		if (data) {

			// TODO 
			//if (typeof(data) == "string") { }

			// Load the data
			this.load(data);
		}


		// If there is no view defined, create one with something to see
		if (this._views.count == 0) {
			new View("CoEditAR", this._views);
		}

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

	/** The resources of the CoEditAR instance. */
	get resources() { return this._resources; }

	/** The spaces of the CoEditAR instance. */
	get spaces() { return this._spaces; }

	/** The views of the CoEditAR instance. */
	get views() { return this._views; }


	// --------------------------------------------------------- PUBLIC METHODS

	/** Deserializes the data properly.
	 * @param data The JSON data to deserialize. */
	load(data) {

		// Verify that the data is for the current version of the framework
		let version = data[CoEditAR.frameworkName];
		if (!version || typeof (version) != "number")
			throw Error("No version number specified");
		if (version < CoEditAR.frameworkVersion)
			throw Error("Invalid version number");

		// Create the NodeSets
		this._resources.deserialize(data["resources"]);
		this._assemblies.deserialize(data["assemblies"]);
		this._views.deserialize(data["views"]);
	}
}

// -------------------------------------------------- STATIC PRIVATE FIELDS

/** The global list of CoEditAR App instances. */
CoEditAR._instances = [];


// If the document has been loaded but the framework is not initialized
window.addEventListener("load", () => { if (!CoEditAR.initialized)
	CoEditAR.init(); });
