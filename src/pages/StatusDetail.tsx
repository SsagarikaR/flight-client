import { useParams } from "react-router-dom";

const StatusDetail = () => {
  const { id } = useParams();
  return <div>Flight Status Detail for ID: {id}</div>;
};
export default StatusDetail;
