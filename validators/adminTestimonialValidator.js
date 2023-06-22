import Joi from "joi";

const AdminTestimonialValidator = {
    token: Joi.string().required().label("Token").error(new Error('Please enter correct Token!')),
    sortOrder: Joi.number().required().label("sortOrder").error(new Error('Please enter sortOrder!')),
    profileimage: Joi.any().label("profileimage").error(new Error('Please enter correct profileimage!')),
    name: Joi.string().required().label("name").error(new Error('Please enter correct name!')),
    description: Joi.string().required().label("description").error(new Error('Please enter correct description!')),
    status: Joi.boolean().required().label("status").error(new Error('Please enter correct status!')),
    id: Joi.any()
}

const AdminTestimonialValidatorSchema = Joi.object(AdminTestimonialValidator);

export default AdminTestimonialValidatorSchema;