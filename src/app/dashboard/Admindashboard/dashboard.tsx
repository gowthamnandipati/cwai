import { Icon } from '@iconify/react';
import shapeSquare from '../../../assets/icons/dashboard/shape-square.svg';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import '../../../styles/dashboard.css';
import { useTranslation } from 'react-i18next';

const Dashboard = () => {
  const { t } = useTranslation(); // ⬅️ Add translation hook

  const summaryData = [
    {
      title: t('Interview Scheduled'),
      value: '11',
      trend: '+2.6%',
      trendUp: true,
      icon: 'ph:calendar-check',
      iconColor: '#007FFF',
      bgColor: '#D0F2FF',
    },
    {
      title: t('In Progress'),
      value: '1.35m',
      trend: '0.1%',
      trendUp: true,
      icon: 'solar:user-bold-duotone',
      iconColor: '#8E33FF',
      bgColor: '#EBD6FD',
    },
    {
      title: t('Completed'),
      value: '1.72m',
      trend: '+2.8%',
      trendUp: true,
      icon: 'solar:cart-2-bold-duotone',
      iconColor: '#FFAB00',
      bgColor: '#FFF3C6',
    },
    {
      title: t('Total Applications'),
      value: '234',
      trend: '+3.6%',
      trendUp: true,
      icon: 'solar:letter-bold-duotone',
      iconColor: '#FF5630',
      bgColor: '#FFE2D3',
    },
  ];

  const pieData = [
    { name: t('Scheduled'), value: 11, color: '#007FFF' },
    { name: t('In Progress'), value: 25, color: '#8E33FF' },
    { name: t('Completed'), value: 20, color: '#FFAB00' },
    { name: t('Rejected'), value: 5, color: '#FF5630' },
  ];

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">{t('Hi, Welcome back 👋')}</h2>

      <div className="dashboard-grid">
        {summaryData.map((item, index) => (
          <div
            key={index}
            className="dashboard-card"
            style={{ backgroundColor: item.bgColor }}
          >
            <img
              src={shapeSquare}
              alt="shape"
              className="card-shape"
              style={{ filter: `drop-shadow(0 0 0 ${item.iconColor})` }}
            />

            <div className={`dashboard-card-trend ${item.trendUp ? 'up' : 'down'}`}>
              <Icon
                icon={item.trendUp ? 'eva:trending-up-fill' : 'eva:trending-down-fill'}
                width={18}
              />
              <span style={{ marginLeft: 4 }}>{item.trend}</span>
            </div>

            <div className="dashboard-card-icon" style={{ color: item.iconColor }}>
              <Icon icon={item.icon} width={32} />
            </div>

            <p className="card-title">{item.title}</p>
            <h3 className="card-value">{item.value}</h3>

            <div className="sparkline-placeholder" style={{ borderColor: item.iconColor }} />
          </div>
        ))}
      </div>

      <div className="dashboard-pie-container">
        <div className="dashboard-pie-card">
          <h3 className="dashboard-pie-title">{t('Interview Status')}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ percent }) => `${(percent * 100).toFixed(1)}%`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Legend layout="horizontal" verticalAlign="bottom" align="center" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
