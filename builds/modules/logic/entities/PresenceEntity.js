import * as THREE from "../../../externals/three.module.js";
import { Entity } from "../Entity.js";
import { Number } from "../../data/types/simple/Number.js";

/** Defines a user Presence entity. */
export class PresenceEntity extends Entity {


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new CameraEntity instance.
	 * @param name The name of the data type.
	 * @param relation The data relation.
	 * @param data The initialization data. */
	constructor(name, relation, data) {

		// Call the parent class constructor
		super(name, relation);

		// Create the 
		this._fieldOfView = new Number("fov", this.children, { defaultValue: 45 });
		this._aspectRatio = new Number("aspect", this.children, { defaultValue: 1 });
		this._nearPlane = new Number("near", this.children, { defaultValue: 0.001 });
		this._farPlane = new Number("far", this.children, { defaultValue: 1000 });

		// Deserialize the initialization data
		if (data)
			this.deserialize(data);

		// Create the representation of the camera
		this._representation = new THREE.PerspectiveCamera(this._fieldOfView.value, this._aspectRatio.value, this._nearPlane.value, this._farPlane.value);

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
		if (this.updated && !forced)
			return;

		// Use a typed variable
		let camera = this._representation;

		// Update the properties of the entity
		if (!this._position.updated) {
			camera.position.set(this._position.x.value, this._position.y.value, this._position.z.value);
		}
		if (!this._rotation.updated) {
			camera.rotation.set(this._rotation.x.value, this._rotation.y.value, this._rotation.z.value);
		}
		if (!this._fieldOfView.updated) {
			camera.fov = this._fieldOfView.value;
			camera.updateProjectionMatrix();
		}
		if (!this._aspectRatio.updated) {
			camera.aspect = this._aspectRatio.value;
			camera.updateProjectionMatrix();
		}
		if (!this._nearPlane.updated) {
			camera.near = this._nearPlane.value;
			camera.updateProjectionMatrix();
		}
		if (!this._farPlane.updated) {
			camera.far = this._farPlane.value;
			camera.updateProjectionMatrix();
		}

		// Call the base class function
		super.update(deltaTime, forced);
	}
}
