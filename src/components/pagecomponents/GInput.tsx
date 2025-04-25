
import '../../styles/pagecomponentsstyles.css';

export const GInput = ({ label, type = 'text', value, onChange }: any) => {
  return (
    <div className="g-input-wrapper">
      <label className="g-label">{label}</label>
      <input className="g-input" type={type} value={value} onChange={onChange} />
    </div>
  );
};
