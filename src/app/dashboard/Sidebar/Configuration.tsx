


  import { useTranslation } from 'react-i18next'; 
import Configurationside from "../../../components/dashboard/Sidebarcomponents/Configurationside";

const Configuration = () => {
  const { t } = useTranslation(); // 🌐 Hook for translations

  return (
    <div>
      <h2 className="dashboard-title">{t('Configuration')} ⚙️</h2>
      <Configurationside />
    </div>
  );
};

export default Configuration;

