import { getAnalytics } from "@/actions/get-analytics";
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation";
import { DataCard } from "./_components/data-card";
import { Chart } from "./_components/chart";

async function Analytics() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/");
  }


  const {
    data,
    totalRevenue,
    totalSales,
  } = await getAnalytics(user.id);


  return (
    <div className="p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <DataCard
          label="Total revenue"
          value={totalRevenue}
          shouldFormat
        />
        <DataCard
          label="Total sales"
          value={totalSales}
        />
      </div>
      <Chart
        data={data}
      />
    </div>
  )
}

export default Analytics