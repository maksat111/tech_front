export const isLogin = () => {
    const token = localStorage.getItem('turkmenExpress-admin');
    if (token) {
        return true;
    }
    return false;
}