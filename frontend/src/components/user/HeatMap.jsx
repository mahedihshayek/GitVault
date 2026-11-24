import { useEffect, useState } from "react";
import HeatMap from "@uiw/react-heat-map";

const API_URL = "http://localhost:3002";

const toLocalDateString = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const HeatMapProfile = () => {
  const [activityData, setActivityData] = useState([]);
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 1);
    return toLocalDateString(date);
  });
  const [endDate, setEndDate] = useState(toLocalDateString(new Date()));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = localStorage.getItem("userId");

        if (!userId) {
          setActivityData([]);
          return;
        }

        const response = await fetch(`${API_URL}/repo/all`);

        if (!response.ok) {
          throw new Error("Failed to fetch repositories");
        }

        const responseData = await response.json();

        const allRepositories = Array.isArray(responseData)
          ? responseData
          : responseData?.repositories || [];

        const myRepositories = allRepositories.filter((repo) => {
          const ownerId =
            typeof repo.owner === "object" ? repo.owner?._id : repo.owner;

          return String(ownerId) === String(userId);
        });

        const activityByDate = {};

        myRepositories.forEach((repo) => {
          if (!repo.createdAt) return;

          const createdDate = new Date(repo.createdAt);

          if (Number.isNaN(createdDate.getTime())) return;

          const dateKey = toLocalDateString(createdDate);
          activityByDate[dateKey] = (activityByDate[dateKey] || 0) + 1;
        });

        const data = Object.entries(activityByDate).map(([date, count]) => ({
          date,
          count: Math.min(count, 4),
        }));

        setActivityData(data);

        const today = new Date();
        setEndDate(toLocalDateString(today));

        if (data.length > 0) {
          const earliestDate = data
            .map((item) => new Date(`${item.date}T12:00:00`))
            .reduce((earliest, date) => (date < earliest ? date : earliest));

          earliestDate.setDate(earliestDate.getDate() - 7);
          setStartDate(toLocalDateString(earliestDate));
        } else {
          const oneYearAgo = new Date(today);
          oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
          setStartDate(toLocalDateString(oneYearAgo));
        }
      } catch (error) {
        console.error("Failed to load repository activity:", error);
        setActivityData([]);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h4>Recent Contributions</h4>

      <HeatMap
        className="HeatMapProfile"
        style={{
          maxWidth: "700px",
          height: "200px",
          color: "white",
        }}
        value={activityData}
        weekLabels={["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]}
        monthLabels={[
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ]}
        startDate={new Date(`${startDate}T12:00:00`)}
        endDate={new Date(`${endDate}T12:00:00`)}
        rectSize={15}
        space={3}
        rectProps={{
          rx: 2.5,
        }}
        panelColors={{
          0: "#161b22",
          1: "#0e4429",
          2: "#006d32",
          3: "#26a641",
          4: "#39d353",
        }}
      />
    </div>
  );
};

export default HeatMapProfile;
