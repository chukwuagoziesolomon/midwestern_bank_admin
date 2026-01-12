import React, { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { FaUsers, FaCheck, FaTimes, FaSync, FaTrash, FaDollarSign } from 'react-icons/fa';
import { adminApi } from '../api/client';
import DateModal from './DateModal';
import BalanceModal from './BalanceModal';
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDateModal, setShowDateModal] = useState(false);
  const [pendingUserId, setPendingUserId] = useState(null);
  const [showBalanceModal, setShowBalanceModal] = useState(false);
  const [balanceUserId, setBalanceUserId] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getUsers();
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      alert('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId) => {
    const user = users.find(u => u.id === userId);
    setPendingUserId(userId);
    setShowDateModal(true);
  };

  const handleDateSubmit = async (startDate, endDate) => {
    if (!pendingUserId) return;

    try {
      setActionLoading(pendingUserId);
      const response = await adminApi.approveUser(pendingUserId, startDate, endDate);
      
      if (response.status === 200) {
        toast.success(
          `✅ ${response.data.message}\n📊 Generated ${response.data.user?.transactions_generated || 'multiple'} transactions`,
          {
            duration: 4000,
            position: 'top-right',
          }
        );
        setShowDateModal(false);
        setPendingUserId(null);
        fetchUsers();
      }
    } catch (error) {
      const errorMsg = error.response?.data?.error || error.message;
      toast.error(`❌ ${errorMsg}`, {
        duration: 4000,
        position: 'top-right',
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (userId) => {
    if (window.confirm('Are you sure you want to reject this user?')) {
      try {
        setActionLoading(userId);
        const response = await adminApi.rejectUser(userId);
        if (response.status === 200) {
          toast.success(`✅ ${response.data.message}`, {
            duration: 3000,
            position: 'top-right',
          });
          fetchUsers();
        }
      } catch (error) {
        toast.error(`❌ Error rejecting user`, {
          duration: 3000,
          position: 'top-right',
        });
      } finally {
        setActionLoading(null);
      }
    }
  };

  const handleResetTransfers = async (userId) => {
    if (window.confirm('Are you sure you want to reset transfer count?')) {
      try {
        setActionLoading(userId);
        const response = await adminApi.resetTransfers(userId);
        if (response.status === 200) {
          toast.success(`✅ ${response.data.message}`, {
            duration: 3000,
            position: 'top-right',
          });
          fetchUsers();
        }
      } catch (error) {
        toast.error(`❌ Error resetting transfers`, {
          duration: 3000,
          position: 'top-right',
        });
      } finally {
        setActionLoading(null);
      }
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        setActionLoading(userId);
        const response = await adminApi.deleteUser(userId);
        if (response.status === 200) {
          toast.success(`✅ ${response.data.message}`, {
            duration: 3000,
            position: 'top-right',
          });
          fetchUsers();
        }
      } catch (error) {
        toast.error(`❌ Error deleting user`, {
          duration: 3000,
          position: 'top-right',
        });
      } finally {
        setActionLoading(null);
      }
    }
  };

  const handleIncreaseBalance = (userId) => {
    setBalanceUserId(userId);
    setShowBalanceModal(true);
  };

  const handleBalanceSubmit = async (amount) => {
    if (!balanceUserId) return;

    try {
      setActionLoading(balanceUserId);
      const response = await adminApi.increaseBalance(balanceUserId, amount);
      
      if (response.status === 200) {
        const { user } = response.data;
        toast.success(
          `✅ ${response.data.message}\n💰 Added $${parseFloat(user.increase_amount).toFixed(2)}\n📈 New Balance: $${parseFloat(user.new_total_balance).toFixed(2)}`,
          {
            duration: 4000,
            position: 'top-right',
          }
        );
        setShowBalanceModal(false);
        setBalanceUserId(null);
        fetchUsers();
      }
    } catch (error) {
      const errorMsg = error.response?.data?.error || error.message;
      toast.error(`❌ ${errorMsg}`, {
        duration: 4000,
        position: 'top-right',
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleLogout = () => {
    // Logout functionality removed - dashboard is now public
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading">Loading users...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <Toaster />
      <DateModal
        isOpen={showDateModal}
        onClose={() => {
          setShowDateModal(false);
          setPendingUserId(null);
        }}
        onSubmit={handleDateSubmit}
        userName={users.find(u => u.id === pendingUserId)?.first_name || 'User'}
      />
      <BalanceModal
        isOpen={showBalanceModal}
        onClose={() => {
          setShowBalanceModal(false);
          setBalanceUserId(null);
        }}
        onSubmit={handleBalanceSubmit}
        userName={users.find(u => u.id === balanceUserId)?.first_name || 'User'}
      />
      <header className="dashboard-header">
        <div className="header-left">
          <h1><FaUsers /> Admin Dashboard</h1>
          <p className="subtitle">Manage user accounts and approvals</p>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="stats-section">
          <div className="stat-card">
            <div className="stat-number">{users.length}</div>
            <div className="stat-label">Total Users</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{users.filter(u => u.account?.is_approved).length}</div>
            <div className="stat-label">Approved Users</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{users.filter(u => !u.account?.is_approved).length}</div>
            <div className="stat-label">Pending Approval</div>
          </div>
        </div>

        <div className="table-section">
          <h2>User Management</h2>
          <div className="table-wrapper">
            <table className="users-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Transfers</th>
                  <th>Balance</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className={selectedUser?.id === user.id ? 'selected' : ''}>
                    <td className="name-cell">
                      {user.first_name} {user.last_name}
                    </td>
                    <td>{user.email}</td>
                    <td className="status-cell">
                      {user.account?.is_approved ? (
                        <span className="status-badge approved"><FaCheck /> Approved</span>
                      ) : (
                        <span className="status-badge pending"><FaTimes /> Pending</span>
                      )}
                    </td>
                    <td className="transfers-cell">
                      {user.account?.transfer_count || 0}/2
                    </td>
                    <td className="balance-cell">
                      ${parseFloat(user.account?.available_balance || 0).toFixed(2)}
                    </td>
                    <td className="date-cell">
                      {new Date(user.date_joined).toLocaleDateString()}
                    </td>
                    <td className="actions-cell">
                      <div className="action-buttons">
                        {!user.account?.is_approved ? (
                          <>
                            <button
                              onClick={() => handleApprove(user.id)}
                              disabled={actionLoading === user.id}
                              className="btn-approve"
                              title="Approve this user"
                            >
                              <FaCheck /> Approve
                            </button>
                            <button
                              onClick={() => handleReject(user.id)}
                              disabled={actionLoading === user.id}
                              className="btn-reject"
                              title="Reject this user"
                            >
                              <FaTimes /> Reject
                            </button>
                          </>
                        ) : (
                          <button disabled className="btn-approved">
                            <FaCheck /> Approved
                          </button>
                        )}
                        <button
                          onClick={() => handleIncreaseBalance(user.id)}
                          disabled={actionLoading === user.id}
                          className="btn-increase"
                          title="Increase account balance"
                        >
                          <FaDollarSign /> Add Balance
                        </button>
                        <button
                          onClick={() => handleResetTransfers(user.id)}
                          disabled={actionLoading === user.id}
                          className="btn-reset"
                          title="Reset transfer count"
                        >
                          <FaSync /> Reset
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          disabled={actionLoading === user.id}
                          className="btn-delete"
                          title="Delete this user"
                        >
                          <FaTrash /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {users.length === 0 && (
          <div className="empty-state">
            <p>No users found. Users will appear here once they sign up.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
