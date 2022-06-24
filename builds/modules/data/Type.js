
/** Contains the metadata of a data type . */
export class Type {


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new instance of the Type class.
	 * @param innerType The Javascript type.
	 * @param parent The parent data type.
	 * @param params The initialization parameters. */
	constructor(innerType, parent, params = {}) {

		// Store the inner type
		this._innerType = innerType;

		// Store the given name
		let name = this._name = params.name || innerType.name;

		// Make sure the names are different
		if (!Type._record[name])
			Type._record[name] = this;
		else
			throw Error('Repeated data type name: "' + name + '"');

		if (!parent) {
			let superclass = Object.getPrototypeOf(innerType.prototype);
			if (superclass !== Object.prototype) {
				let parentInnerType = superclass.constructor;
				if (parentInnerType.type)
					parent = parentInnerType.type;
				else
					parent = superclass.type = new Type(parentInnerType);
			}
		}

		// If there is a parent meta type, store the reference and create a link
		if (parent) {
			this._parent = parent;
			this._parent.children.push(this);
		}

		// Initialize the list of child meta types
		this._children = [];

		// Initialize the list of instances of the data type
		this._instances = [];
	}


	// ------------------------------------------------------- PUBLIC ACCESSORS

	/** The global list of Item instances. */
	static get record() { return this._record; }

	/** The inner type of the data type. */
	get innerType() { return this._innerType; }

	/** The name of the data type. */
	get name() { return this._name; }

	/** The list of items of the data type. */
	get instances() { return this._instances; }

	/** The parent data type. */
	get parent() { return this._parent; }

	/** The child data types. */
	get children() { return this._children; }


	// --------------------------------------------------------- PUBLIC METHODS

	/** Checks if the type is
	 * @param typeName The name of the type. */
	is(typeName) {
		return (this.name == typeName ||
			(this.parent && this.parent.is(typeName)));
	}
}

// --------------------------------------------------------- PRIVATE FIELDS

/** The global list of Type instances. */
Type._record = {};


