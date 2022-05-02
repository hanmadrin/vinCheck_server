const style = {
    home: {
        main: ['d-flex','flex-column','vw-100','vh-100','justify-content-betwwen'],
        logo: ['margin-auto'],
        contentHolder: ['d-flex','justify-content-center','align-items-center','flex-column','h-100'],
        neoDynamicContent:{
            main: ['w-500px','h-250px','bg-light','p-3','border','border-info','border-3','rounded','shadow','d-flex','flex-column'],
            title: ['text-center'],
            inputHolder: ['my-2','w-100','justify-content-center','flex-column','d-flex','h-100'],
            progressHolder: ['w-100','justify-content-center','flex-column','d-flex','h-100'],
            input:['form-control','p-6px'],
            progress: ['loader-line'],
            progressTitle: ['text-center'],
            button: ['btn','btn-info','btn-block'],
            reset: ['btn','btn-danger','btn-block']
        }
    },
    neoNotFound:{
        main: ['vh-100','vw-100','d-flex','flex-column','justify-content-center','align-items-center'],
    },
    neoLoader:{
        main: ['position-fixed','vw-100','vh-100','top-0','start-0','zindex-fixed','d-none'],
        loaderHolder:['position-absolute','top-50','start-50','translate-middle'],
        loader: ['border-solid','border-15px','border-rounded','border-top-warning','border-end-success','border-bottom-danger','border-start-primary','h-120px','w-120px','animate-spin-linear-infinite-1s']
    },
    neoNotFound:{
        main: ['vh-100','vw-100','d-flex','flex-column','justify-content-center','align-items-center'],
    },
    neoLogIn:{
        main: ['vh-100','vw-100','d-flex','flex-column','justify-content-center','align-items-center','top-0','start-0','position-relative'],
        contents:['position-absolute','bg-dark-0','top-50','start-50','translate-middle','border','p-5','bg-info','rounded','shadow-lg'],
        logo: ['h-100px','d-block','align-items-center','margin-auto'],
        username: ['d-block','border-radius-15px','box-shadow-3d','text-center','w-200px','mt-4','m-auto','box-size-border-box','outline-none','border-0','p-2','pt-3'],
        password: ['d-block','border-radius-15px','box-shadow-3d','text-center','w-200px','mt-4','m-auto','box-size-border-box','outline-none','border-0','p-2','pt-3'],
        button: ['d-block','mt-4','m-auto','btn','box-size-border-box','outline-none','p-2','pt-3','w-200px']
    },
    neoNotify:{
        main: ['position-fixed','end-30px','top-30px','cursor-pointer'],
        notification:['text-white','p-3','border-radius-5px']
    },
    neoHeader:{
        main: ['bg-info','d-flex','justify-content-between','p-2'],
        logo: ['w-40px'],
        logout: ['btn','p-2'],
        reset: ['btn','btn-danger','p-2'],
        buttonHolder: ['d-flex','justify-content-between','w-200px']
    },
};
export default style;