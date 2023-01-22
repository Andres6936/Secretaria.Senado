import ReactDOMServer from 'react-dom/server'
import {StaticRouter} from 'react-router-dom/server'
import {Template} from "./Template.js";

export function render(url, context) {
    return ReactDOMServer.renderToString(
        <StaticRouter location={url} context={context}>
            <Template/>
        </StaticRouter>,
    )
}
