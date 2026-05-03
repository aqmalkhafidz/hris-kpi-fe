import { apiBlob, resolveApiUrl } from '@shared/api/client';
import { useEffect, useState } from 'react';

interface ProtectedObjectUrlState {
  src: string | null;
  mimeType: string | null;
  loading: boolean;
}

export function useProtectedObjectUrl(
  source: string | null | undefined
): ProtectedObjectUrlState {
  const [state, setState] = useState<ProtectedObjectUrlState>({
    src: null,
    mimeType: null,
    loading: false,
  });

  useEffect(() => {
    if (!source) {
      setState({ src: null, mimeType: null, loading: false });
      return;
    }

    if (!source.startsWith('/uploads/')) {
      setState({
        src: resolveApiUrl(source),
        mimeType: null,
        loading: false,
      });
      return;
    }

    let cancelled = false;
    let objectUrl: string | null = null;
    setState((current) => ({ ...current, loading: true }));

    void apiBlob(source)
      .then((blob) => {
        if (cancelled) return;
        objectUrl = URL.createObjectURL(blob);
        setState({
          src: objectUrl,
          mimeType: blob.type || null,
          loading: false,
        });
      })
      .catch(() => {
        if (cancelled) return;
        setState({ src: null, mimeType: null, loading: false });
      });

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [source]);

  return state;
}
