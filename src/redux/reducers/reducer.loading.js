import {POPUP_LOADING_VISIBLE} from '../constraints'

let initFloatBtn = {
    type: "",
    loading : false,
};

export default function Popup (state = initFloatBtn, action) {
    switch (action.type) {
        case POPUP_LOADING_VISIBLE:
            return {
                ...state,
                loading: action.isVisible
            };
        default:
            return state;
    }
}
