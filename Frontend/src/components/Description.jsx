
import PropTypes from "prop-types";

function Description({ descriptionText }) {
  return <p>{descriptionText}</p>;
}
Description.propTypes = {
  descriptionText: PropTypes.string.isRequired,
};

export default Description;
