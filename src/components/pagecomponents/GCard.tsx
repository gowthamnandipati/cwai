
import '../../styles/pagecomponentsstyles.css';

export const GCard = ({ children, className = '' }: any) => {
  return <div className={`g-card ${className}`}>{children}</div>;
};
