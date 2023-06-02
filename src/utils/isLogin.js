export const isLogin = () => {
    const token = localStorage.getItem('computershop-admin');
    if (token) {
        return true;
    }
    return false;
}