import { connectToDB } from "@/app/lib/mongodb";
import WorkDay from "@/app/models/workDay";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  await connectToDB();
  const workdays = await WorkDay.find({}).sort({ dateString: -1 });
  return NextResponse.json(workdays);
}

export async function POST(req: NextRequest) {
  await connectToDB();

  // Type de body die we verwachten
  const body = (await req.json()) as { dateString: string; startTime: string; endTime: string };
  const { dateString, startTime, endTime } = body;

  const [startH, startM] = startTime.split(":").map(Number);
  const [endH, endM] = endTime.split(":").map(Number);

  const totalMinutes = endH * 60 + endM - (startH * 60 + startM);
  const netMinutes = totalMinutes - 24; // 24 minuten pauze
  const netHours = +(netMinutes / 60).toFixed(2);

  const workday = await WorkDay.findOneAndUpdate({ dateString }, { dateString, startTime, endTime, netHours }, { new: true, upsert: true });

  return NextResponse.json(workday);
}
