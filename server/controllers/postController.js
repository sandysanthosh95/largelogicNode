const posts = require('../model/posts')
const responseCtrl = require('../responseCtrl')
const { ObjectId } = require('mongoose').Types.ObjectId

let sucResponse = {
    statusCode: 200,
    data: null,
}
let failureResponse = {
    statusCode: 400,
    error: null
}

//Api call

exports.get = async (req, res) => {
    try {
        console.log("get usrId", req.params.id)
        let id = req.params.id
        var post = await posts.aggregate([
            {
                $match:
                {
                    userId: { $ne: ObjectId(id) }
                }
            },
            {
                $lookup:
                {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "userId"
                }
            },
            {
                $lookup:
                {
                    from: "comments",
                    localField: "_id",
                    foreignField: "postId",
                    as: "comments"
                }
            }
        ]).sort({ _id: -1 })
        console.log(post)
        responseCtrl.SendSuccess(res, post)
        return
    } catch (err) {
        responseCtrl.SendInternalError(res, post)
        return
    }
}

exports.getpostbyid = async (req, res) => {
    console.log("get post by id", typeof req.params.id)
    try {
        var post = await posts.aggregate([
            {
                $match:
                {
                    userId: ObjectId(req.params.id)
                }
            },
            {
                $lookup:
                {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "userId"
                }
            },
            {
                $lookup:
                {
                    from: "comments",
                    localField: "_id",
                    foreignField: "postId",
                    as: "comments"
                }
            }
        ])
        responseCtrl.SendSuccess(res, post)
        return
    } catch (err) {
        responseCtrl.SendInternalError(res, post)
        return
    }
}

exports.likedbyuser = async (req, res) => {
    try {
        let body = req.body
        let post = await posts.updateOne({ _id: ObjectId(body.postId) }, { $push: { likedBy: { likeduserId: body.userId, name: body.name } } })
        responseCtrl.SendSuccess(res, post)
        return
    } catch (e) {
        console.log(e)
        return
    }
}

exports.unlikebyuser = async (req, res) => {
    try {
        let body = req.body
        console.log("unlike user", body)
        let post = await posts.updateOne({ _id: ObjectId(body.postId) }, { $pull: { likedBy: { likeduserId: body.userId } } })
        responseCtrl.SendSuccess(res, post)
        return
    } catch (e) {
        console.log(e)
        return
    }
}

//Socket call
exports.save = async (postData) => {
    try {
        let post = new posts()
        post.userId = postData._id
        post.postDate = postData.date
        post.post = postData.post
        let savedPost = await post.save()
        let posted = await posts.findOne({ _id: savedPost._id})
        sucResponse.data = posted
        return sucResponse
    } catch (err) {
        failureResponse.error = "try again later"
        return failureResponse
    }
}
exports.getposts = async (userId) => {
    try {
        let post = await posts.find({ userId: { $ne: ObjectId(userId) } }).sort({ _id: -1 }).populate({ path: 'userId' }).lean()
        sucResponse.data = post
        return sucResponse
    } catch (err) {
        failureResponse.error = "try again later"
        return failureResponse
    }
}

exports.deletePost = async (id) => {
    try {
        let post = await posts.deleteOne({ _id: id })
        sucResponse.data = post
        return sucResponse
    } catch (e) {
        failureResponse.error = "try again later"
        return failureResponse
    }
}