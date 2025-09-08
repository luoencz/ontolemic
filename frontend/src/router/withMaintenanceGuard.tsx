import type { ComponentType } from 'react';
import Maintenance from '../pages/system/Maintenance';

function isLocalEnvironment(): boolean {
  const host = window.location.hostname;
  return (
    host === 'localhost' ||
    host === '127.0.0.1' ||
    host.endsWith('.local')
  );
}

export function withMaintenanceGuard<P extends object>(
  Wrapped: ComponentType<P>,
  options: { enabled: boolean }
): ComponentType<P> {
  const { enabled } = options;

  function Guarded(props: P): JSX.Element {
    const allow = isLocalEnvironment();
    if (enabled && !allow) {
      return <Maintenance />;
    }
    return <Wrapped {...props} />;
  }

  Guarded.displayName = `WithMaintenanceGuard(${Wrapped.displayName || Wrapped.name || 'Component'})`;
  return Guarded;
}



