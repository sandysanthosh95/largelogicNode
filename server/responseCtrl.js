var HttpStatus = require('http-status');
exports.SendSuccess = function (res, data) {
    res.status(HttpStatus.OK).json({
        status: 'success',
        code: HttpStatus.OK,
        data: data
    });
    return;
}
exports.SendInternalError = function (res, data) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: 'failure',
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        error: data
    });
    return;
}
exports.SendNotFound = function (res, data) {
    res.status(HttpStatus.NOT_FOUND).json({
        status: 'failure',
        code: HttpStatus.NOT_FOUND,
        error: data
    });
    return;
}
exports.SendBadRequest = function (res, data) {
    res.status(HttpStatus.BAD_REQUEST).json({
        status: 'failure',
        code: HttpStatus.BAD_REQUEST,
        error: data
    });
    return;
}

exports.StagingLog = function (msg, data) {
    if (constants.STAGING_LOG) {
        console.log(msg, data)
    }
    return;
}
