
export const throwInvalidInput = () => {
    try {
        throw new Error('Invalid input!')
    } catch (error) {
        console.log('\x1b[33m%s\x1b[0m', error.message)
    }
}
export const throwOperationFailed = (message = '') => {
    try {
        throw new Error(`Operation failed! ${message}`)
    } catch (error) {
        console.log('\x1b[31m%s\x1b[0m', error.message)
    }
}