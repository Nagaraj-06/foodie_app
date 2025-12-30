const StatCard = ({ label, value, change, icon, color }) => (
  <div className="stat-card">
    <div>
      <p className="stat-label">{label}</p>
      <h3 className="stat-value">{value}</h3>
      <p
        className={`stat-change ${
          change.startsWith("+") ? "positive" : "negative"
        }`}
      >
        {change} <span className="stat-change-label">vs last period</span>
      </p>
    </div>
    <div className={`stat-icon ${color}`}>
      <span className="material-symbols-outlined">{icon}</span>
    </div>
  </div>
);

export default StatCard;
