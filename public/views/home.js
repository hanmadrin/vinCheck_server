import app from "./app.js";
import view from "./view.js";
import style from "../styles/style.js";
import header from "./header.js";
import notify from "../functions/notify.js";
import toggleLoader from "../functions/toggleLoader.js";
const home = async () => {
    try{
        const response = await fetch('/api/situation', {method: 'GET',});
        if(response.status===200){
            const data = await response.json();
            const root = document.getElementById(app.id);
            const home = document.createElement("div");
            home.className = style.home.main.join(" ");
            const neoHeader = header(data);
            const contentHolder  = document.createElement('div');
            contentHolder.className = style.home.contentHolder.join(' ');
            
            const setupData = async (vins)=>{
                //console.log('inside setupData');
                if(vins==null){
                    const response = await fetch('/api/situation',{method:'GET'});
                    if(response.status===200){
                        const data = await response.json();
                        vins = data.vins;
                    }
                }
                const neoHeader = header(data);
                const oldHeader = document.getElementById('neoHeader');
                oldHeader.replaceWith(neoHeader);
                for(let i=0;i<vins.length;i++){
                    const tr = document.getElementById(vins[i].vin);
                    if(tr!=null){
                        tr.querySelectorAll('td').forEach(td=>{
                            if(td.className!='action'){
                                td.innerText = vins[i][td.className];
                            }else{
                                if(vins[i].status=='skipped' && vins[i].kbb_status=='skipped'){
                                    const button = td.querySelector('button');
                                    button.disabled = true;
                                }
                            }
                        })
                    }
                }
            };
            const dynamicContent = (data) => {
                const neoDynamicContent = document.createElement('div');
                
                if(!data.inputFileExists){
                    neoDynamicContent.className = style.home.neoDynamicContent.main.join(' ');
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
                }else{
                    contentHolder.className = '';
                    const table = document.createElement('table');
                    table.className = 'table table-striped table-bordered table-hover';
                    const trh = document.createElement('tr');
                    const columns = ['Serial','VIN','Mileage','AutoCheck Status','Accident Count','Problem Count','Kbb Status','Year','Vehicle Name','Transmission & Engine','Trade In value','Failed Attempts','Action'];   
                    for(let i=0;i<columns.length;i++){
                        const td = document.createElement('td');
                        td.innerText = columns[i];
                        trh.append(td);
                    }                 
                    table.append(trh);
                    const tbody = document.createElement('tbody');
                    for(let i=0;i<data.vins.length;i++){
                        const tr = document.createElement('tr');
                        tr.id = data.vins[i].vin;
                        const vin = data.vins[i];
                        const td1 = document.createElement('td');
                        td1.className = 'serial';
                        td1.innerText = i;
                        const td2 = document.createElement('td');
                        td2.innerText = vin.vin;
                        td2.className = 'vin';
                        const td3 = document.createElement('td');
                        td3.innerText = vin.mileage;
                        td3.className = 'mileage';
                        const td4 = document.createElement('td');
                        td4.innerText = vin.status;
                        td4.className = 'status';
                        const td5 = document.createElement('td');
                        td5.innerText = vin.accident_count;
                        td5.className = 'accident_count';
                        const td6 = document.createElement('td');
                        td6.innerText = vin.problem_count;
                        td6.className = 'problem_count';
                        const td7 = document.createElement('td');
                        td7.innerText = vin.kbb_status;
                        td7.className = 'kbb_status';
                        const td8 = document.createElement('td');
                        td8.innerText = vin.kbb_year;
                        td8.className = 'kbb_year';
                        const td9 = document.createElement('td');
                        td9.innerText = vin.kbb_vehicle;
                        td9.className = 'kbb_vehicle';
                        const td10 = document.createElement('td');
                        td10.innerText = vin.kbb_engine_trim;
                        td10.className = 'kbb_engine_trim';
                        const td11 = document.createElement('td');
                        td11.innerText = vin.kbb_tradeInValue;
                        td11.className = 'kbb_tradeInValue';
                        const td12 = document.createElement('td');
                        td12.innerText = vin.failed;
                        td12.className = 'failed';
                        const td13 = document.createElement('td');
                        td13.className = 'action';
                        const button = document.createElement('button');
                        // button.className = style.home.neoDynamicContent.button.join(' ');
                        button.innerText = 'Skip';
                        if(vin.status!==null && vin.kbb_status!==null){
                            button.disabled = true;
                        }
                        button.addEventListener('click',async ()=>{
                            const response = await fetch(`/api/vin/skip/${vin.vin}`,{method:'POST'});
                            await setupData();
                        });
                        td13.append(button);
                        tr.append(td1,td2,td3,td4,td5,td6,td7,td8,td9,td10,td11,td12,td13);
                        tbody.append(tr);
                    }
                    table.append(tbody);
                    const interval = setInterval(async ()=>{
                        const response = await fetch('/api/situation',{method:'GET'});
                        if(response.status===200){
                            const dynData = await response.json();
                            const neoHeader = header(dynData);
                            const oldHeader = document.getElementById('neoHeader');
                            oldHeader.replaceWith(neoHeader);
                            if(dynData.leftVin!==0){
                                await setupData(dynData.vins);
                            }else{
                                clearInterval(interval);
                                await view();
                            }
                        }
                    },10000);
                    neoDynamicContent.append(table);
                    return neoDynamicContent;
                }
                
            };
            contentHolder.append(dynamicContent(data));
            home.append(neoHeader,contentHolder);
            root.replaceChildren(home);
        }else{
            notify({data:'You are not allowed to access this page',type:'danger'});
        }
    }catch(err){
        //console.log(err)
    };
}
export default home;