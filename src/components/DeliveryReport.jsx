import { Truck, Calendar } from "lucide-react";

const DeliveryReport = ({ delivery, deliverySuccess }) => (
  <div className="mb-4">
    <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4 mb-4">
      <div className="col">
        <div className="card summary-card h-100">
          <div className="summary-card-header">
            <h6 className="summary-card-title">Pending Deliveries</h6>
            <Truck size={24} className="summary-card-icon" />
          </div>
          <div className="summary-card-body">
            <h3 className="summary-card-value">{delivery.pending}</h3>
            <p className="summary-card-subtext text-muted">Awaiting pickup</p>
          </div>
        </div>
      </div>
      <div className="col">
        <div className="card summary-card h-100">
          <div className="summary-card-header">
            <h6 className="summary-card-title">In Transit</h6>
            <Truck size={24} className="summary-card-icon" />
          </div>
          <div className="summary-card-body">
            <h3 className="summary-card-value">{delivery.inTransit}</h3>
            <p className="summary-card-subtext text-muted">
              Currently being delivered
            </p>
          </div>
        </div>
      </div>
      <div className="col">
        <div className="card summary-card h-100">
          <div className="summary-card-header">
            <h6 className="summary-card-title">Delivered</h6>
            <Truck size={24} className="summary-card-icon" />
          </div>
          <div className="summary-card-body">
            <h3 className="summary-card-value">{delivery.delivered}</h3>
            <p className="summary-card-subtext text-muted">
              Successfully completed
            </p>
          </div>
        </div>
      </div>
      <div className="col">
        <div className="card summary-card h-100">
          <div className="summary-card-header">
            <h6 className="summary-card-title">Avg. Delivery Time</h6>
            <Calendar size={24} className="summary-card-icon" />
          </div>
          <div className="summary-card-body">
            <h3 className="summary-card-value">
              {delivery.averageDeliveryTime} days
            </h3>
            <p className="summary-card-subtext text-muted">
              From order to delivery
            </p>
          </div>
        </div>
      </div>
    </div>

    <div className="row row-cols-1 row-cols-lg-2 g-4">
      <div className="col">
        <div className="card">
          <div className="card-header">
            <h5 className="card-title">Delivery Success Rate</h5>
            <p className="card-text text-muted">
              Overall delivery performance metrics
            </p>
          </div>
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span>Success Rate</span>
              <span className="text-success fw-bold h4">
                {deliverySuccess}%
              </span>
            </div>
            <div className="progress">
              <div
                className="progress-bar bg-success"
                role="progressbar"
                style={{ width: `${deliverySuccess}%` }}
                aria-valuenow={deliverySuccess}
                aria-valuemin={0}
                aria-valuemax={100}
              ></div>
            </div>
          </div>
        </div>
      </div>
      <div className="col">
        <div className="card">
          <div className="card-header">
            <h5 className="card-title">Regional Delivery Performance</h5>
            <p className="card-text text-muted">Delivery metrics by region</p>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr style={{ backgroundColor: "#f8f9fa" }}>
                    <th
                      style={{
                        fontSize: "14px",
                        color: "#6c757d",
                        fontWeight: "normal",
                      }}
                    >
                      Region
                    </th>
                    <th
                      style={{
                        fontSize: "14px",
                        color: "#6c757d",
                        fontWeight: "normal",
                        textAlign: "right",
                      }}
                    >
                      Deliveries
                    </th>
                    <th
                      style={{
                        fontSize: "14px",
                        color: "#6c757d",
                        fontWeight: "normal",
                        textAlign: "right",
                      }}
                    >
                      Avg. Time
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {delivery.deliveryRegions.map((region, index) => (
                    <tr
                      key={index}
                      className="bg-white shadow-sm rounded-lg mb-2"
                      style={{ border: "1px solid #e9ecef" }}
                    >
                      <td
                        style={{
                          fontSize: "14px",
                          color: "#212529",
                          padding: "12px",
                        }}
                      >
                        {region.region}
                      </td>
                      <td
                        style={{
                          fontSize: "14px",
                          color: "#212529",
                          padding: "12px",
                          textAlign: "right",
                        }}
                      >
                        {region.deliveries.toLocaleString()}
                      </td>
                      <td
                        style={{
                          fontSize: "14px",
                          color: "#212529",
                          padding: "12px",
                          textAlign: "right",
                        }}
                      >
                        {region.avgTime}d
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default DeliveryReport;
