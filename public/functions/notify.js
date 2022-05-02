import style from "../styles/style.js";
import { sleep } from "./shortHands.js";
const notify = async ({data,type})=>{
    const neoNotify = document.createElement('div');
    neoNotify.onclick = ()=>{
        neoNotify.remove();
    }
    neoNotify.className = style.neoNotify.main.join(' ');
    const notification = document.createElement('div');
    notification.className = style.neoNotify.notification.join(' ');
    notification.classList.add(`bg-${type}`);
    notification.innerText = data;
    neoNotify.appendChild(notification);
    document.body.appendChild(neoNotify);
    await sleep(1200);
    
    neoNotify.remove();
};
export default notify;