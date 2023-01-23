
// /** Facilitates the serialization/Deserialization of XML data. */
// export class XmlSerializer {

// 	/** Generates a XML node.
// 	 * @param data The JSON data from
// 	 * @returns An object with the XML node */
// 	static toNode(data: any) {

// 		// Create the object
// 		let xmlNode = { tag: '', attributes: {} as Record <string, any>, 
// 			children: [] as object[], test: '', level: 0 };
		
// 		if (data.type) xmlNode.tag = data.type;
// 		else throw Error ('Node does not have a type');

// 		// Convert each element
// 		for (let key in data) {
// 			let value = data[key], type = typeof value;
// 			if (key == 'type') continue;
// 			switch (type) {
// 				case "boolean": case "bigint": case "number": case "string":
// 					xmlNode.attributes[key] = value; break;
// 				case "object":
// 					xmlNode.children.push(XmlSerialization.toNode(value));
// 					break;
// 			}
// 		}

// 		// Return the XML node
// 		return xmlNode;
// 	}


// 	/** Generates a XML string from JSON data.
// 	 * @param data The JSON data to serialize.
// 	 * @param params The serialization parameters.
// 	 * @returns A XML string representation of the JSON data. */
// 	static toString(data: any = {}, params: any = {}): string {

// 		// Create the XML string 
// 		let xmlString = '';

// 		// Process the serialization parameters
// 		let multiline = (params.multiline)? params.multiline : true, 
// 			emptyTags = (params.emptyTags)? params.emptyTags : true,
// 			tabLevel = (params.tabLevel)? params.tabLevel : 0,
// 			tabString = (params.tabString)? params.tabString : '\t';

// 		// Write the start tag
// 		let tagName = data.type || data.tag;
// 		if (!tagName) throw Error("Undefined XML node type");
// 		xmlString += tabString.repeat(tabLevel) + '<' + tagName;


// 		// Write the basic types as attributes of the XML node
// 		let specialAttributes = ["type"], children = [];
// 		for (let key in data) {
// 			let value = data[key], type = typeof value;

// 			// Skip special attributes
// 			if (specialAttributes.includes(key)) continue;

// 			// Save the objects as child nodes
// 			if (type == "object") { children.push(value); continue }

// 			// Convert arrays to CSV
// 			if (Array.isArray(value)) {
// 				let csvString = '';
// 				for (let item of value) {
// 					let itemType = typeof item;
// 					if (itemType == "string") item = item.replace(/\"/g, '\"');
// 					else if (itemType == "object") continue;
// 					csvString += (csvString? ', ' : '') + value;
// 				}
// 				value = csvString;
// 			}
// 			if (type == "string") value = value.replace(/\"/g, '\"');
// 			xmlString += ' ' + key + '="' + value + '"';
// 		}
		
// 		// If there is no children, create and empty tag
// 		if (emptyTags && children.length == 0) xmlString += '/>';
// 		else {

// 			// Write the end of the start tag
// 			xmlString += '>';
					
// 			// Write the child nodes
// 			for (let child of children) {
// 				if (multiline) xmlString += '\n'
// 				xmlString += XmlSerialization.toString(child, { 
// 					multiline: multiline, tabLevel: tabLevel + 1, 
// 					tabString: tabString 
// 				});
// 			}

// 			// Write the end tag
// 			if (multiline && children.length > 0)
// 				xmlString += '\n' + tabString.repeat(tabLevel);
// 			xmlString += '</' + tagName + '>';
// 		}

// 		// Return the XML string
// 		return xmlString;
// 	}

// }