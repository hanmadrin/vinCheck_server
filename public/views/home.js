import app from "./app.js";
import view from "./view.js";
import style from "../styles/style.js";
import header from "./header.js";
import notify from "../functions/notify.js";
import toggleLoader from "../functions/toggleLoader.js";
const home = async () => {
    try{
        const response = await fetch('/api/isLoggedIn', {method: 'GET',});
        if(response.status!==200){
            window.history.pushState({},null,'/login');
            await view();
            return null;
        }
    }catch{console.log('try logging in')};
    try{
        const response = await fetch('/api/situation', {method: 'GET',});
        if(response.status===200){
            const data = await response.json();
            const root = document.getElementById(app.id);
            const home = document.createElement("div");
            home.className = style.home.main.join(" ");
            const neoHeader = header();
            const contentHolder  = document.createElement('div');
            contentHolder.className = style.home.contentHolder.join(' ');
            

            const dynamicContent = (data) => {
                const neoDynamicContent = document.createElement('div');
                neoDynamicContent.className = style.home.neoDynamicContent.main.join(' ');
                if(!data.inputFileExists && !data.outputFileExists && data.leftVin==0){
                // if(true){
                    const title = document.createElement('h4');
                    title.className = style.home.neoDynamicContent.title.join(' ');
                    const inputHolder = document.createElement("div");
                    inputHolder.className = style.home.neoDynamicContent.inputHolder.join(' ');
                    const input = document.createElement("input");
                    input.className = style.home.neoDynamicContent.input.join(' ');
                    title.innerText = 'Please, provide csv input file!'
                    input.type = "file";
                    input.setAttribute('accept','.csv');
                    input.addEventListener('change',async ()=>{
                        const formData = new FormData();
                        if(input.files.length!==0){
                            toggleLoader(true);
                            formData.append('file_upload',input.files[0]);
                            const response = await fetch('/api/fileUpload',{method:'POST',body:formData});
                            if(response.status===200){
                                await view();
                            }else if(response.status===201){
                                notify(await response.json());
                            }else{
                                notify({data:'Input file upload failed',type:'danger'});
                            }
                            toggleLoader(false);
                        }
                    });
                    inputHolder.append(input);
                    neoDynamicContent.append(title,inputHolder);
                    return neoDynamicContent;
                }else if(data.inputFileExists && !data.outputFileExists && data.leftVin>=0){
                    const title = document.createElement('h4');
                    title.className = style.home.neoDynamicContent.title.join(' ');
                    // const holder = document.createElement("div");
                    // holder.className = style.home.neoDynamicContent.progressHolder.join(' ');
                    title.innerText = 'File processing....';
                    const progressHolder = document.createElement("div");
                    progressHolder.className = style.home.neoDynamicContent.progressHolder.join(' ');
                    const progressTitle = document.createElement("div");
                    const interval = setInterval(async ()=>{
                        const response = await fetch('/api/situation',{method:'GET'});
                        if(response.status===200){
                            const dynData = await response.json();
                            if(dynData.leftVin!==0){
                                // progressTitle.innerText = `${dynData.doneVin}/${dynData.totalVin}`;
                                progressTitle.innerText = dynData.leftTime;
                            }else{
                                clearInterval(interval);
                                await view();
                            }
                        }
                    },5000);
                    progressTitle.innerText = `${data.doneVin}/${data.totalVin} ${data.leftTime}`;
                    progressTitle.className = style.home.neoDynamicContent.progressTitle.join(' ');
                    const progress = document.createElement('div');
                    progress.className = style.home.neoDynamicContent.progress.join(' ');
                    progressHolder.append(progressTitle,progress);
                    neoDynamicContent.append(title,progressHolder);

                    return neoDynamicContent;
                }else if(!data.inputFileExists && data.outputFileExists && data.leftVin==0){
                    const title = document.createElement('h4');
                    title.className = style.home.neoDynamicContent.title.join(' ');
                    const inputHolder = document.createElement("div");
                    inputHolder.className = style.home.neoDynamicContent.inputHolder.join(' ');
                    const button = document.createElement("button");
                    button.className = style.home.neoDynamicContent.button.join(' ');
                    title.innerText = 'Download Output file';                    
                    button.type = 'button';
                    button.innerText = 'Download';
                    button.addEventListener('click',async ()=>{
                        window.open(`/api/download`);
                    });
                    inputHolder.append(button);
                    neoDynamicContent.append(title,inputHolder);
                    return neoDynamicContent;
                }else{
                    console.log(`${!data.inputFileExists}  ${data.outputFileExists}  ${data.leftVin==0}`)
                    const title = document.createElement('h4');
                    title.className = style.home.neoDynamicContent.title.join(' ');
                    const inputHolder = document.createElement("div");
                    inputHolder.className = style.home.neoDynamicContent.inputHolder.join(' ');
                    const button = document.createElement("button");
                    button.className = style.home.neoDynamicContent.reset.join(' ');
                    title.innerText = 'Something went wrong! Please, Perform system reset or Contact with Developer!'
                    button.type = 'button';
                    button.innerText = 'System Reset';
                    button.addEventListener('click',async ()=>{
                        toggleLoader(true);
                        const response = await fetch('/api/reset',{method:'POST'});
                        if(response.status===200){
                            await view();
                        }else{
                            notify({data:'Reset failed',type:'danger'});
                        }
                        toggleLoader(false);
                    });
                    inputHolder.append(button);
                    neoDynamicContent.append(title,inputHolder);
                    return neoDynamicContent;
                }
                
            };
            contentHolder.append(dynamicContent(data));
            home.append(neoHeader,contentHolder);
            root.replaceChildren(home);
        }else{
            notify({data:'You are not allowed to access this page',type:'danger'});
        }
    }catch(err){console.log(err)};
}
export default home;