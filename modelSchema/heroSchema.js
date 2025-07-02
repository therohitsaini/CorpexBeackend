// // const mongoose = require("mongoose");

// // // --------------------------- Hero Section Schema ----------------------------- //


// // const heroItemSchema = new mongoose.Schema({
// //     play_Icone: { type: String },
// //     hero_Title: { type: String },
// //     hero_Headline: { type: String },
// //     hero_Images: { type: String },
// //     hero_Button: { type: String },
// // });

// // // Main schema
// // const heroSchema = new mongoose.Schema({
// //     HeroSection: [
// //         {
// //             item: heroItemSchema, // Nested item
// //         }
// //     ]
// // });


// // const HeroSectionSchemaData = mongoose.models.userdetails || mongoose.model("userdetails", heroSchema);



// // // --------------------------- InFo Section Schema ----------------------------- //

// // const inFoSchema = new mongoose.Schema({

// //     inFoData: [
// //         {
// //             section: { type: String, required: true },
// //             inFoItem: [
// //                 {
// //                     inFoHeading: { type: String },
// //                     inFoDescription: { type: String },
// //                     inFoIcone: { type: String },

// //                 }
// //             ]

// //         }
// //     ]
// // })

// // const inFoMongooseData = mongoose.models.userdetails || mongoose.model("userdetails", inFoSchema)


// // module.exports = { HeroSectionSchemaData, inFoMongooseData };



// const mongoose = require("mongoose");

// // --------------------------- Hero Section Schema ----------------------------- //
// const heroItemSchema = new mongoose.Schema({
//     play_Icone: { type: String },
//     hero_Title: { type: String },
//     hero_Headline: { type: String },
//     hero_Images: { type: String },
//     hero_Button: { type: String },
// });

// const heroSchema = new mongoose.Schema({
//     HeroSection: [
//         {
//             item: heroItemSchema,
//         }
//     ]
// });

// const HeroSectionSchemaData = mongoose.models.userdetails || mongoose.model("userdetails", heroSchema);





// module.exports = {
//     HeroSectionSchemaData,
//     // InFoMongooseData
// };
