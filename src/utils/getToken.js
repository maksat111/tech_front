export const getToken = () => {
    let data = JSON.parse(localStorage.getItem('computershop-admin'));
    if (data) {
        return data.token
    } else {
        return null
    }
}