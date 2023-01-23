import { Serialization } from "../CoEditAR.js";

/** Defines a 1 to N (directed) link between data nodes. */
export class Link {


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new instance of the Link class.
	 * @param name The name of the link.
	 * @param parent The parent link.
	 * @param source The source node of the link.
	 * @param targets The target nodes of the link.
	 * @param inverse The inverse link.
	 * @param classes The valid classes for the link. */
	constructor(name, parent, source, targets, inverse, classes, minimumCardinality, maximumCardinality) {

		// Store the given values
		if (!name)
			throw Error('No name provided for Link');
		if (typeof (name) != 'string' || !Serialization.isName(name))
			throw Error('Invalid relation name: "' + name + '"');
		this._name = name;

		// Store the source and target node references
		this._source = source;
		this._targets = [];
		if (targets)
			for (let target of targets)
				this.add(target);

		// Create the hierarchical connections
		if (parent) {
			this._parent = parent;
			parent._children.push(this);
		}
		if (inverse) {
			this._inverse = inverse;
		}

		// Store the minimum and maximum cardinality values
		if (minimumCardinality)
			this._minimumCardinality =
				(minimumCardinality >= 0) ? minimumCardinality : undefined;
		if (maximumCardinality)
			this._maximumCardinality =
				(maximumCardinality >= 0) ? maximumCardinality : undefined;
		if (this._minimumCardinality > this._maximumCardinality)
			throw Error("Invalid cardinality range for: " + this.id);

		// Check the cardinality
		if (this._minimumCardinality != undefined &&
			this._targets.length > this._minimumCardinality)
			throw Error("Invalid cardinality range for: " + this.id);
	}


	// ------------------------------------------------------- PUBLIC ACCESSORS

	/** Identifies that instance as a Link. */
	get isLink() { return true; }

	/** The name of the link. */
	get name() { return this._name; }

	/** The id of the link. */
	get id() {
		return ((this._parent) ? this._parent.id + "." : "") + this._name;
	}

	/** The source node of the link. */
	get source() { return this._source; }

	/** The main target node (if any). */
	get target() {
		return (this._targets.length > 0) ? this._targets[0] : undefined;
	}

	/** The target nodes of the link. */
	get targets() { return this._targets; }

	/** The number of target nodes of the link. */
	get cardinality() { return this._targets.length; }

	/** The minimum number of target nodes of the link. */
	get minimumCardinality() { return this._minimumCardinality; }

	/** The maximum number of target nodes of the link. */
	get maximumCardinality() { return this._maximumCardinality; }

	/** The parent link. */
	get parent() { return this._parent; }

	/** The child links. */
	get children() { return this._children; }

	/** The inverse link. */
	get inverse() { return this._inverse; }

	/** The valid classes for the link. */
	get classes() { return this._classes; }

	/** Indicates if the link connects at least two modules */
	get isConnected() { return (this._source && this._targets.length > 0); }


	// --------------------------------------------------------- PUBLIC METHODS

	/** Adds a node to the link.
	 * @param target The node to add.
	 * @param position The position where to add the node (by default, at the
	 * end). Negative values imply counting from the end of the collection.
	 * @returns The added item.  */
	add(node, position) {

		// If no position is defined, just add it to the end of the array
		if (position == undefined)
			this._targets.push(node);
		else { // Otherwise, calculate the index from the position
			let index = 0, size = this._targets.length;
			if (position > 0) {
				index = position;
				if (index > size)
					index = size; // Prevent out_of_bounds errors
			}
			else { // Negative values imply counting backwards
				index = size - position;
				if (index < 0)
					index = 0; // Prevent out_of_bounds errors
			}

			// Insert the node in the right position
			this._targets.splice(index, 0, node);
		}

		// If there is parent collection, add the node to it
		if (this._parent)
			this._parent.add(node);
	}


	/** Get a specific target from the link.
	 * @param name The name of the node to get.
	 * @returns The node with the specified name. */
	getByName(name) {
		for (let t of this._targets)
			if (t.name == name)
				return t;
	}


	/** Removes an target from the link.
	* @param item The item to remove. */
	remove(node) {
		let cardinality = this._targets.length;
		for (let nodeIndex = 0; nodeIndex < cardinality; nodeIndex++) {
			if (this._targets[nodeIndex] == node) {
				this._targets.splice(nodeIndex, 1);
				nodeIndex--;
				cardinality--;
			}
		}

		// If there is parent link, also remove the node in it
		if (this._parent)
			this._parent.remove(node);
	}


	/** Clears the element of the collection. */
	clear() {
		let cardinality = this._targets.length;
		for (let nodeIndex = 0; nodeIndex < cardinality; nodeIndex++) {
			if (this._parent)
				this._parent.remove(this._targets[nodeIndex]);
			this._targets.splice(nodeIndex, 1);
			nodeIndex--;
			cardinality--;
		}
	}


	/** Iterates through the target nodes of the link. */
	[Symbol.iterator]() {
		let pointer = 0, nodes = this._targets;
		return {
			next() {
				if (pointer < nodes.length)
					return { done: false, value: nodes[pointer++] };
				else
					return { done: true, value: null };
			}
		};
	}
}

