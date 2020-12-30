const db = require('../helpers/mongo_db_connectivity');
var ObjectId = require('mongodb').ObjectId; 
const Course = db.Course;
const Enrollment = db.Enrollment;

module.exports.getAll = async (query, select, offset, limit) => {
    return Course.find(query, select).limit(limit).skip(offset);
}

module.exports.getById = async (courseId,  query, select) => {
    return await Course.findOne({...query, "_id": ObjectId(courseId)}, select);
}

module.exports.update = async (courseId, query, updateParam) => {
    await Course.updateOne({...query, "_id": ObjectId(courseId)}, updateParam);
}

module.exports.delete = async (courseId) => {
    Course.remove({"_id": ObjectId(courseId)});
}

module.exports.create = async (courseParam) => {
    try{
        var course = new Course(courseParam);
        await course.save();
        return true;
    }
    catch(e){
        console.log(e);
        return false;
    }
}

module.exports.enrollCourse = async (courseId, userId) => {
    try{
        var enrollment = new Enrollment({ "courseId": courseId,"userId": userId});
        await enrollment.save();
        return true;
    }
    catch(e){
        console.log(e);
        return false;
    }
}

module.exports.unenrollCourse = async (courseId, userId) => {
    try{
        await Enrollment.deleteOne({"courseId": ObjectId(courseId),"userId": ObjectId(userId)});
        return true;
    }
    catch(e){
        return false;
    }
}

module.exports.search = async (keyword, offset, limit) => {
    return await Course.find({$text: {$search: keyword}}).limit(limit).skip(offset);
}