const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const courseSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    thumbnail: {
        type: String,
        required: true
    },
    instructor: {
        type: Object,
        required: true
    },
    about: {
        type: String,
        required: true
    },
    rating: {
        type: Object,
        required: true
    },
    enrolledUsers: {
        type: String,
        required: true
    },
    certificate: {
        type: Boolean,
        required: true
    },
    lessons: {
        type: Array,
        required: true
    },
    totalHours: {
        type: string,
        required: true
    },
    level: {
        type: String,
        enum: ['beginner', 'advanced', 'beginner&advanced']
    }
});

const Course = mongoose.model('course', courseSchema);

module.exports = Course;