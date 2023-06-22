import Joi from "joi";

const AdminMobileNoValidator = {
    token: Joi.string().required().label("Token").error(new Error('Please enter correct Token!')),
    mobileNo: Joi.string().required().label("MobileNo").error(new Error('Please enter correct MobileNo!')),
    // id: Joi.any()
}

const AdminMobileNoValidatorSchema = Joi.object(AdminMobileNoValidator);

export default AdminMobileNoValidatorSchema;