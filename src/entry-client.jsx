import ReactDOM from 'react-dom/client'
import {BrowserRouter} from 'react-router-dom'
import {Template} from "./Template";

ReactDOM.hydrateRoot(
    document.getElementById('app'),
    <BrowserRouter>
        <Template/>
    </BrowserRouter>,
)

console.log('hydrated')
