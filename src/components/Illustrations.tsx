import React from 'react';

export const LakshmiAvatarSvg: React.FC<{ className?: string }> = ({ className = 'w-14 h-14' }) => (
  <svg viewBox="0 0 80 80" fill="none" className={className} aria-hidden="true">
    <circle cx="40" cy="40" r="38" fill="#ECFDF5" stroke="#16A34A" strokeWidth="3" />
    <circle cx="40" cy="31" r="14" fill="#FDBA74" />
    <path
      d="M26 28C26 19 32 14 40 14C48 14 54 19 54 28C50 23 30 23 26 28Z"
      fill="#1E293B"
    />
    <circle cx="40" cy="24" r="2.2" fill="#DC2626" />
    <circle cx="35" cy="31" r="1.8" fill="#0F172A" />
    <circle cx="45" cy="31" r="1.8" fill="#0F172A" />
    <path d="M36 37C38 39 42 39 44 37" stroke="#9A3412" strokeWidth="2" strokeLinecap="round" />
    <path
      d="M18 68C20 53 29 48 40 48C51 48 60 53 62 68"
      fill="#16A34A"
    />
    <path
      d="M27 50L40 66L53 50"
      stroke="#FACC15"
      strokeWidth="3"
      strokeLinecap="round"
    />
  </svg>
);

export const RuralSavingsIllustration: React.FC<{ className?: string }> = ({
  className = 'w-28 h-28',
}) => (
  <svg viewBox="0 0 120 120" fill="none" className={className} aria-hidden="true">
    <rect x="8" y="8" width="104" height="104" rx="24" fill="#ECFDF5" stroke="#A7F3D0" strokeWidth="2" />
    <ellipse cx="60" cy="88" rx="32" ry="12" fill="#DCFCE7" />
    <path
      d="M42 48H78C82 48 86 54 86 64C86 77 77 86 60 86C43 86 34 77 34 64C34 54 38 48 42 48Z"
      fill="#F97316"
    />
    <rect x="44" y="42" width="32" height="8" rx="4" fill="#166534" />
    <circle cx="60" cy="30" r="11" fill="#FACC15" stroke="#92400E" strokeWidth="2" />
    <text
      x="60"
      y="34"
      textAnchor="middle"
      fill="#0F172A"
      fontSize="13"
      fontWeight="800"
      fontFamily="Poppins, sans-serif"
    >
      ₹
    </text>
    <path d="M26 78C26 68 32 62 36 60" stroke="#16A34A" strokeWidth="3" strokeLinecap="round" />
    <circle cx="26" cy="58" r="5" fill="#16A34A" />
    <circle cx="94" cy="56" r="5" fill="#16A34A" />
  </svg>
);

