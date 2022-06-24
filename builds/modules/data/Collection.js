
/** Defines a collection of data items. */
export class Collection {


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new instance of the Collection instance.
	 * @param types The types of items in the collection. */
	constructor(types) {

		// Store the types of items in the collection
		this._types = types;

		// Initialize the array of items
		this._items = [];
		this._count = 0;
	}

	// ------------------------------------------------------ PUBLIC PROPERTIES

	/** The types of items in the data collection. */
	get types() { return this._types; }

	/** The number of items of the data collection. */
	get count() { return this._count; }

	// ------------------------------------------------------ PROTECTED METHODS



	// --------------------------------------------------------- PUBLIC METHODS

	/** Gets a data item by index.
	 * @param index The index of the item to get.
	 * @returns The item with the specified index. */
	getByIndex(index) {
		if (index >= 0 && index < this._items.length)
			return this._items[index];
		return undefined;
	}


	// /** Gets a data item by name. 
	//  * @param index The name of the item to get.
	//  * @returns The item with the specified name. */
	// getByName(name: string): ItemType | undefined { 
	// 	for (let item of this._items) if (item.name == name) return item; 
	// 	return undefined;
	// }


	[Symbol.iterator]() {
		let pointer = 0, items = this._items;
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
