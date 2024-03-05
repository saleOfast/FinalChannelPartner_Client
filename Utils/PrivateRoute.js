import { getCookie } from "cookies-next";

function checkToken() {
    const token = getCookie('userInfo')
    if (!token) {
        return false
    }
    return true
}
