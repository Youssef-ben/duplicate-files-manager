import { Link, useLocation } from 'react-router-dom';

const DEFAULT_LABELS: Readonly<Record<string, string>> = {
  organize: 'Organize',
  folder: 'Folder',
  flatten: 'Flatten',
  duplicate: 'Duplicate',
  confirm: 'Confirm',
  synchronize: 'Synchronize',
  settings: 'Settings'
};

const toTitle = (value: string): string => {
  const decoded = decodeURIComponent(value);
  const spaced = decoded.replace(/[-_]+/g, ' ');
  return spaced.replace(/\b\w/g, (c) => c.toUpperCase());
};

export interface BreadcrumbsProps {
  labels?: Readonly<Record<string, string>>;
  className?: string;
}

export function Breadcrumbs({ labels, className }: BreadcrumbsProps): React.JSX.Element {
  const { pathname } = useLocation();
  const mergedLabels = labels ? { ...DEFAULT_LABELS, ...labels } : DEFAULT_LABELS;

  const segments = pathname.split('/').filter(Boolean);
  const crumbs = segments.map((seg, idx) => {
    const to = `/${segments.slice(0, idx + 1).join('/')}`;
    const label = mergedLabels[seg] ?? toTitle(seg);
    const isLast = idx === segments.length - 1;
    return { to, label, isLast };
  });

  if (crumbs.length === 0) {
    return <></>;
  }

  return (
    <div className="flex flex-col text-left p-2 gap-2 w-full">
      <nav aria-label="Breadcrumb">
        <ol className={className ?? 'flex items-center gap-2 text-xs text-subtext1'}>
          {crumbs.map((c, idx) => {
            return (
              <li key={c.to} className="flex items-center gap-2">
                {c.isLast ? (
                  <span className="font-semibold">{c.label}</span>
                ) : (
                  <Link to={c.to} className="font-semibold hover:underline">
                    {c.label}
                  </Link>
                )}
                {idx < crumbs.length - 1 ? <span aria-hidden="true">/</span> : null}
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
}
