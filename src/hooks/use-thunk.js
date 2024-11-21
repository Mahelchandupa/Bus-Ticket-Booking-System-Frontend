import { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';

export function useThunk(thunk) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const dispatch = useDispatch();

  const runThunk = useCallback(
    (arg, successMsg = 'Request was successful') => {
      console.log(arg);
      setIsLoading(true);
      setSuccessMessage(null);
      setError(null);
      dispatch(thunk(arg))
        .unwrap()
        .then(() => setSuccessMessage(successMsg))
        .catch((err) => setError(err))
        .finally(() => setIsLoading(false));
    },
    [dispatch, thunk],
  );

  return [runThunk, isLoading, error, successMessage];
}
