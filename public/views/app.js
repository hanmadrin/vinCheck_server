const app ={
    id: 'neoApp',
    node: document.createElement('div'),
    url: window.location.host,
    setup: ()=>{
        app.node.id = app.id;
        document.body.replaceChildren(app.node);
    }
};
export default app;