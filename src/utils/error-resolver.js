export const resolveError = (error) => {
    if (error.response === undefined) {
        throw error;
    }

    if (error.response.status !== undefined && error.response.status === 500) {
        return 'Something went wrong, please try again';
    }

    return error.response.data.errors.map((error) => ({
        name: error.param,
        errorMessage: error.msg,
    }));
};
