import React from 'react';

interface AdminSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  /** Read out with the state, e.g. "Show on site". */
  label: string;
  onText: string;
  offText: string;
  disabled?: boolean;
}

/** An on/off switch that saves straight away, for a record's active state. */
export const AdminSwitch: React.FC<AdminSwitchProps> = ({ checked, onChange, label, onText, offText, disabled }) => (
  <button
    className="ad-switch"
    type="button"
    role="switch"
    aria-checked={checked}
    aria-label={label}
    disabled={disabled}
    onClick={() => onChange(!checked)}
  >
    <span className="ad-switch-track" aria-hidden="true" />
    <span>{checked ? onText : offText}</span>
  </button>
);

export default AdminSwitch;
