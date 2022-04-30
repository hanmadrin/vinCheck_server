import {changeFavicon,changeTitle} from './functions/shortHands.js';
import app from './views/app.js';
import view from './views/view.js';
import loader from './views/loader.js';
import toggleLoader from './functions/toggleLoader.js';
changeTitle('Sheikhcloud');
changeFavicon('/public/icons/favicon.ico');
app.setup();
loader();
toggleLoader(true);
await view();
window.onpopstate = async()=>{
    await view();
}
