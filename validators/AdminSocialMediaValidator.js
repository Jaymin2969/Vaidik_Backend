import Joi from "joi";

const AdminSocialMediaValidator = {
    token: Joi.string().required().label("Token").error(new Error('Please enter correct Token!')),
    Facebook: Joi.string().required().label("Facebook").error(new Error('Please enter correct Facebook link!')),
    LinkedIn: Joi.string().required().label("LinkedIn").error(new Error('Please enter correct LinkedIn link!')),
    Twitter: Joi.string().required().label("Twitter").error(new Error('Please enter correct Twitter link!')),
    YouTube: Joi.string().required().label("YouTube").error(new Error('Please enter correct YouTube link!')),
    Instagram: Joi.string().required().label("Instagram").error(new Error('Please enter correct Instagram link!'))
}

const AdminSocialMediaValidatorSchema = Joi.object(AdminSocialMediaValidator);

export default AdminSocialMediaValidatorSchema;