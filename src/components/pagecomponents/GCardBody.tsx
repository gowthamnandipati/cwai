
import '../../styles/pagecomponentsstyles.css';

export const GCardBody = ({ children, className = '' }: any) => {
  return <div className={`g-card-body ${className}`}>{children}</div>;
};
