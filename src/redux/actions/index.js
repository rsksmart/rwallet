import store from "../store";
import {actLoading} from "./action.loading";
import React from "react";

export const loading = function (visible) {
    store.dispatch(actLoading(visible));
};
