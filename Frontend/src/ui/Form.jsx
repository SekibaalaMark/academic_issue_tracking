import styled from "styled-components";

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;
function Form({ children }) {
  return <StyledForm>{children}</StyledForm>;
}

export default Form;
