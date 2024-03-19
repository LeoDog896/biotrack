export const load = ({ url }) => {
    return {
        local: url.host === 'localhost:5000'
    }
}
