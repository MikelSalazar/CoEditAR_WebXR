import { Item } from "../Item";
import { Relation } from "../Relation";
import { Type } from "../Type";

/** Defines a simple data type. */
export abstract class Simple<BasicType> extends Item {

	/** The metadata of the data type. */
	static type: Type = new Type(Simple, Item.type);

	// ------------------------------------------------------- PROTECTED FIELDS

	/** The value of the simple data type. */
	protected _value: BasicType | undefined;

	/** The default value of the simple data type. */
	protected _defaultValue: BasicType;

	/** The valid values of the simple data type. */
	protected _validValues: BasicType[] = undefined;


	// ------------------------------------------------------ PUBLIC PROPERTIES

	/** The current value of the Simple data type.*/
	get value(): BasicType {
		if (this._value == undefined) return this._defaultValue;
		return this._value;
	}
	set value(newValue: BasicType) {
		if (this._value == newValue) return;
		if (!this.checkValue(newValue)) throw Error('Invalid value "'
			+ newValue + '" for: ' + this._name);
		this._value = newValue; this.updated = false;
	}

	/** The default value of the Simple data type. */
	get defaultValue(): BasicType { return this._defaultValue; }
	set defaultValue(newDefaultValue: BasicType) {
		if (this._defaultValue == newDefaultValue) return;
		if (!this.checkValue(newDefaultValue))
			throw Error('Invalid default value "' + newDefaultValue +
				'" for: ' + this._name);
		this._defaultValue = newDefaultValue; this.updated = false;
	}

	/** The valid values of the Simple data type.*/
	get validValues(): BasicType[] | undefined { return this._validValues; }
	set validValues(newValidValues: BasicType[] | undefined) {
		this._validValues = newValidValues;
		if (!this.checkValue(this._value)) throw Error('Invalid value "'
			+ this._value + '" for: ' + this._name);
		this.updated = false;
	}

	/** The index of the value in the valid Simple data type. */
	get validValueIndex(): number | undefined {
		if (this.validValues != undefined && this.value != undefined)
			return this.validValues.indexOf(this.value);
		return undefined;
	}

	/** Indicates whether the value is the default or not. */
	get isDefault(): boolean { return (this._value == this._defaultValue); }

	/** Indicates whether the value is undefined or not. */
	get isUndefined(): boolean { return (this._value == undefined); }


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new instance of the Simple class.
	 * @param name The name of the data type.
	 * @param relation The data relation.
	 * @param data The initialization data. */
	constructor(name?: string, relation?: Relation<Item>, data?: any) {

		// Call the parent class constructor
		super(name, relation);

		// Deserialize the initialization data
		if (data) this.deserialize(data);
	}


	// --------------------------------------------------------- PUBLIC METHODS

	/** Serializes the String instance.
	 * @return The serialized data. */
	serialize(): any { return this._value; }

	/** Deserializes the Simple data type.
	 * @param data The value to deserialize.
	 * @param mode The deserialization mode. */
	deserialize(data: any, mode?: string) {
		if (typeof (data) == "object") {
			this._defaultValue = data.defaultValue;
			this._validValues = data.validValues;
			this._value = data.value;
		} else this._value = data;
	}

	/** Obtains the value of the Simple data type
	 * @return The value of the Type. */
	valueOf(): any { return this.value; }

	/** Checks if the value is valid for the Simple data type,
	 * @param value The value to check.
	 * @returns A boolean value indicating whether the value is valid or not. */
	checkValue(value: BasicType): boolean {

		// Check the list of valid values
		if (this._validValues && !this._validValues.includes(value))
			return false;

		// If the value has not been rejected, return true
		return true;
	}

}
