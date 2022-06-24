import { Item } from "../Item";
import { Type } from "../Type";

/** Defines an object ready for serialization */
export class Serializable extends Item {

	/** The metadata of the data type. */
	static type: Type = new Type(Serializable, Item.type);

	// ------------------------------------------------------- PROTECTED FIELDS

	/** The data type the  */
	// protected _dataItem: ItemType;


	// ------------------------------------------------------ PUBLIC PROPERTIES

	// deserialize(data : object) : void {
	// };

	// serialize() : object {

	// 	return {};
	// };

}