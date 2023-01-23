import { Node } from "./Global.js";

export class Class extends Node {

	constructor(name, properties) {
		super(this, name);
		this.properties = properties;
	}
}

