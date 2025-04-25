
import '../../styles/pagecomponentsstyles.css';

export const GBtn = ({ children, className = '', size = '', onClick }: any) => {
  return (
    <button className={`g-btn ${className} ${size}`} onClick={onClick}>
      {children}
    </button>
  );
};
