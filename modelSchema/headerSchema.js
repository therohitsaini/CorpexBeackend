const mongoose = require("mongoose");


const noSpecialCharsRegex = /^[a-zA-Z0-9\s\-]+$/;

const headerSchema = new mongoose.Schema({
    headerTopBar: [
        {
            section: { type: String, required: true },
            item: [
                {
                    item_Title: { type: String },
                    item_ContactId: { type: String },
                    item_Icone: { type: String },
                    item_IconeUrl: { type: String },
                    item_ShowOnWebsite: { type: Boolean }
                }
            ]
        }
    ],

    inFoData: [

        {
            inFoHeading: { type: String },
            inFoDescription: { type: String },
            inFoIcone: { type: String },

        }

    ],


    HeroSection: [
        {
            _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
            heroImgUrl: { type: String },
            heroPlay_Button: { type: String },
            heroSlideSubTitle: { type: String },
            heroSlideTitle: { type: String },
            heroButton_One: { type: String },
            heroButton_Two: { type: String }

        }
    ],
    ServiceCard: [
        {
            iconeTop: { type: String },
            serviceHeading: { type: String },
            ServiceDescription: { type: String },
            iconeBottom: { type: String }
        }
    ],

    FunfactBox: [
        {
            projectCount: { type: String },
            aboutProject: { type: String }

        }
    ],
    portfolioItems: [
        {
            title: {
                type: String
            },
            subTitle: {
                type: String
            },
            categories: {
                type: [String]
            },
            item_ShowOnWebsite: {
                type: String
            },
            Icone: {
                type: String
            },
            userImage: {
                type: String
            }
        }
    ]
});

const HeaderData = mongoose.model("userdetails", headerSchema);
module.exports = { HeaderData };



// HeroSection: [    important api me key define krne ke bad kitna bhi complex data bna skte hai bas key ka name difine krna pdata hai
//     {

//         heroItem: [
//             {
//                 play_Icone: { type: String },
//                 hero_Title: { type: String },
//                 hero_Headline: { type: String },
//                 hero_Button: { type: String },
//             }
//         ]
//     }
// ],