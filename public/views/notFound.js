import style from "../styles/style.js";
import app from "./app.js";
import view from "./view.js";
const notFound = ()=>{
    const root = document.getElementById(app.id);
    const neoNotFound = document.createElement('div');
    neoNotFound.className = style.neoNotFound.main.join(' ');
    const neoNotFoundTitle = document.createElement('h1');
    neoNotFoundTitle.innerText = '404 NOT FOUND';
    const logo = document.createElement('img');
    logo.src = '/public/icons/logo.png';
    const homeButton = document.createElement('button');
    homeButton.innerText = 'Home';
    homeButton.classList.add('btn');
    homeButton.addEventListener('click',async ()=>{
        window.history.pushState({},null,'/');
        await view();
    });
    neoNotFound.append(logo,neoNotFoundTitle,homeButton);
    root.replaceChildren(neoNotFound);
}
export default notFound;