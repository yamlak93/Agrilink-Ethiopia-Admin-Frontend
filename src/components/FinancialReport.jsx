import { DollarSign } from "lucide-react";

const FinancialReport = ({ financial }) => (
  <div className="mb-4">
    <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4 mb-4">
      <div className="col">
        <div className="card summary-card h-100">
          <div className="summary-card-header">
            <h6 className="summary-card-title">Total Revenue</h6>
            <DollarSign size={24} className="summary-card-icon" />
          </div>
          <div className="summary-card-body">
            <h3 className="summary-card-value">
              ETB {financial.totalRevenue.toLocaleString()}
            </h3>
            <p className="summary-card-subtext text-success">
              +{financial.revenueGrowth}% from last month
            </p>
          </div>
        </div>
      </div>
      <div className="col">
        <div className="card summary-card h-100">
          <div className="summary-card-header">
            <h6 className="summary-card-title">Platform Fees</h6>
            <DollarSign size={24} className="summary-card-icon" />
          </div>
          <div className="summary-card-body">
            <h3 className="summary-card-value">
              ETB {financial.platformFees.toLocaleString()}
            </h3>
            <p className="summary-card-subtext text-muted">
              {(
                (financial.platformFees / financial.totalRevenue) *
                100
              ).toFixed(1)}
              % of total revenue
            </p>
          </div>
        </div>
      </div>
      <div className="col">
        <div className="card summary-card h-100">
          <div className="summary-card-header">
            <h6 className="summary-card-title">Farmer Earnings</h6>
            <DollarSign size={24} className="summary-card-icon" />
          </div>
          <div className="summary-card-body">
            <h3 className="summary-card-value">
              ETB {financial.farmerEarnings.toLocaleString()}
            </h3>
            <p className="summary-card-subtext text-muted">
              Total farmer payouts
            </p>
          </div>
        </div>
      </div>
      <div className="col">
        <div className="card summary-card h-100">
          <div className="summary-card-header">
            <h6 className="summary-card-title">Avg. Transaction Fee</h6>
            <DollarSign size={24} className="summary-card-icon" />
          </div>
          <div className="summary-card-body">
            <h3 className="summary-card-value">
              ETB {financial.avgTransactionFee}
            </h3>
            <p className="summary-card-subtext text-muted">Per transaction</p>
          </div>
        </div>
      </div>
    </div>

    <div className="row row-cols-1 row-cols-lg-2 g-4">
      <div className="col">
        <div className="card">
          <div className="card-header">
            <h5 className="card-title">Monthly Revenue Trends</h5>
            <p className="card-text text-muted">
              Revenue and fee collection over time
            </p>
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
                      Month
                    </th>
                    <th
                      style={{
                        fontSize: "14px",
                        color: "#6c757d",
                        fontWeight: "normal",
                        textAlign: "right",
                      }}
                    >
                      Revenue (ETB)
                    </th>
                    <th
                      style={{
                        fontSize: "14px",
                        color: "#6c757d",
                        fontWeight: "normal",
                        textAlign: "right",
                      }}
                    >
                      Fees (ETB)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {financial.monthlyRevenue.map((month, index) => (
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
                        {month.month}
                      </td>
                      <td
                        style={{
                          fontSize: "14px",
                          color: "#212529",
                          padding: "12px",
                          textAlign: "right",
                        }}
                      >
                        {month.revenue.toLocaleString()}
                      </td>
                      <td
                        style={{
                          fontSize: "14px",
                          color: "#212529",
                          padding: "12px",
                          textAlign: "right",
                        }}
                      >
                        {month.fees.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div className="col">
        <div className="card">
          <div className="card-header">
            <h5 className="card-title">Top Earning Farmers</h5>
            <p className="card-text text-muted">
              Highest revenue generating farmers
            </p>
          </div>
          <div className="card-body">
            {financial.topEarningFarmers.map((farmer, index) => (
              <div
                key={index}
                className="d-flex justify-content-between align-items-center mb-3"
              >
                <div>
                  <div className="fw-bold">{farmer.name}</div>
                  <div className="text-muted small">{farmer.orders} orders</div>
                </div>
                <div className="text-end">
                  <div className="text-success fw-bold">
                    ETB {farmer.earnings.toLocaleString()}
                  </div>
                  <div className="text-muted small">earnings</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default FinancialReport;
