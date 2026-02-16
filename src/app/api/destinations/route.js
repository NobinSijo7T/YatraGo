import { NextResponse } from "next/server";
import { connectToDB } from "@/mongodb";
import Destination from "@/models/Destination";

export async function GET(req) {
    try {
        await connectToDB();

        const { searchParams } = new URL(req.url);
        const query = searchParams.get("query");
        const category = searchParams.get("category");
        const continent = searchParams.get("continent");
        const expense = searchParams.get("expense");

        let filter = {};
        if (query) {
            filter.$or = [
                { name: { $regex: query, $options: "i" } },
                { details: { $regex: query, $options: "i" } },
                { tags: { $in: [new RegExp(query, "i")] } }
            ];
        }
        if (category && category !== "all") {
            filter.category = category;
        }
        if (continent && continent !== "all") {
            filter.continent = continent;
        }
        if (expense && expense !== "all") {
            filter.expense = expense;
        }

        const destinations = await Destination.find(filter).sort({ createdAt: -1 });

        return NextResponse.json(destinations, { status: 200 });
    } catch (err) {
        console.error("ERROR_GET_DESTINATIONS", err);
        return NextResponse.json({ message: "Failed to fetch destinations" }, { status: 500 });
    }
}
