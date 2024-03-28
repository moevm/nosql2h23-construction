function checkingRights(role, id){
    console.log(id === 'positions')
    switch(role){
        case 'Worker':
           if (id === 'positions'){ 
                window.location.href = '/positions';
                return true;
           }else{
            console.log("doesn't have rights")
            $('.ui.basic.modal').modal('show');
            return false;
           } 
           break;
       
       case 'StoreKeeper':
           if (id === 'warehouse'){
                window.location.href = '/warehouse';
                return true;
           }else{
               $('.ui.basic.modal').modal('show');
               return false;
           }

           break;
       case 'Foreman':
           console.log("we are in foreman", id, role)
           switch(id){
            case 'positions': window.location.href = '/positions';  break;
            case 'invoices': window.location.href = '/invoices';  break;
            case 'warehouse': window.location.href = '/warehouse'; break;
            case 'statistics': window.location.href = '/statistics'; break;
            case 'backup': window.location.href = '/backup'; break;
           }

           break;
    }
}
