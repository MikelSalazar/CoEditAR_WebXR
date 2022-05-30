import * as THREE from "three";
import { Node } from "../../data/Node";
import { Number } from "../../data/types/simple/Number";
import { String } from "../../data/types/simple/String";
import { Layer } from "./Layer";
import { NodeSet } from "../../data/NodeSet";

/** Defines a User Interaction View. */
export class View extends Node {

	// --------------------------------------------------------- PRIVATE FIELDS

	/** The main element of the View. */
	private _element: HTMLElement;

	/** The canvas element of the View. */
	private _canvas: HTMLCanvasElement;

	/** The renderer of the View. */
	private _renderer: THREE.WebGLRenderer;

	/** The state of the View. */
	private _state: String;

	/** The width of the View. */
	private _width: Number;

	/** The height of the View. */
	private _height: Number;

	/** The layers of the View. */
	private _layers: NodeSet<Layer>; 

	/** The time between updates. */
	private _deltaTime: number = 0;

	/** The last update time. */
	private _lastTime: number = 0;

	/** The Frames Per Second counter. */
	private _fpsCounter: number = 0;

	/** The Frames Per Second timer. */
	private _fpsTimer: number = 0;

	/** The current Frames Per Second value. */
	private _fpsValue: number = 0;

	/** The list of Frames Per Second values. */
	private _fpsValues: number[] = [];

	/** The maximum size of the array of Frames Per Second values. */
	private _fpsValuesMaxSize: number = 100;

	// ------------------------------------------------------- PUBLIC ACCESSORS

	/** The main element of the view. */
	get element(): HTMLElement { return this._element; }

	/** The canvas element of the view. */
	get canvas(): HTMLCanvasElement { return this._canvas; }

	/** The renderer of the view. */
	get renderer(): THREE.WebGLRenderer { return this._renderer; }

	/** The state of the view. */
	get state(): String { return this._state; }

	/** The width of the view. */
	get width(): Number { return this._width; }

	/** The height of the view. */
	get height(): Number { return this._height; }

	/** The layers of the view. */
	get layers(): NodeSet<Layer> { return this._layers; }

	/** The current Frames Per Second value. */
	get fpsValue(): number { return this._fpsValue; }

	/** The list of Frames Per Second values. */
	get fpsValues(): number[] { return this._fpsValues; }


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new View instance.
	 * @param name The name of the View.
	 * @param parent The parent Node of the View.
	 * @param data The initialization data. */
	constructor(name: string, parent: Node, data?: any) {

		// Call the parent class constructor
		super(["view"], name, parent, data);

		// Create the sub nodes
		this._width = new Number("width", this, { default: 100, min: 0 });
		this._height = new Number("height", this, { default: 100, min: 0 });
		this._state = new String("state", this, { default: "Normal", 
			validValues: "Normal, Fullscreen, VR, AR" });
		this._layers = new NodeSet<Layer>("layers", this, Layer);

		// Deserialize the initialization data
		if (data) this.deserialize(data);

		// Create the viewport WebGL renderer
		this._element = View.createDomElement("div", this.nodeName + "View", 
			null, 'CoEditAR-View');
		this._canvas = View.createDomElement("canvas", this.nodeName + "Canvas", 
			this._element, 'CoEditAR-Canvas', 'width:100%; height:100%;'
			) as HTMLCanvasElement;

		// Create the renderer
		this._renderer = new THREE.WebGLRenderer( { canvas:this._canvas} );
		this._renderer.xr.enabled = true;
		this._renderer.setAnimationLoop(this.update.bind(this));
		
		// Create the debug panel
		// this._debugPanel = new DebugPanel(this);

		// Set a connection to the resize event
		window.onresize = (e)=> { this.resize(); }

		// Update the viewport
		this.resize();
	}


	// --------------------------------------------------------- PUBLIC METHODS

	/** Updates the Viewport.
	 * @param time The time (in milliseconds) since the last call. */
	update(time: number = 0) {

		// Update the delta time and Frames Per Second counter
		time /= 1000; // Convert the time to seconds
		this._deltaTime = time - this._lastTime; this._lastTime = time;
		this._fpsTimer += this._deltaTime; this._fpsCounter++; 
		if(this._fpsTimer >= 1) { 
			this._fpsValue = this._fpsCounter;
			console.log("FPS: " + this._fpsValue);
			if (this._fpsValues.length >= this._fpsValuesMaxSize)
				this._fpsValues.shift();
			this._fpsValues.push(this._fpsValue);
			this._fpsTimer %= 1; this._fpsCounter = 0; 
		}

		// Clear the renderer
		this._renderer.setClearColor(0xff0000);
		this._renderer.clear();

		// Update the interaction layers and render it
		for (let layer of this._layers) {
			// layer.update(true);
			// let camera = layer.presences.getIndex(0).camera;
			// camera.aspectRatio = this.width / this.height;
			// camera.update(true, this._deltaTime);
			// this._renderer.render(layer.entity.representation, 
			// 	layer.presences.getIndex(0).camera.representation as THREE.Camera);
		}
	}


	/** Resizes the viewport. */
	resize() {
		switch (this._state.value) {
			case "Normal":
				this._element.style.width = "100%";
				this._element.style.height = "100%";
				this._width.value = this._element.clientWidth;
				this._height.value = this._element.clientHeight;
		 		break;
		}
		
		// Set the size of the renderer
		this.renderer.setSize(this._width.value, this._height.value);

		// Update the camera properties of the associated presences
		for (let layer of this._layers) {
			// for (let presence of space.presences) {
			// 	if (presence.viewport != this) continue;
			// 	presence.camera.aspectRatio = this.width / this.height;
			// 	presence.camera.update(true);
			// }
		}
	}


	/** Creates a DOM element
	 * @param type The type of the element (its tag name)
	 * @param id The id of the element.
	 * @param parent The parent of the element.
	 * @param classes The classes of the element.
	 * @param style The style of the element.
	 * @param content The HTML content of the element.
	 * @returns The generated element. */
	static createDomElement(type: string, id?: string, parent?: HTMLElement, 
		classes?: string, style?: string, content?: string): HTMLElement {

		// Create the element
		let element = document.createElement(type);

		// Set the properties of the element
		if (id) element.id = id;
		if (classes) element.className = classes;
		if (style) element.style.cssText = style;
		if (content) element.innerHTML = content;

		// Set the parent of element
		((parent) ? parent : document.body).appendChild(element);

		// Return the generated element
		return element;
	}


	/** Creates a CSS rule.
	 * @param selector The CSS selector
	 * @param rule The css rule
	 * @param override Indicates whether to override rules or not. */
	static addCssRule(selector, rule, override = false) {
			
		// If there is no stylesheet, create it
		if (document.styleSheets.length == 0)
			document.head.append(document.createElement('style'));
		let stylesheet = document.styleSheets[0];
		
		// Check if the rule exists
		let rules = stylesheet.cssRules, ruleIndex, ruleCount = rules.length
		for(ruleIndex = 0; ruleIndex < ruleCount; ruleIndex++) {
			if (rules[ruleIndex].cssText.startsWith(selector)) {
				if (override) rules[ruleIndex].cssText = selector + " " + rule;
				else return;
			}
		}
		
		// If no rule was fond, create i and add it at the end
		stylesheet.insertRule(selector + " " + rule, ruleCount);
	}
}