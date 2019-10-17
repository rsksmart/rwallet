import color from "./color";

const font = {
    size : {
        12 : {
            fontSize : 12
        },
        13 : {
            fontSize : 13
        },
        14 : {
            fontSize : 14
        },
        15 : {
            fontSize : 15
        },
        18 : {
            fontSize : 18
        },
        24 : {
            fontSize : 24
        },
    },
    bold : {
        fontWeight : "bold",
    },
    color : {
        standard : {
            color : color.app.standard,
        },
        imp : {
            color : color.app.fontImp,
        },
        normal : {
            color : color.app.fontNormal,
        },
        assist : {
            color : color.app.fontAssist,
        },
        pink : {
            color : color.app.soundProgress,
        },
        white : {
            color : "#ffffff",
        },
    },
    lineHeight : {
        15 : {
            lineHeight: 15
        },
        18 : {
            lineHeight: 18
        },
        20 : {
            lineHeight: 20
        },
        22 : {
            lineHeight: 22
        },
        24 : {
            lineHeight: 24
        },
        34 : {
            lineHeight: 34
        },
        42 : {
            lineHeight: 42
        }
    },
    border : {
        16: {
            borderRadius: 16
        }
    },
};

export default font;
