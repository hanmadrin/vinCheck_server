import app from "./app.js";
import style from "../styles/style.js";
import { changeTitle } from "../functions/shortHands.js";
import notify from "../functions/notify.js";
import view from "./view.js";
const logIn = async () => {
    try{
        const response = await fetch('/api/isLoggedIn', {method: 'GET',});
        if(response.status===200){
            window.history.pushState({},null,'/');
            await view();
            return null;
        }
    }catch{};
    changeTitle('Log In | VinCheck');
    const root = document.getElementById(app.id);
    const neoLogIn = document.createElement("div");
    neoLogIn.className = style.neoLogIn.main.join(" ");
    const contents = document.createElement("div");
    contents.className = style.neoLogIn.contents.join(" ");
    const logo = document.createElement("img");
    logo.src = "./public/icons/logo.png";
    logo.className = style.neoLogIn.logo.join(' ');

    const username = document.createElement("input");
    username.type = "text";
    username.className = style.neoLogIn.username.join(' ');
    username.placeholder = "Username";

    const password = document.createElement("input");
    password.type = "password";
    password.className = style.neoLogIn.password.join(' ');
    password.placeholder = "Password";

    const button = document.createElement("button");
    button.innerText = "Log In";
    button.className = style.neoLogIn.button.join(' ');
    button.addEventListener('click',async ()=>{
        const usernameValue = username.value;
        const passwordValue = password.value;
        if(usernameValue.length>0 && passwordValue.length>0){
            const response = await fetch(`/api/login`,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: usernameValue,
                    password: passwordValue
                })
            });
            // const data = await response.json();
            if(response.status===200){
                window.history.pushState({},null,'/');
                await view();
            }else{
                notify({data:'Log in failed',type:'danger'});
            }
        }else{
            notify({data:'Please, Check all the fields',type:'warning'});
        }
    });
    contents.append(logo,username,password,button);
    neoLogIn.append(contents);
    root.replaceChildren(neoLogIn);
}
export default logIn;