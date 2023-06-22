import Joi from "joi";

const AdminCMSValidator = {
    token: Joi.string().required().label("Token").error(new Error('Please enter correct Token!')),
    sortOrder: Joi.number().required().label('sortOrder').error(new Error('Please enter correct sortOrder')),
    pageName: Joi.string().required().label("pageName").error(new Error("Please enter correct pageName")),
    contentText: Joi.string().required().label("contentText").error(new Error('Please enter correct contentText')),
    metaTitle: Joi.string().required().label("metaTitle").error(new Error("Please enter metaTitle")),
    metaKeyword: Joi.string().required().label("metaKeyword").error(new Error("Please enter metaKeyword")),
    metaDescription: Joi.string().required().label("metaDescription").error(new Error("Please enter correct metaDescription")),
    status: Joi.boolean().label("status").error(new Error('Please enter correct status!')),
    id: Joi.any()
}

const AdminCMSValidatorSchema = Joi.object(AdminCMSValidator);

export default AdminCMSValidatorSchema;