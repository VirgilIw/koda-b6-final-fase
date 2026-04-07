import React from "react";

export default function useFetch(endpoint) {
  const [data, setData] = React.useState(null);

  React.useEffect(() => {
    const fetchData = async () => {
      const baseUrl = import.meta.env.VITE_BASE_URL;
      const res = await fetch(`${baseUrl}${endpoint}`);
      const result = await res.json();
      setData(result);
    };

    if (endpoint) {
      fetchData();
    }
  }, [endpoint]);

  return data;
}