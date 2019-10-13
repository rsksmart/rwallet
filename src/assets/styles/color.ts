

let aColor = ["aqua", "black", "blue", "fuchsia", "gray", "green", "lime", "maroon", "navy", "olive", "orange", "purple", "red", "silver", "teal", "white", "yellow"];
let oCustomColors:any = {
    app_primary : "",          //primary color
    app_bg : "#ffffff",        //background
    app_gray : "#cccccc",      //gery
};
let aAcceptor = ["backgroundColor", "color", "borderColor",];
let aTitle = ["bg", "font", "border",];

function styleScript() {
    let style:any = {};
    for(let i =0;i < aAcceptor.length; i++){
        let _title = aTitle[i];
        let _aAcceptor = aAcceptor[i];
        let lev1:any = {};
        // colors
        aColor.forEach((colorItem)=>{
            let lev2:any = {};
            lev2[_aAcceptor] = colorItem;
            lev1[colorItem] = lev2
        });
        // custom colors
        for(let key in oCustomColors){
            let value = oCustomColors[key];
            let lev2:any = {};
            lev2[_aAcceptor] = value;
            lev1[key] = lev2;
        }
        style[_title] = lev1;
    }
    return style;
}


const color = {

    // only used for IDE
    bg :     {"bg": {} ,"primary":{} ,"aqua":{}, "black":{}, "blue":{}, "fuchsia":{}, "gray":{}, "green":{}, "lime":{}, "maroon":{}, "navy":{}, "olive":{}, "orange":{}, "purple":{}, "red":{}, "silver":{}, "teal":{}, "white":{}, "yellow":{}},
    font :   {"bg": {} ,"primary":{} ,"aqua":{}, "black":{}, "blue":{}, "fuchsia":{}, "gray":{}, "green":{}, "lime":{}, "maroon":{}, "navy":{}, "olive":{}, "orange":{}, "purple":{}, "red":{}, "silver":{}, "teal":{}, "white":{}, "yellow":{}},
    border : {"bg": {} ,"primary":{} ,"aqua":{}, "black":{}, "blue":{}, "fuchsia":{}, "gray":{}, "green":{}, "lime":{}, "maroon":{}, "navy":{}, "olive":{}, "orange":{}, "purple":{}, "red":{}, "silver":{}, "teal":{}, "white":{}, "yellow":{}},
    //end
    app : {
        standard : "#df394d",
        fontImp : "#333333",
        fontNormal : "#666666",
        fontAssist :  "#999999",
        naviLine : "#e5e5e5",
        inputLine : "#cccccc",
        btnApricot : "#fff3f1",
        soundProgress : "#ffb9be",
        bg : "#f9f9f8",
        fontVIP : "#904829",
        inputBg : "#f2f2f2"
    },
    ...styleScript(),
};



export default color;
