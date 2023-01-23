import { Class } from "../../CoEditAR";
import { Serialization, Serializable, LocalizedString } from "../../CoEditAR";


/** Defines an semantic domain. Necessary to differentiate between classes 
 * with the same name, but also useful to describe knowledge fields/domains
 * in a hierarchical (taxonomical) way. */
export class Domain implements Serializable {

	// ---------------------------------------------------------- STATIC FIELDS

	/** The global list of domains. */
	public static list: Record<string, Domain> = {};

	/** The global default domain. */
	public static default: Domain = new Domain("CoEditAR");


	// --------------------------------------------------------- PRIVATE FIELDS

	/** The name of the domain. */
	private _name: string;

	/** The title of the domain. */
	private _title: LocalizedString;

	/** The description of the domain. */
	private _description: LocalizedString;

	/** The classes contained in this domain. */
	private _classes: Record<string, Class> = {};

	/** The parent domain. */
	private _parent: Domain;

	/** The child subdomains. */
	private _children: Record<string, Domain> = {};


	// ------------------------------------------------------- PUBLIC ACCESSORS

	/** Marks the Domain instance. */
	get isDomain(): boolean { return true; }
	
	/** The name of the domain (in the parent domain). */
	get name(): string { return this._name; }

	/** The title of the domain. */
	get title(): LocalizedString { return this._title; }

	/** The description of the domain. */
	get description(): LocalizedString { return this._description; }

	/** The parent (super)domain. */
	get parent(): Domain { return this._parent; }

	/** The child (sub)domains. */
	get children(): Record<string, Domain> { return this._children; }

	/** The unique ID of the domain (including the ids of the super-domains). */
	get id(): string { 
		return (this._parent? this._parent.id + "/" : "") + this._name; 
	}

	/** The classes contained in this domain. */
	get classes(): Record<string, Class> { return this._classes; }


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new instance of the Domain class.
	 * @param name The name of the domain.
	 * @param parent The parent (super)domain.
	 * @param data The initialization data. */
	constructor(name: string, parent?: Domain, data?: any) {

		// Store the name
		this._name = (data && data.name)? data.name : name;
		if (!this._name) throw Error('No name provided for Domain');
		if (!Serialization.isName(this._name))  
			throw Error('Invalid name "' + this._name + '" for a Domain');
		
		// Create the default values for the title and description
		this._title = new LocalizedString('DomainTitle' + this._name); 
		this._description = new LocalizedString(
			'DomainDescription' + this._name);

		// Create the hierarchical link
		if (parent) { this._parent = parent; parent._children[name] = this; }

		// Add the domain to the list (using the complete Id)
		if (Domain.list[this.id]) throw Error('Domain "' + this._name + '" ' +
			'already exists' + (parent? ' in domain "' + parent.id +'"': ''));
		Domain.list[this.id] = this;

		// If there is any initialization data, deserialize it
		if (data) this.deserialize(data);
	}


	// --------------------------------------------------------- PUBLIC METHODS


	/** Deserializes the Class from a JSON Schema object. 
	 * @param data The schema data to deserialize. */
	deserialize(data?: any) {

		// Check if there is data to deserialize
		if (!data || typeof data != 'object') return;

		// Deserialize the title and description
		if (data.title) this._description.deserialize(data.title);
		if (data.description) this._description.deserialize(data.description);
	}


	/** Serializes the Domain instance.
	* @param data Additional data to include in the serialized object.
	* @return The serialized data. */
	serialize(data: any = {}): any {
		data.name = this._name;	data.title = this._title.serialize();
		data.description = this._description.serialize(); return data;
	}


	/** Adds a class to the domain. 
	 * @param c the class to add to the domain.
	 * @param alias If a class with the name.
	 * @returns The class added to the domain. */
	add(c: Class): Class { return c;}


	/** Get the string representation of the domain.
	 * @returns The ID of the domain. */
	toString(): string { return this.id; }

}
