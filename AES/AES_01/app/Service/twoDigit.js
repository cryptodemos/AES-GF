/**
 * Created by shannon_z on 12/12/16.
 */

myApp.service("toTwoDigit", function(){
    this.two = function(val){
        return (val.length<2)?"0"+val:val;
    };
    this.eight = function(val){
        return (val.length<8)?"0"+val:val;
    };

    this.toBin = function(val){
        return ("00000000" + parseInt(val,16).toString(2)).substring(("00000000" + parseInt(val,16).toString(2)).length - 8);
    };
});