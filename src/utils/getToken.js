export const getToken = () => {
    let data = JSON.parse(localStorage.getItem('ertir-admin'));
    if (data) {
        return data.token
    } else {
        return null
    }
}