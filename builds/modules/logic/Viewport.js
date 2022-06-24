import * as THREE from "../../externals/three.module.js";

/** Defines a Viewport. */
export class Viewport {

	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new Viewport instance.
	 * @param canvas The canvas of the viewport.
	 * @param updateFunction The function called upon viewport update. */
	constructor(canvas, updateFunction) {

		// Save the canvas reference
		this._canvas = canvas;

		// Create the renderer
		this._renderer = new THREE.WebGLRenderer({ canvas: this._canvas });
		this._renderer.xr.enabled = true;
		this._renderer.setAnimationLoop(updateFunction);
	}


	// ------------------------------------------------------- PUBLIC ACCESSORS

	/** The main element of the viewport. */
	get element() { return this._element; }

	/** The canvas element of the viewport. */
	get canvas() { return this._canvas; }

	/** The renderer of the viewport. */
	get renderer() { return this._renderer; }


	/** Resizes the viewport.
	 * @param width The width of the viewport.
	 * @param height The height of the viewport. */
	resize(width, height) {
		this._renderer.setSize(width, height);
	}


	/** Renders the a user presence in an interaction space.
	 * @param presence The user presence. */
	render(presence) {

		// Clear the renderer
		this._renderer.setClearColor(0xff0000);
		this._renderer.clear();


		this._renderer.render(presence.space.entity.representation, presence.entity.representation);

	}
}
