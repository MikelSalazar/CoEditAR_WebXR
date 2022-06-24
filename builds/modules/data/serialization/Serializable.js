import { Item } from "../Item.js";
import { Type } from "../Type.js";

/** Defines an object ready for serialization */
export class Serializable extends Item {
}

/** The metadata of the data type. */
Serializable.type = new Type(Serializable, Item.type);
