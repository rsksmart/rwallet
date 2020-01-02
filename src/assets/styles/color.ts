

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
    component: {
        input: {
            backgroundColor: '#F3F3F3',
            borderColor: 'rgba(144,144,144,0.2)',
        },
        button: {
            backgroundColor: '#00b520',
            color: '#FFF',
        },
        passcodeModal: {
            backgroundColor: '#080808',
            title: {
                color: '#FFF',
                alert: '#FC4349',
            },
            dot: {
                borderColor: '#00B520'
            },
            dot2 : {
                backgroundColor: '#00B520',
            },
            button: {
                borderColor: '#9F9F9F',
            },
            cancel: {
                color: '#FFF',
            },
            char: {
                color: '#F3F3F3',
            },
            number: {
                color: '#F3F3F3',
            }
        },
        tags: {
            backgroundColor: '#0AB627',
            color: '#FFF',
        },
        iconList: {
            borderBottomColor: '#D5D5D5',
            title: {
                color: '#0B0B0B',
            },
            chevron: {
                color: '#D5D5D5',
            }
        },
        iconTwoTextList: {
            borderBottomColor: '#bbb',
            title: {
                color: '#0B0B0B',
            },
            text: {
                color: '#4A4A4A',
            }
        },
        selectionList: {
            color: '#2D2D2D',
        },
        dashLine: {
            backgroundColor: '#979797',
        },
        touchSensorModal: {
            color: '#000',
            backgroundColor: 'rgba(0,0,0,0.5)',
            panel: {
                backgroundColor: '#FFF',
            }
        },
        swipableButtonList: {
            backText: {
                color: '#FFF',
            },
            rowFront: {
                backgroundColor: '#FFF',
            },
            backLeftBtnLeft: {
                backgroundColor: '#545455',
            },
            backRightBtnLeft: {
                backgroundColor: '#5866AF',
            },
            backRightBtnRight: {
                backgroundColor: '#60BA52',
            },
            right: {
                borderBottomColor: '#EDEDED',
            },
            title: {
                color: '#042C5C',
            },
            text: {
                color: '#77869E',
            },
            worth: {
                color: '#000',
            },
            amount: {
                color: '#77869E',
            }
        }
    },
    ...styleScript(),
};



export default color;
