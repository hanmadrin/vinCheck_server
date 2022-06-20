import style from '../styles/style.js';
import view from '../views/view.js';
import notify from '../functions/notify.js';
const header = (situation) => {
    const neoHeader = document.createElement('div');
    neoHeader.id = 'neoHeader';
    neoHeader.className = style.neoHeader.main.join(' ');
    const logo = document.createElement('img');
    logo.className = style.neoHeader.logo.join(' ');
    logo.src = '/public/icons/logo.png'; 
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
    const restart = document.createElement('button');
    restart.className = style.neoHeader.restart.join(' ');
    restart.innerText = 'Start/Restart Scraping';
    restart.addEventListener('click', async () => {
        const response = await fetch('/puppet/restart',{method:'GET'});
        if(response.status===200){
            await view();
        }else{
            notify({data:'Restart failed',type:'danger'});
        }
    });
    const download = document.createElement('button');
    download.className = style.neoHeader.download.join(' ');
    download.innerText = 'Download Output file';
    download.addEventListener('click', async () => {
        window.open(`/api/download`);
    });

    const time = document.createElement('div');
    time.className = style.neoHeader.time.join(' ');
    time.innerText = `${situation.leftTime}`;

    const buttonHolder = document.createElement('div');

    buttonHolder.append(download,restart,reset);
    neoHeader.append(logo,time,buttonHolder);
    return neoHeader;
};
export default header;