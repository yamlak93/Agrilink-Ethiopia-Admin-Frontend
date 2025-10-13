import { ShoppingCart, DollarSign, Clock, CreditCard } from "lucide-react";

const OrderReport = ({ orders }) => (
  <div className="mb-4">
    <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4 mb-4">
      <div className="col">
        <div className="card summary-card h-100">
          <div className="summary-card-header">
            <h6 className="summary-card-title">Total Orders</h6>
            <ShoppingCart size={24} className="summary-card-icon" />
          </div>
          <div className="summary-card-body">
            <h3 className="summary-card-value">
              {orders.totalOrders.toLocaleString()}
            </h3>
            <p className="summary-card-subtext text-muted">All time orders</p>
          </div>
        </div>
      </div>
      <div className="col">
        <div className="card summary-card h-100">
          <div className="summary-card-header">
            <h6 className="summary-card-title">Completed Orders</h6>
            <ShoppingCart size={24} className="summary-card-icon" />
          </div>
          <div className="summary-card-body">
            <h3 className="summary-card-value">
              {orders.completedOrders.toLocaleString()}
            </h3>
            <p className="summary-card-subtext text-muted">
              {((orders.completedOrders / orders.totalOrders) * 100).toFixed(1)}
              % completion rate
            </p>
          </div>
        </div>
      </div>
      <div className="col">
        <div className="card summary-card h-100">
          <div className="summary-card-header">
            <h6 className="summary-card-title">Avg. Order Value</h6>
            <DollarSign size={24} className="summary-card-icon" />
          </div>
          <div className="summary-card-body">
            <h3 className="summary-card-value">ETB {orders.avgOrderValue}</h3>
            <p className="summary-card-subtext text-muted">Per order</p>
          </div>
        </div>
      </div>
      <div className="col">
        <div className="card summary-card h-100">
          <div className="summary-card-header">
            <h6 className="summary-card-title">Pending Orders</h6>
            <Clock size={24} className="summary-card-icon" />
          </div>
          <div className="summary-card-body">
            <h3 className="summary-card-value">{orders.pendingOrders}</h3>
            <p className="summary-card-subtext text-muted">
              Awaiting processing
            </p>
          </div>
        </div>
      </div>
    </div>

    <div className="row row-cols-1 row-cols-lg-2 g-4">
      <div className="col">
        <div className="card">
          <div className="card-header">
            <h5 className="card-title">Monthly Order Trends</h5>
            <p className="card-text text-muted">
              Order volume and value over time
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
                      Orders
                    </th>
                    <th
                      style={{
                        fontSize: "14px",
                        color: "#6c757d",
                        fontWeight: "normal",
                        textAlign: "right",
                      }}
                    >
                      Value (ETB)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {orders.orderTrends.map((trend, index) => (
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
                        {trend.month}
                      </td>
                      <td
                        style={{
                          fontSize: "14px",
                          color: "#212529",
                          padding: "12px",
                          textAlign: "right",
                        }}
                      >
                        {trend.orders.toLocaleString()}
                      </td>
                      <td
                        style={{
                          fontSize: "14px",
                          color: "#212529",
                          padding: "12px",
                          textAlign: "right",
                        }}
                      >
                        {trend.value.toLocaleString()}
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
            <h5 className="card-title">Payment Methods</h5>
            <p className="card-text text-muted">
              Payment processing via Chapa gateway
            </p>
          </div>
          <div className="card-body">
            {orders.paymentMethods.map((method, index) => (
              <div key={index} className="mb-3">
                <div className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center">
                    <CreditCard size={16} className="text-muted me-2" />
                    <span>{method.method} Gateway</span>
                  </div>
                  <div className="text-end">
                    <div className="fw-bold">
                      {method.orders.toLocaleString()}
                    </div>
                    <div className="text-muted small">total orders</div>
                  </div>
                </div>
                <div className="d-flex justify-content-between align-items-center mt-2">
                  <span className="text-muted">Total Payments Processed</span>
                  <span className="text-success fw-bold">
                    ETB {method.totalPayments.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default OrderReport;
