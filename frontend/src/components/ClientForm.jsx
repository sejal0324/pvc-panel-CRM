import {
     Building2,
     User,
     Phone,
     MapPin,
     Briefcase,
     Activity,
     Send,
     Clock,
     CheckCircle2,
     AlertCircle,
     ArrowLeft
} from 'lucide-react';
import React, { useState, useEffect } from 'react';
import './ClientForm.css';
import * as clientInput from "../apis/clientMApi";
import { useNavigate, useParams } from 'react-router-dom';

const ClientForm = () => {
     const navigate = useNavigate();
     const { id } = useParams();
     const isEditMode = !!id;

     const [formData, setFormData] = useState({
          business_name: '',
          owner_name: '',
          phone: '',
          address: '',
          client_type: 'shop',
          status: 'LEAD',
          zone_id: ''
     });
     const [error, setError] = useState("");
     const [success, setSuccess] = useState("");

     useEffect(() => {
          if (success || error) {
               const timer = setTimeout(() => {
                    setSuccess("");
                    setError("");
               }, 5000);
               return () => clearTimeout(timer);
          }
     }, [success, error]);

     useEffect(() => {
          if (isEditMode) {
               const loadClient = async () => {
                    try {
                         const client = await clientInput.getClientById(id);
                         if (client) {
                              setFormData({
                                   business_name: client.business_name || '',
                                   owner_name: client.owner_name || '',
                                   phone: client.phone || '',
                                   address: client.address || '',
                                   client_type: client.client_type || 'shop',
                                   status: client.status || 'LEAD',
                                   zone_id: client.zone_id?.toString() || ''
                              });
                         }
                    } catch (err) {
                         console.error("Error loading client for edit:", err);
                         setError("Failed to load client details for editing.");
                    }
               };
               loadClient();
          }
     }, [id, isEditMode]);

     const handleChange = (e) => {
          const { name, value } = e.target;
          setFormData(prev => ({ ...prev, [name]: value }));
     };

     const handleSubmit = async (e) => {
          e.preventDefault();
          try {
               if (isEditMode) {
                    await clientInput.updateClient(id, formData);
                    setSuccess('Enterprise record updated successfully!');
                    setTimeout(() => navigate(`/clients/${id}`), 1500);
               } else {
                    const response = await clientInput.clientForm(formData);
                    console.log(response);
                    setSuccess('Enterprise record saved successfully!');
                    setTimeout(() => navigate("/clientDashboard"), 1500);
               }
          } catch (error) {
               console.log(error.response?.data || error.message);
               setError(error.response?.data?.error || 'Failed to save record.');
          }
     };

     return (
          <div className="client-form-container">
               <div className="client-form-card">
                    <div className="form-header">
                         <button className="back-btn" onClick={() => navigate(isEditMode ? `/clients/${id}` : '/clientDashboard')}>
                              <ArrowLeft size={18} /> Back
                         </button>
                         <h2>{isEditMode ? 'Edit Client Record' : 'Client Onboarding'}</h2>
                         <p>KALPAVRUKSH ERP + CRM | Enterprise Portal</p>
                    </div>

                    <form onSubmit={handleSubmit} className="form-body">
                         {/* Account Section */}
                         <div className="section-divider">
                              <h3>Business Account Details</h3>
                              <div className="line"></div>
                         </div>

                         <div className="form-grid">
                              <div className="form-group">
                                   <label><Building2 size={16} /> Business Name</label>
                                   <div className="input-container">
                                        <input
                                             type="text"
                                             name="business_name"
                                             placeholder="e.g. Acme Distributions"
                                             value={formData.business_name}
                                             onChange={handleChange}
                                             required
                                        />
                                   </div>
                              </div>

                              <div className="form-group">
                                   <label><User size={16} /> Business Owner Name</label>
                                   <div className="input-container">
                                        <input
                                             type="text"
                                             name="owner_name"
                                             placeholder="Entry authorized by"
                                             value={formData.owner_name}
                                             onChange={handleChange}
                                             required
                                        />
                                   </div>
                              </div>

                              <div className="form-group">
                                   <label><Phone size={16} /> Contact Identification</label>
                                   <div className="input-container">
                                        <input
                                             type="tel"
                                             name="phone"
                                             placeholder="+91 XXX XXX XXXX"
                                             value={formData.phone}
                                             onChange={handleChange}
                                             required
                                        />
                                   </div>
                              </div>

                              <div className="form-group">
                                   <label><Briefcase size={16} /> Client Classification</label>
                                   <div className="input-container">
                                        <select name="client_type" value={formData.client_type} onChange={handleChange}>
                                             <option value="shop">Retail Shop</option>
                                             <option value="interior designer">Interior Designer</option>
                                             <option value="carpentry owners">Carpentry Owner</option>
                                        </select>
                                   </div>
                              </div>

                              <div className="form-group full-width">
                                   <label><MapPin size={16} /> Business Address</label>
                                   <div className="input-container">
                                        <input
                                             type="text"
                                             name="address"
                                             placeholder="Enter complete office/shop location"
                                             value={formData.address}
                                             onChange={handleChange}
                                             required
                                        />
                                   </div>
                              </div>

                              <div className="form-group">
                                   <label><Clock size={16} /> Operational Zone</label>
                                   <div className="input-container">
                                        <select name="zone_id" value={formData.zone_id} onChange={handleChange} required>
                                             <option value="">-- Select Zone --</option>
                                             <option value="1">Zone 1</option>
                                             <option value="2">Zone 2</option>
                                             <option value="3">Zone 3</option>
                                        </select>
                                   </div>
                              </div>

                              <div className="form-group">
                                   <label><Activity size={16} /> Lead Engagement Status</label>
                                   <div className="input-container">
                                        <select
                                             name="status"
                                             value={formData.status}
                                             onChange={handleChange}
                                             className={`status-${formData.status}`}
                                        >
                                             <option value="LEAD">Lead</option>
                                             <option value="ACTIVE">Active</option>
                                             <option value="INACTIVE">Inactive</option>
                                             <option value="LOST">Lost</option>
                                        </select>
                                   </div>
                              </div>
                         </div>

                         <button type="submit" className="submit-btn" style={{ marginTop: '40px' }}>
                              {isEditMode ? 'UPDATE CLIENT RECORD' : 'COMMIT CLIENT RECORD'} <Send size={18} />
                         </button>

                         {error && (
                              <div className="error-message">
                                   <AlertCircle size={18} /> {error}
                              </div>
                         )}

                         {success && (
                              <div className="success-message">
                                   <CheckCircle2 size={18} /> {success}
                              </div>
                         )}
                    </form>
               </div>
          </div>
     );
};

export default ClientForm;
