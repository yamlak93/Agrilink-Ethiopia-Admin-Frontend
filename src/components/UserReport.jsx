import { UserCheck, Users, MapPin } from "lucide-react";

const UserReport = ({ users }) => (
  <div className="mb-4">
    <div className="row row-cols-1 row-cols-md-2 g-4 mb-4">
      <div className="col">
        <div className="card summary-card h-100">
          <div className="summary-card-header">
            <h6 className="summary-card-title">New Registrations</h6>
            <UserCheck size={24} className="summary-card-icon" />
          </div>
          <div className="summary-card-body">
            <h3 className="summary-card-value">
              {users.newRegistrations.toLocaleString()}
            </h3>
            <p className="summary-card-subtext text-muted">This month</p>
          </div>
        </div>
      </div>
      <div className="col">
        <div className="card summary-card h-100">
          <div className="summary-card-header">
            <h6 className="summary-card-title">Active Users</h6>
            <Users size={24} className="summary-card-icon" />
          </div>
          <div className="summary-card-body">
            <h3 className="summary-card-value">
              {users.activeUsers.toLocaleString()}
            </h3>
            <p className="summary-card-subtext text-muted">
              Monthly active users
            </p>
          </div>
        </div>
      </div>
    </div>

    <div className="card">
      <div className="card-header">
        <h5 className="card-title">Top Regions by User Growth</h5>
        <p className="card-text text-muted">
          Regional user registration trends
        </p>
      </div>
      <div className="card-body">
        {users.topRegions.map((region, index) => (
          <div
            key={index}
            className="d-flex justify-content-between align-items-center mb-3"
          >
            <div className="d-flex align-items-center">
              <MapPin size={16} className="text-muted me-2" />
              <span>{region.region}</span>
            </div>
            <div className="text-end">
              <div className="fw-bold">{region.users.toLocaleString()}</div>
              <div className="text-success small">+{region.growth}%</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default UserReport;
