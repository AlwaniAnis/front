import * as Yup from "yup";

export default class LoginDto {
  constructor() {
    this.username = "";

    this.password = "";
  }
}
export const loginSchema = Yup.object().shape({
  username: Yup.string().required("Username is required"),

  password: Yup.string()
    .min(6, "Password must be at least 6 characters long")
    .required("Password is required"),
});
