import {Parser} from "./Parser.js";
import path from "path";
import fs from "fs";

export class RenameFiles implements Parser {
    private capitalizeFirstLetter(value: string): string {
        return value.charAt(0).toUpperCase() + value.slice(1);
    }

    public process(pathFile: string): void {
        const filename = path.basename(pathFile, '.html.xml.xml');
        const newFilename = filename
            .split('_')
            .map(this.capitalizeFirstLetter)
            .join('')
            .concat('.xml')
        const newPath = path.join(path.dirname(pathFile), newFilename)
        fs.rename(pathFile, newPath, (err) => {
            if (err) {
                console.log('Cannot renamed file: ' + filename)
            }
        })
    }
}
