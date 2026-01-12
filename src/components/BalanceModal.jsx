import React, { useState } from 'react';
import '../styles/BalanceModal.css';

const BalanceModal = ({ isOpen, onClose, onSubmit, userName }) => {
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate amount
    const amountValue = parseFloat(amount);
    if (!amount || isNaN(amountValue)) {
      setError('Please enter a valid amount');
      return;
    }
    
    if (amountValue <= 0) {
      setError('Amount must be greater than 0');
      return;
    }
    
    onSubmit(amountValue);
    setAmount('');
    setError('');
  };

  const handleClose = () => {
    setAmount('');
    setError('');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content balance-modal" onClick={(e) => e.stopPropagation()}>
        <h2>Increase Balance for {userName}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="amount">Amount to Add ($)</label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                setError('');
              }}
              placeholder="Enter amount (e.g., 5000)"
              step="0.01"
              min="0.01"
              className={error ? 'error' : ''}
              autoFocus
            />
            {error && <span className="error-message">{error}</span>}
          </div>
          
          <div className="modal-actions">
            <button type="button" onClick={handleClose} className="btn-cancel">
              Cancel
            </button>
            <button type="submit" className="btn-submit">
              Increase Balance
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BalanceModal;
