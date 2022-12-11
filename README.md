# CoEditAR_WebXR

This repository contains the WebXR implementation of the CoEditAR framework.

## Folder Structure

The main folders of this repository are the following:

* __builds__: The transpiled (Javascript) files, ready to be used in web browsers.
* __docs__: Additional documentation files about this implementation.
* __examples__: Usage examples of the framework.
* __sources__: The (TypeScript) source files of the implementation 
* __tests__: Different tests of the platform.
* __utilities__: The internal tools to transpile and test the code.

## Usage

The build folder contains different versions of the 

## Installation

To install the basic libraries for this project, please run the following npm command.

    npm install

This will create a node_modules folder with the different modules required to compile the CoEditAR WebXR implementation.

To compile and test the CoEditAR WebXR implementation, you need to install the typescript compiler and electron system, which it is recommended to install globally with the following commands

    npm install -g typescript
    npm install -g electron

## Compilation

To initiate the building process it is recommend to use the following command:

    npm run build


## Testing:

To launch the electron-based test platform locally, you can use the following command:

    npm run test

Alternatively, it is possible to access the different tests by using a web server and opening the HTML files in the test folder.


