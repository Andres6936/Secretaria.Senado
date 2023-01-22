import express, {Express, Request, Response} from 'express'
import fs from "fs";
import {DOMParser} from "@xmldom/xmldom";
import path from "path";
import {fileURLToPath} from "url";
import {ViteDevServer} from "vite";

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

interface Context {
    url?: string | undefined
}

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export async function startServer(
    root: string = process.cwd(),
    isProd: boolean = process.env.NODE_ENV === "production",
    hmrPort: number | undefined = undefined,
) {
    const resolve = (p: string) => path.resolve(__dirname, p);
    const indexProduction = isProd
        ? fs.readFileSync(resolve('dist/client/index.html'), 'utf-8')
        : "";

    const app: Express = express()

    let vite: ViteDevServer | undefined = undefined;

    if (isProd) {
        app.use((await import('compression')).default());
        app.use((await import('serve-static')).default(resolve('dist/client'), {
            index: false
        }))
    } else {
        vite = await (await import('vite')).createServer({
            root,
            logLevel: "info",
            server: {
                middlewareMode: true,
                watch: {
                    usePolling: true,
                    interval: 100,
                },
                hmr: {
                    port: hmrPort,
                },
            },
            appType: "custom"
        })
        app.use((await import('serve-static')).default(resolve('dist/client'), {
            index: false
        }))
    }

    app.use('*', async (req: Request, res: Response) => {
        try {
            const url = req.originalUrl

            let template, render
            if (isProd) {
                template = indexProduction;
                // @ts-ignore
                render = (await import('./dist/server/entry-server.js').render)
            } else {
                template = fs.readFileSync(resolve('index.html'), 'utf-8')
                template = await vite?.transformIndexHtml(url, template);
                render = (await vite?.ssrLoadModule('/src/entry-server.jsx'))?.render
            }

            const context: Context = {}
            const appHtml = render(url, context);

            if (context.url) {
                // Somewhere a `<Redirect>` was rendered
                return res.redirect(301, context.url)
            }

            const html = template?.replace('<!--app-html-->', appHtml);
            res.status(200).set({'Content-Type': "text/html"}).end(html)
        } catch (e) {
            !isProd && vite?.ssrFixStacktrace(e as Error);
            console.log((e as Error).stack);
            res.status(500).end((e as Error).stack);
        }
    })

    return {app, vite}
}

(async () => {
    const {app} = await startServer();
    app.listen(5100, () => {
        console.log('http://localhost:5100')
    })
})();
