import style from "../styles/style.js";
const loader = ()=>{
    try{
        if(document.getElementById('neoLoader')===null){
            const neoLoader = document.createElement('div');
            neoLoader.id = 'neoLoader';
            neoLoader.className = style.neoLoader.main.join(' ');
            const loaderHolder = document.createElement('div');
            loaderHolder.className = style.neoLoader.loaderHolder.join(' ');
            const loader = document.createElement('div');
            loader.className = style.neoLoader.loader.join(' ');
            loaderHolder.appendChild(loader);
            neoLoader.appendChild(loaderHolder);
            document.body.appendChild(neoLoader);
        }
        return document.getElementById('neoLoader');
    }catch(error){
        console.log(error);
    }
}
export default loader;