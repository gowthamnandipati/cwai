
import '../../styles/pagecomponentsstyles.css';

export const GRow = ({ children, className = '' }: any) => {
  return <div className={`g-row ${className}`}>{children}</div>;
};
