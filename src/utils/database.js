import axios from "axios";

export default class database {
  static fetchIntervals = () => {
    return axios
      .get("/api/intervalUpdates", {
        params: {
          userName: "fredricklou523"
        }
      })
      .then(intervals => {
        console.log(intervals);
        return intervals.data;
      })
      .catch(err => {
        console.log(err);
      });
  };
}
