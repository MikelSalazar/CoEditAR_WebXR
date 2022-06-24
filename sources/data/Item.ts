import { Relation } from "./Relation";
import { Type } from "./Type";
import { Event } from "../logic/Event";

/** Defines a basic data structure.
 * Provides mechanisms to store semantic data. */
export class Item {

	/** The metadata associated to the data type. */
	static type: Type = new Type(Item);

	// ------------------------------------------------------- PROTECTED FIELDS

	/** The metadata associated to the data type 
	 * (usually a reference to a static instance). */
	protected _type: Type;

	/** The name of the data item. */
	protected _name: string;

	/** The relations of with other data types. */
	protected _relations: Record<string, Relation<Item>>;

	/** Indicates whether the data item has been updated or not. */
	private _updated: boolean;

	/** An event triggered before a data item is modified
	* (if any listener return a false value, it prevents the modification). */
	protected _onModification: Event;
	
	/** An event triggered before a data item is updated
	 * (if any listener return a false value, it prevents the update). */
	 protected _onUpdate: Event;

	/** A global event triggered before a data item is created
	* (if any listener return a false value, it prevents the creation). */
	protected static _onCreation: Event = new Event("creation");

	/** A global event triggered before a data item is modified
	* (if any listener return a false value, it prevents the modification). */
	protected static _onModification: Event = new Event("modification");

	/** A global event triggered before a data item is updated
	 * (if any listener return a false value, it prevents the update). */
	protected static _onUpdate: Event = new Event("update");


	// ------------------------------------------------------- PUBLIC ACCESSORS

	/** The metadata associated to the data type 
	 * (usually a reference to a static instance). */
	get type(): Type { return this._type; };

	/** The name of the data item. */
	get name(): string { return this._name; }
	
	/** The relations of with other data types. */
	get relations(): Record <string, Relation<Item>> { return this._relations; }

	/** The parent of the data item. */
	get parent(): Item | undefined {
		if (!this._relations["parent"]) return undefined;
		return this._relations["parent"].getByIndex(0);
	}
	
	/** The child data types. */
	get children(): Relation<Item> | undefined { 
		if (!this._relations["children"]) return undefined;
		return this._relations["children"];
	}

	/** Indicates if the Node has been updated or not. */
	get updated(): boolean { return this._updated; }
	set updated(value: boolean) {

		// Propagate "false" values upwards in the node hierarchy
		if (value == false && this.parent) this.parent.updated = false;
		
		if (value == false) {
			Item._onModification.trigger(this);
			this._onModification.trigger(this);
		}

		// Apply the new value
		this._updated = value;
	}

	/** An event triggered before a data item is modified.
	* (If any listener return a false value, it prevents the modification). */
	get onModification(): Event { return this._onModification; }

	/** An event triggered before a data item is updated. 
	 * (If any listener return a false value, it prevents the update).	*/
	get onUpdate(): Event { return this._onUpdate; }

	/** A global event triggered before a data item is created.
	* (If any listener return a false value, it prevents the creation). */
	static get onCreation(): Event { return Item._onCreation; }

	/** A global event triggered before a data item is created.
	* (If any listener return a false value, it prevents the creation). */
	static get onModification(): Event { return Item._onModification; }

	/** A global event triggered before a data item is updated. 
	 * (If any listener return a false value, it prevents the update).	*/
	static get onUpdate(): Event { return Item._onUpdate; }


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new instance of the Item class.
 	 * @param name The name of the data item.
	 * @param relation The data relation. */
	constructor(name?: string, relation?: Relation<Item>) {

		this._name = name;

		// Check that the class item is properly established
		let instance = (this.constructor as any); 
		this._type = instance["type"];
		if (!this._type || this.type.innerType != this.constructor) 
			this._type = instance["type"] = new Type(this.constructor);

		// Create the relations
		this._relations = {};
		this._relations.parent = new Relation("parent", [Item.type], this);
		this._relations.children = new Relation("child", [Item.type], this);
		if (relation) { 
			relation.add(this);
			this._relations.parent.add(relation.owner);
		}

		// Register the modification and events
		this._onModification = new Event("modification");
		this._onUpdate = new Event("update");
	}


	// --------------------------------------------------------- PUBLIC METHODS

	/** Updates the Node. 
	 * @param deltaTime The update time.
	 * @param forced Indicates whether the update is forced or not. 
	 * @param data Additional update data. */
	update(deltaTime: number = 0, forced: boolean = false, data?: any) {

		// If the update is not forced, skip it when the node is already updated
		if (this._updated && !forced) return;

		// Trigger the update event
		this._onUpdate.trigger(this, data);

		// Mark this node as updated
		this._updated = true;

		// Update the children
		for (let child of this.children)
			child.update(deltaTime, forced, data);
	}


	/** Serializes the Node instance.
	 * @param mode The serialization mode: full (default), simple,).
	 * @return The serialized data. */
	serialize(mode?: string): any {

		// Create an object to serialize the Node
		let data: any = {};

		// Save the name of the node
		if (this.name) data.name = this.name;

		// Serialize the child nodes
		for (let child of this.children) {
			let nodeChildData = child.serialize(mode);
			if (mode == "simple" && nodeChildData == undefined) continue;
			data[child.name] = nodeChildData;
		}

		// Return the object with the serialized data
		return data;
	}

	
	/** Deserializes the Node instance.
	 * @param data The data to deserialize.
	 * @param mode The deserialization mode. */
	deserialize(data: any = {}, mode?: string) {

		// If the data is a string, check if it is JSON or CSV data
		if (typeof data == "string") JSON.parse(data);

		// If the data is an array, try to parse it value by value
		if (Array.isArray(data)) {
			for (let dataIndex = 0; dataIndex < data.length; dataIndex++) {
				if (dataIndex >= this.children.count) return;
				this.children.getByIndex(dataIndex).deserialize(
					data[dataIndex], mode);
			}
		}

		// If the data is an object, analyze it key by key
		else for (let dataKey in data) {
			let dataItem = data[dataKey];
			if (dataItem == undefined) continue;

			// If the key references an existing child relation 
			let subRelation = false;
			for (let relation of this.children.children) {
				if (relation.name == dataKey) {
					subRelation = true
					if (!Array.isArray(dataItem)) break;
					for (let dataSubitem of dataItem) {
						let itemType = (relation.types[0].innerType as any);
						new itemType("test", relation, dataSubitem);
					}
				}
			}
			if (subRelation) continue;

			// If the key references an existing item 
			for (let child of this.children) {
				if (child._name == dataKey) {
					child.deserialize(dataItem, mode); break;
				}
			}
		}
	}
}