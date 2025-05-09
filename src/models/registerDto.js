import * as Yup from "yup";

export default class RegisterDto {
  constructor() {
    this.username = "";
    this.email = "";
    this.password = "";
    this.phoneNumber = "";
    this.firstName = "";
    this.lastName = "";
  }
}
export const registerSchema = Yup.object().shape({
  username: Yup.string().required("Username is required"),

  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),

  password: Yup.string()
    .min(6, "Password must be at least 6 characters long")
    .required("Password is required"),

  phoneNumber: Yup.string().notRequired(),

  firstName: Yup.string().required("First name is required"),

  lastName: Yup.string().required("Last name is required"),
});
