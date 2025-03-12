import Button from "../ui/Button";
import Form from "../ui/Form";
import FormRow from "../ui/FormRow";
import Input from "../ui/Input";
import Option from "../ui/Option";
import Select from "../ui/Select";
import styles from "./register.module.css";

function RegisterForm() {
  return (
    <div className={styles.formCenter}>
    <Form >
      <h2>REGISTER FORM</h2>
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
      <FormRow label="Department">
        <Input placeholder="Department" required />
      </FormRow>
      <FormRow label="Academic year">
        <Input placeholder="Academic Year" required />
      </FormRow>
      <FormRow label="Select College">
        <Select>
          <Option>COCIS</Option>
          <Option>CEES</Option>
          <Option>CAES</Option>
          <Option>COBAMS</Option>
        </Select>
      </FormRow>
      <Button>Login</Button>
    </Form>
    </div>
  );
}

export default RegisterForm;
