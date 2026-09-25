const toneClasses = {
  error: 'border-red-600 bg-red-50 text-red-700',
  success: 'border-emerald-600 bg-emerald-50 text-emerald-700',
  info: 'border-[#2F3E8F] bg-[#2F3E8F]/5 text-[#2F3E8F]',
};

const Alert = ({ tone = 'error', children }) => {
  if (!children) return null;

  return (
    <div
      role={tone === 'error' ? 'alert' : 'status'}
      className={`rounded-xl border-2 px-4 py-3 text-sm font-medium ${toneClasses[tone] ?? toneClasses.info}`}
    >
      {children}
    </div>
  );
};

export default Alert;
