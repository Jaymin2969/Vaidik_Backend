import Joi from "joi";

const AdminTestimonialStatusValidator = {
    token: Joi.string().required().label("Token").error(new Error('Please enter correct Token!')),
    status: Joi.boolean().required().label("status").error(new Error('Please enter correct status!'))
}

const AdminTestimonialStatusValidatorSchema = Joi.object(AdminTestimonialStatusValidator);

export default AdminTestimonialStatusValidatorSchema;