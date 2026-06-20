import { useState } from 'react';

import { ConsentDialog } from '../../components/onboarding';
import { useProfiles } from '../../providers';

export function ConsentScreen() {
  const { acceptConsent } = useProfiles();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAccept() {
    setLoading(true);
    setError(null);

    const result = await acceptConsent();

    if (result.error) {
      setError(result.error);
    }

    setLoading(false);
  }

  return <ConsentDialog loading={loading} error={error} onAccept={handleAccept} />;
}
