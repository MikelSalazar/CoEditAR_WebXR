import * as THREE from "../../externals/three.module.js";

/** Defines a Viewport. */
export class Viewport {

	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new View instance.
	 * @param canvas The canvas of the viewport.
	 * @param updateFunction The update function. */
	constructor(canvas, updateFunction) {

		this._canvas = canvas;

		// Create the renderer
		this._renderer = new THREE.WebGLRenderer({ canvas: this._canvas });
		this._renderer.xr.enabled = true;
		this._renderer.setAnimationLoop(updateFunction);
	}


	// ------------------------------------------------------- PUBLIC ACCESSORS

	/** The main element of the view. */
	get element() { return this._element; }

	/** The canvas element of the view. */
	get canvas() { return this._canvas; }

	/** The renderer of the view. */
	get renderer() { return this._renderer; }

	/** Resizes the viewport.
	 * @param width The width of the viewport.
	 * @param height The height of the viewport. */
	resize(width, height) {
		this._renderer.setSize(width, height);
	}

	/** Renders the viewport.
	 * @param presence The user presence. */
	render(presence) {

		// Clear the renderer
		this._renderer.setClearColor(0xff0000);
		this._renderer.clear();


		this._renderer.render(presence.space.entity.representation, presence.entity.representation);

	}
}
