import { Serialization, LocalizedString } from "../../CoEditAR.js";

/** Defines a 1 to N (directed) relation between classes. */
export class Relation {


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
	constructor(name, source, targets = [], parent, inverse, equivalent, operator = RelationOperator.enumeration, data) {

		// Check the given name
		this._name = (data && data.name) ? data.name : name;
		if (!this._name)
			throw Error('No name provided for Relation');
		if (!Serialization.isName(this._name))
			throw Error('Invalid name "' + this._name + '" for a Relation');

		// Create the default values for the title and description
		this._title = new LocalizedString('RelationTitle' + this._name);
		this._description = new LocalizedString('RelationDescription' + this._name);

		// Check the given source class and save the relation in its list.
		if (source)
			source.relations[name] = this;

		// Store the source and target class references
		this._source = source;
		this._targets = targets;

		// Create a hierarchical links
		this._children = [];
		if (parent) {
			this._parent = parent;
			parent.children.push(this);
		}

		// Save the names of the inverse and equivalent relations
		this._inverse = inverse;
		this._equivalent = equivalent;

		// Store the operator
		this._operator = operator;

		// If there is any initialization data, deserialize it
		if (data)
			this.deserialize(data);
	}


	// ------------------------------------------------------- PUBLIC ACCESSORS

	/** Marks the Relation instance. */
	get isRelation() { return true; }

	/** The name of the expression. */
	get name() { return this._name; }

	/** The title of the relation. */
	get title() { return this._title; }

	/** The description of the relation. */
	get description() { return this._description; }

	/** The operator of the relation. */
	get operator() { return this._operator; }

	/** The source class of the relation. */
	get source() { return this._source; }

	/** The items of the relation. */
	get targets() { return this._targets; }

	/** The name of the inverse relation (in the target classes). */
	get inverse() { return this._inverse; }
	;

	/** The name of the equivalent relation (in the target classes). */
	get equivalent() { return this._equivalent; }
	;

	/** The parent relation. */
	get parent() { return this._parent; }

	/** The child expressions. */
	get children() { return this._children; }


	// --------------------------------------------------------- PUBLIC METHODS

	/** Deserializes the instance from a JSON representation.
	* @param data The JSON data to deserialize. */
	deserialize(data) {

		// Check if there is data to deserialize
		if (!data || typeof data != 'object')
			return;

		// Deserialize the title and description
		if (data.title)
			this._description.deserialize(data.title);
		if (data.description)
			this._description.deserialize(data.description);
	}


	/** Serializes the instance to a JSON representation.
	* @param data Additional data to include in the serialized object.
	* @return The serialized JSON data. */
	serialize(data = {}) {

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
			next() {
				if (pointer < items.length)
					return { done: false, value: items[pointer++] };
				else
					return { done: true, value: null };
			}
		};
	}
}

/** Defines the operators of a relation. */
export var RelationOperator;
(function (RelationOperator) {
	RelationOperator["enumeration"] = ",";
	RelationOperator["union"] = "+";
	RelationOperator["intersection"] = "*";
	RelationOperator["complement"] = "-";
})(RelationOperator || (RelationOperator = {}));
