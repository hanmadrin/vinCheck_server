import toggleLoader from "../functions/toggleLoader.js";
import { sleep } from "../functions/shortHands.js";
import app from "./app.js";
import home from "./home.js";
const view = async ()=>{
    const path = window.location.pathname;
    toggleLoader(true);
    await home();
    toggleLoader(false);
    app.setup();
}
export default view;