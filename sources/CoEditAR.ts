
import { Node } from "./data/Node";
import { NodeSet } from "./data/NodeSet";
import { ResourceGroup } from "./data/resources/ResourceGroup";

/** Manages the CoEditAR Framework (and facilitates the creation of web 
 * apps on top of it). */
export class CoEditAR extends Node {

	// -------------------------------------------------- STATIC PRIVATE FIELDS

	/** The global list of CoEditAR App instances. */
	private static _instances: CoEditAR[] = [];


	// ------------------------------------------------ STATIC PUBLIC ACCESSORS

	/** The name of the CoEditAR Framework. */
	static get frameworkName(): string { return "CoEditAR"; }

	/** The version number of the CoEditAR Framework. */
	static get frameworkVersion(): string { return "0.1"; }

	/** The global list of CoEditAR instances. */
	static get instances(): CoEditAR[] { return CoEditAR._instances; }


	// -------------------------------------------------- STATIC PUBLIC METHODS

	/** Initializes the CoEditAR Framework.
	 * @param data The initialization data. */
	 static init(data: any = {}) { 

		// If no name is defined, use the app name
		if(!data.name) data.name = CoEditAR.frameworkName ;

		// Create a new CoEditAR instance
		let instance: CoEditAR = new CoEditAR(data.name, data);
		CoEditAR._instances.push(instance);

		// Show a message on console
		console.log(CoEditAR.frameworkName + " " + 
			CoEditAR.frameworkVersion + " Initialized");

		// Return the created CoEditAR instance
		return instance;
	}


	// --------------------------------------------------------- PRIVATE FIELDS

	/** The resources of the App. */
	private _resources: NodeSet<ResourceGroup>;

	// /** The interaction Spaces of the App. */
	// private _spaces: NodeSet<Space>;

	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new CoEditAR instance.
	 * @param name The name of the CoEditAR instance.
	 * @param data The initialization data. */
	 constructor(name?: string, data?: any) {

		// Call the parent class constructor
		super(["coeditar"], name, null, data);

		// Initialize the child nodes
		this._resources = new NodeSet<ResourceGroup>("resources", this, ResourceGroup);
		// this._spaces = new NodeSet<Space>("spaces", this, Space);

		// Deserialize the initialization data
		if (data != undefined) this.deserialize(data);
	}
}


// If the document has been loaded but the loaded
window.addEventListener("load", () => { CoEditAR.init(); }) 