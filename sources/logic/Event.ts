/** Defines a logic event. */
export class Event {

	// --------------------------------------------------------- PRIVATE FIELDS

	/** The event name. */
	private _name: string;

	/** The event owner. */
	private _owner: object | undefined;

	/** The event data. */
	private _data: object | undefined;

	/** The event listeners. */
	private _listeners: CallableFunction[];


	// ------------------------------------------------------- PUBLIC ACCESSORS

	/** Identifies the object as an Event. */
	get isEvent(): boolean { return true; }

	/** The event name. */
	get name(): string { return this._name; }

	/** The event owner. */
	get owner(): object | undefined { return this._owner; }

	/** The event data. */
	get data(): object | undefined { return this._data; }

	/** The event listeners. */
	get listeners(): any { return this._listeners; }


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new Event instance.
	 * @param name The event name.
	 * @param owner The event owner.
	 * @param data The event data. */
	constructor (name: string, owner?: object, data?: object) {
		
		// Check the given name
		if (!name || name.length == 0) throw Error("Invalid event name");
		this._name = name; 

		// Store the event owner
		this._owner = owner; this._data = data; 

		// Initialize the list of listeners
		this._listeners = [];
	}


	// --------------------------------------------------------- PUBLIC METHODS

	/** Adds a new listener for the event.
	 * @param listener The new listener function to add. */
	listen (listener: CallableFunction) { this._listeners.push(listener); }


	/** Triggers the event.
	 * @param target The object that triggers the event.
	 * @param data Additional event data. */
	trigger (target?:any, data?: any) {
		for (let listener of this._listeners) {
			let captured = listener(this, target, data);
			if (captured) break; // If captured, stop broadcasting the event
		}
	}
}