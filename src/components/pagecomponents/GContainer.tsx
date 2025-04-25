
import '../../styles/pagecomponentsstyles.css';

export const GContainer = ({ children, fluid = false, className = '' }: any) => {
  return (
    <div className={`${fluid ? 'g-container-fluid' : 'g-container'} ${className}`}>
      {children}
    </div>
  );
};
