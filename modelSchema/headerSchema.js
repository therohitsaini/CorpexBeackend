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
                    item_ShowOnWebsite: { type: String }
                }
            ]
        }
    ],
    SectionHeadingTop: [
        {
            section: { type: String, required: true },
            item: [
                {
                    item_Title: { type: String },
                    item_Description: { type: String },
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

    ServiceHeadingSection: [
        {
            _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
            heading: { type: String },
            description: { type: String },
            showOnWebsite: { type: Boolean, default: true }
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
    ],

    PrincingSection: [
        {
            heading: { type: String },
            listItem: { type: [String] },
            price: { type: String },
            button: { type: String }
        }
    ],

    TestimonialSection: [
        {
            heading: { type: String },
            userName: { type: String },
            userProfile: { type: String },
            paragraph: { type: String },
            occupationRole: { type: String }
        }
    ],

    FeatureSectionStore: [
        {
            sectionTitle: { type: String },
            setionDescriptions: { type: String },
            setionImage: { type: String },
        }
    ],
    FeatureSectionListItem: [
        {
            listTitle: { type: String },
            listIconeLeft: { type: String },
            listIconeRight: { type: String },
            backGroundImage: { type: String },
        }
    ],
    TeamHeadingSection: [
        {
            teamHeading: { type: String },
            teamDescription: { type: String },
            teamBgImage: { type: String },

        }
    ],
    TeamCardSection: [
        {
            image: { type: String },
            name: { type: String },
            role: { type: String },
            item_Icone: { type: [String] },
            urls: { type: [String] },
        }
    ],
    BlogHeadingSection: [
        {
            blogHeading: { type: String },
            blogDescription: { type: String },


        }
    ],
    BlogCardSection: [
        {
            goIcone: { type: String },
            blogDatePicker: { type: String },
            blogerRoleIocne: { type: String },
            blogerRole: { type: String },
            blogHeading: { type: String },
            blogDescription: { type: String },
            blogButton: { type: String },
            blogerImage: { type: String },

        }
    ],
    FooterSponese: [
        {
            sponsorsOne: { type: String },
            sponsorsTwo: { type: String },
            sponsorsThree: { type: String },
            sponsorsFour: { type: String },
            sponsorsFive: { type: String },
            showOnWebsite: { type: Boolean, default: true },
            userId: { type: mongoose.Schema.Types.ObjectId, ref: 'userdetails' }
        }
    ],

    FooterBackground: {
        backgroundColor: { type: String },
        backgroundImage: { type: String }
    },



    FooterContact: [
        {
            description: { type: String },
            logo: { type: String },
            icons: [
                {
                    iconName: { type: String },
                    icon: { type: String },
                    iconUrl: { type: String }
                }
            ]
        }
    ],

    FooterRightContact: [
        {
            location: {
                icon: { type: String },
                location: { type: String },
                address: { type: String }
            },
            call: {
                icon: { type: String },
                call: { type: String },
                contactNumber: { type: String }
            },
            email: {
                icon: { type: String },
                email: { type: String },
                emailId: { type: String }
            }
        }
    ],

    FooterCategory: [
        {
            categoryName: { type: String, required: true },
            listItem: { type: [String], default: [] }
        }
    ],
    FooterTags: [
        {
            FooterTagesName: { type: String, required: true },
            listItem: { type: [String], default: [] }
        }
    ],
    FooterHelpCenter: {
        leftSection: {
            title: { type: String },
            subTitle: { type: String },
            description: { type: String },
            image: { type: String },
            icon: { type: String, default: "" },
            show: { type: Boolean, default: true }
        },
        rightSection: {
            title: { type: String },
            subTitle: { type: String },
            description: { type: String },
            image: { type: String },
            icon: { type: String, default: "" },
            show: { type: Boolean, default: true }
        }
    },

    FooterTopBar: {
        leftSection: {
            title: { type: String },
            subTitle: { type: String },
            icone: { type: String },
            image: { type: String }
        },
        rightSection: {
            title: { type: String },
            subTitle: { type: String },
            icone: { type: String },
            image: { type: String }
        }
    },

    FooterCopyRight: [
        {
            _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
            section: { type: String, },
            copyrightText: { type: String, },
            poweredByText: { type: String, },
            paymentIcons: [
                {
                    id: { type: Number },
                    name: { type: String },
                    icon: { type: String },
                    url: { type: String },
                    isActive: { type: Boolean, default: true }
                }
            ]
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




//  "BlogCardSection.$.goIcone": req.body.goIcone || "",
//         "BlogCardSection.$.blogDatePicker": req.body.blogDatePicker || "",
//         // "BlogCardSection.$.item_ShowOnWebsite": req.body.item_ShowOnWebsite || "",
//         // "BlogCardSection.$.categories": req.body.categories || "",

//         "BlogCardSection.$.blogerRoleIocne": req.body.blogerRoleIocne || "",
//         "BlogCardSection.$.blogerRole": req.body.blogerRole || "",
//         "BlogCardSection.$.blogHeading": req.body.blogHeading || "",
//         "BlogCardSection.$.blogDescription": req.body.blogDescription || "",
//         "BlogCardSection.$.blogButton": req.body.blogButton || "",