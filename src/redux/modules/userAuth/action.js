export const LOGIN_USER = 'LOGIN_USER';
export const LOGOUT_USER = 'LOGOUT_USER';

export const loginUser = (params) => {
    return {
        type: `${LOGIN_USER}`,
        payload: new Promise((resolve, reject) => {
            resolve({
                    code: 200,
                    data: {
                        loginName: "admin",
                        token: "11122333",
                    }
                }
            )
        })
    }
}


export const logoutUser = () => {
    return {
        type: `${LOGOUT_USER}_SUCCESS`,
        payload: {}
    }
}

