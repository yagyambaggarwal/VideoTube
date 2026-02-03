const asyncHandler = (requestHandler) => {
    (req, res, next) => {
        Promise.resolve(requestHandler(res, res, next)).
        catch((err) => next(err))
    }
}

export {asyncHandler}