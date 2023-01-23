// ----------------------------------------------------------- GLOBAL VARIABLES

let debugPanel, debugPanelHeader, debugPanelCloseButton, debugPanelConsole;
let showDebugPanel = true, scrollToBottomDebugPanel = true;
let stopOnInvalidTest = true, testingStopped = false;
let ValidResults = 0, InvalidResults = 0;
let infoColor = '#dddddd', validColor = '#22dd22', errorColor = '#dd2222'

// ---------------------------------------------------------- UTILITY FUNCTIONS

/** Creates a DOM element
 * @param type The type of the element (its tag name)
 * @param id The id of the element.
 * @param content The HTML content of the element.
 * @param parent The parent of the element.
 * @param classes The classes of the element.
 * @param style The style of the element.
 * @param onclick The callback associated to the click action.
 * @returns The generated element. */
function createDomElement(type, id, parent, content, classes, style, onclick) {

	// Create the element
	let element = document.createElement(type);

	// Set the properties of the element
	if (id) element.id = id;
	if (classes) element.className = classes;
	if (style) element.style.cssText = style;
	if (onclick) element.onclick = onclick;

	// Set the content of the element
	if (content) {
		if (typeof content == 'string') element.innerHTML = content
		.replace(/&/g, '&amp;').replace(/>/g, '&gt;').replace(/</g, '&lt;')
		.replace(/'/g, '&quot;').replace(/\n/g, '<br>')
		.replace(/\t/g, '&emsp;&emsp;');
	}
	
	// Set the parent of element
	((parent)? parent : document.body).appendChild(element);

	// Return the generated element
	return element;
}


/** Creates the test environment.
 * @param indexPath The path to the index file. */
function initializeTest(indexPath) {
	if (!window.frameElement)
		createDomElement('button', 'IndexButton', null, 'Index', undefined, 
			undefined, ()=> { window.location.href = indexPath; });

	
	debugPanel = createDomElement('div', 'DebugPanel');
	debugPanelHeader = createDomElement('div', 'DebugPanelHeader', debugPanel, 
		'Debug:');
	debugPanelCloseButton = (createDomElement('div', 'DebugPanelCloseButton', 
		debugPanelHeader, 'X', null, 'float:right;'));
	debugPanelConsole = createDomElement('div', 'DebugPanelConsole', 
		debugPanel, );

	// Disable automatic scroll if the user manually scrolls the console
	debugPanelConsole.onscroll = (e) => { scrollToBottomDebugPanel = false; };

	// Handle the visibility of the debug panel
	debugPanelCloseButton.onclick = switchDebugPanelVisibility;
	document.onkeyup = (e) => { if (e.key=='º') switchDebugPanelVisibility(); }

	// Start the Test
	print('TEST STARTED'); print('');
}

/** Switches the visibility of the Debug panel. */
function switchDebugPanelVisibility() {
	showDebugPanel = !showDebugPanel;
	debugPanel.style.display = (showDebugPanel)? 'block' : 'none';
}

/** Finish the test environment. */
function finalizeTest(forced = false) {
	print (); print ('TEST ' + (forced? 'STOPPED' : 'COMPLETED') +
		' (OKs: ' + ValidResults + ', Errors: ' + InvalidResults + ')');
	testingStopped = true;
}




/** Prints a message on the debug console. 
 * @param message The message to display.
 * @param {*} tabs The tabulation level.
 * @param {*} color The label for. */
function print(message, tabs = 0, color = null, callback, stack) { 
	
	// If the testing has been stopped, do not do anything
	if (testingStopped) return;

	// If no message is provided, create a blank line
	if (!message) message = '\n';

	// Create the html element for the debug panel console
	let element = createDomElement('p', '', debugPanelConsole, message); 
	if (color) element.style.color = color;
	if (tabs) element.style.paddingLeft = (tabs * 10) + 'px' ;
	if (scrollToBottomDebugPanel && debugPanelConsole)
		debugPanelConsole.scrollTop = debugPanelConsole.scrollHeight;

	// Use the debug messages to show the caller
	if (typeof message  == 'object') callback(message);
	else {
		if (!stack) {
			let params = undefined;
			if(tabs) message = ' '.repeat(tabs) + message;
			if (color) { message = '%c' + message; params = 'color: ' + color; }
			if (params) oldLog(message, params); else oldLog(message);
		} else console.error(stack);
	}

	// Return the element
	return element;
}


// Capture the messages sent to the console
let oldLog = console.log.bind(console), 
	oldWarning = console.warn.bind(console), 
	oldError = console.error.bind(console),
	oldInfo = console.info.bind(console), 
	oldDebug = console.debug.bind(console);
console.log = function (msg) { print(msg, 0, 'white', oldLog); }
console.warn = function (msg) { print(msg, 0, 'yellow', oldWarning); }
console.error = function (msg) { print(msg, 0, 'red', oldError); }
console.debug = function (msg) { print(msg, 0, 'blue', oldDebug); }


/** Validates a small piece of code.
 * @param {*} label The label to display.
 * @param {*} callback The function callback.
 * @param {*} expected The expected result. */
function validate(label, callback, expected) {
	
	// If the testing has been stopped, do not do anything
	if (testingStopped) return;

	// Call the function
	let result = '', stack = '';

	// Create the line in the custom console
	let consoleLine = print(label + ': ', 2);

	// Execute the given code
	try { callback(); }
	catch (e) { 
		result = 'Error: ' + e.message; 
		if (!result.startsWith(expected)) stack = e.stack;
	}	
	let valid = (expected)? result.startsWith(expected) : result. length == 0;

	// Add the result to the line of the debug panel console
	createDomElement('b', null,consoleLine, (valid)? 'OK' : 'ERROR', 
		null, 'color: ' + ((valid)? validColor: errorColor));

	// Show the result on the real console
	if (stack) { oldError(stack); print(result, 4, infoColor); }
	else if (result) print(result, 4, infoColor);

	// Check the result and whether we have to stop the test or not
	if (valid) ValidResults++; else InvalidResults++; 
	if (!valid && stopOnInvalidTest) finalizeTest(true);
}
