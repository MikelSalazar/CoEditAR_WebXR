import { Class, Node } from "./Global.js";

export class SubNode extends Node {

	constructor(name) {
		super(SubNode.class, name);

		console.log("Created SubNode");
	}
}

