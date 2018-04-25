const mongoose = require('mongoose');
mongoose.Promise = global.Promise;


const blogPostSchema = mongoose.Schema({
  title: {type: String, required: true},
  content: {type: String, required: true},
  author: {
    firstName: String, 
    lastName: String
  },
  created: {type: Date, default: Date.now}
})




blogPostSchema.virtual('authorName').get(function() {
  return `${this.author.firstName} ${this.author.lastName}`.trim();
})


blogPostSchema.methods.serialize = function (){
  return {
    id: this._id,
    tile: this.title,
    content: this.content,
    author: this.authorName,
    created: this.created
  };
};






module.exports = blogPostSchema;