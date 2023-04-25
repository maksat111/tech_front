export const isLogin = () => {
    const token = localStorage.getItem('ertir-admin');
    if (token) {
        return true;
    }
    return false;
}