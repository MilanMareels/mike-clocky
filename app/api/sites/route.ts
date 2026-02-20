import { connectToDB } from "@/app/lib/mongodb";
import Site from "@/app/models/site";
import { NextResponse } from "next/server";

export async function GET() {
  await connectToDB();
  const sites = await Site.find({}).sort({ name: 1 });
  return NextResponse.json(sites);
}

export async function POST(req: Request) {
  await connectToDB();
  const { name } = await req.json();

  if (!name) return NextResponse.json({ error: "Name required" }, { status: 400 });

  // Voorkom dubbele invoer
  const existing = await Site.findOne({ name });
  if (existing) return NextResponse.json(existing);

  const site = await Site.create({ name });
  return NextResponse.json(site);
}

export async function DELETE(req: Request) {
  await connectToDB();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  await Site.findByIdAndDelete(id);
  return NextResponse.json({ message: "Deleted" });
}
