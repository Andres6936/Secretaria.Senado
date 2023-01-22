import {hydrateRoot} from "react-dom/client.js";
import {Template} from "../module/server/Template.js";

hydrateRoot(document, React.createElement(Template))
