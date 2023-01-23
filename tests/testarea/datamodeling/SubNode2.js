import { Class, Node } from "./Global.js";


export class SubNode2 extends Node {

	constructor(name) {
		super(SubNode2.class, name);

		console.log("Created SubNode2");
	}

}
