const commentSchema = require('../model/comment')
const responseCtrl = require('../responseCtrl')

exports.save = async (req, res) => {
    try {
        let body = req.body
        let commentSchm = new commentSchema()
        commentSchm.postId = body.postId
        commentSchm.userId = body.userId
        commentSchm.comment = body.comment
        commentSchm.username = body.username
        let comment = await commentSchm.save()
        responseCtrl.SendSuccess(res, comment)
        return
    } catch (e) {
        console.log(e)
        responseCtrl.SendBadRequest(res,"unexpected error while accessing data")
        return
    }
}
