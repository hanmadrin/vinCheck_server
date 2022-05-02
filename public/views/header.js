import style from '../styles/style.js';
import view from '../views/view.js';
import notify from '../functions/notify.js';
const header = () => {
    const neoHeader = document.createElement('div');
    neoHeader.className = style.neoHeader.main.join(' ');
    const logo = document.createElement('img');
    logo.className = style.neoHeader.logo.join(' ');
    logo.src = '/public/icons/logo.png'; 
    const logout = document.createElement('button');
    logout.className = style.neoHeader.logout.join(' ');
    logout.innerText = 'Logout';
    logout.addEventListener('click', async () => {
        const response = await fetch('/api/logout',{method:'GET'});
        if(response.status===200){
            window.history.pushState({},null,'/login');
            await view();
        }else{
            notify({data:'Log out failed',type:'danger'});
        }
    });
    const reset = document.createElement('button');
    reset.className = style.neoHeader.reset.join(' ');
    reset.innerText = 'System Reset';
    reset.addEventListener('click', async () => {
        const response = await fetch('/api/reset',{method:'POST'});
        if(response.status===200){
            await view();
        }else{
            notify({data:'Reset failed',type:'danger'});
        }
    });
    const buttonHolder = document.createElement('div');
    buttonHolder.className = style.neoHeader.buttonHolder.join(' ');
    buttonHolder.append(reset,logout);

    neoHeader.append(logo,buttonHolder);
    return neoHeader;
};
export default header;