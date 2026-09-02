function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  type,
}) {
  return (
    <div className="stat-card">

      <div className="stat-card-top">

        <div className={`stat-icon ${type}`}>
          <Icon size={22} />
        </div>

        <span className="stat-menu">•••</span>

      </div>

      <div className="stat-value">
        {value}
      </div>

      <div className="stat-title">
        {title}
      </div>

      <div className="stat-subtitle">
        {subtitle}
      </div>

    </div>
  );
}

export default StatCard;