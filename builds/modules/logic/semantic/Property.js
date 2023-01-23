import { Serialization, Serializable, LocalizedString } from "../../CoEditAR.js";


/** Defines a property of a semantic class.
 * @see https://json-schema.org/understanding-json-schema/ */
export class Property extends Serializable {


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new instance of the Property class.
	 * @param name The name of the property.
	 * @param data The initialization data. */
	constructor(name, data) {

		super();

		// Store the name, title and description
		this._name = (data && data.name) ? data.name : name;
		if (!this._name)
			throw Error('No name provided for Property');
		if (!Serialization.isName(this._name))
			throw Error('Invalid name "' + this._name + '" for a Property');

		// Create the default values for the title and description
		this._title = new LocalizedString('PropertyTitle' + this._name);
		this._description = new LocalizedString('PropertyDescription' + this._name);

		// Initialize the different fields
		this._type = 'object'; // By default every property defines an object
		this._required = false;
		this._unique = false;
		this._readOnly = false;
		this._classes = [];
		this._instances = [];
		this._original = null;
		this._copies = [];
		this._value = undefined;
		this._default = undefined;
		this._enum = undefined;
		this._minimum = undefined;
		this._maximum = undefined;
		this._minLength = undefined;
		this._maxLength = undefined;
		this._pattern = undefined;
		this._format = undefined;
		this._items = [];
		this._minItems = undefined;
		this._maxItems = undefined;

		// If there is any initialization data, deserialize it
		if (data)
			this.deserialize(data);
	}



	// ------------------------------------------------------- PUBLIC ACCESSORS

	/** Marks the Property instance. */
	get isProperty() { return true; }

	/** The name of the property. */
	get name() { return this._name; }

	/** The name of the property. */
	get type() { return this._type; }
	set type(type) {
		if (Property.types.includes(type))
			this._type = type;
		else
			throw Error('Invalid type "' + type + '" ' +
				'for property "' + this.name + '" (available options are: "' +
				Property.types.join('", "') + '")');
	}

	/** The title of the property. */
	get title() { return this._title; }

	/** The description of the property. */
	get description() { return this._description; }

	/** Indicates if the property has to defined or not. */
	get required() { return this._required; }
	set required(required) { this._required = required; }

	/** Indicates if the property is unique (among all instances). */
	get unique() { return this._unique; }
	set unique(unique) { this._unique = unique; }

	/** Indicates if the property can not be set after initialization. */
	get readOnly() { return this._readOnly; }
	set readOnly(readOnly) { this._readOnly = readOnly; }

	/** The value of the property. */
	get value() {
		return this._value == undefined ? this._default : this._value;
	}
	set value(newValue) {
		if (this.checkValue(newValue, true))
			this._value = newValue;
	}

	/** The default value of the property. */
	get default() { return this._default; }
	set default(defaultValue) {
		if (this.checkValue(defaultValue, true))
			this._default = defaultValue;
	}

	/** The valid values of the property. */
	get enum() { return this._enum; }
	set enum(ev) {
		this._enum = (ev) ? (Array.isArray(ev) ? [...ev] : [ev]) : undefined;
	}

	/** The minimum numeric value of the property. */
	get minimum() { return this._minimum; }
	set minimum(minimum) {
		if (minimum !== undefined && minimum < 0 && minimum > this._maximum)
			throw new Error('Invalid minimum value: "' + minimum + '"');
		this._minimum = minimum;
	}

	/** The maximum numeric value of the property. */
	get maximum() { return this._maximum; }
	set maximum(maximum) {
		if (maximum !== undefined && maximum < 0 && maximum < this._minimum)
			throw new Error('Invalid maximum value: "' + maximum + '"');
		this._maximum = maximum;
	}

	/** The minimum length of a text value of the property. */
	get minLength() { return this._minLength; }
	set minLength(mL) {
		if (mL !== undefined && mL < 0 && mL > this._maxLength)
			throw new Error('Invalid minLength value: "' + mL + '"');
		this.minLength = mL;
	}

	/** The maximum length of a text value of the property. */
	get maxLength() { return this._maxLength; }
	set maxLength(mL) {
		if (mL !== undefined && mL < 0 && mL < this._minLength)
			throw new Error('Invalid maxLength value: "' + mL + '"');
		this._maxLength = mL;
	}

	/** The pattern (regular expression) of a text value of the property. */
	get pattern() { return this._pattern; }
	set pattern(pattern) { this._pattern = pattern; }

	/** The semantic identification of a text value of the property. */
	get format() { return this._format; }
	set format(format) { this._format = format; }


	/** The type of items contained in an array property. */
	get items() { return this._items; }

	/** The minimum number of items contained in an array property. */
	get minItems() { return this._minItems; }
	set minItems(minItems) {
		if (minItems !== undefined && minItems < 0)
			throw new Error('Invalid minItems value: "' + minItems + '"');
		this._minItems = minItems;
	}

