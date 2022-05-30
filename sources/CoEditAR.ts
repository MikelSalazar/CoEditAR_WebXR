import { Assembly } from "./data/model/Assembly";
import { Node } from "./data/Node";
import { NodeSet } from "./data/NodeSet";
import { ResourceGroup } from "./data/resources/ResourceGroup";
import { Entity } from "./logic/Entity";
import { Space } from "./user/interaction/Space";
import { View } from "./user/interaction/View";

/** Manages the CoEditAR Framework (and facilitates the creation of web 
 * apps on top of it). */
export class CoEditAR {

	// -------------------------------------------------- STATIC PRIVATE FIELDS

	/** The global list of CoEditAR App instances. */
	private static _instances: CoEditAR[] = [];

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

	/** The title of the CoEditAR instance. */
	private _title: string;

	/** The root node of the CoEditAR instance. */
	private _root: Node;

	/** The resources of the CoEditAR instance. */
	private _resources: NodeSet<ResourceGroup>;

	/** The assemblies of the CoEditAR instance. */
	private _assemblies: NodeSet<Assembly>;

	/** The entities of the CoEditAR instance. */
	private _entities: NodeSet<Entity>;

	/** The spaces of the CoEditAR instance. */
	private _spaces: NodeSet<Space>;

	/** The views of the CoEditAR instance. */
	private _views: NodeSet<View>;

	
	// ------------------------------------------------------ PUBLIC PROPERTIES

	/** The resources of the CoEditAR instance. */
	get resources (): NodeSet<ResourceGroup> { return this._resources; }

	/** The spaces of the CoEditAR instance. */
	get spaces (): NodeSet<Space> { return this._spaces; }

	/** The views of the CoEditAR instance. */
	get views (): NodeSet<View> { return this._views; }


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new CoEditAR instance.
	  * @param data The initialization data (or a URL to the data file). */
	constructor(data?: object | URL) {

		// Create the root node and its child nodes
		let root = this._root = new Node(["coeditar"], "root", null);
		this._resources = new NodeSet<ResourceGroup>("resources", root, 
			ResourceGroup); 
		this._assemblies = new NodeSet<Assembly>("assemblies", root, Assembly); 
		this._spaces = new NodeSet<Space>("spaces", root, Space);
		this._views = new NodeSet<View>("views", root, View);

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
		if (CoEditAR._instances.length == 1) console.log(
			"CoEditAR " + CoEditAR.frameworkVersion + " Initialized");
	}


	// --------------------------------------------------------- PUBLIC METHODS

	/** Deserializes the data properly.
	 * @param data The JSON data to deserialize. */
	load(data: object) {

		// Verify that the data is for the current version of the framework
		let version = data[CoEditAR.frameworkName];
		if (!version || typeof(version) != "number") 
			throw Error("No version number specified");
		if (version < CoEditAR.frameworkVersion) 
			throw Error("Invalid version number");

		// Create the NodeSets
		this._resources.deserialize(data["resources"]);
		this._assemblies.deserialize(data["assemblies"]);
		this._views.deserialize(data["views"]);
	}
}


// If the document has been loaded but the framework is not initialized
window.addEventListener("load", () => 
	{ if(!CoEditAR.initialized) CoEditAR.init(); })