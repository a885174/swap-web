import Cookies from 'js-cookie'
const TokenKey = 'x-access-token'
var inFifteenMinutes;
export function getToken() {
    return Cookies.get(TokenKey)
}

export function setToken(token) {
    inFifteenMinutes = new Date(new Date().getTime() + 120 * 60 * 1000);
    return Cookies.set(TokenKey, token, { expires: inFifteenMinutes })
}

export function removeToken() {
    return Cookies.remove(TokenKey)
}