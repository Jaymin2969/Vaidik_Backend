import Joi from 'joi';

const AdmintutorpersonalValidator = {
    token: Joi.string().required().label("Token").error(new Error('Please enter correct Token')),
    profilephoto: Joi.any().label("Profilephoto").error(new Error('Please enter profilephoto')),
    name: Joi.string().required().min(3).label("Name").error(new Error('Please enter Valid Name!')),
    country: Joi.string().trim().required().label("Country").error(new Error('Please enter Valid Country!')),
    mobileNo: Joi.string().trim().required().min(10).label("Mobile No.").error(new Error('Please enter Valid Mobile Number!')),
    gender: Joi.string().required().label("Gender").error(new Error('Please enter Valid Gender!')),
    dob: Joi.string().required().label("DOB").error(new Error('Please enter Valid DOB!')),
    experience: Joi.string().required().label("Experience").error(new Error('Please enter Valid Experience!')),




    degree_choice: Joi.string().required().label("Degree_choice").error(new Error('Please enter correct Choice!')),
    degree: Joi.string().required().label("Degree").error(new Error('Please enter Valid Degree!')),
    degree_specialisation: Joi.string().required().label("Degree_specialisation").error(new Error('Please enter Valid Degree Specialisation!')),
    degree_image: Joi.any(),
    clg_name: Joi.string().required().label("Clg_name").error(new Error('Please enter Valid College Name!')),
    clg_city: Joi.string().required().label("Clg_city").error(new Error('Please enter Valid College City!')),
    gpa: Joi.number().required().label("Gpa").error(new Error('Please enter Valid GPA!')),




    bankcountry: Joi.string().required().label("Country").error(new Error('Please enter correct Country!')),
    Tutorbankname: Joi.string().required().label("Name").error(new Error('Please enter correct Name!')),
    bankName: Joi.string().required().label("Bank_name").error(new Error('Please enter Valid Bank Name!')),
    accountNumber: Joi.string().required().label("AC_number").error(new Error('Please enter Valid Account Number!')),
    IFSCCode: Joi.string().required().label("IFSC_number").error(new Error('Please enter Valid IFSC Number!')),
    accountType: Joi.string().required().label("AC_type").error(new Error('Please enter Valid Account Type!')),
    panCard: Joi.string().required().label("Pancard").error(new Error('Please enter Valid Pancard!'))

}

const AdmintutorpersonalValidatorSchema = Joi.object(AdmintutorpersonalValidator);

export {
    AdmintutorpersonalValidatorSchema
};
            