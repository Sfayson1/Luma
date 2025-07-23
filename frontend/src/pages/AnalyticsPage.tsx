import React, { useEffect, useState } from "react";
import { getAnalyticsData } from "../services/analyticsService";
import MoodChart from "../components/MoodChart";
import WritingStreak from "../components/WritingStreak";
import TagSummary from "../components/TagSummary";

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    async function fetchData() {
      const result = await getAnalyticsData();
      setData(result);
    }
    fetchData();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <h1 className="font-['Playfair_Display'] text-3xl font-bold text-[#1F2937] mb-6">
        Your Journal Analytics
      </h1>

      {!data ? (
        <p className="text-gray-500">Loading analytics...</p>
      ) : (
        <div className="space-y-10">
          <MoodChart moodData={data.moodOverTime} />
          <WritingStreak entryDates={data.entryDates} />
          <TagSummary tagCounts={data.tagCounts} />
        </div>
      )}
    </div>
  );
}
