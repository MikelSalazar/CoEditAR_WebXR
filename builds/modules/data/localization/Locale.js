var _a;

/** Defines a simple way to store localization data. */
export class Locale {


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new instance of the Locale class.
	 * @param id The id of the locale.
	 * @param data The initialization data */
	constructor(id, data = {}) {

		/** The list of strings for this Locale. */
		this._strings = {};

		// Save the given values
		this._id = id;
		this._name = (id ? data.name : "default") || null;

		// Add this instance to the global list
		if (Locale._instances[id])
			throw Error('Repeated Locale ID: "' + id + '"');
		Locale._instances[id] = this;

		// Initialize the lists of strings
		this._strings = {};
	}


	// ------------------------------------------------------  PUBLIC ACCESSORS

	/** The global list of Locale instances. */
	static get instances() { return Locale._instances; }

	/** The default Locale instance. */
	static get default() { return Locale._default; }

	/** The current Locale instance. */
	static get current() { return Locale._current; }
	static set current(locale) {
		if (!locale)
			locale = this._default;
		else if (typeof locale == 'string') {
			let id = locale;
			locale = this.instances[id];
			if (!locale)
				throw Error('Invalid Locale Id: "' + id + '"');
		}
		Locale._current = locale;
	}

	/** The id of the Locale (recommended to use ISO 639-1 codes). */
	get id() { return this._id; }

	/** The name of the Locale. */
	get name() { return this._name; }

	/** The list of strings for the Locale. */
	get strings() { return this._strings; }
}
_a = Locale;

// --------------------------------------------------------- PRIVATE FIELDS

/** The global list of Locale instances. */
Locale._instances = {};

/** The default Locale instance. */
Locale._default = new Locale(null);

/** The current Locale instance. */
Locale._current = _a._default;
