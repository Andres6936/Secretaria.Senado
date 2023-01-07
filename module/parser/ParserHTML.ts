import {Parser} from "./Parser.js";
import path from "path";
import fs from "fs";
import sanitize from "sanitize-html";

export class ParserHTML implements Parser {
    public process(pathFile: string): void {
        if (path.extname(pathFile) === '.html') {
            fs.readFile(pathFile, 'utf-8', (err1, data) => {
                if (err1) {
                    console.log('Error reading file: ' + path.basename(pathFile) + ' cause by ' + err1)
                } else {
                    const cleanHTML = sanitize(data, {
                        allowedTags: sanitize.defaults.allowedTags.concat(['title'])
                    })
                    try {
                        fs.writeFileSync(pathFile + '.xml', cleanHTML, {encoding: 'utf-8'})
                    } catch (err2) {
                        console.log('Error writing file: ' + path.basename(pathFile))
                    }
                }
            })
        }
    }
}
