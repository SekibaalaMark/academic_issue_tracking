import Form from "../ui/Form";
import FormRow from "../ui/FormRow";
import Input from "../ui/Input";
import Option from "../ui/Option";
import Select from "../ui/Select";
import { H2 } from "./Login";

function RegisterForm() {
  return (
    <Form>
      <H2>REGISTER FORM</H2>
      <FormRow label="Name">
        <Input placeholder="Enter name" required />
      </FormRow>
      <FormRow label="Registration number">
        <Input placeholder="Enter registration number" required />
      </FormRow>
      <FormRow label="Student number">
        <Input placeholder="Enter student number" required />
      </FormRow>
      <FormRow label="College">
        <Input placeholder="Enter college" required />
      </FormRow>
      <FormRow label="Name">
        <Input placeholder="Enter name" required />
      </FormRow>
      <FormRow label="Select College">
        <Select>
          <Option>COCIS</Option>
          <Option>CEES</Option>
          <Option>CAES</Option>
          <Option>COBAMS</Option>
        </Select>
      </FormRow>
    </Form>
  );
}

export default RegisterForm;
