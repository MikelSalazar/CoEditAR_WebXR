import { ChildrenClass } from "./ChildrenClass.js";

export class ParentClass {

	constructor(hasBeenCreatedByParentClass) {

		// Limit recursion
		if (!hasBeenCreatedByParentClass) new ChildrenClass(true);
		console.log("Created ParentClass");
	}

}