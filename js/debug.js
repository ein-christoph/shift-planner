var native_logger = null;
function enabledebug(arg){
    if(arg){
        if(native_logger == null)
            return;

        window['console']['log'] = native_logger;
    }else{
        native_logger = console.log;
        window['console']['log'] = function() {};
    }
};