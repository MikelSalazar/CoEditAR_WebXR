import { Entity } from "../Entity.js";
import { Number } from "../../data/types/simple/Number.js";

/** Defines a Camera entity. */
export class CameraEntity extends Entity {


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new CameraEntity instance.
	 * @param name The name of the entity.
	 * @param data The initialization data. */
	constructor(name, parent = null, params = {}) {

		// Call the base class constructor
		super(["camera"], name, parent),

			this._fieldOfView = new Number("fov", this, { defaultValue: 45 });
		this._aspectRatio = new Number("aspect", this, { defaultValue: 1 });
		this._nearPlane = new Number("near", this, { defaultValue: 0.001 });
		this._farPlane = new Number("far", this, { defaultValue: 1000 });
		// this._representation = new THREE.PerspectiveCamera(
		// 	this._fieldOfView, this._aspectRatio,
		// 	this._nearPlane, this._farPlane);

		// this.representation.position.z=3;
	}


	// ------------------------------------------------------- PUBLIC ACCESSORS

	/** The field of view of the Camera. */
	get fieldOfView() { return this._fieldOfView; }

	/** The aspect ratio of the Camera. */
	get aspectRatio() { return this._aspectRatio; }

	/** The near plane of the Camera frustum. */
	get nearPlane() { return this._nearPlane; }

	/** The far plane of the Camera frustum. */
	get farPlane() { return this._farPlane; }


	/** Updates the Entity.
	 * @param deltaTime The update time.
	 * @param forced Indicates whether the update is forced or not. */
	update(deltaTime = 0, forced = false) {

		// If the update is not forced, skip it when the node is already updated
		if (this.nodeUpdated && !forced)
			return;

		// // Update the position, rotation and scale of the representation
		// if()

		// this.representation


		// Call the base class function
		super.update(deltaTime, forced);
	}
}
