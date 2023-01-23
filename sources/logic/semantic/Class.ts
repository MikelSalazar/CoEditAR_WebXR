import { Domain, Instance, Property, Relation } from "../../CoEditAR";
import { Serialization, Serializable, LocalizedString } from "../../CoEditAR";

/** Defines a semantic class that stores the metadata of a OOP class. */
export class Class implements Serializable {

	// ---------------------------------------------------------- STATIC FIELDS

	/** The global list of classes. */
	public static list: Record<string, Class> = {};


	// --------------------------------------------------------- PRIVATE FIELDS

	/** The name of the class. */
	private _name: string;

	/** The domain the class belongs to. */
	private _domain: Domain;

	/** The implementation of the class. */
	private _implementation: any;

	/** The title of the class. */
	private _title: LocalizedString;

	/** The description of the class. */
	private _description: LocalizedString;

	/** The abstract nature of the class (if it can have instances or not). */
	private _abstract: boolean;

	/** The final nature of the class (if it can have children or not). */
	private _final: boolean;

	/** The instances of the class (if not abstract). */
	private _instances: Instance[];

	/** The properties of the class. */
	private _properties: Record<string, Property>;

	/** The list of required properties. */
	private _required: string[];

	/** Indicates if additional properties are allowed or not. */
	private _additionalProperties: boolean;

	/** The relations of the class (links with others classes). */
	private _relations: Record<string, Relation>;

	/** The parent (super)classes. */
	private _parents: Relation;

	/** The child (sub)classes. */
	private _children: Relation;

	/** The classes with equivalent meaning (generally, in other domains). */
	private _aliases: Relation;



	// ------------------------------------------------------- PUBLIC ACCESSORS

	/** Marks the Class instance. */
	get isClass(): boolean { return true; }

	/** The name of the class. */
	get name(): string { return this._name; }

	/** The domain of the class. */
	get domain(): Domain { return this._domain; }

	/** The unique Id of the class (including the ids of the super-domains). */
	get id(): string { 
		return ((this.domain)? this.domain.id + "/" : "") + this._name;
	}

	/** The implementation of the class. */
	get implementation(): any { return this._implementation; }

	/** The title of the class. */
	get title(): LocalizedString { return this._title; }

	/** The description of the class. */
	get description(): LocalizedString { return this._description; }

	/** The abstract nature of the class (if it can have instances or not). */
	get abstract(): boolean { return this._abstract; }

	/** The final nature of the class (if it can have children or not). */
	get final(): boolean { return this._final; }

	/** The description of the class. */
	get instances(): Instance[] { return this._instances; }

	/** The properties of the class. */
	get properties(): Record<string, Property> { return this._properties; }

	/** The list of required properties. */
	get required(): string[] { return this._required; }

	/** Indicates if additional properties are allowed or not. */
	get additionalProperties(): boolean { return this._additionalProperties; }
 
	/** The relations of the class (links with others classes). */
	get relations(): Record<string, Relation> { return this._relations; }

	/** The parent (super)classes. */
	get parents(): Relation { return this._parents; }

	/** The child (sub)classes. */
	get children(): Relation { return this._children; }

	/** The classes with equivalent meaning (generally, in other domains). */
	get aliases(): Relation { return this._aliases; }



	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new Class instance.
	 * @param name The name of the class.
	 * @param domain The domain the class belongs to.
	 * @param properties The properties of the class.
	 * @param parents The parent (super)classes.
	 * @param data The initialization data. */
	constructor(name: string, domain?: Domain | string, data?: any) {

		// Check the given name
		this._name = (data && data.name)? data.name : name;
		if (!this._name) throw Error('No name provided for Class');
		if (!Serialization.isName(this._name)) 
			throw Error('Invalid name "' + this._name + '" for a Class');
		
		// Create the default values for the title and description
		this._title = new LocalizedString('ClassTitle' + this._name); 
		this._description = new LocalizedString(
			'ClassDescription' + this._name); 

		// Check the given domain
		this._domain = (data && data.name)? data.name : name;
		if (domain) {
			if (typeof (domain) == 'string') {
				if (!Domain.list[domain]) 
					throw Error('Invalid domain path: "' + domain + '"');
				domain = Domain.list[domain]; 
			}
			else this._domain = domain;
		} else this._domain = Domain.default;

		// Add this class to the list of the domain
		if (this._domain.classes[this._name]) 
			throw Error('Class "' + this._name + '" already exists' +
			 'in domain: "' + this._domain.name + '"');
		this._domain.classes[name] = this;

		// Initialize the basic elements
		this._abstract = false; this._final = false;
		this._instances = []; this._properties = {}; this._required = [];
		this._additionalProperties = true;

		// Create the different relations between classes
		this._relations = {};
		this._parents = new Relation("parents", this, [], undefined, "children");
		this._children = new Relation("children", this, [], undefined, "parents");
		this._aliases = new Relation("aliases", this, [], undefined, "aliases");

		// If there is any initialization data, deserialize it
		if (data) this.deserialize(data);
	}


