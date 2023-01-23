import { JsonSerializer } from "./serializers/JsonSerializer.js";

/** A utility class that facilitates the (de)serialization process. */
export class Serialization {

	// --------------------------------------------------------- PUBLIC METHODS

	/** Checks if a character is a letter.
	 * @param char the character to validate.
	 * @returns validates */
	static isLetter(char) { return RegExp(/^\p{L}/, 'u').test(char); }


	/** Validates if a string is a valid name (a combination of letters,
	 * numbers and dashes, starting with a letter).
	 * @param name The name to validate.
	 * @param strict Whether to accept null or void names .
	 * @returns A boolean value with the result of the validation. */
	static isName(name, strict = true) {
		if (name == undefined || name == '')
			return !strict;
		if (typeof name != 'string')
			name = '' + name;
		return RegExp(/^\p{L}[\p{L}\p{N}_-]*$/, 'u').test(name);
	}


	/** Provides a way to more easily serialize data into different formats.
	 * @param data The data to serialize.
	 * @param params The serialization parameters.
	 * @returns The serialization result.*/
	static serialize(data = {}, params) {

		if (params == "JSON")
			return JsonSerializer.serialize(data);

		return data;
	}
}
