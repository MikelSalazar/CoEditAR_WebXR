import * as THREE from "three";
import { Resource } from "../Resource";

/** Defines a Audio Resource. */
export class AudioResource extends Resource {

	// --------------------------------------------------------- PRIVATE FIELDS

	/** The representation of the Font. */
	private _representation: THREE.Audio;


	// ------------------------------------------------------- PUBLIC ACCESSORS

	/** The representation of the Font. */
	get representation(): THREE.Audio { return this._representation; }


	// --------------------------------------------------------- PUBLIC METHODS

	// /** */
	// static load(url): Font {
	// 	let loader = new THREE.FontLoader();
	// 	loader.parse(defaultFontData);
	// 	// loader.load()
	// }

	// static parse(data): Font{
	// 	let loader = new THREE.FontLoader();
	// 	loader.parse(defaultFontData);
	// 	// loader.load()
	// }
}