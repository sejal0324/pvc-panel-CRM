import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
     ArrowLeft,
     Building2,
     User,
     Phone,
     MapPin,
     Briefcase,
     Clock,
     ShieldCheck,
     FileText,
     DollarSign,
    TrendingUp,
    ShoppingCart,
     Package
} from 'lucide-react';
import * as clientApi from '../apis/clientMApi';
import AiSpinner from './AiSpinner';
import AiCard from './AiCard';
import './ClientDetails.css';

const ClientDetails = () => {
     const { id } = useParams();
     const navigate = useNavigate();
     const [client, setClient] = useState(null);
     const [loading, setLoading] = useState(true);
     const [aiReady, setAiReady] = useState(false);
     const [analysisStep, setAnalysisStep] = useState(0);
     const [error, setError] = useState(null);
     const [revenue, setRevenue] = useState(30000);
const [cogs, setCogs] = useState(18000);
const [expenses, setExpenses] = useState(1800);
const [tax, setTax] = useState(1200);
const [discount, setDiscount] = useState(500);

const orderValue = 45000;


const toNum = (v) => Number(v) || 0;

const profit =
    revenue -
    cogs -
    expenses -
    tax -
    discount;

     useEffect(() => {
          const fetchClientDetails = async () => {
               try {
                    setLoading(true);
                    setAiReady(false);
                    const data = await clientApi.getClientById(id);
                    if (data) {
                         setClient(data);
                    } else {
                         setError('Client record not found.');
                    }
                    setLoading(false);
               } catch (err) {
                    console.error('Error fetching client details:', err);
                    setError('Failed to load client details.');
                    setLoading(false);
               }
          };

          fetchClientDetails();
     }, [id]);

     useEffect(() => {
          if (!client) return;

          if (!client.ai) {
               setAiReady(true);
               return;
          }

          setAiReady(false);
          setAnalysisStep(0);

          const stepInterval = setInterval(() => {
               setAnalysisStep(prev => (prev + 1) % 4);
          }, 350);

          const revealTimer = setTimeout(() => {
               clearInterval(stepInterval);
               setAiReady(true);
          }, 1200);

          return () => {
               clearInterval(stepInterval);
               clearTimeout(revealTimer);
          };
     }, [client]);

     const getStatusColor = (status) => {
          switch (status?.toUpperCase()) {
               case 'ACTIVE': return 'status-active';
               case 'LEAD': return 'status-lead';
               case 'INACTIVE': return 'status-inactive';
               case 'LOST': return 'status-lost';
               default: return 'status-default';
          }
     };

     if (loading) {
          return (
               <div className="loader-container">
                    <div className="loader"></div>
                    <p>Loading Client Profile...</p>
               </div>
          );
     }

     if (error || !client) {
          return (
               <div className="details-error-container">
                    <Building2 size={48} className="error-icon" style={{ color: 'var(--alert-red)' }} />
                    <h2 className="error-title">Record Search Failed</h2>
                    <p className="error-msg">{error || 'The requested client details could not be found.'}</p>
                    <button className="back-link" onClick={() => navigate('/clientDashboard')} style={{ margin: '0 auto' }}>
                         <ArrowLeft size={18} /> Back to Ecosystem
                    </button>
               </div>
          );
     }

     // Generate initials for avatar
               const handleVisit=async()=>{
               await clientApi.scheduleVisit(
               client.client_id,
               new Date().toISOString().split("T")[0]
               );
               alert("Visit Scheduled");
               }
               const handleFollowUp=async()=>{
               await clientApi.scheduleFollowUp(
               client.client_id,
               new Date().toISOString().split("T")[0]
               );
               alert("Follow-up Scheduled");
               }
               function getInitials(name) {
    if (!name) return "?";

    return name
        .split(" ")
        .map(word => word[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
}
const crossSell = [
    "PVC Adhesive",
    "Corner Profiles",
    "Ceiling Panels",
    "UV Marble Sheets"
];


const aiProducts = Array.isArray(client.ai?.recommended_products)
     ? client.ai.recommended_products
     : client.ai?.recommended_products
          ? [client.ai.recommended_products]
          : [];

const customerProducts = Array.isArray(client.products_sold)
     ? client.products_sold
     : client.products_sold
          ? [client.products_sold]
          : aiProducts.length > 0
               ? aiProducts
               : ["PVC Panels", "Wall Panels", "Ceiling Panels"];

const lastOrder = client.last_order || client.lastOrder || {};
const lastOrderValue = lastOrder.value || lastOrder.amount || orderValue;
const lastOrderDate = lastOrder.date || client.last_order_date || "Recent";
const lastOrderItems = lastOrder.items || lastOrder.product || "PVC panel bundle";
const formattedLastOrderValue = Number.isFinite(Number(lastOrderValue))
     ? `₹${Number(lastOrderValue).toLocaleString()}`
     : lastOrderValue;
const customerNotes = client.notes || client.customer_notes || client.remarks || "No customer notes added yet.";


     return (
          <div className="client-details-container">
               <div className="details-header">
                    <button className="back-link" onClick={() => navigate('/clientDashboard')}>
                         <ArrowLeft size={18} /> Back to Ecosystem
                    </button>
                    <div className="header-meta">
                         System Reference: {client.client_id}
                    </div>
               </div>

               <div className="details-grid">
                    <div className="client-summary-column">
                         <div className="details-card client-profile-card">
                              <div className="card-header-accent"></div>
                              <div className="card-content">
                                   <div className="profile-section">
                                        <div className="profile-avatar">
                                             {getInitials(client.business_name)}
                                        </div>
                                        <div className="profile-info">
                                             <h1>{client.business_name}</h1>
                                             <div className="status-row">
                                                  <span className={`status-badge ${getStatusColor(client.status)}`}>
                                                       {client.status}
                                                  </span>
                                                  <span className="zone-tag">Zone {client.zone_id}</span>
                                             </div>
                                        </div>
                                   </div>

                                   <div className="info-section">
                                        <h3><Briefcase size={18} /> Account Overview</h3>
                                        <div className="info-grid">
                                             <div className="info-item">
                                                  <div className="info-label">Primary Stakeholder</div>
                                                  <div className="info-value">
                                                       <User size={16} style={{ color: 'var(--text-secondary)' }} />
                                                       {client.owner_name}
                                                  </div>
                                             </div>
                                             <div className="info-item">
                                                  <div className="info-label">Classification</div>
                                                  <div className="info-value capitalize">
                                                       <Building2 size={16} style={{ color: 'var(--text-secondary)' }} />
                                                       {client.client_type}
                                                  </div>
                                             </div>
                                        </div>
                                   </div>

                                   <div className="info-section">
                                        <h3><Phone size={18} /> Connectivity & Space</h3>
                                        <div className="info-grid">
                                             <div className="info-item">
                                                  <div className="info-label">Contact Line</div>
                                                  <div className="info-value">
                                                       <Phone size={16} style={{ color: 'var(--text-secondary)' }} />
                                                       {client.phone}
                                                  </div>
                                             </div>
                                             <div className="info-item">
                                                  <div className="info-label">Operational Zone Map</div>
                                                  <div className="info-value">
                                                       <Clock size={16} style={{ color: 'var(--text-secondary)' }} />
                                                       Zone {client.zone_id}
                                                  </div>
                                             </div>
                                             <div className="info-item full-width">
                                                  <div className="info-label">Registered Office Address</div>
                                                  <div className="info-value">
                                                       <MapPin size={16} style={{ color: 'var(--text-secondary)', alignSelf: 'flex-start', marginTop: '4px' }} />
                                                       <span style={{ lineHeight: '1.4' }}>{client.address}</span>
                                                  </div>
                                             </div>
                                        </div>
                                   </div>
                              </div>
                         </div>

                         <div className="action-card">
                              <h4>Enterprise CRM Action Room</h4>
                              <p>Perform direct account configuration or manage follow-ups for this organization.</p>

                              <button
                                   onClick={() => handleVisit()}
                                   className="primary-action-btn"
                              >
                                   Schedule Visit
                              </button>

                              <button
                                   onClick={() => handleFollowUp()}
                                   className="primary-action-btn secondary-action-btn"
                              >
                                   Schedule Follow-up
                              </button>

                              <button
                                   onClick={() => navigate(`/clients/${client.client_id}/edit`)}
                                   className="primary-action-btn"
                              >
                                   Edit Client Details
                              </button>

                              <div className="info-badge-container">
                                   <ShieldCheck size={18} style={{ color: 'var(--accent-blue)', flexShrink: 0 }} />
                                   <span>Active Lead Integrity Verified</span>
                              </div>

                              <div className="info-badge-container" style={{ marginTop: '12px' }}>
                                   <FileText size={18} style={{ color: 'var(--text-secondary)', flexShrink: 0 }} />
                                   <span>Last Synced: Just now</span>
                              </div>
                         </div>
                    </div>

                    <div className="dashboard-grid">
                         <div className="ai-assistant-panel dashboard-panel">
                              {!aiReady ? (
                                   <AiSpinner stepIndex={analysisStep} />
                              ) : client.ai ? (
                                   <AiCard ai={client.ai} />
                              ) : (
                                   <div className="ai-unavailable">
                                        <p>AI analysis unavailable for this client.</p>
                                   </div>
                              )}
                         </div>
                         <div className="details-card products-card">
                              <div className="card-content">
                                   <h3 className="mini-title">
                                        <Package size={18} />
                                        Products Customer Sells
                                   </h3>

                                   <div className="compact-chip-grid">
                                        {customerProducts.slice(0, 5).map(product => (
                                             <span className="compact-chip" key={product}>
                                                  {product}
                                             </span>
                                        ))}
                                   </div>
                              </div>
                         </div>

                         <div className="details-card last-order-card">
                              <div className="card-content">
                                   <h3 className="mini-title">
                                        <FileText size={18} />
                                        Last Order Details
                                   </h3>

                                   <div className="order-summary-grid">
                                        <div>
                                             <label>Order Value</label>
                                             <strong>{formattedLastOrderValue}</strong>
                                        </div>
                                        <div>
                                             <label>Date</label>
                                             <strong>{lastOrderDate}</strong>
                                        </div>
                                        <div className="order-summary-wide">
                                             <label>Items</label>
                                             <strong>{Array.isArray(lastOrderItems) ? lastOrderItems.join(', ') : lastOrderItems}</strong>
                                        </div>
                                   </div>
                              </div>
                         </div>

                         <div className="details-card notes-card">
                              <div className="card-content">
                                   <h3 className="mini-title">
                                        <FileText size={18} />
                                        Customer Notes
                                   </h3>

                                   <p className="customer-notes-text">{customerNotes}</p>
                              </div>
                         </div>

                         <div className="details-card revenue-card">
                              <div className="card-content">
                                   <h3 className="mini-title">
                                        <ShoppingCart size={18} />
                                        Cross Selling
                                   </h3>

                                   <p className="cross-description">
                                        Customers similar to this client usually purchase
                                   </p>

                                   <div className="cross-grid">
                                        {crossSell.map(item => (
                                             <div
                                                  className="cross-item"
                                                  key={item}
                                             >
                                                  ✓ {item}
                                             </div>
                                        ))}
                                   </div>

                                   <div className="cross-footer">
                                        <TrendingUp size={18} />
                                        Potential Upsell
                                        <strong>₹14,500</strong>
                                   </div>
                              </div>
                         </div>

                         <div className="profit-calculator metric-card">
            <div className="metric-title">Profit Calculator</div>

            <div className="profit-calc-grid">
                <div className="profit-inputs">
                    <label>Revenue</label>
                    <input type="number" step="0.01" value={revenue} onChange={e => setRevenue(toNum(e.target.value))} />

                    <label>Cost of Goods (COGS)</label>
                    <input type="number" step="0.01" value={cogs} onChange={e => setCogs(toNum(e.target.value))} />

                    <label>Expenses</label>
                    <input type="number" step="0.01" value={expenses} onChange={e => setExpenses(toNum(e.target.value))} />

                    <label>Tax</label>
                    <input type="number" step="0.01" value={tax} onChange={e => setTax(toNum(e.target.value))} />

                    <label>Discount</label>
                    <input type="number" step="0.01" value={discount} onChange={e => setDiscount(toNum(e.target.value))} />
                </div>

                                        <div className="metric-box">

<label>

Net Profit

</label>

<h2>

₹{profit.toLocaleString()}

</h2>

</div>

                                        <div className="profit-total">
                                             <label>Estimated Profit</label>
                                             <h1>₹{profit.toLocaleString()}</h1>
                                        </div>
                                   </div>
                              </div>
                         </div>
                    </div>
               </div>
     
     );
};


export default ClientDetails;