export const UpiPhoneIllustration: React.FC<{ step: number; className?: string }> = ({
  step,
  className = 'w-44 h-44',
}) => (
  <svg viewBox="0 0 160 160" fill="none" className={className} aria-hidden="true">
    <rect x="42" y="12" width="76" height="136" rx="18" fill="#0F172A" />
    <rect x="48" y="22" width="64" height="112" rx="10" fill="#FFFFFF" />
    <rect x="68" y="15" width="24" height="4" rx="2" fill="#475569" />
    {step === 1 && (
      <>
        <rect x="56" y="34" width="48" height="22" rx="6" fill="#0EA5E9" />
        <text x="80" y="49" textAnchor="middle" fill="#FFF" fontSize="10" fontWeight="700">UPI APP</text>
        <rect x="56" y="66" width="21" height="21" rx="5" fill="#ECFDF5" stroke="#16A34A" strokeWidth="2" />
        <rect x="83" y="66" width="21" height="21" rx="5" fill="#FFF7ED" stroke="#F97316" strokeWidth="2" />
        <rect x="56" y="96" width="48" height="24" rx="8" fill="#16A34A" />
        <text x="80" y="112" textAnchor="middle" fill="#FFF" fontSize="9" fontWeight="700">SCAN QR</text>
      </>
    )}
    {step === 2 && (
      <>
        <rect x="58" y="38" width="44" height="44" rx="6" fill="#ECFDF5" stroke="#16A34A" strokeWidth="2" />
        <rect x="64" y="44" width="12" height="12" fill="#0F172A" />
        <rect x="84" y="44" width="12" height="12" fill="#0F172A" />
        <rect x="64" y="64" width="12" height="12" fill="#0F172A" />
        <rect x="84" y="64" width="12" height="12" fill="#16A34A" />
        <path d="M56 96H104" stroke="#F97316" strokeWidth="3" strokeLinecap="round" />
        <text x="80" y="116" textAnchor="middle" fill="#166534" fontSize="9" fontWeight="700">SCANNING...</text>
      </>
    )}
    {step === 3 && (
      <>
        <circle cx="80" cy="46" r="14" fill="#ECFDF5" stroke="#16A34A" strokeWidth="2" />
        <text x="80" y="50" textAnchor="middle" fill="#166534" fontSize="11" fontWeight="800">RK</text>
        <text x="80" y="72" textAnchor="middle" fill="#0F172A" fontSize="8" fontWeight="700">Raju Kirana</text>
        <rect x="56" y="82" width="48" height="22" rx="6" fill="#F8FAFC" stroke="#94A3B8" strokeWidth="1.5" />
        <text x="80" y="97" textAnchor="middle" fill="#0F172A" fontSize="12" fontWeight="800">₹ 250</text>
        <rect x="56" y="110" width="48" height="16" rx="6" fill="#F97316" />
        <text x="80" y="121" textAnchor="middle" fill="#FFF" fontSize="8" fontWeight="700">PAY NOW</text>
      </>
    )}
    {step === 4 && (
      <>
        <text x="80" y="46" textAnchor="middle" fill="#0F172A" fontSize="9" fontWeight="700">ENTER UPI PIN</text>
        <rect x="56" y="56" width="48" height="18" rx="6" fill="#FEF2F2" stroke="#DC2626" strokeWidth="1.5" />
        <text x="80" y="69" textAnchor="middle" fill="#0F172A" fontSize="12" fontWeight="800">* * * *</text>
        <rect x="58" y="84" width="44" height="36" rx="6" fill="#F1F5F9" />
        <text x="80" y="106" textAnchor="middle" fill="#166534" fontSize="8" fontWeight="700">HIDE KEYPAD</text>
      </>
    )}
    {step === 5 && (
      <>
        <circle cx="80" cy="64" r="22" fill="#16A34A" />
        <path d="M69 64L77 72L92 56" stroke="#FFFFFF" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
        <text x="80" y="102" textAnchor="middle" fill="#166534" fontSize="10" fontWeight="800">PAID ₹250</text>
        <text x="80" y="116" textAnchor="middle" fill="#475569" fontSize="8" fontWeight="600">SUCCESSFUL</text>
      </>
    )}
    {step === 6 && (
      <>
        <rect x="54" y="34" width="52" height="54" rx="8" fill="#ECFDF5" stroke="#16A34A" strokeWidth="2" />
        <text x="80" y="52" textAnchor="middle" fill="#166534" fontSize="9" fontWeight="800">BANK SMS</text>
        <text x="80" y="66" textAnchor="middle" fill="#0F172A" fontSize="8" fontWeight="600">Debited ₹250</text>
        <text x="80" y="78" textAnchor="middle" fill="#16A34A" fontSize="8" fontWeight="700">Bal ₹8,200</text>
        <rect x="56" y="98" width="48" height="22" rx="8" fill="#0EA5E9" />
        <text x="80" y="112" textAnchor="middle" fill="#FFF" fontSize="8" fontWeight="700">SAVED ✓</text>
      </>
    )}
  </svg>
);

export const ScamShieldIllustration: React.FC<{ className?: string }> = ({
  className = 'w-20 h-20',
}) => (
  <svg viewBox="0 0 80 80" fill="none" className={className} aria-hidden="true">
    <path
      d="M40 8L68 18V38C68 55 56 68 40 74C24 68 12 55 12 38V18L40 8Z"
      fill="#FEE2E2"
      stroke="#DC2626"
      strokeWidth="3"
    />
    <path d="M40 24V44" stroke="#DC2626" strokeWidth="5" strokeLinecap="round" />
    <circle cx="40" cy="54" r="3.5" fill="#DC2626" />
  </svg>
);
