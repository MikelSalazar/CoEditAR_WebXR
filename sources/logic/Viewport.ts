import * as THREE from "three";
import { Presence } from "../user/interaction/Presence";

/** Defines a Viewport. */
export class Viewport {

	// --------------------------------------------------------- PRIVATE FIELDS

	/** The main element of the viewport. */
	private _element: HTMLElement;

	/** The canvas element of the viewport. */
	private _canvas: HTMLCanvasElement;

	/** The renderer of the viewport. */
	private _renderer: THREE.WebGLRenderer;


	// ------------------------------------------------------- PUBLIC ACCESSORS

	/** The main element of the viewport. */
	get element(): HTMLElement { return this._element; }

	/** The canvas element of the viewport. */
	get canvas(): HTMLCanvasElement { return this._canvas; }

	/** The renderer of the viewport. */
	get renderer(): THREE.WebGLRenderer { return this._renderer; }

		// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new Viewport instance.
	 * @param canvas The canvas of the viewport. 
	 * @param updateFunction The function called upon viewport update. */
	constructor(canvas: HTMLCanvasElement, updateFunction: any) {

		// Save the canvas reference
		this._canvas = canvas; 

		// Create the renderer
		this._renderer = new THREE.WebGLRenderer( { canvas:this._canvas} );
		this._renderer.xr.enabled = true;
		this._renderer.setAnimationLoop(updateFunction);
	}

	
	/** Resizes the viewport.
	 * @param width The width of the viewport.
	 * @param height The height of the viewport. */
	resize(width: number, height: number) {
		this._renderer.setSize(width, height);
	}


	/** Renders the a user presence in an interaction space.
	 * @param presence The user presence. */
	render(presence: Presence) {

		// Clear the renderer
		this._renderer.setClearColor(0xff0000);
		this._renderer.clear();

		
		this._renderer.render(presence.space.entity.representation,
			presence.entity.representation as THREE.PerspectiveCamera);

	}
} 