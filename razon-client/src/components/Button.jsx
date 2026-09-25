import { Link } from 'react-router-dom';

const variantClasses = {
  primary: 'border-[#2F3E8F] bg-[#2F3E8F] text-white hover:bg-[#253273]',
  secondary: 'border-[#2F3E8F] bg-white text-[#2F3E8F] hover:bg-[#F2C94C]',
};

const Button = ({
  children,
  to,
  type = 'button',
  variant = 'secondary',
  className = '',
  disabled = false,
  ...rest
}) => {
  const classes = [
    'inline-flex items-center justify-center rounded-full border-2 border-zinc-900 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.24em] transition',
    variantClasses[variant] ?? variantClasses.secondary,
    disabled ? 'cursor-not-allowed opacity-50' : '',
    className,
  ]
    .join(' ')
    .trim();

  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={classes} disabled={disabled} {...rest}>
      {children}
    </button>
  );
};

export default Button;
