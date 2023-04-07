export const getToken = () => {
    let data = JSON.parse(localStorage.getItem('turkmenExpress-admin'));
    if (data) {
        return data.access
    } else {
        return null
    }
}