	/** The maximum number of items contained in an array property. */
	get maxItems() { return this._maxItems; }
	set maxItems(maxItems) {
		if (maxItems !== undefined && maxItems < 0)
			throw new Error('Invalid maxItems value: "' + maxItems + '"');
		this._maxItems = maxItems;
	}

	/** The classes with this property. */
	get classes() { return this._classes; }

	/** The instances associated with the property. */
	get instances() { return this._instances; }

	/** The original property instance (if not unique). */
	get original() { return this._original; }

	/** The copied instances of the property (if not unique). */
	get copies() { return this._copies; }


	// --------------------------------------------------------- PUBLIC METHODS

	/** Creates a deep copy of the property.
	 * @returns The generated copy of the property. */
	clone() {

		// Generate a new copy
		let prototype = (Object.getPrototypeOf(this));
		let copy = new prototype.constructor(this.name, this.serialize());

		// Create a copy and set the link to the original relation
		this._copies.push(copy);
		copy._original = this.original || this;

		// Return the copy
		return copy;
	}


	/** Deserializes the property.
	 * @param data The data to deserialize. */
	deserialize(data) {

		// Check if there is data to deserialize
		if (!data || typeof (data) != 'object')
			return;

		// Get the data type
		if (data.type != undefined)
			this.type = data.type;

		// Deserialize the title and description
		if (data.title)
			this._description.deserialize(data.title);
		if (data.description)
			this._description.deserialize(data.description);

		// Get the main attributes
		if (data.required != undefined)
			this.required = data.required == true;
		if (data.unique != undefined)
			this.unique = data.unique == true;
		if (data.readonly != undefined)
			this.readOnly = data.readonly == true;
		if (data.default != undefined)
			this.default = data.default;
		if (data.enum != undefined)
			this.enum = data.enum;
		if (data.minimum != undefined)
			this.minimum = data.minimum;
		if (data.maximum != undefined)
			this.maximum = data.maximum;
		if (data.minLength != undefined)
			this.minLength = data.minLength;
		if (data.maxLength != undefined)
			this.maxLength = data.maxLength;
		if (data.pattern != undefined)
			this.pattern = data.pattern;
		if (data.format != undefined)
			this.format = data.format;
		if (data.minItems != undefined)
			this.minItems = data.minItems;
		if (data.maxItems != undefined)
			this.maxItems = data.maxItems;

		// Serialize the sub-properties
		if (data.items != undefined) {
			if (!Array.isArray(data.items))
				data.items = [data.items];
			for (let itemIndex = 0; itemIndex < data.items.length; itemIndex++)
				this._items.push(new Property(this.name + itemIndex, data.items[itemIndex]));
		}

		// Get the value at the end, to be able to do the necessary checks
		if (data.value != undefined)
			this.value = data.value;

		// Link the properties to the classes and the instances
		this._classes = [];
		if (data.classes)
			for (let c of data.classes) {
				// c.properties[this._name] = this; 
				this.classes.push(c);
			}

		// Associate the instances
		this._instances = [];
		if (data.instances)
			for (let i of data.instances)
				this.associate(i);

		// Create the link between original and the copies
		this._original = data.original;
		this._copies = [];
		if (data.copies)
			for (let c of data.copies)
				this._copies.push(c);

		// If undefined, set the default values depending on the type
		if (this._default == undefined) {
			switch (this._type) {
				case "null":
					this._default = null;
					break;
				case "boolean":
					this._default = false;
					break;
			}
		}
	}


	/** Serializes the instance to a JSON (Schema) representation.
	* @param params The serialization parameters.
	* @param data Additional data to include in the serialized object.
	* @return The resulting JSON (schema) data. */
	serialize(params, data = {}) {

		// Set the basic attributes
		data.name = this._name;

		// Save the optional attributes of the property
		if (!this._title.isNull)
			data.title = this._title.serialize();
		if (!this._description.isNull)
			data.description = this._description.serialize();
		if (this._type !== "object")
			data.type = this._type;
		if (this._required != false)
			data.required = this._required;
		if (this._unique != false)
			data.unique = this._unique;
		if (this._readOnly != false)
			data.readOnly = this._readOnly;
		if (this._value != undefined)
			data.value = this._value;
		if (this._default != undefined)
			data.default = this._default;
		if (this._enum != undefined)
			data.enum = this._enum;
		if (this._minimum != undefined)
			data.minimum = this._minimum;
		if (this._maximum != undefined)
			data.maximum = this._maximum;
		if (this._minLength != undefined)
			data.minLength = this._minLength;
		if (this._maxLength != undefined)
			data.maxLength = this._maxLength;
		if (this._pattern != undefined)
			data.pattern = this._pattern;
		if (this._format != undefined)
			data.format = this._format;
		if (this._minItems != undefined)
			data.minItems = this._minItems;
		if (this._maxItems != undefined)
			data.maxItems = this._maxItems;

		// Serialize the sub-properties
		if (this._items != undefined && this._items.length > 0) {
			data.items = [];
			for (let item of this._items) {
				let itemData = item.serialize();
				itemData.name = undefined;
				data.items.push(itemData);
			}
		}

		// If there are serialization parameters language, use them
		if (params)
			return Serialization.serialize(data, params);

		// Otherwise, just return the object
		return data;
	}


