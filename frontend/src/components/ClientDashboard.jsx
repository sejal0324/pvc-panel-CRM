import React, { useState, useEffect } from 'react';
import { Search, Users, Plus, ArrowUpDown, Trash2, Radar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import * as clientApi from '../apis/clientMApi';
import './ClientDashboard.css';

const ClientDashboard = () => {
     const navigate = useNavigate();
     const [clients, setClients] = useState([]);
     const [searchTerm, setSearchTerm] = useState('');
     const [loading, setLoading] = useState(true);
     const [error, setError] = useState(null);
     const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
     const [clientToDelete, setClientToDelete] = useState(null);

     useEffect(() => {
          fetchClients();
     }, []);

     const fetchClients = async () => {
          try {
               const data = await clientApi.getClients();
               setClients(data);
               setLoading(false);
          } catch (err) {
               setError('Failed to load client data.');
               setLoading(false);
          }
     };

     const filteredClients = clients.filter(client =>
          client.business_name.toLowerCase().includes(searchTerm.toLowerCase())
     );

     const getStatusColor = (status) => {
          switch (status?.toUpperCase()) {
               case 'ACTIVE': return 'status-active';
               case 'LEAD': return 'status-lead';
               case 'INACTIVE': return 'status-inactive';
               case 'LOST': return 'status-lost';
               default: return 'status-default';
          }
     };

     const handleDeleteClick = (client) => {
          setClientToDelete(client);
          setShowDeleteConfirm(true);
     };

     const handleConfirmDelete = async () => {
          if (!clientToDelete) return;
          try {
               await clientApi.deleteClient(clientToDelete.client_id);
               await fetchClients();
               setShowDeleteConfirm(false);
               setClientToDelete(null);
          } catch (err) {
               console.error("Failed to delete client:", err);
               setError(err.response?.data?.error || 'Failed to delete client.');
               setShowDeleteConfirm(false);
               setClientToDelete(null);
          }
     };

     if (loading) return (
          <div className="loader-container">
               <div className="loader"></div>
               <p>Loading Enterprise Records...</p>
          </div>
     );

     return (
          <div className="dashboard-container">
               <div className="dashboard-header">
                    <div className="header-title">
                         <Users size={28} />
                         <div>
                              <h1>Client Ecosystem</h1>
                              <p>Total Registered Entities: {clients.length}</p>
                         </div>
                    </div>
                    <div className="header-actions">
                         <div className="search-wrapper">
                              <Search size={18} className="search-icon" />
                              <input
                                   type="text"
                                   placeholder="Search by business name..."
                                   value={searchTerm}
                                   onChange={(e) => setSearchTerm(e.target.value)}
                              />
                         </div>
                         <button className="add-client-btn" onClick={() => navigate('/clients')}>
                              <Plus size={18} /> New Client
                         </button>
                         <button className="discover-leads-btn" onClick={() => navigate('/leadDashboard')}>
                              <Radar size={18} /> Discover Leads
                         </button>
                         <button className="refresh-btn" onClick={fetchClients}>
                              <ArrowUpDown size={16} /> Sync Data
                         </button>
                    </div>
               </div>

               {error && <div className="dashboard-error">{error}</div>}

               <div className="table-container">
                    <table className="client-table">
                         <thead>
                              <tr>
                                   <th>BUSINESS NAME</th>
                                   <th>OWNER</th>
                                   <th>ZONE</th>
                                   <th>CLASSIFICATION</th>
                                   <th>ENGAGEMENT STATUS</th>
                                   <th>ACTIONS</th>
                              </tr>
                         </thead>
                         <tbody>
                              {filteredClients.map((client) => (
                                   <tr
                                        key={client.client_id}
                                        onClick={() => navigate(`/clients/${client.client_id}`)}
                                   >
                                        <td className="bold-text">{client.business_name}</td>
                                        <td>{client.owner_name}</td>
                                        <td><span className="zone-tag">Zone {client.zone_id}</span></td>
                                        <td>{client.client_type}</td>
                                        <td>
                                             <span className={`status-badge ${getStatusColor(client.status)}`}>
                                                  {client.status}
                                             </span>
                                        </td>
                                        <td onClick={(e) => e.stopPropagation()}>
                                             <button
                                                  className="delete-action-btn"
                                                  onClick={() => handleDeleteClick(client)}
                                                  title="Delete Client"
                                             >
                                                  <Trash2 size={16} />
                                             </button>
                                        </td>
                                   </tr>
                              ))}
                         </tbody>
                    </table>
                    {filteredClients.length === 0 && !loading && (
                         <div className="empty-state">
                              <Search size={48} />
                              <p>No clients found matching your search.</p>
                         </div>
                    )}
               </div>

               {showDeleteConfirm && (
                    <div className="modal-overlay">
                         <div className="modal-card">
                              <h4>Delete Confirmation</h4>
                              <p>Are you sure you want to delete <strong>{clientToDelete?.business_name}</strong>? This action cannot be undone.</p>
                              <div className="modal-actions">
                                   <button
                                        onClick={() => {
                                             setShowDeleteConfirm(false);
                                             setClientToDelete(null);
                                        }}
                                        className="cancel-btn"
                                   >
                                        Cancel
                                   </button>
                                   <button
                                        onClick={handleConfirmDelete}
                                        className="delete-confirm-btn"
                                   >
                                        Delete
                                   </button>
                              </div>
                         </div>
                    </div>
               )}
          </div>
     );
};

export default ClientDashboard;
