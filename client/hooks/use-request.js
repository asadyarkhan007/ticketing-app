import axios from "axios";
import { useState } from "react";

const useRequest = ({ url, method, body, onSuccess }) => {
  const [errors, setErrors] = useState(null);

  const doRequest = async () => {
    try {
      setErrors(null);
      const response = await axios[method](url, body);
      if (onSuccess) {
        onSuccess(response.data);
      }
      return response.data;
    } catch (err) {
      {
        err &&
          setErrors(
            <div className="alert alert-danger">
              <h4>Oops..</h4>
              <div>{err.response.data.message} </div>
              <ul className="my-0">
                {err.response.data.detail.map((err) => (
                  <li key={err}>{err}</li>
                ))}
              </ul>
            </div>
          );
      }
    }
  };

  return { doRequest, errors };
};

export default useRequest;
