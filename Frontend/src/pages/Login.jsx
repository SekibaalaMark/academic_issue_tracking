import styled from "styled-components";
import Button from "../ui/Button";
import Form from "../ui/Form";
import FormRow from "../ui/FormRow";
import Input from "../ui/Input";
import styles from "./register.module.css";

const StyledForm = styled(Form)`
  max-width: 400px;
  margin: auto;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  background: #fff;
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  
  /* Center vertically */
  min-height: 100vh; 
  display: flex;
  justify-content: center;
  width: clamp(300px, 80%, 400px);
  margin: 0 auto;
  padding: 2rem;  
  @media (max-width: 480px) {
    max-width: 90%;
    padding: 1.5rem;
  }
`;

function Login() {
  return (
    <div className={styles.formCenter}>
    <Form>
      <h2>welcome to AITS</h2>
      <h2>Login</h2>
      <FormRow label="username">
        <Input type="password" placeholder="Enter username" />
      </FormRow>
      <FormRow label="password">
        <Input type="password" placeholder="Enter password" />
      </FormRow>
      <Button>Login</Button>
    </Form>
    </div>
  );
}

export default Login;
