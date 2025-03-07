import styled from "styled-components";
import Button from "../ui/Button";
import Form from "../ui/Form";
import FormRow from "../ui/FormRow";
import Input from "../ui/Input";

export const H2 = styled.h2`

  font-size: 5rem;
  text-transform: uppercase;
`;
function Login() {
  return (
    <Form>
      <H2>welcome to AITS</H2>
      <h2>Login</h2>
      <FormRow label="username">
        <Input type="password" placeholder="Enter username" />
      </FormRow>
      <FormRow label="password">
        <Input type="password" placeholder="Enter password" />
      </FormRow>
      <Button>Login</Button>
    </Form>
  );
}

export default Login;
