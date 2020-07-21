import _ from 'lodash';

const aColor = ['aqua', 'black', 'blue', 'fuchsia', 'gray', 'green', 'lime', 'maroon', 'navy', 'olive', 'orange', 'purple', 'red', 'silver', 'teal', 'white', 'yellow'];
const oCustomColors = {
  app_primary: '', // primary color
  app_bg: '#ffffff', // background
  app_gray: '#cccccc', // gery
};
const aAcceptors = ['backgroundColor', 'color', 'borderColor'];
const aTitle = ['bg', 'font', 'border'];

function styleScript() {
  const style = {};
  for (let i = 0; i < aAcceptors.length; i += 1) {
    const title = aTitle[i];
    const aAcceptor = aAcceptors[i];
    const lev1 = {};
    // colors
    aColor.forEach((colorItem) => {
      const lev2 = {};
      lev2[aAcceptor] = colorItem;
      lev1[colorItem] = lev2;
    });

    // custom colors
    const keys = Object.keys(oCustomColors);
    _.each(keys, (key) => {
      const value = oCustomColors[key];
      const lev2 = {};
      lev2[aAcceptor] = value;
      lev1[key] = lev2;
    });
    style[title] = lev1;
  }
  return style;
}


const color = {
  // transparent
  transparent: 'transparent',

  // gray
  white: '#FFF',
  black: '#000',
  gray: 'gray',
  grayD5: '#D5D5D5',
  grayD1: '#D1D1D1',
  grayD8: '#D8D8D8',
  grayED: '#EDEDED',
  gray06: '#060606',
  gray97: '#979797',
  grayAB: '#ABABAB',
  gray53: '#535353',
  grayF2: '#F2F2F2',
  gray91: '#919191',
  gray93: '#939393',
  grayEB: '#EBEBEB',
  grayB1: '#B1B1B1',
  grayB5: '#B5B5B5',
  codGray: '#0B0B0B',
  doveGray: '#666666',
  lightGray: '#CBC6C6',
  dustyGray: '#9B9B9B',
  gainsboro: '#DCDCDC',
  tundora: '4A4A4A',
  silver: '#BBB',
  alto: '#DDD',
  gallery: '#EEE',
  nevada: '#656667',
  emperor: '#515151',
  silverChalice: '#ACACAC',
  mineShaft: '#2D2D2D',
  nobel: '#B6B6B6',
  concrete: '#F3F3F3',
  wildSand: '#F5F5F5',
  snowDrift: '#F3F7F4',

  // blue
  lynch: '#77869E',
  shipCove: '#6875B7',
  azureRadiance: '#008CFF',
  vividBlue: '#028CFF',
  greenVogue: '#042C5C',
  sanMarino: '#3F51B5',
  curiousBlue: '#3B9DD8',
  cerulean: '#039BE5',
  royalBlue: '#4169E1',
  godgerBlue: '#2979FF',
  brightBlue: '#3B78E7',

  // red
  red: 'red',
  cinnabar: '#E73934',
  crimson: '#D2142B',
  vermilion: '#FF4500',
  ceriseRed: '#df394d',
  scarlet: '#FF3300',

  // green
  mantis: '#6FC062',
  malachite: '#00B520',
  lightGrayishGreen: '#7BCC70',

  // orange
  buttercup: '#F5A623',

  // yellow
  selectiveYellow: '#FFBB00',

  whiteA0: 'rgba(255, 255, 255, 0)',
  whiteA50: 'rgba(255, 255, 255, 0.5)',
  whiteA90: 'rgba(255, 255, 255, 0.9)',
  whiteA92: 'rgba(255, 255, 255, 0.92)',
  blackA30: 'rgba(0, 0, 0, 0.3)',
  blackA50: 'rgba(0, 0, 0, 0.5)',
  blackA64: 'rgba(0, 0, 0, 0.64)',
  blackA80: 'rgba(0, 0, 0, 0.8)',
  ebonyA60: 'rgba(8, 9, 18, 0.6)',
  tunaA50: 'rgba(49, 49, 51,0.5)',
  azureRadianceA65: 'rgba(2, 140, 255, 0.65)',

  // only used for IDE
  bg: {
    bg: {}, primary: {}, aqua: {}, black: {}, blue: {}, fuchsia: {}, gray: {}, green: {}, lime: {}, maroon: {}, navy: {}, olive: {}, orange: {}, purple: {}, red: {}, silver: {}, teal: {}, white: {}, yellow: {},
  },
  font: {
    bg: {}, primary: {}, aqua: {}, black: {}, blue: {}, fuchsia: {}, gray: {}, green: {}, lime: {}, maroon: {}, navy: {}, olive: {}, orange: {}, purple: {}, red: {}, silver: {}, teal: {}, white: {}, yellow: {},
  },
  border: {
    bg: {}, primary: {}, aqua: {}, black: {}, blue: {}, fuchsia: {}, gray: {}, green: {}, lime: {}, maroon: {}, navy: {}, olive: {}, orange: {}, purple: {}, red: {}, silver: {}, teal: {}, white: {}, yellow: {},
  },
  // end
  app: {
    theme: this.azureRadiance,
    standard: this.ceriseRed,
    fontImp: '#333333',
    fontNormal: this.doveGray,
    fontAssist: '#999999',
    naviLine: '#e5e5e5',
    inputLine: '#cccccc',
    btnApricot: '#fff3f1',
    soundProgress: '#ffb9be',
    bg: '#f9f9f8',
    fontVIP: '#904829',
    inputBg: '#f2f2f2',
  },
  text: {
    link: '#DF5264',
    warning: this.azureRadiance,
  },
  component: {
    input: {
      backgroundColor: this.concrete,
      borderColor: 'rgba(144,144,144,0.2)',
    },
    button: {
      backgroundColor: this.azureRadiance,
      color: this.white,
    },
    passcodeModal: {
      backgroundColor: '#080808',
      title: {
        color: this.white,
        alert: '#FC4349',
      },
      dot: {
        borderColor: this.azureRadiance,
      },
      dot2: {
        backgroundColor: this.azureRadiance,
      },
      button: {
        borderColor: '#9F9F9F',
      },
      cancel: {
        color: this.white,
      },
      char: {
        color: this.concrete,
      },
      number: {
        color: this.concrete,
      },
    },
    tags: {
      backgroundColor: '#0AB627',
      color: this.white,
    },
    iconList: {
      borderBottomColor: this.grayD5,
      title: {
        color: this.codGray,
      },
      chevron: {
        color: this.grayD5,
      },
    },
    iconTwoTextList: {
      borderBottomColor: this.silver,
      title: {
        color: this.codGray,
      },
      text: {
        color: this.tundora,
      },
    },
    selectionList: {
      color: this.mineShaft,
    },
    dashLine: {
      backgroundColor: this.gray97,
    },
    touchSensorModal: {
      color: this.black,
      backgroundColor: this.whiteA50,
      panel: {
        backgroundColor: this.white,
      },
    },
    listItemIndicator: {
      color: this.dustyGray,
    },
    navBackIndicator: {
      color: this.white,
    },
    swipableButtonList: {
      backText: {
        color: this.white,
      },
      rowFront: {
        backgroundColor: this.white,
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
        borderBottomColor: this.grayED,
      },
      title: {
        color: this.greenVogue,
      },
      text: {
        color: this.lynch,
      },
      worth: {
        color: this.black,
      },
      amount: {
        color: this.lynch,
      },
    },
  },
  midGrey: '#727372',
  seporatorLineGrey: this.grayD8,
  seporatorLineLightGrey: this.grayD5,
  word: this.tundora,
  warningText: '#DF5264',
  ...styleScript(),
};


export default color;
