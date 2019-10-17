import {POPUP_LOADING_VISIBLE} from '../constraints'

export function actLoading(isVisible){
    return {
        type: POPUP_LOADING_VISIBLE,
        isVisible : isVisible
    }
}
