import { Package, DollarSign } from "lucide-react";

const ProductReport = ({ products }) => (
  <div className="mb-4">
    <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4 mb-4">
      <div className="col">
        <div className="card summary-card h-100">
          <div className="summary-card-header">
            <h6 className="summary-card-title">Total Listings</h6>
            <Package size={24} className="summary-card-icon" />
          </div>
          <div className="summary-card-body">
            <h3 className="summary-card-value">
              {products.totalListings.toLocaleString()}
            </h3>
            <p className="summary-card-subtext text-muted">
              All product listings
            </p>
          </div>
        </div>
      </div>
      <div className="col">
        <div className="card summary-card h-100">
          <div className="summary-card-header">
            <h6 className="summary-card-title">Active Listings</h6>
            <Package size={24} className="summary-card-icon" />
          </div>
          <div className="summary-card-body">
            <h3 className="summary-card-value">
              {products.activeListings.toLocaleString()}
            </h3>
            <p className="summary-card-subtext text-muted">
              {(
                (products.activeListings / products.totalListings) *
                100
              ).toFixed(1)}
              % of total
            </p>
          </div>
        </div>
      </div>
      <div className="col">
        <div className="card summary-card h-100">
          <div className="summary-card-header">
            <h6 className="summary-card-title">Average Price</h6>
            <DollarSign size={24} className="summary-card-icon" />
          </div>
          <div className="summary-card-body">
            <h3 className="summary-card-value">ETB {products.avgPrice}</h3>
            <p className="summary-card-subtext text-muted">
              Per product listing
            </p>
          </div>
        </div>
      </div>
      <div className="col">
        <div className="card summary-card h-100">
          <div className="summary-card-header">
            <h6 className="summary-card-title">Categories</h6>
            <Package size={24} className="summary-card-icon" />
          </div>
          <div className="summary-card-body">
            <h3 className="summary-card-value">
              {products.topCategories.length}
            </h3>
            <p className="summary-card-subtext text-muted">
              Product categories
            </p>
          </div>
        </div>
      </div>
    </div>

    <div className="row row-cols-1 row-cols-lg-2 g-4">
      <div className="col">
        <div className="card">
          <div className="card-header">
            <h5 className="card-title">Top Categories</h5>
            <p className="card-text text-muted">
              Performance by product category
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
                      Category
                    </th>
                    <th
                      style={{
                        fontSize: "14px",
                        color: "#6c757d",
                        fontWeight: "normal",
                        textAlign: "right",
                      }}
                    >
                      Listings
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
                      Revenue
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {products.topCategories.map((category, index) => (
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
                        {category.category}
                      </td>
                      <td
                        style={{
                          fontSize: "14px",
                          color: "#212529",
                          padding: "12px",
                          textAlign: "right",
                        }}
                      >
                        {category.listings}
                      </td>
                      <td
                        style={{
                          fontSize: "14px",
                          color: "#212529",
                          padding: "12px",
                          textAlign: "right",
                        }}
                      >
                        {category.orders.toLocaleString()}
                      </td>
                      <td
                        style={{
                          fontSize: "14px",
                          color: "#212529",
                          padding: "12px",
                          textAlign: "right",
                        }}
                      >
                        ETB {category.revenue.toLocaleString()}
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
            <h5 className="card-title">Product Performance</h5>
            <p className="card-text text-muted">
              Top products by sales percentage
            </p>
          </div>
          <div className="card-body">
            {products.productPerformance.map((product, index) => (
              <div
                key={index}
                className="d-flex justify-content-between align-items-center mb-3"
              >
                <div>
                  <div className="fw-bold">{product.product}</div>
                  <div className="text-muted small">
                    {product.orders} orders
                  </div>
                </div>
                <div className="text-end">
                  <div className="text-success fw-bold">
                    {product.salesPercentage}%
                  </div>
                  <div className="text-muted small">of total sales</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default ProductReport;
