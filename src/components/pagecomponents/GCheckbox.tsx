
import '../../styles/pagecomponentsstyles.css';

export const GCheckbox = ({ label, id, name }: any) => {
  return (
    <div className="g-checkbox-wrapper">
      <input type="checkbox" id={id} name={name} />
      <label htmlFor={id}>{label}</label>
    </div>
  );
};
