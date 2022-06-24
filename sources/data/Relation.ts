import { Item } from "./Item";
import { Collection } from "./Collection";
import { Type } from "./Type";

/** Defines a binary (1 to N) relation between data types.
 * Necessary for serialization and to store relational data. */
export class Relation<ItemType extends Item> extends Collection<ItemType> {

	// --------------------------------------------------------- PRIVATE FIELDS

	/** The name of the data relation. */
	private _name: string;

	/** The main type the data relation. */
	protected _owner: Item;

	/** The parent data relation. */
	protected _parent: Relation<Item>;

	/** The child data relations. */
	protected _children: Relation<Item>[];


	// ------------------------------------------------------- PUBLIC ACCESSORS

	/** The name of the data relation. */
	get name(): string { return this._name; }

	/** The main type the data relation. */
	get owner(): Item { return this._owner; }

	/** The parent data relation. */
	get parent(): Relation<Item> { return this._parent; }

	/** The child data relations. */
	get children(): Relation<Item>[] { return this._children; }
	

	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new instance of the Relation class.
	 * @param name The name(s) of the relation.
	 * @param types The types of item in the collection.
	 * @param owner The main data the data relation.
	 * @param parent The parent the data relation. */
	constructor(name: string, types: Type[], owner: Item, 
		parent?: Relation<Item>) {

		// Call the parent class constructor
		super(types);

		// Store the name and the owner of the data relation
		this._name = name; this._owner = owner;

		//Check if there is a parent relation
		if (parent) { this._parent = parent; parent._children.push(this); }

		// Initialize the list of child relations
		this._children = [];

	}


	// --------------------------------------------------------- PUBLIC METHODS

	/** Adds a new type to the relation.
	 * @param item The item to add.
	 * @returns The added type.  */
	add(item: ItemType) {

		// Add the item to the collection
		this._items.push(item); this._count++;

		// If there is a parent relation, also add it to it
		if (this._parent) this._parent.add(item);
	}


}
