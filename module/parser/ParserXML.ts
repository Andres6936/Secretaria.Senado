import {Parser} from "./Parser.js";
import {DOMParser, XMLSerializer} from '@xmldom/xmldom'
import xmlFormat from 'xml-formatter'
import path from "path";
import fs from "fs";

export function writeDocumentToFile(document: Document, pathFile: string) {
    const serializer = new XMLSerializer()
    const stream = xmlFormat(serializer.serializeToString(document));
    try {
        fs.writeFileSync(pathFile, stream, {encoding: 'utf-8'})
    } catch (err2) {
        console.log('Error writing file: ' + path.basename(pathFile))
    }
}

export function deleteDocument(pathFile: string) {
    fs.unlink(pathFile, (error) => {
        if (error) {
            console.log('Error deleting file: ' + path.basename(pathFile))
        }
    })
}

export class ParserXML implements Parser {
    public process(pathFile: string): void {
        if (path.extname(pathFile) === '.xml') {
            fs.readFile(pathFile, 'utf-8', (err1, data) => {
                if (err1) {
                    console.log('Error reading file: ' + path.basename(pathFile) + ' cause by ' + err1)
                } else {
                    const domParser = new DOMParser();
                    const document = domParser.parseFromString(`
                    <xml version="1.0" encoding="UTF-8">
                        <body>
                            ${data}
                        </body>
                    </xml>
                    `, "text/xml");
                    document.normalize();
                    writeDocumentToFile(document, pathFile + '.xml');
                    // Deleted the old document
                    deleteDocument(pathFile);
                }
            })
        }
    }
}