	/** Links or copies a property to an instance.
	 * @param instances The instances to associate to. */
	associate(instances) {

		// Check the provided
		if (!instances)
			throw Error("No instances provided");
		if (!Array.isArray(instances))
			instances = [instances];
		for (let instance of instances) {

			// If it is unique, just link this property
			let properties = instance.metadata.properties;
			if (this._unique)
				properties[this._name] = this;

			// Otherwise, create a copy of this property
			else
				properties[this._name] = this.clone();

			// Add this instance to the list in the instance
			this.instances.push(instance);
		}
	}


	/** Checks if a value is valid with the current rules.
	 * @param value The value to test.
	 * @param trowException Whether to throw exception or not
	 * @returns A boolean indicating if the value is valid.  */
	checkValue(value, throwExceptions = false) {

		// Prepare an error message
		let property = this;
		function errorMessage(reason) {
			return 'Invalid value "' + value + '" for ' + property._type +
				' property "' + property._name + '"' +
				(reason ? ' (' + reason + ')' : '');
		}

		// If there is a enumeration, check the values
		if (this._readOnly)
			throw Error('Property "' + this.name + '" ' +
				'cannot receive a value because is marked as "read only"');

		// If there is a enumeration, check the values
		if (this._enum) {
			if (!this._enum.includes(value))
				throw Error(errorMessage('valid options are "' + this.enum.join('", "') + '"'));
		}

		// Check depending on the type
		switch (this._type) {
			case 'null':
				if (!throwExceptions)
					return false;
				throw Error(errorMessage('A null property can not have a value'));
			case 'boolean':
				if (!(value === true || value === false))
					if (!throwExceptions)
						return false;
					else
						throw Error(errorMessage('valid options are "true" or "false"'));
				break;
			case 'integer':
			case 'number':
				if ((this.type == 'integer' && typeof value != "bigint") ||
					(this.type == 'number' && typeof value != "number"))
					throw Error(errorMessage('invalid value type "' + typeof value + '"'));
				if (this._minimum != undefined && value < this._minimum)
					if (!throwExceptions)
						return false;
					else
						throw Error(errorMessage('the minimum value is ' + this._minimum));
				if (this._maximum != undefined && value > this._maximum)
					if (!throwExceptions)
						return false;
					else
						throw Error(errorMessage('the maximum value is ' + this._maximum));
				break;
			case 'string':
				if (typeof value != "string")
					throw Error(errorMessage('invalid value type "' + typeof value + '"'));
				if (this._minLength && value.length < this._minLength)
					if (!throwExceptions)
						return false;
					else
						throw Error(errorMessage('the minimum text size is ' + this._minLength));
				if (this._maxLength && value.length > this._maxLength)
					if (!throwExceptions)
						return false;
					else
						throw Error(errorMessage('the maximum text size is ' + this._maxLength));
				// TODO Check pattern and format
				break;
			case 'array': {
				if (!Array.isArray(value))
					throw Error(errorMessage('value is not an array'));

				// Check the items (sub-properties)
				if (this._items && this._items.length > 0) {
					for (let itemValue of value) {
						let validItem = false;
						for (let itemProperty of this._items)
							if (itemProperty.checkValue(itemValue)) {
								validItem = true;
								break;
							}
						if (!validItem)
							if (!throwExceptions)
								return false;
							else
								throw Error(errorMessage('the item "' +
									itemValue + '" is not a valid array element'));
					}
				}
				if (this._minItems && value.length < this._minItems)
					if (!throwExceptions)
						return false;
					else
						throw Error(errorMessage('the minimum number of items is ' + this._minItems));
				if (this._maxItems && value.length > this._maxItems)
					if (!throwExceptions)
						return false;
					else
						throw Error(errorMessage('the maximum number of items is ' + this._maxItems));
			}
		}

		// If we reached this point, the value is considered valid
		return true;
	}
}

// ---------------------------------------------------------- STATIC FIELDS

/** The valid property types (as defined in JSON Schema ). */
Property.types = [
	"null", "boolean", "integer", "number", "string", "array", "object"
];

/** The valid property types (as defined in JSON Schema ). */
Property.formats = [
	"date-time",
	"time",
	"date",
	"duration",
	"email",
	"idn-email",
	"hostname",
	"idn-hostname",
	"ipv4",
	"ipv6",
	"uuid",
	"uri",
	"uri-reference",
	"iri",
	"iri-reference",
	"uri-template",
	"json-pointer",
	"relative-json-pointer",
	"regex" // Regular Expressions
];

