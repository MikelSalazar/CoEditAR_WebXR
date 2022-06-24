import { Collection } from "../Collection.js";

/** Defines a generic list of data types. */
export class List extends Collection {

	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new instance of the List instance.
	 * @param types The types of types in the collection. */
	constructor(types) {

		// Call the base class constructor
		super(types);
	}

	// --------------------------------------------------------- PUBLIC METHODS

	/** Adds a new item to the list.
	 * @param item The item to add.
	 * @param position The position where to add the item (by default, at the
	 * end). Negative values imply counting from the end of the list.
	 * @returns The added type.  */
	add(item, position) {

		// If no position is defined, just add the item to the end of the array
		if (position == undefined)
			this._items.push(item);
		else { // Otherwise, calculate the index from the position
			let index = 0, size = this._items.length;
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

			// Insert the item in the right position
			this._items.splice(index, 0, item);
		}

		// Remember to increase the counter 
		this._count++;
	}
}


