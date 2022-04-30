const changeFavicon = (iconUrl) => {
    try {
        const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
        link.type = 'image/x-icon';
        link.rel = 'shortcut icon';
        link.href = iconUrl;
        document.getElementsByTagName('head')[0].appendChild(link);
    } catch (error) {
        console.log(error);
    }
}
const changeTitle = (title) => {
    try {
        document.title = title;
    } catch (error) {
        console.log(error);
    }
}
const sleep = async (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}
export {changeFavicon,changeTitle,sleep};