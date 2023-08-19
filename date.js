
module.exports.getDate = GetDate;

function GetDate(){
    var today = new Date();
    //var Current_Day = today.getDay();
    var day ="";

    var options = { 
        weekday :"long" , 
        day:"numeric" ,
        month: "long"
    };

    day = today.toLocaleDateString("en-US" , options );
    return day;
}

module.exports.getDay = GetDay;

function GetDay(){
    var today = new Date();
    //var Current_Day = today.getDay();
    var day ="";

    var options = { 
        weekday :"long" , 
        //day:"numeric" ,
        //month: "long"
    };

    day = today.toLocaleDateString("en-US" , options );
    return day;   
}

//console.log(module.exports);