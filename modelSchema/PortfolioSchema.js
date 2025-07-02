// const mongoose = require('mongoose');

// const noSpecialCharsRegex = /^[a-zA-Z0-9\s\-]+$/;

// const singlePortfolioSchema = new mongoose.Schema({
//     title: {
//         type: String,
//         required: true,
//         match: [noSpecialCharsRegex, 'Title contains invalid characters']
//     },
//     subTitle: {
//         type: String,
//         match: [noSpecialCharsRegex, 'Subtitle contains invalid characters']
//     },
//     userImage: {
//         type: String,
//         required: true
//     },
//     categories: [{
//         type: String,
//         match: [noSpecialCharsRegex, 'Category contains invalid characters']
//     }]
// });

// const userPortfolioSchema = new mongoose.Schema({

//     portfolioItems: [singlePortfolioSchema]
// }, { timestamps: true });

// const PortfolioItem = mongoose.models.userdetails || mongoose.model('userdetails', userPortfolioSchema);

// module.exports = { PortfolioItem };
