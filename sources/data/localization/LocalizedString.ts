import { Locale, Serializable, Serialization } from "../../CoEditAR";

/** Defines a localized string. */
export class LocalizedString implements Serializable
{

	// --------------------------------------------------------- PRIVATE FIELDS

	/** The name of the localized string. */
	readonly _name: string | undefined;

	/** The values of the localized string. */
	private _values: Record<string, string>;


	// ------------------------------------------------------- PUBLIC ACCESSORS

	/** Indicates whether the localized string has values or not. */
	get isNull(): boolean { return Object.keys(this._values).length == 0; }

	/** The name of the localized string. */
	get name(): string { return this._name; }

	/** The current value of localized string. */
	get value(): string { 
		let result = this._values[Locale.current.id];
		return (result != undefined)? result : '[' + this._name + ']';
	}
	set value(v: string) {
		this._values[Locale.current.id] = v;
	}

	/** The locale ids of the localized string. */
	get locales(): string[] { return Object.keys(this._values); }


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new instance of the LocalizedString class.
	 * @param name The name of the localized string.
	 * @param data The initialization data. */
	constructor(name?: string, data?: any) {

		// The name of the localized string (can be undefined)
		this._name = name;
		if (this._name && !Serialization.isName(this._name)) 
			throw Error('Invalid name "' + this._name +'" for LocalizedString');

		// Initialize the Record of values
		this._values = {};

		// Deserialize the given data
		if (data) this.deserialize(data);
	}


	/** Creates a copy of the LocalizedString instance.
	 * @returns The copy of the LocalizedString instance. */
	clone(name?: string): LocalizedString {
		return new LocalizedString(name || this._name, this._values);
	}


	/** Deserializes the instance from a JSON representation.
	 * @param data The JSON data to deserialize. */
	deserialize(data?: any) {
		if (!data) this._values = { null: "" };
		else if (typeof data == "string") this._values = { null: data };
		else if (typeof data == "object") 
			for (let localeId in data) this.setValue(localeId, data[localeId]);
		else throw Error ('Invalid value for LocalizeString "' + this._name +
			'": ' + JSON.stringify(data));
	}


	/** Serializes the instance to a JSON representation.
	* @param data Additional data to include in the serialized object.
	* @return The serialized JSON data. */
	serialize(data: any = {}): any {
		for (let localeId in this._values) 
			data[localeId] = this._values[localeId];
		return data;
	}


	/** Sets the value of the string for a particular Locale.
	 * @param locale The locale (or the locale id).
	 * @param value The new value (can be undefined). */
	setValue(locale: Locale | string | undefined, value?: string) {
		if (!locale) locale = Locale.current;
		else if (typeof locale == 'string') {
			let id = locale; locale = Locale.instances[id];
			if (!locale) throw Error ('Invalid Locale Id: "'+ id + '"');
		}
		if (typeof value == "string") this._values[locale.id] = value;
		else throw Error ('Invalid value for LocalizeString "' + this._name +
			'": ' + JSON.stringify(value));
		locale.strings[this._name] = this;
	}

	toString() { }
}
