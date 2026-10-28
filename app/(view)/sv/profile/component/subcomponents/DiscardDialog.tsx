import React from 'react';

interface DiscardDialogProps {
  onCancel: () => void;
  onConfirm: () => void;
}

/** The same confirm dialog the membership form uses before clearing a form. */
export const DiscardDialog: React.FC<DiscardDialogProps> = ({ onCancel, onConfirm }) => (
  <div
    style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(15, 32, 39, .6)',
      backdropFilter: 'blur(2px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    }}
    onClick={onCancel}
  >
    <div className="confirm-dialog" onClick={(e) => e.stopPropagation()} role="dialog" aria-labelledby="mpDiscardTitle">
      <h3 id="mpDiscardTitle">Discard your changes?</h3>
      <p>Your details will go back to what was last saved.</p>
      <div className="cd-actions">
        <button className="btn btn-secondary" type="button" onClick={onCancel}>
          Keep editing
        </button>
        <button className="btn btn-primary" type="button" onClick={onConfirm}>
          Yes, discard
        </button>
      </div>
    </div>
  </div>
);

export default DiscardDialog;
