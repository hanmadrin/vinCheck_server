import notFound from "./notFound.js";
import logIn from "./logIn.js";
import toggleLoader from "../functions/toggleLoader.js";
import { sleep } from "../functions/shortHands.js";
import app from "./app.js";
import home from "./home.js";
const view = async ()=>{
    const path = window.location.pathname;
    toggleLoader(true);
    if(path==='/'){
        await home();
    }else if(path==='/login' || path==='/login/'){
        await logIn();
    }else{
        notFound();
    }
    // await sleep(1000);
    toggleLoader(false);
    app.setup();
}
export default view;