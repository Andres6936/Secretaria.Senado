import fs from 'fs';
import path from 'path';
import {Parser} from "./module/parser/Parser.js";
import {ParserHTML} from './module/parser/ParserHTML.js'
import {ParserXML} from "./module/parser/ParserXML.js";
import {TypeEvent} from "./module/parser/TypeEvent.js";
import {RenameFiles} from "./module/parser/RenameFiles.js";
import {RemoverTags} from "./module/parser/RemoverTags.js";
import {startServer} from "./module/server/App.js";

const PARENT_DIRECTORY = "Input/"

function processDirectory(directory: string, processor: Parser) {
    fs.readdir(directory, (err, files) => {
        for (const file of files) {
            const pathFile = path.join(directory, file)
            fs.lstat(pathFile, (err, stats) => {
                if (err) {
                    console.error('Error processing file' + err)
                } else if (stats.isDirectory()) {
                    processDirectory(pathFile, processor)
                } else if (stats.isFile()) {
                    processor.process(pathFile)
                }
            })
        }
    })
}

(async () => {
    const events = process.argv.slice(2);

    switch (events.at(0)) {
        case TypeEvent.PARSER_HTML:
            processDirectory(PARENT_DIRECTORY, new ParserHTML());
            break;
        case TypeEvent.PARSER_XML:
            processDirectory(PARENT_DIRECTORY, new ParserXML());
            break;
        case TypeEvent.RENAME_FILES:
            processDirectory(PARENT_DIRECTORY, new RenameFiles());
            break;
        case TypeEvent.REMOVER_TAGS:
            processDirectory(PARENT_DIRECTORY, new RemoverTags());
            break;
        case TypeEvent.START_SERVER:
            startServer();
            break;
        default:
            console.error('Unknown arguments to parse')
    }
})()
