import Joi from 'joi';

const professionalValidator = {
    token: Joi.string().required().label("Token").error(new Error('Please enter correct Token!')),
    degree_choice: Joi.string().required().label("Degree_choice").error(new Error('Please enter correct Choice!')),
    degree: Joi.string().required().label("Degree").error(new Error('Please enter Valid Degree!')),
    degree_specialisation: Joi.string().required().label("Degree_specialisation").error(new Error('Please enter Valid Degree Specialisation!')),
    degree_image: Joi.any(),
    clg_name: Joi.string().required().label("Clg_name").error(new Error('Please enter Valid College Name!')),
    clg_city: Joi.string().required().label("Clg_city").error(new Error('Please enter Valid College City!')),
    gpa: Joi.number().required().label("Gpa").error(new Error('Please enter Valid GPA!'))
}

const StudentProfessionalValidatorSchema = Joi.object(professionalValidator);

export default StudentProfessionalValidatorSchema;
            