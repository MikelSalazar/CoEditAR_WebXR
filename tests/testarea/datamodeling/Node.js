import { Class, SubNode2 } from "./Global.js";


export class Node {

	constructor(classes, name) {
		this.classes = classes;
		this.name = name;

		console.log("Created Node of class: " + classes.name);
		if (this.classes.properties.length>0) new SubNode2("serialized");
	}

}

