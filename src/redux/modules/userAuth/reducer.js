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
            const secret = action.payload.secret;
            return {
                ...state,
                isAuthenticated: true,
                token: secret,
                loginName: "管理员",
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

