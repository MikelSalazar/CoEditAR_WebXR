import * as THREE from "three"
import { Entity } from "../Entity";
import { Number } from "../../data/types/simple/Number";

/** Defines a Camera entity. */
export class CameraEntity extends Entity {

	// --------------------------------------------------------- PRIVATE FIELDS

	/** The field of view of the Camera. */
	private _fieldOfView : Number;

	/** The aspect ratio of the Camera. */
	private _aspectRatio : Number;

	/** The near plane of the Camera frustum. */
	private _nearPlane: Number;

	/** The far plane of the Camera frustum. */
	private _farPlane : Number;


	// ------------------------------------------------------- PUBLIC ACCESSORS

	/** The field of view of the Camera. */
	get fieldOfView(): Number { return this._fieldOfView; }

	/** The aspect ratio of the Camera. */
	get aspectRatio(): Number { return this._aspectRatio; }

	/** The near plane of the Camera frustum. */
	get nearPlane(): Number { return this._nearPlane; }

	/** The far plane of the Camera frustum. */
	get farPlane(): Number { return this._farPlane; }

	
	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new CameraEntity instance.
	 * @param name The name of the entity. 
	 * @param data The initialization data. */
	 constructor (name: string, parent: Entity = null, params: any = {}){

		// Call the base class constructor
		super(["camera"], name, parent),

		this._fieldOfView = new Number("fov", this, {defaultValue: 45});
		this._aspectRatio = new Number("aspect", this, {defaultValue: 1});
		this._nearPlane = new Number("near", this, {defaultValue: 0.001});
		this._farPlane = new Number("far", this, {defaultValue: 1000});
		// this._representation = new THREE.PerspectiveCamera(
		// 	this._fieldOfView, this._aspectRatio,
		// 	this._nearPlane, this._farPlane);

		// this.representation.position.z=3;
	}


	/** Updates the Entity.
	 * @param deltaTime The update time. 
 	 * @param forced Indicates whether the update is forced or not. */
	 update(deltaTime: number = 0, forced: boolean = false) {

		// If the update is not forced, skip it when the node is already updated
		if (this.nodeUpdated && !forced) return;

		// // Update the position, rotation and scale of the representation
		// if()

		// this.representation


		// Call the base class function
		super.update(deltaTime, forced);
	}
}