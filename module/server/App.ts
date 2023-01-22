import express, {Express, Request, Response} from 'express'
import ReactDOMServer from 'react-dom/server';
import React from "react";
import {Template} from "./Template.js";
import fs from "fs";
import {DOMParser} from "@xmldom/xmldom";

function getDocumentFromFile(): Document | null {
    try {
        const data = fs.readFileSync('./Input/Acto/ActoLegislativo011993.xml', {encoding: 'utf-8'});
        const domParser = new DOMParser();
        return domParser.parseFromString(data);
    } catch (e) {
        console.error('Error reading file.', e)
        return null;
    }
}

export function startServer() {
    const app: Express = express()
    const port = 5100;

    app.use(express.static('public'))

    app.get('/', (req: Request, res: Response) => {
        let errorProcessingStream = false
        const stream = ReactDOMServer.renderToPipeableStream(
            React.createElement(Template),
            {
                bootstrapModules: ['/main.js'],
                onShellReady() {
                    res.statusCode = errorProcessingStream ? 501 : 200
                    res.set('Content-Type', 'text/html')
                    stream.pipe(res);
                },
                onShellError(error) {
                    res.statusCode = 502;
                    res.send(`<h1>Error Converting Stream: ${error} </h1>`)
                },
                onError(error) {
                    errorProcessingStream = true;
                    console.error(error);
                }
            }
        )
    })

    app.listen(port, () => {
        console.log(`[server]: Server is running at http://localhost:${port}`);
    })
}
