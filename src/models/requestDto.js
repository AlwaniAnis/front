import * as Yup from "yup";
export default class CreateRequestDto {
  constructor() {
    this.title = "";
    this.description = "";
    this.category = "";
    this.urgencyLevel = "Normal";
  }
}

export const createRequestSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  description: Yup.string().required("Description is required"),
  category: Yup.string().required("Category is required"),
  urgencyLevel: Yup.string()
    .oneOf(["Normal", "Urgent", "Critical"], "Invalid urgency level")
    .required("Urgency level is required"),
});
