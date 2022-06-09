import { Node } from "../Node.js";
import { NodeSet } from "../NodeSet.js";
import { AudioResource } from "./AudioResource.js";
import { ModelResource } from "./ModelResource.js";

/** Provides a way to group resources. */
export class ResourceGroup extends Node {


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new ResourceManager instance.
	 * @param name The name of the interaction space. */
	constructor(name) {

		// Call the parent class constructor
		super(name);

		// Create the node sets
		this._models = new NodeSet("models", this, ModelResource);
		// this._fonts = new NodeSet<FontResource>("fonts", this, FontResource);
		this._audios = new NodeSet("audios", this, AudioResource);
	}


	// ------------------------------------------------------- PUBLIC ACCESSORS

	/** The model resources. */
	get models() { return this._models; }

	/** The font resources. */
	// get fonts (): NodeSet<FontResource> { return this._fonts; }

	/** The audio resources. */
	get audios() { return this._audios; }
}