	// --------------------------------------------------------- PUBLIC METHODS

	
	/** Deserializes the Class from a JSON Schema object. 
	 * @param data The JSON (schema) data to deserialize. */
	deserialize(data?: any) {

		// Check if there is data to deserialize
		if (!data || typeof data != 'object') return;

		// Deserialize the title and description
		if (data.title) this._description.deserialize(data.title);
		if (data.description) this._description.deserialize(data.description);

		// Check the nature of the class
		if (data.abstract != undefined) this._abstract = data.abstract == true;
		if (data.final != undefined) this._final = data.final == true;

		// Check if there is an implementation of the class
		if (data.implementation) this._implementation = data.implementation;
		
		// Process the properties
		if (data.properties) {
			for (let propertyName in data.properties) {
				let propertyData = data.properties[propertyName];
				propertyData.required = this._required.includes(propertyName);
				this._properties[propertyName] = 
					new Property(propertyName, propertyData);
			}
		}

		// Get the required properties and whether additional ones are allowed
		this._required = [];
		if (data.required !== undefined) {
			if (!Array.isArray(data.required)) data.required = [data.required];
			for (let propertyName of data.required) {
				if (typeof propertyName !== 'string' || 
					!this._properties[propertyName]) throw new Error (
						'Invalid required property "' + propertyName + '" ' +
						'for class "' + this._name + '"');
				this._required.push(propertyName);
			}
		}
		if (data.additionalProperties !== undefined) 
			this._additionalProperties = (data.additionalProperties == true);

		// TODO: Deserialize the relations between classes
		// if()
	}


	/** Serializes the instance to a JSON (Schema) representation.
	* @param data Additional data to include in the serialized object.
	* @return The resulting JSON (schema) data. */
	serialize(data: any = {}): any {

		// Set the basic elements
		data.name = this._name;
		data.title = this._title.serialize();
		data.description = this._description.serialize();

		// Save the optional elements of the property
		if (this._abstract != undefined) data.abstract = this._abstract;
		if (this._final != undefined) data.final = this._final;

		// Save the properties
		let properties = Object.keys(this._properties);
		if (properties.length > 0) { 
			data.properties = [];
			for (let property of properties)
				data.properties.push(this._properties[property].serialize());
		}

		data.required = this._required; 
		data.additionalProperties = this._additionalProperties;

		// Return the result
		return data;
	}


	/** Creates an instance of the class (or adds it to an existing instance).
	 * @param instance An already existing object.
	 * @param data The initialization data.
	 * @returns The instance of the class. */
	instantiate(instance?: Instance, data?: any): Instance {

		// Show a debug message on console
		// console.log("Instantiating class: " + this._name);

		// If there is no provided instance, create it
		if (!instance) { 

			// Check if there is already an implementation
			if (this._implementation) { 
				instance = new this._implementation(
					data.name, data.link, data);
				// TODO Check that the properties are applied
				//return instance; 
			} 
			// Otherwise create a basic Instance
			else instance = new Instance(this);

			// Add the class to the list
			if (!instance.metadata.classes.includes(this)) 
				instance.metadata.classes.push(this);
		} 

		// Recursively apply the parents properties first
		for (let p of this._parents) p.instantiate(instance, data);
			
		// Apply the properties of the class
		for (let propertyName in this._properties) 
			this._properties[propertyName].associate(instance);

		// Apply the required properties
		for (let requiredPropertyName of this._required)
			instance.metadata.required.push(requiredPropertyName);

		// Check if additional properties 
		if (instance.metadata.additionalProperties)
			instance.metadata.additionalProperties = 
				(this._additionalProperties == true)

		// If there is any data to deserialize, do it now
		if (data != null) instance.deserialize(data);

		// Return the generated instance
		return instance;
	}
}
