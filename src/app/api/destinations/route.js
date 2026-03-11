import { connectToDB } from "@/mongodb";
import Destination from "@/models/Destination";

export async function GET(request) {
  try {
    await connectToDB();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const queryStr = searchParams.get("query");
    const country = searchParams.get("country");
    const city = searchParams.get("city");
    const sortBy = searchParams.get("sortBy") || "name";

    let query = {};
    if (category && category !== "all") {
      query.category = category;
    }

    // Search by query string across name, country, continent, capital
    if (queryStr) {
      const regex = new RegExp(queryStr, "i");
      query.$or = [
        { name: regex },
        { country: regex },
        { continent: regex },
        { capital: regex },
      ];
    }

    // Filter by country
    if (country) {
      query.country = new RegExp(country, "i");
    }

    // Filter by city (matched against capital or name)
    if (city) {
      const cityRegex = new RegExp(city, "i");
      if (!queryStr) {
        query.$or = [{ capital: cityRegex }, { name: cityRegex }];
      }
    }

    // Determine sort order
    let sortOptions = { name: 1 };
    if (sortBy === "name") sortOptions = { name: 1 };

    const destinations = await Destination.find(query).sort(sortOptions);

    return new Response(JSON.stringify(destinations), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching destinations:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch destinations" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

export async function POST(request) {
  try {
    await connectToDB();

    const body = await request.json();
    const destination = await Destination.create(body);

    return new Response(JSON.stringify(destination), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error creating destination:", error);
    return new Response(
      JSON.stringify({ error: "Failed to create destination", details: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
