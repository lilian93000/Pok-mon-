interface TopbarProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

/** En-tête de la zone de contenu (espace membre / admin). */
export function Topbar({ title, subtitle, action }: TopbarProps) {
  return (
    <div className="flex flex-col gap-4 border-b border-brand/10 bg-white px-6 py-5 sm:flex-row sm:items-center sm:justify-between md:px-8">
      <div>
        <h1 className="text-xl font-extrabold tracking-tightest text-ink md:text-2xl">
          {title}
        </h1>
        {subtitle && <p className="mt-0.5 text-sm text-slate">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
