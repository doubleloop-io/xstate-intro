export const query = `
query getCountry($code: ID!) {
    country(code: $code) {
        name
        native
        phone
    }
}
`
