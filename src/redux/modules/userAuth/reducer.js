import {
    LOGIN_USER,
    LOGOUT_USER,
} from './action';

const initialState = {
    isLogging: false,       //是否处于登录中

    token: null,
    isAuthenticated: false,
    //userInfos
    loginName: ''
};

export const userAuth = (state = initialState, action) => {
    switch (action.type) {
        case `${LOGIN_USER}_PENDING`:
            return {
                ...state,
                isLogging: true,
            };
        case `${LOGIN_USER}_SUCCESS`:
            const userLogged = action.payload.data;
            return {
                ...state,
                isAuthenticated: true,
                token: userLogged.token,
                loginName: userLogged.loginName,
                isLogging: false,
            };
        case `${LOGIN_USER}_ERROR`:
            return {
                ...state,
                ...initialState
            };

        case `${LOGOUT_USER}_SUCCESS`:
            return {
                ...state,
                ...initialState
            };
        case `${LOGOUT_USER}_ERROR`:
            return {
                ...state,
                ...initialState
            };
        default:
            return state;
    }
}

