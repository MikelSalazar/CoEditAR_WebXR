import { Class } from "../../CoEditAR";
import { Serialization, Serializable, LocalizedString } from "../../CoEditAR";

/** Defines a 1 to N (directed) relation between classes. */
export class Relation implements Serializable, Iterable<Class> {

	// --------------------------------------------------------- PRIVATE FIELDS

	/** The name of the relation. */
	private _name: string;

	/** The title of the relation. */
	private _title: LocalizedString;

	/** The description of the relation. */
	private _description: LocalizedString;
	
	/** The operator of the relation. */
	private _operator: RelationOperator;

	/** The source class of the relation. */
	private _source: Class;

	/** The target classes of the relation. */
	private _targets: Class[];

	/** The name of the inverse relation (in the target classes). */
	private _inverse: string;

	/** The name of the equivalent relation (in the target classes). */
	private _equivalent: string;

	/** The parent relation. */
	private _parent: Relation | undefined;

	/** The child relations. */
	private _children: Relation [];


	// ------------------------------------------------------- PUBLIC ACCESSORS

	/** Marks the Relation instance. */
	get isRelation(): boolean { return true; }

	/** The name of the expression. */
	get name(): string { return this._name; }

	/** The title of the relation. */
	get title(): LocalizedString { return this._title; }

	/** The description of the relation. */
	get description(): LocalizedString { return this._description; }

	/** The operator of the relation. */
	get operator(): RelationOperator { return this._operator; }

	/** The source class of the relation. */
	get source(): Class { return this._source; }

	/** The items of the relation. */
	get targets(): Class[] { return this._targets; }

	/** The name of the inverse relation (in the target classes). */
	get inverse(): string { return this._inverse; };

	/** The name of the equivalent relation (in the target classes). */
	get equivalent(): string { return this._equivalent; };

	/** The parent relation. */
	get parent(): Relation | undefined { return this._parent; }

	/** The child expressions. */
	get children():  Relation [] { return this._children; }


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR
	
	/** Initializes a new instance of the Relation class.
	 * @param name The name of the relation.
	 * @param source The source class of the relation.
	 * @param targets The target classes of the relation.
	 * @param parent  The parent relation.
	 * @param inverse The name of the inverse relation.
	 * @param equivalent The name of the equivalent relation.
	 * @param operator The operator of the relation (enumeration, union, 
	 * intersection or complement). */
	constructor(name: string, source: Class, targets: Class[] = [], 
		parent?: Relation, inverse?: string, equivalent?: string,
		operator: RelationOperator = RelationOperator.enumeration, data?: any) {

		// Check the given name
		this._name = (data && data.name)? data.name : name;
		if (!this._name) throw Error('No name provided for Relation');
		if (!Serialization.isName(this._name)) 
			throw Error('Invalid name "' + this._name + '" for a Relation');
		
		// Create the default values for the title and description
		this._title = new LocalizedString('RelationTitle' + this._name); 
		this._description = new LocalizedString(
			'RelationDescription' + this._name);  

		// Check the given source class and save the relation in its list.
		if (source) source.relations[name] = this;
		
		// Store the source and target class references
		this._source = source; this._targets = targets;

		// Create a hierarchical links
		this._children = [];
		if (parent) { this._parent = parent; parent.children.push(this); }

		// Save the names of the inverse and equivalent relations
		this._inverse = inverse; this._equivalent = equivalent; 

		// Store the operator
		this._operator = operator;

		// If there is any initialization data, deserialize it
		if (data) this.deserialize(data);
	}

	
	// --------------------------------------------------------- PUBLIC METHODS

	/** Deserializes the instance from a JSON representation.
 	* @param data The JSON data to deserialize. */
	deserialize(data: any): void {

		// Check if there is data to deserialize
		if (!data || typeof data != 'object') return;

		// Deserialize the title and description
		if (data.title) this._description.deserialize(data.title);
		if (data.description) this._description.deserialize(data.description);
	}


	/** Serializes the instance to a JSON representation.
	* @param data Additional data to include in the serialized object.
	* @return The serialized JSON data. */
	serialize(data: any = {}): any {
		
		// Set the basic elements
		data.name = this._name;
		data.title = this._title.serialize();
		data.description = this._description.serialize();

		// Return the result
		return data;
	}


	/** Iterates through the items of the expression. */
	[Symbol.iterator]() {
		let pointer = 0, items = this.targets;
		return {
			next(): IteratorResult<Class> {
				if (pointer < items.length)
					return { done: false, value: items[pointer++] }
				else return { done: true, value: null };
			}
		}
	}
}

/** Defines the operators of a relation. */
export enum RelationOperator {
	enumeration = ',',
	union = '+',
	intersection = '*',
	complement = '-',
}