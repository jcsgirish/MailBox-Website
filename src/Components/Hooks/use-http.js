const useHttp = (requestConfig, applyData) => {
    const sendRequest = async () => {
      try {
        const response = await fetch(requestConfig.url, {
          method: requestConfig.method,
          headers: requestConfig.headers,
          body: JSON.stringify(requestConfig.body),
        });
  
        if (!response.ok) {
          console.log('Request failed!')
          throw new Error('Request failed!');
        } else {
          const data = await response.json();
          applyData(data);
        }
      } catch (err) {
        console.log(err);
      }
    };
  
    return sendRequest;
  
  };
  
  export default useHttp;