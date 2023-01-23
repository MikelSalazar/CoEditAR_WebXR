export * from "./Class.js"
export * from "./Node.js"
export * from "./SubNode.js"
export * from "./Subnode2.js"

Node.class = new Class("Node")
SubNode.class = new Class("SubNode", ["subnode"]);
SubNode2.class = new Class("SubNode2", ["subnode2"]);