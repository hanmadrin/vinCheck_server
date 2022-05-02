import loader from "../views/loader.js";
const toggleLoader = (show)=>{
    const neoLoader = loader();
    if(show){
        neoLoader.classList.remove('d-none');
    }else{
        neoLoader.classList.add('d-none');
    }  
}
export default toggleLoader;