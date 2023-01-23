import { ParentClass } from "./ParentClass.js";

export class ChildrenClass extends ParentClass {

	constructor(hasBeenCreatedByParentClass = false) {
		super(hasBeenCreatedByParentClass);
		//let p = new ParentClass();
		console.log("Created ChildrenClass");

	}

}