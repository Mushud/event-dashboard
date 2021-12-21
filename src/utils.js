import { useState, useCallback } from "react";
import axios from "axios";

import { hyperApi, voucherServer } from "./config";

function useRequest(
  { api = 1, path, method = "get", search },
  { onCompleted = (response) => {}, onError = (error) => {} } = {}
) {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(undefined);
  const [error, setError] = useState(undefined);

  const refetch = useCallback((variables = {}) => {
    setLoading(true);
    if (method === "get") {
      axios
        .get(hyperApi + path)
        .then((response) => {
          setResponse(response.data);
          setLoading(false);
          setError(undefined);
          onCompleted && onCompleted(response);
        })
        .catch((error) => {
          setResponse(undefined);
          setLoading(false);
          setError(error);
          onError && onError(error);
        });
    } else {
      axios
        .post(hyperApi + path, variables)
        .then((response) => {
          setResponse(response.data);
          setLoading(false);
          setError(undefined);
          onCompleted && onCompleted(response);
        })
        .catch((error) => {
          setResponse(undefined);
          setLoading(false);
          setError(error);
          onError && onError(error);
        });
    }
  }, []);

  const makeRequest = useCallback((variables = {}) => {
    setLoading(true);
    if (method === "get") {
      axios
        .get(hyperApi + path)
        .then((response) => {
          setResponse(response.data);
          setLoading(false);
          setError(undefined);
          onCompleted && onCompleted(response);
        })
        .catch((error) => {
          setResponse(undefined);
          setLoading(false);
          setError(error);
          onError && onError(error);
        });
    } else {
      axios
        .post(hyperApi + path, variables)
        .then((response) => {
          setResponse(response.data);
          setLoading(false);
          setError(undefined);
          onCompleted && onCompleted(response);
        })
        .catch((error) => {
          setResponse(undefined);
          setLoading(false);
          setError(error);
          onError && onError(error);
        });
    }
  }, []);

  return [
    makeRequest,
    { loading, data: response, error, refetch: () => refetch() },
  ];
}

export default useRequest;
