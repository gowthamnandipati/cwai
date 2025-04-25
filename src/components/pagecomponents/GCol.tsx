import '../../styles/pagecomponentsstyles.css';

export const GCol = ({
  children,
  xs = "12",
  sm = "12",
  md = "6",
  lg = "6",
  className = '',
}: any) => {
  return (
    <div className={`g-col xs-${xs} sm-${sm} md-${md} lg-${lg} ${className}`}>
      {children}
    </div>
  );
};