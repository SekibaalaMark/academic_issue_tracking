import styled from "styled-components";
import Input from "./Input";
import Label from "./Label";
const StyledDiv = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-size: 1.4rem;
`;
function FormRow({ children, label }) {
  console.log(label);
  return (
    <StyledDiv>
      <Label>{label}:</Label>
      {children}
    </StyledDiv>
  );
}

export default FormRow;
