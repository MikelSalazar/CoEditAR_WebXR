import * as THREE from "../../../externals/three.module.js";
import { Node } from "../../data/Node.js";
import { Number } from "../../data/types/simple/Number.js";
import { String } from "../../data/types/simple/String.js";
import { Layer } from "./Layer.js";
import { NodeSet } from "../../data/NodeSet.js";

/** Defines a User Interaction View. */
export class View extends Node {


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new View instance.
	 * @param name The name of the View.
	 * @param parent The parent Node of the View.
	 * @param data The initialization data. */
	constructor(name, parent, data) {

		// Call the parent class constructor
		super(["view"], name, parent, data);

		/** The time between updates. */
		this._deltaTime = 0;

		/** The last update time. */
		this._lastTime = 0;

		/** The Frames Per Second counter. */
		this._fpsCounter = 0;

		/** The Frames Per Second timer. */
		this._fpsTimer = 0;

		/** The current Frames Per Second value. */
		this._fpsValue = 0;

		/** The list of Frames Per Second values. */
		this._fpsValues = [];

		/** The maximum size of the array of Frames Per Second values. */
		this._fpsValuesMaxSize = 100;

		// Create the sub nodes
		this._width = new Number("width", this, { default: 100, min: 0 });
		this._height = new Number("height", this, { default: 100, min: 0 });
		this._state = new String("state", this, { default: "Normal",
			validValues: "Normal, Maximized, Fullscreen, VR, AR" });
		this._layers = new NodeSet("layers", this, Layer);

		// Deserialize the initialization data
		if (data)
			this.deserialize(data);

		// Create the viewport WebGL renderer
		this._element = View.createDomElement("div", this.nodeName + "View", null, 'CoEditAR-View');
		this._canvas = View.createDomElement("canvas", this.nodeName + "Canvas", this._element, 'CoEditAR-Canvas', 'width:100%; height:100%;');

		// Create the renderer
		this._renderer = new THREE.WebGLRenderer({ canvas: this._canvas });
		this._renderer.xr.enabled = true;
		this._renderer.setAnimationLoop(this.update.bind(this));

		// Create a debug scene
		this._space = new THREE.Scene();
		this._presence = new THREE.PerspectiveCamera(60);
		this._entity = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshPhongMaterial());
		this._space.add(new THREE.PointLight());
		this._entity.position.set(0, 0, -3);
		this._space.add(this._entity);



		// Set a connection to the resize event
		window.onresize = (e) => { this.resize(); };
		this._state.onModified.listen(() => { this.resize(); });

		// TEMPORAL
		this._element.addEventListener("dblclick", () => {
			// ifthis.state
			this._state.value = "Fullscreen";
		});

		// Update the viewport
		this._state.value = "Maximized";
	}

	// ------------------------------------------------------- PUBLIC ACCESSORS

	/** The main element of the view. */
	get element() { return this._element; }

	/** The canvas element of the view. */
	get canvas() { return this._canvas; }

	/** The renderer of the view. */
	get renderer() { return this._renderer; }

	/** The state of the view. */
	get state() { return this._state; }

	/** The width of the view. */
	get width() { return this._width; }

	/** The height of the view. */
	get height() { return this._height; }

	/** The layers of the view. */
	get layers() { return this._layers; }

	/** The current Frames Per Second value. */
	get fpsValue() { return this._fpsValue; }

	/** The list of Frames Per Second values. */
	get fpsValues() { return this._fpsValues; }


	// --------------------------------------------------------- PUBLIC METHODS

	/** Updates the Viewport.
	 * @param time The time (in milliseconds) since the last call. */
	update(time = 0) {

		// Update the delta time and Frames Per Second counter
		time /= 1000; // Convert the time to seconds
		this._deltaTime = time - this._lastTime;
		this._lastTime = time;
		this._fpsTimer += this._deltaTime;
		this._fpsCounter++;
		if (this._fpsTimer >= 1) {
			this._fpsValue = this._fpsCounter;
			console.log("FPS: " + this._fpsValue);
			if (this._fpsValues.length >= this._fpsValuesMaxSize)
				this._fpsValues.shift();
			this._fpsValues.push(this._fpsValue);
			this._fpsTimer %= 1;
			this._fpsCounter = 0;
		}

		// Clear the renderer
		this._renderer.setClearColor(0xff0000);
		this._renderer.clear();

		// Draw the debug scene
		this._entity.rotateX(this._deltaTime);
		this._entity.rotateY(this._deltaTime);
		this._renderer.render(this._space, this._presence);


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

		//
		if (this._state.value !== "Fullscreen" && document.fullscreenElement) {
			document.exitFullscreen();
		}


		switch (this._state.value) {
			case "Normal":
				this._element.style.position = "initial";
				this._width.value = this._element.clientWidth;
				this._height.value = this._element.clientHeight;
				break;
			case "Maximized":
				this._element.style.position = "fixed";
				this._element.style.top = "0";
				this._element.style.left = "0";
				this._element.style.width = "100vw";
				this._element.style.height = "100vh";
				this._width.value = this._element.clientWidth;
				this._height.value = this._element.clientHeight;
				break;
			case "Fullscreen":
				// debugger
				if (!document.fullscreenElement)
					this._element.requestFullscreen();
				this._element.style.width = "100vw";
				this._element.style.height = "100vh";
				this._width.value = this._element.clientWidth;
				this._height.value = this._element.clientHeight;
				break;
		}

		// Set the size of the renderer
		this.renderer.setSize(this._width.value, this._height.value);

		//TEMPORAL
		this._presence.aspect = this._width.value / this._height.value;

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
	static createDomElement(type, id, parent, classes, style, content) {

		// Create the element
		let element = document.createElement(type);

		// Set the properties of the element
		if (id)
			element.id = id;
		if (classes)
			element.className = classes;
		if (style)
			element.style.cssText = style;
		if (content)
			element.innerHTML = content;

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
		let rules = stylesheet.cssRules, ruleIndex, ruleCount = rules.length;
		for (ruleIndex = 0; ruleIndex < ruleCount; ruleIndex++) {
			if (rules[ruleIndex].cssText.startsWith(selector)) {
				if (override)
					rules[ruleIndex].cssText = selector + " " + rule;
				else
					return;
			}
		}

		// If no rule was fond, create i and add it at the end
		stylesheet.insertRule(selector + " " + rule, ruleCount);
	}
}
