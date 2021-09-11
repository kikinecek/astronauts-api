import Joi from "joi";

/** Validator for astronaut form type */
export const AstronautFormValidator = Joi.object({
  name: Joi.string().min(1).max(20).required(),
  surname: Joi.string().min(1).max(20).required(),
  superpower: Joi.string().min(1).max(20).required(),
  birthdate: Joi.date().required()
})