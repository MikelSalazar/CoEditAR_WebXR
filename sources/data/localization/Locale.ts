import { LocalizedString } from "./LocalizedString";

/** Defines a simple way to store localization data. */
export class Locale {

	// --------------------------------------------------------- PRIVATE FIELDS

	/** The global list of Locale instances. */
	private static _instances: Record<string, Locale> = {};

	/** The default Locale instance. */
	private static _default: Locale = new Locale(null);

	/** The current Locale instance. */
	private static _current: Locale = this._default;

	/** The id of the Locale (recommended to use ISO 639-1 codes). */
	private _id: string;

	/** The name of the Locale. */
	private _name: string;

	/** The list of strings for this Locale. */
	private _strings: Record<string, LocalizedString> = {};


	// ------------------------------------------------------  PUBLIC ACCESSORS

	/** The global list of Locale instances. */
	static get instances(): Record<string, Locale> { return Locale._instances; }

	/** The default Locale instance. */
	static get default(): Locale { return Locale._default; }

	/** The current Locale instance. */
	static get current(): Locale { return Locale._current; }
	static set current(locale: Locale | string | undefined) {
		if (!locale) locale = this._default;
		else if (typeof locale == 'string') {
			let id = locale; locale = this.instances[id];
			if (!locale) throw Error ('Invalid Locale Id: "'+ id + '"');
		}
		Locale._current = locale;
	}

	/** The id of the Locale (recommended to use ISO 639-1 codes). */
	get id(): string { return this._id; }

	/** The name of the Locale. */
	get name(): string { return this._name; }

	/** The list of strings for the Locale. */
	get strings(): Record<string, LocalizedString> { return this._strings; }


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new instance of the Locale class.
	 * @param id The id of the locale.
	 * @param data The initialization data */
	constructor(id: string, data: any = {}) {

		// Save the given values
		this._id = id;
		this._name = (id? data.name : "default") || null;

		// Add this instance to the global list
		if (Locale._instances[id]) throw Error('Repeated Locale ID: "'+id+'"');
		Locale._instances[id] = this;

		// Initialize the lists of strings
		this._strings = {};
	}
}