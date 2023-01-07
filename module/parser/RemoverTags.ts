import {Parser} from "./Parser.js";
import fs from "fs";
import path from "path";
import {DOMParser} from "@xmldom/xmldom";
import {writeDocumentToFile} from "./ParserXML.js";

function iterateOverNodes(nodes: NodeListOf<ChildNode>, document: Document) {
    for (let node of Array.from(nodes)) {
        if (["div", "p", "tr"].includes(node.nodeName)) {
            if (node.childNodes.length === 1) {
                // Retrieve the unique node of div
                const uniqueNodeChild = node.childNodes[0];
                // @ts-ignore
                if (uniqueNodeChild.nodeName === "#text" && uniqueNodeChild.nodeValue.trim() === "") {
                    // Remove empty node div
                    node?.parentNode?.removeChild(node);
                }
            }
        }

        if (node.parentNode?.nodeName === "div" &&
            node.nodeValue?.includes('Última actualización: ')) {
            const nodeValue = node.nodeValue.trim();
            const paragraph = document.createElement('p');
            paragraph.appendChild(document.createTextNode(nodeValue))
            node.parentNode?.parentNode?.appendChild(paragraph);

            node.parentNode?.parentNode?.removeChild(node.parentNode);
        }

        if (node.childNodes?.length > 0) {
            iterateOverNodes(node.childNodes, document);
        }
    }
}

export class RemoverTags implements Parser {
    process(pathFile: string): void {
        fs.readFile(pathFile, 'utf-8', (err, data) => {
            if (err) {
                console.log('Error reading file: ' + path.basename(pathFile) + ' cause by ' + err)
            } else {
                const domParser = new DOMParser();
                const document = domParser.parseFromString(data);
                iterateOverNodes(document.childNodes, document);
                writeDocumentToFile(document, pathFile);
            }
        })
    }
}
