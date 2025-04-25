



import { useTranslation } from 'react-i18next';
import JdSide from "../../../components/dashboard/Sidebarcomponents/JdSide";

const Jd = () => {
  const { t } = useTranslation(); // ✅ use i18n hook

  return (
    <div>
      <h2 className="dashboard-title">{t('JD & QUESTION BANK UPLOAD')} 🗂️</h2>
      <JdSide />
    </div>
  );
};

export default Jd;
